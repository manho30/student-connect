<template>
  <ActivitiesDetail
      v-if="activityId"
      :activity-id="activityId"
      :current-user="currentUser"
      @back="clearSelection"
      @edit="navigateToEdit"
      @delete="deleteSelectedActivity"
  />

  <div v-else id="activities-view-root" class="space-y-6">
    <!-- Header Section -->
    <header
        class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
    >
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">
          Activities
        </h1>

        <p class="text-sm text-slate-500 sm:text-base">
          Discover co-curricular events, competitions, and opportunities.
        </p>
      </div>

      <button
          id="open-create-activity-btn"
          type="button"
          class="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-100 transition-all hover:bg-brand-700"
          @click="navigateToCreate"
      >
        <i class="fi fi-rr-plus"></i>
        Promote Activity
      </button>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div
          class="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-500"
      >
        <i class="fi fi-rr-spinner animate-spin"></i>
        Loading activities...
      </div>

      <div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        <div
            v-for="index in 6"
            :key="index"
            class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div class="aspect-video animate-pulse bg-slate-200"></div>

          <div class="space-y-4 p-5">
            <div class="h-5 w-24 animate-pulse rounded-full bg-slate-200"></div>

            <div class="space-y-2">
              <div class="h-5 w-4/5 animate-pulse rounded bg-slate-200"></div>
              <div class="h-5 w-2/3 animate-pulse rounded bg-slate-200"></div>
            </div>

            <div class="space-y-2">
              <div class="h-3 w-full animate-pulse rounded bg-slate-100"></div>
              <div class="h-3 w-5/6 animate-pulse rounded bg-slate-100"></div>
            </div>

            <div class="space-y-2 border-t border-slate-100 pt-4">
              <div class="h-4 w-3/4 animate-pulse rounded bg-slate-100"></div>
              <div class="h-4 w-1/2 animate-pulse rounded bg-slate-100"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
        v-else-if="loadError"
        id="activities-error"
        class="rounded-2xl border border-rose-200 bg-rose-50 p-6"
    >
      <div class="flex flex-col items-center justify-center text-center">
        <div
            class="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600"
        >
          <i class="fi fi-rr-exclamation text-lg"></i>
        </div>

        <h2 class="text-sm font-bold text-rose-800">
          Unable to load activities
        </h2>

        <p class="mt-1 max-w-md text-sm text-rose-700">
          {{ loadError }}
        </p>

        <button
            id="activities-retry-btn"
            type="button"
            class="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-rose-700"
            @click="loadActivities"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-8">
      <!-- Search -->
      <section
          class="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-5"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <!-- Search Input -->
          <div class="relative flex-1">
            <i
                class="fi fi-rr-search pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400"
            ></i>

            <input
                id="activities-search-input"
                v-model="searchQuery"
                type="search"
                placeholder="Search activities, categories, locations..."
                class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
                @keydown.esc="clearSearch"
            />

            <button
                v-if="searchQuery"
                id="activities-search-clear-btn"
                type="button"
                aria-label="Clear search"
                class="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
                @click="clearSearch"
            >
              <i class="fi fi-rr-cross-small"></i>
            </button>
          </div>

          <!-- Search Result Count -->
          <div
              class="flex shrink-0 items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs"
          >
            <span class="font-semibold text-slate-500">
              Results
            </span>

            <span
                class="rounded-full bg-white px-2 py-0.5 font-bold text-slate-700 shadow-xs"
            >
              {{ filteredActivityCount }}
            </span>
          </div>
        </div>

        <!-- Search Hint -->
        <div
            v-if="searchQuery"
            class="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3"
        >
          <p class="text-xs text-slate-500">
            Showing activities matching
            <strong class="text-slate-700">
              "{{ searchQuery }}"
            </strong>
          </p>

          <button
              type="button"
              class="shrink-0 text-xs font-bold text-brand-600 hover:text-brand-700"
              @click="clearSearch"
          >
            Clear search
          </button>
        </div>
      </section>

      <!-- Search Empty State -->
      <div
          v-if="searchQuery && filteredActivityCount === 0"
          class="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"
      >
        <div
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"
        >
          <i class="fi fi-rr-search text-lg"></i>
        </div>

        <h2 class="mt-3 text-sm font-bold text-slate-800">
          No activities found
        </h2>

        <p class="mt-1 text-xs text-slate-500">
          Try searching with another title, category, or location.
        </p>

        <button
            type="button"
            class="mt-4 rounded-lg bg-brand-50 px-4 py-2 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-100"
            @click="clearSearch"
        >
          Clear Search
        </button>
      </div>

      <!-- Activity Sections -->
      <div v-else class="space-y-10">
        <!-- Currently Active -->
        <section>
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                Currently Active
              </h2>

              <p class="text-xs text-slate-500">
                Open opportunities for students to discover.
              </p>
            </div>

            <span
                class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"
            >
              {{ activeActivities.length }}
            </span>
          </div>

          <ActivitiesList
              v-if="activeActivities.length"
              :activities="activeActivities"
              :current-user="currentUser"
              @select="selectActivity"
              @open-create="navigateToCreate"
          />

          <div
              v-else
              class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"
          >
            <i class="fi fi-rr-calendar text-xl text-slate-400"></i>

            <p class="mt-2 text-sm text-slate-500">
              {{
                searchQuery
                    ? 'No active activities match your search.'
                    : 'No active activities available.'
              }}
            </p>
          </div>
        </section>

        <!-- Archive -->
        <section>
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900">
                Archive
              </h2>

              <p class="text-xs text-slate-500">
                Inactive activities from the last 3 days.
              </p>
            </div>

            <span
                class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600"
            >
              {{ archivedActivities.length }}
            </span>
          </div>

          <ActivitiesList
              v-if="archivedActivities.length"
              :activities="archivedActivities"
              :current-user="currentUser"
              :show-create-prompt="false"
              @select="selectActivity"
          />

          <div
              v-else
              class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center"
          >
            <i class="fi fi-rr-calendar text-xl text-slate-400"></i>

            <p class="mt-2 text-sm text-slate-500">
              {{
                searchQuery
                    ? 'No archived activities match your search.'
                    : 'No inactive activities from the last 3 days.'
              }}
            </p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  ElMessage,
  ElMessageBox
} from 'element-plus'

import studentConnect from '@/api'
import { user } from '@/services/auth'

import ActivitiesList from '@/components/activities/ActivitiesList.vue'
import ActivitiesDetail from '@/components/activities/ActivitiesDetail.vue'

const route = useRoute()
const router = useRouter()

const activities = ref([])
const loading = ref(false)
const loadError = ref('')
const searchQuery = ref('')
const now = ref(
    Math.floor(Date.now() / 1000)
)

let timeInterval = null

const currentUser = computed(() => ({
  id: String(user.value?.uid || ''),
  name:
      user.value?.displayName ||
      user.value?.email ||
      'Student'
}))

const activityId = computed(() => {
  const id = route.query.id

  if (Array.isArray(id)) {
    return String(id[0] || '')
  }

  return id
      ? String(id)
      : ''
})

/**
 * Returns the normalized search query.
 *
 * @returns {string} Lowercase trimmed search text.
 */
const normalizedSearchQuery = computed(() => {
  return searchQuery.value
      .trim()
      .toLowerCase()
})

/**
 * Determines whether an activity matches the current search.
 *
 * @param {Object} activity - Activity record.
 * @returns {boolean} True when the activity matches.
 */
function matchesSearch(activity) {
  const query =
      normalizedSearchQuery.value

  if (!query) {
    return true
  }

  const owner =
      activity?.owner ||
      activity?.createdBy ||
      {}

  const searchableText = [
    activity?.title,
    activity?.category,
    activity?.description,
    activity?.location,
    activity?.contact,
    owner?.name,
    owner?.displayName,
    owner?.email
  ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

  return searchableText.includes(query)
}

/**
 * Returns currently active activities after applying search.
 *
 * @returns {Array<Object>} Filtered and sorted active activities.
 */
const activeActivities = computed(() => {
  return activities.value
      .filter((activity) => {
        return (
            getStatus(activity) === 'open' &&
            matchesSearch(activity)
        )
      })
      .sort(
          (left, right) =>
              getTimestamp(left.eventDate) -
              getTimestamp(right.eventDate)
      )
})

/**
 * Returns archived activities after applying search.
 *
 * Only inactive activities updated within the last 72 hours
 * are included.
 *
 * @returns {Array<Object>} Filtered and sorted archived activities.
 */
const archivedActivities = computed(() => {
  return activities.value
      .filter((activity) => {
        const status =
            getStatus(activity)

        if (status === 'open') {
          return false
        }

        const timestamp =
            getTimestamp(
                activity.updatedAt ||
                activity.createdAt
            )

        return (
            timestamp > 0 &&
            now.value - timestamp <= 72 * 60 * 60 &&
            matchesSearch(activity)
        )
      })
      .sort(
          (left, right) =>
              getTimestamp(
                  right.updatedAt ||
                  right.createdAt
              ) -
              getTimestamp(
                  left.updatedAt ||
                  left.createdAt
              )
      )
})

/**
 * Returns the number of activities visible after search.
 *
 * @returns {number} Number of matching activities.
 */
const filteredActivityCount = computed(() => {
  return (
      activeActivities.value.length +
      archivedActivities.value.length
  )
})

/**
 * Clears the current activity search.
 *
 * @returns {void}
 */
function clearSearch() {
  searchQuery.value = ''
}

/**
 * Converts common API timestamp formats into Unix seconds.
 *
 * @param {*} value - Timestamp value from the API.
 * @returns {number} Unix timestamp or zero.
 */
function getTimestamp(value) {
  if (typeof value === 'number') {
    return value > 100000000000
        ? Math.floor(value / 1000)
        : value
  }

  if (
      typeof value === 'string' &&
      /^\d+$/.test(value)
  ) {
    const numericValue =
        Number(value)

    return numericValue > 100000000000
        ? Math.floor(numericValue / 1000)
        : numericValue
  }

  const parsed =
      Date.parse(value || '')

  return Number.isNaN(parsed)
      ? 0
      : Math.floor(parsed / 1000)
}

/**
 * Derives the effective activity lifecycle status.
 *
 * Explicit terminal statuses returned by the backend always
 * take precedence. Otherwise, an activity becomes expired when
 * its registration deadline has passed, or when its event date
 * has passed if there is no registration deadline.
 *
 * @param {Object} activity - Activity record.
 * @returns {string} Status key.
 */
function getStatus(activity) {
  const explicit =
      String(
          activity?.status || ''
      ).toLowerCase()

  if (
      [
        'cancelled',
        'completed',
        'expired'
      ].includes(explicit)
  ) {
    return explicit
  }

  const registrationDeadline =
      getTimestamp(
          activity?.registrationDeadline
      )

  const eventDate =
      getTimestamp(
          activity?.eventDate
      )

  if (
      registrationDeadline > 0 &&
      registrationDeadline <= now.value
  ) {
    return 'expired'
  }

  if (
      registrationDeadline <= 0 &&
      eventDate > 0 &&
      eventDate <= now.value
  ) {
    return 'expired'
  }

  return 'open'
}

/**
 * Loads all activities from the shared API client.
 *
 * @returns {Promise<void>} Resolves after the request completes.
 */
async function loadActivities() {
  loading.value = true
  loadError.value = ''

  try {
    const response =
        await studentConnect.getAllActivities()

    if (response?.success === false) {
      throw new Error(
          response.message ||
          'Unable to load activities.'
      )
    }

    const data =
        response?.data

    if (Array.isArray(data)) {
      activities.value = data
    } else if (
        Array.isArray(data?.activities)
    ) {
      activities.value =
          data.activities
    } else if (
        Array.isArray(response)
    ) {
      activities.value = response
    } else {
      activities.value = []
    }
  } catch (error) {
    loadError.value =
        error?.message ||
        'Unable to load activities.'
  } finally {
    loading.value = false
  }
}

/**
 * Opens the activity creation route.
 *
 * @returns {Promise<void>} Resolves after navigation.
 */
function navigateToCreate() {
  return router.push(
      '/activities/new'
  )
}

/**
 * Opens one activity detail route.
 *
 * @param {string} id - Activity identifier.
 * @returns {Promise<void>} Resolves after navigation.
 */
function selectActivity(id) {
  return router.push({
    path: '/activities',
    query: {
      id: String(id)
    }
  })
}

/**
 * Clears the selected detail resource.
 *
 * @returns {Promise<void>} Resolves after navigation.
 */
function clearSelection() {
  return router.push(
      '/activities'
  )
}

/**
 * Opens the edit route for an owned activity.
 *
 * Ownership is ultimately enforced by the backend.
 *
 * @param {string} id - Activity identifier.
 * @returns {Promise<void>} Resolves after navigation.
 */
function navigateToEdit(id) {
  return router.push({
    path: '/activities/edit',
    query: {
      id: String(id)
    }
  })
}

/**
 * Confirms and deletes an activity through the API.
 *
 * @param {string} id - Activity identifier.
 * @returns {Promise<void>} Resolves after deletion.
 */
async function deleteSelectedActivity(id) {
  try {
    await ElMessageBox.confirm(
        'Delete this activity announcement?',
        'Delete Activity',
        {
          type: 'warning',
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel'
        }
    )

    await studentConnect.deleteActivity(id)

    ElMessage.success(
        'Activity deleted.'
    )

    await loadActivities()
    await clearSelection()
  } catch (error) {
    if (
        error !== 'cancel' &&
        error !== 'close'
    ) {
      ElMessage.error(
          error?.message ||
          'Unable to delete activity.'
      )
    }
  }
}

onMounted(() => {
  loadActivities()

  timeInterval =
      window.setInterval(() => {
        now.value =
            Math.floor(
                Date.now() / 1000
            )
      }, 60000)
})

onUnmounted(() => {
  if (timeInterval) {
    window.clearInterval(
        timeInterval
    )
  }
})
</script>
