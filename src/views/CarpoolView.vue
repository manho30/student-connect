<!-- views/CarpoolView.vue -->

<template>
  <div id="carpool-view-container">
    <!-- DETAIL VIEW -->
    <CarpoolDetail
        v-if="carpoolId"
        :carpool-id="carpoolId"
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
            Find students going your way
          </h1>

          <p class="text-slate-500 text-sm sm:text-base">
            Share rides, save costs, and meet new friends on campus.
          </p>
        </div>

        <button
            id="open-create-carpool-btn"
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

          <span>Create Carpool</span>
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
              id="carpool-search-input"
              v-model="searchQuery"
              type="text"
              placeholder="Where are you headed? (Search origin or destination)"
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
              v-for="tab in filterTabs"
              :key="tab.id"
              :id="'carpool-filter-tab-' + tab.id"
              type="button"
              :class="[
                'cursor-pointer whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-semibold transition-colors',
                activeFilter === tab.id
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              ]"
              @click="activeFilter = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </section>

      <!-- Loading State -->
      <div
          v-if="loading"
          id="carpool-loading"
          class="space-y-4"
      >
        <!-- Loading Header -->
        <div class="flex items-center gap-3 px-1">
          <div
              class="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"
          ></div>

          <p class="text-sm font-medium text-slate-500">
            Loading carpools...
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

            <!-- Route -->
            <div class="space-y-3 mb-5">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-slate-200 rounded-full"></div>
                <div class="h-4 w-2/3 bg-slate-200 rounded"></div>
              </div>

              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-slate-200 rounded-full"></div>
                <div class="h-4 w-3/4 bg-slate-200 rounded"></div>
              </div>
            </div>

            <!-- Details -->
            <div class="space-y-3 mb-5">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-slate-200 rounded-full"></div>
                <div class="h-3 w-1/2 bg-slate-100 rounded"></div>
              </div>

              <div class="flex items-center gap-2">
                <div class="w-4 h-4 bg-slate-200 rounded-full"></div>
                <div class="h-3 w-2/5 bg-slate-100 rounded"></div>
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
          id="carpool-error"
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
            id="carpool-retry-btn"
            type="button"
            class="mt-4 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors cursor-pointer"
            @click="loadCarpools"
        >
          Try Again
        </button>
      </div>

      <!-- Carpool Lists -->
      <div v-else class="space-y-8">
        <!-- Currently Active -->
        <section>
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                Currently Active
              </h2>

              <p class="text-xs text-slate-500">
                Open carpools and rides with available capacity.
              </p>
            </div>

            <span
                class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
            >
              {{ activeCarpools.length }}
            </span>
          </div>

          <CarpoolList
              :carpools="activeCarpools"
              :current-user="currentUser"
              @join="handleJoin"
              @leave="handleLeave"
              @edit="handleEdit"
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
                Inactive carpools from the last 3 days.
              </p>
            </div>

            <span
                class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"
            >
              {{ archivedCarpools.length }}
            </span>
          </div>

          <CarpoolList
              v-if="archivedCarpools.length"
              :carpools="archivedCarpools"
              :current-user="currentUser"
              :show-create-prompt="false"
              @join="handleJoin"
              @leave="handleLeave"
              @edit="handleEdit"
              @select="handleSelect"
          />

          <p
              v-else
              class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500"
          >
            No inactive carpools from the last 3 days.
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
  onUnmounted,
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

import {
  user
} from '@/services/auth'

import CarpoolList from '@/components/carpool/CarpoolList.vue'
import CarpoolDetail from '@/components/carpool/CarpoolDetail.vue'

const route = useRoute()
const router = useRouter()

const carpools = ref([])
const searchQuery = ref('')
const activeFilter = ref('all')
const loading = ref(false)
const loadError = ref('')

const currentTimestamp = ref(
    Math.floor(Date.now() / 1000)
)

let timeUpdateInterval = null

/**
 * Represents the currently authenticated student.
 *
 * @returns {Object} Current student information.
 */
const currentUser = computed(() => ({
  id: String(
      user.value?.uid || ''
  ),

  name:
      user.value?.displayName ||
      user.value?.email ||
      'Student'
}))

/**
 * Reads the carpool ID from the current route query.
 *
 * @returns {string|null} Carpool ID or null when displaying the list.
 */
const carpoolId = computed(() => {
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

const filterTabs = [
  {
    id: 'all',
    label: 'All Carpools'
  },
  {
    id: 'available',
    label: 'Available Seats'
  },
  {
    id: 'joined',
    label: 'My Carpools'
  }
]

/**
 * Updates the current Unix timestamp.
 *
 * @returns {void}
 */
function updateCurrentTimestamp() {
  currentTimestamp.value =
      Math.floor(Date.now() / 1000)
}

/**
 * Normalizes a timestamp into Unix seconds.
 *
 * Supports numeric seconds, milliseconds, and timestamp objects.
 *
 * @param {*} value - Timestamp value.
 * @returns {number} Unix timestamp in seconds, or zero when invalid.
 */
function normalizeTimestamp(value) {
  if (
      value &&
      typeof value === 'object'
  ) {
    value =
        value.timestamp ??
        value.unix ??
        value.value ??
        value.seconds
  }

  const timestamp = Number(value)

  if (
      !Number.isFinite(timestamp) ||
      timestamp <= 0
  ) {
    return 0
  }

  return timestamp > 100000000000
      ? Math.floor(timestamp / 1000)
      : Math.floor(timestamp)
}

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
 * Determines whether a carpool has already departed.
 *
 * @param {Object} carpool - Carpool resource.
 * @returns {boolean} True when the carpool has already departed.
 */
function isDeparturePassed(carpool) {
  const departure =
      normalizeTimestamp(
          carpool?.departure
      )

  if (!departure) {
    return false
  }

  return (
      currentTimestamp.value >=
      departure
  )
}

/**
 * Returns normalized participant IDs from a carpool.
 *
 * Supports both the current participant object-map schema
 * and legacy participant arrays.
 *
 * @param {Object} carpool - Carpool resource.
 * @returns {string[]} Participant Firebase UIDs.
 */
function getParticipantIds(carpool) {
  const participants =
      carpool?.participants

  if (!participants) {
    return []
  }

  if (Array.isArray(participants)) {
    return participants
        .map((participant) => {
          if (
              typeof participant === 'string'
          ) {
            return participant
          }

          return (
              participant?.id ||
              participant?.uid ||
              participant?.userId ||
              participant?.firebaseUid ||
              ''
          )
        })
        .filter(Boolean)
        .map(String)
  }

  if (
      typeof participants === 'object'
  ) {
    return Object.entries(
        participants
    )
        .map(([uid, participant]) => {
          if (
              participant &&
              typeof participant === 'object'
          ) {
            return (
                participant.id ||
                participant.uid ||
                participant.userId ||
                participant.firebaseUid ||
                uid
            )
          }

          return uid
        })
        .filter(Boolean)
        .map(String)
  }

  return []
}

/**
 * Returns the Firebase UID of the carpool owner.
 *
 * @param {Object} carpool - Carpool resource.
 * @returns {string} Owner Firebase UID.
 */
function getOwnerId(carpool) {
  return String(
      carpool?.owner?.id ||
      carpool?.owner?.uid ||
      carpool?.ownerId ||
      ''
  )
}

/**
 * Determines whether the current user is a participant.
 *
 * @param {Object} carpool - Carpool resource.
 * @returns {boolean} True when the current user is a participant.
 */
function isCurrentUserParticipant(carpool) {
  const currentUserId =
      String(
          currentUser.value.id || ''
      )

  if (!currentUserId) {
    return false
  }

  return getParticipantIds(carpool)
      .includes(currentUserId)
}

/**
 * Determines whether the current user owns the carpool.
 *
 * @param {Object} carpool - Carpool resource.
 * @returns {boolean} True when the current user is the owner.
 */
function isCurrentUserOwner(carpool) {
  const currentUserId =
      String(
          currentUser.value.id || ''
      )

  if (!currentUserId) {
    return false
  }

  return (
      getOwnerId(carpool) ===
      currentUserId
  )
}

/**
 * Returns the number of participants in a carpool.
 *
 * @param {Object} carpool - Carpool resource.
 * @returns {number} Current participant count.
 */
function getParticipantCount(carpool) {
  return getParticipantIds(
      carpool
  ).length
}

/**
 * Determines whether a carpool currently has available seats.
 *
 * @param {Object} carpool - Carpool resource.
 * @returns {boolean} True when the carpool can still be joined.
 */
function isCarpoolAvailable(carpool) {
  const status =
      String(
          carpool?.status || ''
      ).toLowerCase()

  const capacity =
      Number(
          carpool?.capacity
      )

  if (
      status !== 'open' ||
      !Number.isFinite(capacity) ||
      capacity <= 0
  ) {
    return false
  }

  return (
      getParticipantCount(carpool) <
      capacity &&
      !isDeparturePassed(carpool)
  )
}

/**
 * Returns the backend-aligned carpool status used by list grouping.
 *
 * @param {Object} carpool - Carpool resource.
 * @returns {string} open, full, cancelled, or expired.
 */
function getCarpoolStatus(carpool) {
  const status =
      String(
          carpool?.status || ''
      ).toLowerCase()

  if (
      status === 'cancelled' ||
      status === 'expired'
  ) {
    return status
  }

  if (isDeparturePassed(carpool)) {
    return 'expired'
  }

  const capacity =
      Number(
          carpool?.capacity
      )

  return (
      capacity > 0 &&
      getParticipantCount(carpool) >=
      capacity
  )
      ? 'full'
      : 'open'
}

/**
 * Determines whether an inactive carpool belongs in the 72-hour archive.
 *
 * @param {Object} carpool - Carpool resource.
 * @returns {boolean} True when the inactive record is recent.
 */
function isRecentInactiveCarpool(carpool) {
  const status =
      getCarpoolStatus(carpool)

  if (
      status !== 'cancelled' &&
      status !== 'expired'
  ) {
    return false
  }

  const timestamp =
      normalizeActivityTimestamp(
          carpool?.updatedAt ||
          carpool?.createdAt
      )

  return (
      timestamp > 0 &&
      Date.now() - timestamp <=
      72 * 60 * 60 * 1000
  )
}

/**
 * Converts a value into lowercase searchable text.
 *
 * @param {*} value - Value to normalize.
 * @returns {string} Searchable lowercase text.
 */
function toSearchText(value) {
  if (
      value === null ||
      value === undefined
  ) {
    return ''
  }

  if (
      typeof value === 'object'
  ) {
    return Object.values(value)
        .map((item) =>
            toSearchText(item)
        )
        .join(' ')
  }

  return String(value)
}

/**
 * Builds searchable text from the Carpool API schema.
 *
 * @param {Object} carpool - Carpool resource.
 * @returns {string} Combined searchable text.
 */
function getCarpoolSearchText(carpool) {
  return [
    carpool?.origin,
    carpool?.destination,
    carpool?.notes,
    carpool?.departure,
    carpool?.status,
    carpool?.owner?.name
  ]
      .map(toSearchText)
      .join(' ')
      .toLowerCase()
}

/**
 * Loads the latest carpools list from the Student Connect API.
 *
 * @returns {Promise<void>}
 */
async function loadCarpools() {
  loading.value = true
  loadError.value = ''

  try {
    const response =
        await studentConnect
            .getAllCarPoolList()

    if (response?.success === false) {
      throw new Error(
          response?.message ||
          'Failed to load carpools'
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
      carpools.value =
          response.data
    } else if (Array.isArray(response)) {
      carpools.value =
          response
    } else {
      carpools.value = []
    }
  } catch (error) {
    console.error(
        'Failed to load carpools:',
        error
    )

    carpools.value = []

    loadError.value =
        error?.message ||
        'Failed to load carpools'

    ElMessage.error(
        loadError.value
    )
  } finally {
    loading.value = false
  }
}

/**
 * Filters carpools using the search query and selected filter.
 *
 * @returns {Array<Object>} Filtered carpools.
 */
const filteredCarpools = computed(() => {
  let list = Array.isArray(
      carpools.value
  )
      ? [...carpools.value]
      : []

  const query =
      searchQuery.value
          .trim()
          .toLowerCase()

  if (query) {
    list = list.filter((carpool) => {
      return getCarpoolSearchText(
          carpool
      ).includes(query)
    })
  }

  if (
      activeFilter.value ===
      'available'
  ) {
    list = list.filter(
        isCarpoolAvailable
    )
  }

  if (
      activeFilter.value ===
      'joined'
  ) {
    list = list.filter((carpool) => {
      return (
          isCurrentUserOwner(carpool) ||
          isCurrentUserParticipant(carpool)
      )
    })
  }

  return list
})

/**
 * Returns active carpools after search and filter criteria are applied.
 *
 * @returns {Array<Object>} Active carpools.
 */
const activeCarpools = computed(() => {
  return filteredCarpools.value
      .filter((carpool) => {
        return [
          'open',
          'full'
        ].includes(
            getCarpoolStatus(carpool)
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
 * Returns recent inactive carpools for the archive section.
 *
 * @returns {Array<Object>} Recent archived carpools.
 */
const archivedCarpools = computed(() => {
  return filteredCarpools.value
      .filter(isRecentInactiveCarpool)
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
 * Navigates to the carpool creation page.
 *
 * @returns {void}
 */
function navigateToCreate() {
  router.push('/carpool/new')
}

/**
 * Opens the detail page for a specific carpool.
 *
 * @param {string|number} id - Carpool identifier.
 * @returns {void}
 */
function handleSelect(id) {
  if (!id) {
    ElMessage.error(
        'Carpool ID is missing'
    )

    return
  }

  router.push({
    path: '/carpool',
    query: {
      id: String(id)
    }
  })
}

/**
 * Navigates to the carpool edit page.
 *
 * @param {Object} carpool - Carpool resource.
 * @returns {void}
 */
function handleEdit(carpool) {
  if (!carpool?.id) {
    ElMessage.error(
        'Carpool ID is missing'
    )

    return
  }

  router.push({
    path: '/carpool/edit',
    query: {
      id: String(carpool.id)
    }
  })
}

/**
 * Joins a carpool through the Student Connect API.
 *
 * @param {string|number} id - Carpool identifier.
 * @returns {Promise<void>}
 */
async function handleJoin(id) {
  if (!id) {
    ElMessage.error(
        'Carpool ID is missing'
    )

    return
  }

  const targetCarpool =
      carpools.value.find(
          (carpool) =>
              String(carpool?.id) ===
              String(id)
      )

  if (
      targetCarpool &&
      isDeparturePassed(
          targetCarpool
      )
  ) {
    ElMessage.warning(
        'This carpool has already departed.'
    )

    return
  }

  try {
    const response =
        await studentConnect
            .joinCarPool(id)

    if (response?.success === false) {
      throw new Error(
          response?.message ||
          'Could not join carpool'
      )
    }

    await loadCarpools()

    ElMessage.success(
        response?.message ||
        'You joined the carpool!'
    )
  } catch (error) {
    console.error(
        'Failed to join carpool:',
        error
    )

    ElMessage.error(
        error?.message ||
        'Could not join the carpool'
    )
  }
}

/**
 * Leaves a carpool through the Student Connect API.
 *
 * @param {string|number} id - Carpool identifier.
 * @returns {Promise<void>}
 */
async function handleLeave(id) {
  if (!id) {
    ElMessage.error(
        'Carpool ID is missing'
    )

    return
  }

  try {
    const response =
        await studentConnect
            .leaveCarPool(id)

    if (response?.success === false) {
      throw new Error(
          response?.message ||
          'Could not leave carpool'
      )
    }

    await loadCarpools()

    ElMessage.success(
        response?.message ||
        'You left the carpool.'
    )
  } catch (error) {
    console.error(
        'Failed to leave carpool:',
        error
    )

    ElMessage.error(
        error?.message ||
        'Could not leave carpool'
    )
  }
}

/**
 * Loads carpools when the listing view is initially displayed.
 */
onMounted(() => {
  if (!carpoolId.value) {
    loadCarpools()
  }

  timeUpdateInterval =
      window.setInterval(
          updateCurrentTimestamp,
          1000
      )
})

/**
 * Clears the timestamp update interval when the view is destroyed.
 */
onUnmounted(() => {
  if (timeUpdateInterval !== null) {
    window.clearInterval(
        timeUpdateInterval
    )

    timeUpdateInterval = null
  }
})

/**
 * Reloads carpools when returning from a carpool detail page.
 */
watch(
    () => route.query.id,
    (newId) => {
      if (!newId) {
        loadCarpools()
      }
    }
)
</script>
