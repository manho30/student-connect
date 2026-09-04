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
            class="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap"
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

      <!-- Search & Filter Bar -->
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
              id="carpool-search-input"
              v-model="searchQuery"
              type="text"
              placeholder="Where are you headed? (Search origin or destination)"
              class="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-800 text-sm transition-all"
          />
        </div>

        <div
            class="hidden md:block w-px h-8 bg-slate-200 self-center"
        ></div>

        <!-- Filter Tabs -->
        <div
            class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0"
        >
          <button
              v-for="tab in filterTabs"
              :key="tab.id"
              :id="'filter-tab-' + tab.id"
              type="button"
              :class="[
              'px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
              activeFilter === tab.id
                ? 'bg-indigo-50 text-indigo-700'
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
          class="flex justify-center py-10 text-sm text-slate-500"
      >
        Loading carpools...
      </div>

      <!-- Error State -->
      <div
          v-else-if="loadError"
          class="bg-red-50 border border-red-100 rounded-2xl p-6 text-center"
      >
        <p class="text-sm font-medium text-red-700">
          {{ loadError }}
        </p>

        <button
            id="carpool-retry-btn"
            type="button"
            class="mt-3 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer"
            @click="loadCarpools"
        >
          Try Again
        </button>
      </div>

      <!-- Carpool List -->
      <CarpoolList
          v-else
          :carpools="filteredCarpools"
          :current-user="currentUser"
          @join="handleJoin"
          @leave="handleLeave"
          @edit="handleEdit"
          @select="handleSelect"
          @open-create="navigateToCreate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import studentConnect from '@/api'
import { user } from '@/services/auth'
import CarpoolList from '../components/carpool/CarpoolList.vue'
import CarpoolDetail from '../components/carpool/CarpoolDetail.vue'

const route = useRoute()
const router = useRouter()

const carpools = ref([])
const searchQuery = ref('')
const activeFilter = ref('all')
const loading = ref(false)
const loadError = ref('')

/**
 * Represents the current Firebase-authenticated student for display and
 * client-side filtering. Backend authorization is based on the ID token.
 */
const currentUser = computed(() => ({
  id: user.value?.uid || '',
  name: user.value?.displayName || user.value?.email || 'Student'
}))

/**
 * Reads the backend-generated carpool ID from the route query.
 *
 * @returns {string|null} Carpool resource ID, or null when the list
 * page is currently displayed.
 */
const carpoolId = computed(() => {
  const id = route.query.id

  return id ? String(id) : null
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
 * Loads all carpools from the Student Connect API.
 *
 * The API response must follow the standard response envelope:
 * { success, message, data }.
 *
 * @returns {Promise<void>} Resolves when the carpool list has loaded.
 * @throws {Error} When the API request fails or returns an unsuccessful response.
 */
async function loadCarpools() {
  loading.value = true
  loadError.value = ''

  try {
    const response = await studentConnect.getAllCarPoolList()

    if (!response?.success) {
      throw new Error(
          response?.message || 'Failed to load carpool list'
      )
    }

    carpools.value = Array.isArray(response.data)
        ? response.data
        : []
  } catch (error) {
    carpools.value = []
    loadError.value =
        error?.message || 'Failed to load carpool list'

    ElMessage.error(loadError.value)
  } finally {
    loading.value = false
  }
}

/**
 * Reloads the carpool list when navigation returns from a detail page
 * to the main carpool listing.
 *
 * @param {string|undefined} newId - Current carpool ID from the route query.
 * @returns {void} Starts a carpool list reload when no detail ID exists.
 */
function handleRouteChange(newId) {
  if (!newId) {
    loadCarpools()
  }
}

onMounted(() => {
  if (!carpoolId.value) {
    loadCarpools()
  }
})

watch(
    () => route.query.id,
    handleRouteChange
)

/**
 * Filters the loaded carpools according to the active search query
 * and selected filter.
 *
 * Search covers the carpool title, origin, destination, departure
 * date, and departure time using the latest resource structure.
 *
 * @returns {Array<Object>} The filtered carpool resources.
 */
const filteredCarpools = computed(() => {
  let list = Array.isArray(carpools.value)
      ? carpools.value
      : []

  const query = searchQuery.value.trim().toLowerCase()

  if (query) {
    list = list.filter((carpool) => {
      const title = String(
          carpool.title || ''
      ).toLowerCase()

      const origin = String(
          carpool.origin || ''
      ).toLowerCase()

      const destination = String(
          carpool.destination || ''
      ).toLowerCase()

      const departureDate = String(
          carpool.departure?.date || ''
      ).toLowerCase()

      const departureTime = String(
          carpool.departure?.time || ''
      ).toLowerCase()

      return (
          title.includes(query) ||
          origin.includes(query) ||
          destination.includes(query) ||
          departureDate.includes(query) ||
          departureTime.includes(query)
      )
    })
  }

  if (activeFilter.value === 'available') {
    list = list.filter((carpool) => {
      const capacity = Number(
          carpool.capacity || 0
      )

      const participantCount = Array.isArray(
          carpool.participants
      )
          ? carpool.participants.length
          : 0

      return participantCount < capacity
    })
  }

  if (activeFilter.value === 'joined') {
    list = list.filter((carpool) => {
      const participants = Array.isArray(
          carpool.participants
      )
          ? carpool.participants
          : []

      const isParticipant = participants.some(
          (participant) =>
              participant?.id === currentUser.value.id
      )

      const isOwner =
          carpool.owner?.id === currentUser.value.id

      return isParticipant || isOwner
    })
  }

  return list
})

/**
 * Navigates to the dedicated carpool creation page.
 *
 * @returns {void} Performs router navigation to /carpool/new.
 */
function navigateToCreate() {
  router.push('/carpool/new')
}

/**
 * Navigates to the carpool detail page using the backend-generated ID.
 *
 * @param {string} id - Backend-generated carpool resource identifier.
 * @returns {void} Performs router navigation to the detail page.
 */
function handleSelect(id) {
  if (!id) {
    ElMessage.error('Carpool ID is missing')
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
 * Navigates to the dedicated carpool edit page.
 *
 * @param {Object} carpool - Carpool resource containing its backend-generated ID.
 * @returns {void} Performs router navigation to /carpool/edit.
 */
function handleEdit(carpool) {
  if (!carpool?.id) {
    ElMessage.error('Carpool ID is missing')
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
 * The frontend does not modify the participant list directly.
 * The backend remains responsible for validating capacity and
 * updating membership.
 *
 * @param {string} id - Backend-generated carpool resource identifier.
 * @returns {Promise<void>} Resolves after the join operation completes.
 * @throws {Error} When the API request fails or returns an unsuccessful response.
 */
async function handleJoin(id) {
  if (!id) {
    ElMessage.error('Carpool ID is missing')
    return
  }

  try {
    const response = await studentConnect.joinCarPool(id)

    if (!response?.success) {
      throw new Error(
          response?.message || 'Could not join carpool'
      )
    }

    await loadCarpools()

    ElMessage.success(
        response.message || 'You joined the carpool!'
    )
  } catch (error) {
    ElMessage.error(
        error?.message || 'Could not join carpool'
    )
  }
}

/**
 * Leaves a carpool through the Student Connect API.
 *
 * The frontend does not remove the participant locally.
 * The backend remains responsible for validating and applying
 * the membership change.
 *
 * @param {string} id - Backend-generated carpool resource identifier.
 * @returns {Promise<void>} Resolves after the leave operation completes.
 * @throws {Error} When the API request fails or returns an unsuccessful response.
 */
async function handleLeave(id) {
  if (!id) {
    ElMessage.error('Carpool ID is missing')
    return
  }

  try {
    const response = await studentConnect.leaveCarPool(id)

    if (!response?.success) {
      throw new Error(
          response?.message || 'Could not leave carpool'
      )
    }

    await loadCarpools()

    ElMessage.success(
        response.message || 'You left the carpool.'
    )
  } catch (error) {
    ElMessage.error(
        error?.message || 'Could not leave carpool'
    )
  }
}
</script>
