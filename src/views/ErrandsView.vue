<template>
  <div id="errands-view-root">
    <!-- DETAIL VIEW (When route.query.id is present) -->
    <ErrandDetail
      v-if="errandId"
      :errand-id="errandId"
      :current-user="currentUser"
    />

    <!-- LISTING VIEW (When no route.query.id is present) -->
    <div v-else class="space-y-6">
      <!-- Header Section -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Post & fulfill student errands</h1>
          <p class="text-slate-500 text-sm sm:text-base">Need a favor or heading to the store? Help a campus peer today.</p>
        </div>
        <button
          id="open-create-errand-btn"
          class="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap"
          @click="navigateToCreate"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Post Errand</span>
        </button>
      </header>

      <!-- Search & Category Filter Bar -->
      <section class="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div class="flex-1 relative">
          <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            id="errand-search-input"
            v-model="searchQuery"
            type="text"
            placeholder="Search errands by title, description or location..."
            class="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-800 text-sm transition-all"
          />
        </div>

      </section>

      <!-- Errand List Component -->
      <ErrandList
        :errands="filteredErrands"
        :current-user="currentUser"
        @accept="handleAccept"
        @complete="handleComplete"
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
import ErrandList from '../components/errands/ErrandList.vue'
import ErrandDetail from '../components/errands/ErrandDetail.vue'
import { user } from '@/services/auth'

const route = useRoute()
const router = useRouter()

const currentUser = computed(() => ({
  id: user.value?.uid || '',
  name: user.value?.displayName || user.value?.email || 'Student'
}))
const errands = ref([])
const searchQuery = ref('')

const errandId = computed(() => {
  return route.query.id ? String(route.query.id) : null
})

/**
 * Loads the latest errands list from the Student Connect API.
 *
 * @returns {Promise<void>} Resolves after errands are loaded and local state is updated.
 */
async function loadErrands() {
  try {
    const res = await studentConnect.getAllErrands()
    errands.value = res.data || res || []
  } catch (err) {
    ElMessage.error(err.message || 'Failed to load errands')
  }
}

onMounted(() => {
  if (!errandId.value) {
    loadErrands()
  }
})

watch(
  () => route.query.id,
  (newId) => {
    if (!newId) {
      loadErrands()
    }
  }
)

/**
 * Computes the list of errands filtered by user search keywords.
 *
 * @type {import('vue').ComputedRef<Array<Object>>}
 */
const filteredErrands = computed(() => {
  let list = errands.value || []

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (item) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q))
    )
  }

  return list
})

/**
 * Navigates to the dedicated create errand page.
 *
 * @returns {void}
 */
function navigateToCreate() {
  router.push('/errands/new')
}

/**
 * Navigates to the detail page for a specific errand.
 *
 * @param {string|number} id - Unique errand identifier.
 * @returns {void}
 */
function handleSelect(id) {
  router.push(`/errands?id=${id}`)
}

/**
 * Accepts a student errand.
 *
 * @param {string|number} id - Unique identifier of the errand to accept.
 * @returns {Promise<void>}
 */
async function handleAccept(id) {
  try {
    await studentConnect.acceptErrand(id)
    await loadErrands()
    ElMessage.success('You accepted this errand! Thank you for helping a peer.')
  } catch (err) {
    ElMessage.error(err.message || 'Could not accept errand')
  }
}

/**
 * Marks an accepted errand as completed.
 *
 * @param {string|number} id - Unique identifier of the completed errand.
 * @returns {Promise<void>}
 */
async function handleComplete(id) {
  try {
    await studentConnect.completeErrand(id)
    await loadErrands()
    ElMessage.success('Errand marked as completed! Great job.')
  } catch (err) {
    ElMessage.error(err.message || 'Could not complete errand')
  }
}
</script>
