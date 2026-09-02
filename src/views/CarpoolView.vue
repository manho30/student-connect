<template>
  <div id="carpool-view-root">
    <!-- DETAIL VIEW (When route.query.id is present) -->
    <CarpoolDetail
      v-if="carpoolId"
      :carpool-id="carpoolId"
      :current-user="currentUser"
    />

    <!-- LISTING VIEW (When no route.query.id is present) -->
    <div v-else class="space-y-6">
      <!-- Header Section -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Find students going your way</h1>
          <p class="text-slate-500 text-sm sm:text-base">Share rides, save costs, and meet new friends on campus.</p>
        </div>
        <button
          id="open-create-carpool-btn"
          class="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap"
          @click="navigateToCreate"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Create Carpool</span>
        </button>
      </header>

      <!-- Search & Filter Bar -->
      <section class="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div class="flex-1 relative">
          <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            id="carpool-search-input"
            v-model="searchQuery"
            type="text"
            placeholder="Where are you headed? (Search origin or destination)"
            class="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-800 text-sm transition-all"
          />
        </div>

        <div class="hidden md:block w-px h-8 bg-slate-200 self-center"></div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            v-for="tab in filterTabs"
            :key="tab.id"
            :id="'filter-tab-' + tab.id"
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

      <!-- Carpool List Component -->
      <CarpoolList
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
import CarpoolList from '../components/carpool/CarpoolList.vue'
import CarpoolDetail from '../components/carpool/CarpoolDetail.vue'

const route = useRoute()
const router = useRouter()

const currentUser = ref(localStorage.getItem('student_user_name') || 'Manho')
const carpools = ref([])
const searchQuery = ref('')
const activeFilter = ref('all')

const carpoolId = computed(() => {
  return route.query.id ? String(route.query.id) : null
})

const filterTabs = [
  { id: 'all', label: 'All Carpools' },
  { id: 'available', label: 'Available Seats' },
  { id: 'joined', label: 'My Carpools' }
]

/**
 * Loads the latest carpool list from the Student Connect API.
 *
 * @returns {Promise<void>} Resolves after the carpool list is loaded.
 */
async function loadCarpools() {
  currentUser.value = localStorage.getItem('student_user_name') || 'Manho'
  try {
    const res = await studentConnect.getAllCarPoolList()
    carpools.value = res.data || res || []
  } catch (err) {
    ElMessage.error(err.message || 'Failed to load carpool list')
  }
}

onMounted(() => {
  if (!carpoolId.value) {
    loadCarpools()
  }
})

watch(
  () => route.query.id,
  (newId) => {
    if (!newId) {
      loadCarpools()
    }
  }
)

/**
 * Computes filtered carpool items based on the active search query and selected filter tab.
 *
 * @type {import('vue').ComputedRef<Array<Object>>}
 */
const filteredCarpools = computed(() => {
  let list = carpools.value || []

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (item) =>
        (item.from && item.from.toLowerCase().includes(q)) ||
        (item.to && item.to.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q))
    )
  }

  // Tab filter
  if (activeFilter.value === 'available') {
    list = list.filter((item) => Number(item.joined) < Number(item.capacity))
  } else if (activeFilter.value === 'joined') {
    list = list.filter(
      (item) =>
        (item.joinedStudents && item.joinedStudents.includes(currentUser.value)) ||
        item.creator === currentUser.value ||
        item.creatorName === currentUser.value
    )
  }

  return list
})

/**
 * Navigates to the dedicated carpool creation page.
 *
 * @returns {void}
 */
function navigateToCreate() {
  router.push('/carpool/new')
}

/**
 * Navigates to the detail page for a specific carpool.
 *
 * @param {string|number} id - Carpool unique identifier.
 * @returns {void}
 */
function handleSelect(id) {
  router.push(`/carpool?id=${id}`)
}

/**
 * Navigates to the edit page for a specific carpool.
 *
 * @param {Object} carpool - The carpool item to edit.
 * @returns {void}
 */
function handleEdit(carpool) {
  router.push(`/carpool/edit?id=${carpool.id}`)
}

/**
 * Joins a specific carpool using the Student Connect API.
 *
 * @param {string|number} id - Unique identifier of the carpool to join.
 * @returns {Promise<void>}
 */
async function handleJoin(id) {
  try {
    const currentName = currentUser.value || 'Student'
    const currentId = localStorage.getItem('student_user_id') || 'student-001'

    await studentConnect.joinCarPool(id, {
      userName: currentName,
      userId: currentId
    })
    await loadCarpools()
    ElMessage.success('You joined the carpool!')
  } catch (err) {
    ElMessage.error(err.message || 'Could not join carpool')
  }
}

/**
 * Leaves a joined carpool using the Student Connect API.
 *
 * @param {string|number} id - Unique identifier of the carpool to leave.
 * @returns {Promise<void>}
 */
async function handleLeave(id) {
  try {
    const currentName = currentUser.value || 'Student'
    const currentId = localStorage.getItem('student_user_id') || 'student-001'

    await studentConnect.leaveCarPool(id, {
      userName: currentName,
      userId: currentId
    })
    await loadCarpools()
    ElMessage.info('You left the carpool.')
  } catch (err) {
    ElMessage.error(err.message || 'Could not leave carpool')
  }
}
</script>
