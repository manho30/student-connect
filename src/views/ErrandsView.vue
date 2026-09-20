<template>
  <div id="errands-view-root">
    <!-- DETAIL VIEW -->
    <ErrandDetail
        v-if="errandId"
        :errand-id="errandId"
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
            Post & fulfill student errands
          </h1>

          <p class="text-slate-500 text-sm sm:text-base">
            Need a favor or heading to the store? Help a campus peer today.
          </p>
        </div>

        <button
            id="open-create-errand-btn"
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

          <span>Post Errand</span>
        </button>
      </header>

      <!-- Search Bar -->
      <section
          class="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row gap-4 items-stretch md:items-center"
      >
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
              id="errand-search-input"
              v-model="searchQuery"
              type="text"
              placeholder="Search errands by title, description or location..."
              class="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-slate-800 text-sm transition-all"
          />
        </div>
      </section>

      <!-- Loading State -->
      <div
          v-if="loading"
          id="errands-loading"
          class="space-y-4"
      >
        <!-- Loading Header -->
        <div class="flex items-center gap-3 px-1">
          <div
              class="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"
          ></div>

          <p class="text-sm font-medium text-slate-500">
            Loading errands...
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

            <!-- Location -->
            <div class="flex items-center gap-2 mb-5">
              <div class="w-4 h-4 bg-slate-200 rounded-full"></div>
              <div class="h-3 w-1/2 bg-slate-100 rounded"></div>
            </div>

            <!-- Footer -->
            <div class="pt-4 border-t border-slate-100 flex justify-between items-center">
              <div class="h-4 w-20 bg-slate-100 rounded"></div>
              <div class="h-9 w-24 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div
          v-else-if="loadError"
          id="errands-error"
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
            id="errands-retry-btn"
            type="button"
            class="mt-4 px-5 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-bold hover:bg-rose-700 transition-colors cursor-pointer"
            @click="loadErrands"
        >
          Try Again
        </button>
      </div>

      <!-- Errand Lists -->
      <div v-else class="space-y-8">
        <section>
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900">Currently Active</h2>
              <p class="text-xs text-slate-500">Open and accepted errands needing attention.</p>
            </div>
            <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              {{ activeErrands.length }}
            </span>
          </div>
          <ErrandList
              :errands="activeErrands"
              :current-user="currentUser"
              @accept="handleAccept"
              @complete="handleComplete"
              @select="handleSelect"
              @open-create="navigateToCreate"
          />
        </section>

        <section>
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold text-slate-900">Archive</h2>
              <p class="text-xs text-slate-500">Inactive errands from the last 3 days.</p>
            </div>
            <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
              {{ archivedErrands.length }}
            </span>
          </div>
          <ErrandList
              v-if="archivedErrands.length"
              :errands="archivedErrands"
              :current-user="currentUser"
              :show-create-prompt="false"
              @accept="handleAccept"
              @complete="handleComplete"
              @select="handleSelect"
          />
          <p v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No inactive errands from the last 3 days.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import studentConnect from '@/api'
import ErrandList from '../components/errands/ErrandList.vue'
import ErrandDetail from '../components/errands/ErrandDetail.vue'
import { user } from '@/services/auth'

const route = useRoute()
const router = useRouter()

const errands = ref([])
const searchQuery = ref('')
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
 * Reads the errand ID from the current route query.
 *
 * @returns {string|null} Errand ID or null when displaying the list.
 */
const errandId = computed(() => {
  return route.query.id
      ? String(route.query.id)
      : null
})

/**
 * Loads the latest errands list from the Lend a Hand API.
 *
 * @returns {Promise<void>}
 */
async function loadErrands() {
  loading.value = true
  loadError.value = ''

  try {
    const response = await studentConnect.getAllErrands()

    /**
     * Support both:
     *
     * { success, message, data }
     *
     * and legacy direct array responses.
     */
    if (response?.success === false) {
      throw new Error(
          response?.message || 'Failed to load errands'
      )
    }

    if (Array.isArray(response?.data)) {
      errands.value = response.data
    } else if (Array.isArray(response)) {
      errands.value = response
    } else {
      errands.value = []
    }
  } catch (error) {
    errands.value = []

    loadError.value =
        error?.message || 'Failed to load errands'

    ElMessage.error(loadError.value)
  } finally {
    loading.value = false
  }
}

/**
 * Loads errands when the listing page is initially displayed.
 */
onMounted(() => {
  if (!errandId.value) {
    loadErrands()
  }
})

/**
 * Reloads errands when returning from an errand detail page.
 */
watch(
    () => route.query.id,
    (newId) => {
      if (!newId) {
        loadErrands()
      }
    }
)

/**
 * Computes the list of errands filtered by search keywords.
 *
 * @returns {Array<Object>} Filtered errands.
 */
const filteredErrands = computed(() => {
  let list = Array.isArray(errands.value)
      ? errands.value
      : []

  const query = searchQuery.value
      .trim()
      .toLowerCase()

  if (!query) {
    return list
  }

  return list.filter((item) => {
    const title = String(
        item?.title || ''
    ).toLowerCase()

    const description = String(
        item?.description || ''
    ).toLowerCase()

    const location = String(
        item?.location || ''
    ).toLowerCase()

    return (
        title.includes(query) ||
        description.includes(query) ||
        location.includes(query)
    )
  })
})

/**
 * Returns the backend-aligned errand status used by list grouping.
 *
 * @param {Object} errand - Errand resource.
 * @returns {string} open, accepted, completed, cancelled, or expired.
 */
function getErrandStatus(errand) {
  const status = String(errand?.status || '').toLowerCase()
  if (['accepted', 'completed', 'cancelled', 'expired'].includes(status)) return status

  const deadline = normalizeActivityTimestamp(errand?.deadline)
  return deadline > 0 && deadline < Date.now() ? 'expired' : 'open'
}

/**
 * Determines whether an inactive errand belongs in the 72-hour archive.
 *
 * @param {Object} errand - Errand resource.
 * @returns {boolean} True when the inactive record is recent.
 */
function isRecentInactiveErrand(errand) {
  const status = getErrandStatus(errand)
  if (!['completed', 'cancelled', 'expired'].includes(status)) return false

  const timestamp = normalizeActivityTimestamp(
      errand?.updatedAt || errand?.completedAt || errand?.createdAt
  )
  return timestamp > 0 && Date.now() - timestamp <= 72 * 60 * 60 * 1000
}

/**
 * Returns active errands after search criteria are applied.
 *
 * @returns {Array<Object>} Active errands.
 */
const activeErrands = computed(() => {
  return filteredErrands.value
      .filter((errand) => ['open', 'accepted'].includes(getErrandStatus(errand)))
      .sort((first, second) => normalizeActivityTimestamp(second.updatedAt || second.createdAt) - normalizeActivityTimestamp(first.updatedAt || first.createdAt))
})

/**
 * Returns recent inactive errands for the archive section.
 *
 * @returns {Array<Object>} Recent archived errands.
 */
const archivedErrands = computed(() => {
  return filteredErrands.value
      .filter(isRecentInactiveErrand)
      .sort((first, second) => normalizeActivityTimestamp(second.updatedAt || second.completedAt || second.createdAt) - normalizeActivityTimestamp(first.updatedAt || first.completedAt || first.createdAt))
})

/**
 * Navigates to the create errand page.
 *
 * @returns {void}
 */
function navigateToCreate() {
  router.push('/errands/new')
}

/**
 * Opens the detail page for a specific errand.
 *
 * @param {string|number} id - Errand identifier.
 * @returns {void}
 */
function handleSelect(id) {
  if (!id) {
    ElMessage.error('Errand ID is missing')
    return
  }

  router.push({
    path: '/errands',
    query: {
      id: String(id)
    }
  })
}

/**
 * Accepts a student errand.
 *
 * @param {string|number} id - Errand identifier.
 * @returns {Promise<void>}
 */
async function handleAccept(id) {
  try {
    const response = await studentConnect.acceptErrand(id)

    if (response?.success === false) {
      throw new Error(
          response?.message || 'Could not accept errand'
      )
    }

    await loadErrands()

    ElMessage.success(
        response?.message ||
        'You accepted this errand! Thank you for helping a peer.'
    )
  } catch (error) {
    ElMessage.error(
        error?.message || 'Could not accept errand'
    )
  }
}

/**
 * Marks an accepted errand as completed.
 *
 * @param {string|number} id - Errand identifier.
 * @returns {Promise<void>}
 */
async function handleComplete(id) {
  try {
    const response = await studentConnect.completeErrand(id)

    if (response?.success === false) {
      throw new Error(
          response?.message || 'Could not complete errand'
      )
    }

    await loadErrands()

    ElMessage.success(
        response?.message ||
        'Errand marked as completed! Great job.'
    )
  } catch (error) {
    ElMessage.error(
        error?.message || 'Could not complete errand'
    )
  }
}
</script>
