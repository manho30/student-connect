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

      <!-- Loading State -->
      <div
          v-if="loading"
          class="flex justify-center py-10 text-sm text-slate-500"
      >
        Loading study groups...
      </div>

      <!-- Error State -->
      <div
          v-else-if="loadError"
          class="rounded-2xl border border-red-100 bg-red-50 p-6 text-center"
      >
        <p class="text-sm font-medium text-red-700">
          {{ loadError }}
        </p>

        <button
            id="study-retry-btn"
            type="button"
            class="mt-3 cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            @click="loadStudyGroups"
        >
          Try Again
        </button>
      </div>

      <!-- Study Group Lists -->
      <div v-else class="space-y-8">
        <section>
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900">Currently Active</h2>
              <p class="text-xs text-slate-500">Open study sessions and groups with available capacity.</p>
            </div>
            <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              {{ activeGroups.length }}
            </span>
          </div>
          <StudyGroupList
              :groups="activeGroups"
              :current-user="currentUser"
              @join="handleJoin"
              @leave="handleLeave"
              @select="handleSelect"
              @open-create="navigateToCreate"
          />
        </section>

        <section>
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900">Archive</h2>
              <p class="text-xs text-slate-500">Inactive study sessions from the last 3 days.</p>
            </div>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              {{ archivedGroups.length }}
            </span>
          </div>
          <StudyGroupList
              v-if="archivedGroups.length"
              :groups="archivedGroups"
              :current-user="currentUser"
              :show-create-prompt="false"
              @join="handleJoin"
              @leave="handleLeave"
              @select="handleSelect"
          />
          <p v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No inactive study sessions from the last 3 days.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted
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
const loading = ref(false)
const loadError = ref('')

/**
 * Returns the current authenticated Firebase user.
 *
 * @returns {Object|null} Current authenticated user.
 */
const currentUser = computed(() => {
  return user.value || null
})

/**
 * Normalizes a service activity timestamp to Unix milliseconds.
 *
 * @param {*} value - Numeric, ISO, or timestamp-object value.
 * @returns {number} Timestamp in milliseconds, or zero when invalid.
 */
function normalizeActivityTimestamp(value) {
  if (value && typeof value === 'object') {
    value = value.toDate
        ? value.toDate()
        : value.timestamp ?? value.seconds ?? value.value
  }

  if (value instanceof Date) return value.getTime()

  if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) {
    const numericValue = Number(value)
    return Number.isFinite(numericValue)
        ? numericValue < 100000000000 ? numericValue * 1000 : numericValue
        : 0
  }

  const parsed = Date.parse(value || '')
  return Number.isFinite(parsed) ? parsed : 0
}

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
 * The loading state prevents the empty-state component from appearing
 * before the backend response has been received.
 *
 * @returns {Promise<void>} Resolves after the study groups are loaded.
 * @throws {Error} When the backend request fails.
 */
async function loadStudyGroups() {
  loading.value = true
  loadError.value = ''

  try {
    const response =
        await studentConnect.getAllStudyGroups()

    if (!response?.success) {
      throw new Error(
          response?.message ||
          'Failed to load study groups.'
      )
    }

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

    groups.value = []

    loadError.value =
        err?.message ||
        'Failed to load study groups.'

    ElMessage.error(
        loadError.value
    )
  } finally {
    loading.value = false
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
 * Returns the backend-aligned study status used by list grouping.
 *
 * @param {Object} group - Study group resource.
 * @returns {string} open, full, cancelled, or expired.
 */
function getStudyStatus(group) {
  const status = String(group?.status || '').toLowerCase()
  if (status === 'cancelled' || status === 'expired') return status
  const startTime = normalizeActivityTimestamp(group?.schedule?.startTime)
  if (startTime > 0 && startTime < Date.now()) return 'expired'

  const capacity = Number(group?.capacity)
  const memberCount = Array.isArray(group?.members) ? group.members.length : 0
  return capacity > 0 && memberCount >= capacity ? 'full' : 'open'
}

/**
 * Determines whether an inactive study group belongs in the 72-hour archive.
 *
 * @param {Object} group - Study group resource.
 * @returns {boolean} True when the inactive record is recent.
 */
function isRecentInactiveStudy(group) {
  const status = getStudyStatus(group)
  if (status !== 'cancelled' && status !== 'expired') return false

  const timestamp = normalizeActivityTimestamp(group?.updatedAt || group?.createdAt)
  return timestamp > 0 && Date.now() - timestamp <= 72 * 60 * 60 * 1000
}

/**
 * Returns active study groups after search and filter criteria are applied.
 *
 * @returns {Array<Object>} Active study groups.
 */
const activeGroups = computed(() => {
  return filteredGroups.value
      .filter((group) => ['open', 'full'].includes(getStudyStatus(group)))
      .sort((first, second) => normalizeActivityTimestamp(second.updatedAt || second.createdAt) - normalizeActivityTimestamp(first.updatedAt || first.createdAt))
})

/**
 * Returns recent inactive study groups for the archive section.
 *
 * @returns {Array<Object>} Recent archived study groups.
 */
const archivedGroups = computed(() => {
  return filteredGroups.value
      .filter(isRecentInactiveStudy)
      .sort((first, second) => normalizeActivityTimestamp(second.updatedAt || second.createdAt) - normalizeActivityTimestamp(first.updatedAt || first.createdAt))
})

/**
 * Navigates to the study group creation page.
 *
 * @returns {Promise<void>} Resolves after navigation completes.
 */
async function navigateToCreate() {
  await router.push('/study/new')
}

/**
 * Opens a specific study group detail page.
 *
 * @param {string|number} id Study group identifier.
 * @returns {Promise<void>} Resolves after navigation completes.
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
 * @returns {Promise<void>} Resolves after the join operation completes.
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
 * @returns {Promise<void>} Resolves after the leave operation completes.
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
 * @returns {void} Starts the initial study group request.
 */
onMounted(() => {
  if (!studyId.value) {
    loadStudyGroups()
  }
})
</script>
