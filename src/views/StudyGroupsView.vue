<template>
  <div id="study-view-root">
    <!-- DETAIL VIEW (When route.query.id is present) -->
    <StudyGroupDetail
      v-if="groupId"
      :group-id="groupId"
      :current-user="currentUser"
    />

    <!-- LISTING VIEW (When no route.query.id is present) -->
    <div v-else class="space-y-6">
      <!-- Header Section -->
      <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div class="space-y-1">
          <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Collaborate in student study groups</h1>
          <p class="text-slate-500 text-sm sm:text-base">Prepare for exams, crack difficult assignments, and build study pods.</p>
        </div>
        <button
          id="open-create-study-btn"
          class="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap"
          @click="navigateToCreate"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          <span>Create Study Group</span>
        </button>
      </header>

      <!-- Search & Subject Filter Bar -->
      <section class="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div class="flex-1 relative">
          <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            id="study-search-input"
            v-model="searchQuery"
            type="text"
            placeholder="Search study groups by topic, module, or subject..."
            class="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-800 text-sm transition-all"
          />
        </div>

        <div class="hidden md:block w-px h-8 bg-slate-200 self-center"></div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            v-for="filter in filters"
            :key="filter.id"
            :id="'study-filter-tab-' + filter.id"
            :class="[
              'px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer',
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

      <!-- Study Group List Component -->
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import studentConnect from '@/api'
import StudyGroupList from '../components/study/StudyGroupList.vue'
import StudyGroupDetail from '../components/study/StudyGroupDetail.vue'

const route = useRoute()
const router = useRouter()

const currentUser = ref(localStorage.getItem('student_user_name') || 'Manho')
const groups = ref([])
const searchQuery = ref('')
const activeFilter = ref('all')

const groupId = computed(() => {
  return route.query.id ? String(route.query.id) : null
})

const filters = [
  { id: 'all', label: 'All Groups' },
  { id: 'open', label: 'Open Slots' },
  { id: 'joined', label: 'My Study Pods' }
]

/**
 * Loads the latest study groups list from the Student Connect API.
 *
 * @returns {Promise<void>}
 */
async function loadStudyGroups() {
  currentUser.value = localStorage.getItem('student_user_name') || 'Manho'
  try {
    const res = await studentConnect.getAllStudyGroups()
    groups.value = res.data || res || []
  } catch (err) {
    ElMessage.error(err.message || 'Failed to load study groups')
  }
}

onMounted(() => {
  if (!groupId.value) {
    loadStudyGroups()
  }
})

watch(
  () => route.query.id,
  (newId) => {
    if (!newId) {
      loadStudyGroups()
    }
  }
)

/**
 * Computes filtered study groups based on active search keyword and filter tabs.
 *
 * @type {import('vue').ComputedRef<Array<Object>>}
 */
const filteredGroups = computed(() => {
  let list = groups.value || []

  // Search filter
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.subject && item.subject.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q))
    )
  }

  // Tab filter
  if (activeFilter.value === 'open') {
    list = list.filter((item) => Number(item.members) < Number(item.maxMembers))
  } else if (activeFilter.value === 'joined') {
    list = list.filter((item) => {
      const isMember = Array.isArray(item.memberList) && item.memberList.includes(currentUser.value)
      const isCreator = item.creator === currentUser.value || item.creatorName === currentUser.value
      return isMember || isCreator
    })
  }

  return list
})

/**
 * Navigates to the dedicated create study group page.
 *
 * @returns {void}
 */
function navigateToCreate() {
  router.push('/study/new')
}

/**
 * Navigates to the detail page for a specific study group.
 *
 * @param {string|number} id - Unique study group identifier.
 * @returns {void}
 */
function handleSelect(id) {
  router.push(`/study?id=${id}`)
}

/**
 * Joins a study group.
 *
 * @param {string|number} id - Unique study group identifier.
 * @returns {Promise<void>}
 */
async function handleJoin(id) {
  try {
    const currentName = currentUser.value || 'Student'
    const currentId = localStorage.getItem('student_user_id') || 'student-001'

    await studentConnect.joinStudyGroup(id, {
      userName: currentName,
      userId: currentId
    })
    await loadStudyGroups()
    ElMessage.success('You joined the study group!')
  } catch (err) {
    ElMessage.error(err.message || 'Could not join study group')
  }
}

/**
 * Leaves a study group.
 *
 * @param {string|number} id - Unique study group identifier.
 * @returns {Promise<void>}
 */
async function handleLeave(id) {
  try {
    const currentName = currentUser.value || 'Student'
    const currentId = localStorage.getItem('student_user_id') || 'student-001'

    await studentConnect.leaveStudyGroup(id, {
      userName: currentName,
      userId: currentId
    })
    await loadStudyGroups()
    ElMessage.info('You left the study group.')
  } catch (err) {
    ElMessage.error(err.message || 'Could not leave study group')
  }
}
</script>
