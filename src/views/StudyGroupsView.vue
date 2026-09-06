<!-- views/studyView.vue -->

<template>
  <div id="study-view-root">
    <!-- DETAIL VIEW -->
    <StudyGroupDetail
        v-if="studyId"
        :study-id="studyId"
        :current-user="currentUser"
    />

    <!-- LISTING VIEW -->
    <div
        v-else
        class="space-y-6"
    >
      <!-- Header -->
      <header
          class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div class="space-y-1">
          <h1
              class="text-3xl font-bold tracking-tight text-slate-900"
          >
            Collaborate in Student Study Groups
          </h1>

          <p class="text-sm text-slate-500 sm:text-base">
            Prepare for exams, tackle difficult assignments, and learn
            together with other students.
          </p>
        </div>

        <button
            id="open-create-study-btn"
            class="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700"
            @click="navigateToCreate"
        >
          <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
            />
          </svg>

          <span>Create Study Group</span>
        </button>
      </header>

      <!-- Search & Filter -->
      <section
          class="flex flex-col items-stretch gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs md:flex-row md:items-center"
      >
        <!-- Search -->
        <div class="relative flex-1">
          <svg
              class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
              id="study-search-input"
              v-model="searchQuery"
              type="text"
              placeholder="Search by title, subject, location..."
              class="w-full rounded-xl border border-slate-100 bg-slate-50 py-2.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition-all focus:border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500"
          >
        </div>

        <!-- Divider -->
        <div
            class="hidden h-8 w-px self-center bg-slate-200 md:block"
        />

        <!-- Filter Tabs -->
        <div
            class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0"
        >
          <button
              v-for="filter in filters"
              :key="filter.id"
              :id="'study-filter-tab-' + filter.id"
              :class="[
                'cursor-pointer whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors',
                activeFilter === filter.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              ]"
              @click="activeFilter = filter.id"
          >
            {{ filter.label }}
          </button>
        </div>
      </section>

      <!-- Study Group List -->
      <StudyGroupList
          :groups="filteredGroups"
          :current-user="currentUser"
          @join="handleJoin"
          @leave="handleLeave"
          @select="handleSelect"
          @open-create="navigateToCreate"
      />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  watch
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  ElMessage
} from 'element-plus'

import studentConnect from '@/api'

import StudyGroupList from '@/components/study/StudyGroupList.vue'
import StudyGroupDetail from '@/components/study/StudyGroupDetail.vue'

import {
  user
} from '@/services/auth'

const route = useRoute()
const router = useRouter()

const groups = ref([])
const searchQuery = ref('')
const activeFilter = ref('all')

/**
 * Returns the current authenticated Firebase user.
 *
 * @returns {Object|null} Current authenticated user.
 */
const currentUser = computed(() => {
  return user.value || null
})

/**
 * Gets the currently selected study ID from the route query.
 *
 * @returns {string|null} Study ID or null when no study is selected.
 */
const studyId = computed(() => {
  const id = route.query.id

  if (Array.isArray(id)) {
    return id[0] ? String(id[0]) : null
  }

  return id
      ? String(id)
      : null
})

const filters = [
  {
    id: 'all',
    label: 'All Groups'
  },
  {
    id: 'open',
    label: 'Open Slots'
  },
  {
    id: 'joined',
    label: 'My Study Groups'
  }
]

/**
 * Loads all available study groups from the backend.
 *
 * @returns {Promise<void>}
 */
async function loadStudyGroups() {
  try {
    const response =
        await studentConnect.getAllStudyGroups()

    const data =
        response?.data ?? response

    groups.value =
        Array.isArray(data)
            ? data
            : []
  } catch (err) {
    console.error(
        'Failed to load study groups:',
        err
    )

    ElMessage.error(
        err?.message ||
        'Failed to load study groups.'
    )

    groups.value = []
  }
}

/**
 * Extracts a comparable user identifier.
 *
 * @param {Object|string|null} member User or member object.
 * @returns {string} Comparable user identifier.
 */
function getUserId(member) {
  if (!member) {
    return ''
  }

  if (typeof member === 'string') {
    return member
  }

  return String(
      member.uid ||
      member.id ||
      member.userId ||
      member.firebaseUid ||
      ''
  )
}

/**
 * Determines whether the authenticated user belongs to a study group.
 *
 * @param {Object} group Study group resource.
 * @returns {boolean} True when the user is a member.
 */
function isCurrentUserMember(group) {
  const currentUserId =
      getUserId(currentUser.value)

  if (
      !currentUserId ||
      !Array.isArray(group?.members)
  ) {
    return false
  }

  return group.members.some((member) => {
    return getUserId(member) === currentUserId
  })
}

/**
 * Determines whether a study group has remaining capacity.
 *
 * @param {Object} group Study group resource.
 * @returns {boolean} True when at least one slot remains.
 */
function hasOpenSlot(group) {
  const capacity =
      Number(group?.capacity)

  const memberCount =
      Array.isArray(group?.members)
          ? group.members.length
          : 0

  if (
      !Number.isFinite(capacity) ||
      capacity <= 0
  ) {
    return false
  }

  return memberCount < capacity
}

/**
 * Determines whether a study group has available membership slots.
 *
 * @param {Object} group Study group resource.
 * @returns {boolean} True when the group is open and has capacity.
 */
function isGroupOpen(group) {
  const status =
      String(
          group?.status || 'open'
      ).toLowerCase()

  return status === 'open' && hasOpenSlot(group)
}

/**
 * Computes the study groups displayed in the listing.
 *
 * @returns {Array<Object>} Filtered study groups.
 */
const filteredGroups = computed(() => {
  let list = [
    ...(groups.value || [])
  ]

  if (searchQuery.value.trim()) {
    const query =
        searchQuery.value
            .toLowerCase()
            .trim()

    list = list.filter((group) => {
      const searchableFields = [
        group.title,
        group.subject,
        group.description,
        group.location
      ]

      return searchableFields.some((value) => {
        return String(value || '')
            .toLowerCase()
            .includes(query)
      })
    })
  }

  if (activeFilter.value === 'open') {
    list = list.filter((group) => {
      return isGroupOpen(group)
    })
  }

  if (activeFilter.value === 'joined') {
    list = list.filter((group) => {
      return isCurrentUserMember(group)
    })
  }

  return list
})

/**
 * Navigates to the study group creation page.
 *
 * @returns {Promise<void>}
 */
async function navigateToCreate() {
  await router.push('/study/new')
}

/**
 * Opens a specific study group detail page.
 *
 * @param {string|number} id Study group identifier.
 * @returns {Promise<void>}
 */
async function handleSelect(id) {
  if (!id) {
    return
  }

  await router.push({
    path: '/study',
    query: {
      id: String(id)
    }
  })
}

/**
 * Joins a study group using the authenticated user.
 *
 * @param {string|number} id Study group identifier.
 * @returns {Promise<void>}
 */
async function handleJoin(id) {
  if (!id) {
    return
  }

  try {
    await studentConnect.joinStudyGroup(id)

    await loadStudyGroups()

    ElMessage.success(
        'You joined the study group.'
    )
  } catch (err) {
    console.error(
        'Failed to join study group:',
        err
    )

    ElMessage.error(
        err?.message ||
        'Could not join this study group.'
    )
  }
}

/**
 * Leaves a study group using the authenticated user.
 *
 * @param {string|number} id Study group identifier.
 * @returns {Promise<void>}
 */
async function handleLeave(id) {
  if (!id) {
    return
  }

  try {
    await studentConnect.leaveStudyGroup(id)

    await loadStudyGroups()

    ElMessage.info(
        'You left the study group.'
    )
  } catch (err) {
    console.error(
        'Failed to leave study group:',
        err
    )

    ElMessage.error(
        err?.message ||
        'Could not leave this study group.'
    )
  }
}

/**
 * Loads study groups when the listing view is opened.
 *
 * @returns {void}
 */
onMounted(() => {
  if (!studyId.value) {
    loadStudyGroups()
  }
})

/**
 * Reloads the study group list when returning to the listing view.
 *
 * @param {string|string[]|undefined} newId Selected study ID.
 * @returns {void}
 */
watch(
    () => route.query.id,
    (newId) => {
      if (!newId) {
        loadStudyGroups()
      }
    }
)
</script>
