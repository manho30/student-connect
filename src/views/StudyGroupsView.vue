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
    <div v-else class="space-y-6">
      <!-- Header Section -->
      <header
          class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4"
      >
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">
            Collaborate in Student Study Groups
          </h1>

          <p class="text-slate-500 text-sm sm:text-base">
            Prepare for exams, tackle difficult assignments, and learn
            together with other students.
          </p>
        </div>

        <button
            id="open-create-study-btn"
            type="button"
            class="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-100 hover:bg-brand-700 transition-all flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap"
            @click="navigateToCreate"
        >
          <svg
              class="w-5 h-5"
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
          class="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row gap-4 items-stretch md:items-center"
      >
        <!-- Search -->
        <div class="flex-1 relative">
          <svg
              class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
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
              placeholder="Search study groups by title, subject or location..."
              class="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-slate-800 text-sm transition-all"
          />
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
              type="button"
              :class="[
                'cursor-pointer whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors',
                activeFilter === filter.id
                  ? 'bg-brand-50 text-brand-700'
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
          id="study-loading"
          class="space-y-4"
      >
        <!-- Loading Header -->
        <div class="flex items-center gap-3 px-1">
          <div
              class="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"
          ></div>

          <p class="text-sm font-medium text-slate-500">
            Loading study groups...
          </p>
        </div>

        <!-- Skeleton Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <div
              v-for="index in 6"
              :key="index"
              class="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse"
          >
            <!-- Badge -->
            <div class="flex items-center justify-between mb-5">
              <div class="h-5 w-20 bg-slate-200 rounded-full"></div>
              <div class="h-4 w-14 bg-slate-100 rounded"></div>
            </div>

            <!-- Title -->
            <div class="h-5 w-3/4 bg-slate-200 rounded mb-3"></div>

            <!-- Description -->
            <div class="space-y-2 mb-5">
              <div class="h-3 w-full bg-slate-100 rounded"></div>
              <div class="h-3 w-5/6 bg-slate-100 rounded"></div>
            </div>

            <!-- Subject / Location -->
            <div class="space-y-3 mb-5">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-slate-200 rounded-full"></div>
                <div class="h-3 w-1/2 bg-slate-100 rounded"></div>
              </div>

              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-slate-200 rounded-full"></div>
                <div class="h-3 w-2/3 bg-slate-100 rounded"></div>
              </div>
            </div>

            <!-- Footer -->
            <div
                class="pt-4 border-t border-slate-100 flex justify-between items-center"
            >
              <div class="h-4 w-20 bg-slate-100 rounded"></div>
              <div class="h-9 w-24 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
          v-else-if="loadError"
          id="study-error"
          class="bg-rose-50 border border-rose-100 rounded-2xl p-8 text-center"
      >
        <div
            class="w-12 h-12 mx-auto mb-4 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center"
        >
          <i class="fi fi-rr-exclamation text-xl"></i>
        </div>

        <p class="text-sm font-semibold text-rose-700">
          {{ loadError }}
        </p>

        <button
            id="study-retry-btn"
            type="button"
            class="mt-4 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors cursor-pointer"
            @click="loadStudyGroups"
        >
          Try Again
        </button>
      </div>

      <!-- Study Group Lists -->
      <div v-else class="space-y-8">
        <!-- Active Groups -->
        <section>
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                Currently Active
              </h2>

              <p class="text-xs text-slate-500">
                Open study groups and sessions with available capacity.
              </p>
            </div>

            <span
                class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
            >
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

        <!-- Archive -->
        <section>
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                Archive
              </h2>

              <p class="text-xs text-slate-500">
                Inactive study groups from the last 3 days.
              </p>
            </div>

            <span
                class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"
            >
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

          <p
              v-else
              class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500"
          >
            No inactive study groups from the last 3 days.
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
const loading = ref(false)
const loadError = ref('')

/**
 * Represents the currently authenticated student.
 *
 * @returns {Object} Current student information.
 */
const currentUser = computed(() => ({
  id: user.value?.uid || '',
  name: user.value?.displayName || user.value?.email || 'Student'
}))

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

  if (value instanceof Date) {
    return value.getTime()
  }

  if (
      typeof value === 'number' ||
      (typeof value === 'string' && /^\d+$/.test(value))
  ) {
    const numericValue = Number(value)

    return Number.isFinite(numericValue)
        ? numericValue < 100000000000
            ? numericValue * 1000
            : numericValue
        : 0
  }

  const parsed = Date.parse(value || '')

  return Number.isFinite(parsed)
      ? parsed
      : 0
}

/**
 * Reads the study group ID from the current route query.
 *
 * @returns {string|null} Study group ID or null when displaying the list.
 */
const studyId = computed(() => {
  const id = route.query.id

  if (Array.isArray(id)) {
    return id[0]
        ? String(id[0])
        : null
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
 * Loads the latest study groups list from the Lend a Hand API.
 *
 * @returns {Promise<void>}
 */
async function loadStudyGroups() {
  loading.value = true
  loadError.value = ''

  try {
    const response =
        await studentConnect.getAllStudyGroups()

    if (response?.success === false) {
      throw new Error(
          response?.message ||
          'Failed to load study groups'
      )
    }

    /**
     * Support both:
     *
     * { success, message, data }
     *
     * and legacy direct array responses.
     */
    if (Array.isArray(response?.data)) {
      groups.value = response.data
    } else if (Array.isArray(response)) {
      groups.value = response
    } else {
      groups.value = []
    }
  } catch (error) {
    console.error(
        'Failed to load study groups:',
        error
    )

    groups.value = []

    loadError.value =
        error?.message ||
        'Failed to load study groups'

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
 * @param {Object|string|null} member - User or member object.
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
 * @param {Object} group - Study group resource.
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
 * @param {Object} group - Study group resource.
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
 * Determines whether a study group is currently open.
 *
 * @param {Object} group - Study group resource.
 * @returns {boolean} True when the group is open and has capacity.
 */
function isGroupOpen(group) {
  const status =
      String(
          group?.status || 'open'
      ).toLowerCase()

  return (
      status === 'open' &&
      hasOpenSlot(group)
  )
}

/**
 * Computes study groups filtered by search keywords and selected filter.
 *
 * @returns {Array<Object>} Filtered study groups.
 */
const filteredGroups = computed(() => {
  let list = [
    ...(groups.value || [])
  ]

  const query =
      searchQuery.value
          .trim()
          .toLowerCase()

  if (query) {
    list = list.filter((group) => {
      const searchableFields = [
        group?.title,
        group?.subject,
        group?.description,
        group?.location
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
  const status =
      String(
          group?.status || ''
      ).toLowerCase()

  if (
      [
        'cancelled',
        'expired'
      ].includes(status)
  ) {
    return status
  }

  const scheduleEndTime =
      normalizeActivityTimestamp(
          group?.schedule?.endTime
      )

  if (
      scheduleEndTime > 0 &&
      scheduleEndTime < Date.now()
  ) {
    return 'expired'
  }

  const capacity =
      Number(group?.capacity)

  const memberCount =
      Array.isArray(group?.members)
          ? group.members.length
          : 0

  return (
      capacity > 0 &&
      memberCount >= capacity
  )
      ? 'full'
      : 'open'
}

/**
 * Determines whether an inactive study group belongs in the 72-hour archive.
 *
 * @param {Object} group - Study group resource.
 * @returns {boolean} True when the inactive record is recent.
 */
function isRecentInactiveStudy(group) {
  const status =
      getStudyStatus(group)

  if (
      ![
        'cancelled',
        'expired'
      ].includes(status)
  ) {
    return false
  }

  const timestamp =
      normalizeActivityTimestamp(
          group?.updatedAt ||
          group?.createdAt
      )

  return (
      timestamp > 0 &&
      Date.now() - timestamp <=
      72 * 60 * 60 * 1000
  )
}

/**
 * Returns active study groups after search and filter criteria are applied.
 *
 * @returns {Array<Object>} Active study groups.
 */
const activeGroups = computed(() => {
  return filteredGroups.value
      .filter((group) => {
        return [
          'open',
          'full'
        ].includes(
            getStudyStatus(group)
        )
      })
      .sort((first, second) => {
        return (
            normalizeActivityTimestamp(
                second?.updatedAt ||
                second?.createdAt
            ) -
            normalizeActivityTimestamp(
                first?.updatedAt ||
                first?.createdAt
            )
        )
      })
})

/**
 * Returns recent inactive study groups for the archive section.
 *
 * @returns {Array<Object>} Recent archived study groups.
 */
const archivedGroups = computed(() => {
  return filteredGroups.value
      .filter(isRecentInactiveStudy)
      .sort((first, second) => {
        return (
            normalizeActivityTimestamp(
                second?.updatedAt ||
                second?.createdAt
            ) -
            normalizeActivityTimestamp(
                first?.updatedAt ||
                first?.createdAt
            )
        )
      })
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
 * Opens the detail page for a specific study group.
 *
 * @param {string|number} id - Study group identifier.
 * @returns {Promise<void>}
 */
async function handleSelect(id) {
  if (!id) {
    ElMessage.error(
        'Study group ID is missing'
    )

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
 * @param {string|number} id - Study group identifier.
 * @returns {Promise<void>}
 */
async function handleJoin(id) {
  if (!id) {
    ElMessage.error(
        'Study group ID is missing'
    )

    return
  }

  try {
    const response =
        await studentConnect.joinStudyGroup(id)

    if (response?.success === false) {
      throw new Error(
          response?.message ||
          'Could not join this study group'
      )
    }

    await loadStudyGroups()

    ElMessage.success(
        response?.message ||
        'You joined the study group.'
    )
  } catch (error) {
    console.error(
        'Failed to join study group:',
        error
    )

    ElMessage.error(
        error?.message ||
        'Could not join this study group.'
    )
  }
}

/**
 * Leaves a study group using the authenticated user.
 *
 * @param {string|number} id - Study group identifier.
 * @returns {Promise<void>}
 */
async function handleLeave(id) {
  if (!id) {
    ElMessage.error(
        'Study group ID is missing'
    )

    return
  }

  try {
    const response =
        await studentConnect.leaveStudyGroup(id)

    if (response?.success === false) {
      throw new Error(
          response?.message ||
          'Could not leave this study group'
      )
    }

    await loadStudyGroups()

    ElMessage.info(
        response?.message ||
        'You left the study group.'
    )
  } catch (error) {
    console.error(
        'Failed to leave study group:',
        error
    )

    ElMessage.error(
        error?.message ||
        'Could not leave this study group.'
    )
  }
}

/**
 * Loads study groups when the listing view is initially displayed.
 */
onMounted(() => {
  if (!studyId.value) {
    loadStudyGroups()
  }
})

/**
 * Reloads study groups when returning from a study group detail page.
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
