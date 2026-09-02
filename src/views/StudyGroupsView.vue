<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Form & join study pods</h1>
        <p class="text-slate-500 text-sm sm:text-base">Collaborate on subject revisions, exam prep, and group assignments.</p>
      </div>
      <button
        id="open-create-study-btn"
        class="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap"
        @click="isDialogOpen = true"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Create Group</span>
      </button>
    </header>

    <!-- Search & Filter Controls -->
    <section class="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
      <div class="flex-1 relative">
        <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input
          id="study-search-input"
          v-model="searchQuery"
          type="text"
          placeholder="Search study groups by subject, title, or topic..."
          class="w-full pl-12 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-800 text-sm transition-all"
        />
      </div>

      <div class="hidden md:block w-px h-8 bg-slate-200 self-center"></div>

      <!-- Filter Buttons -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          :id="'study-filter-tab-' + tab.id"
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

    <!-- Study Group List Component -->
    <StudyGroupList
      :groups="filteredGroups"
      :current-user="currentUser"
      @join="handleJoin"
      @leave="handleLeave"
      @open-create="isDialogOpen = true"
    />

    <!-- Create Study Group Dialog -->
    <el-dialog
      v-model="isDialogOpen"
      title="Create a New Study Group"
      width="90%"
      class="max-w-lg !rounded-2xl"
      destroy-on-close
    >
      <div class="mb-4 text-xs text-slate-500">
        Set up a study group to collaborate with peers in your subject.
      </div>
      <StudyGroupForm
        @submit="handleCreate"
        @cancel="isDialogOpen = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import database from '../database'
import StudyGroupList from '../components/study/StudyGroupList.vue'
import StudyGroupForm from '../components/study/StudyGroupForm.vue'

const currentUser = ref(localStorage.getItem('student_user_name') || 'Manho')
const groups = ref([])
const searchQuery = ref('')
const activeFilter = ref('all')
const isDialogOpen = ref(false)

const filterTabs = [
  { id: 'all', label: 'All Groups' },
  { id: 'available', label: 'Open Slots' },
  { id: 'joined', label: 'My Groups' }
]

function getActiveUserObject() {
  return {
    id: localStorage.getItem('student_user_id') || 'student-001',
    name: currentUser.value || 'Manho',
    email: localStorage.getItem('student_user_email') || 'student@student.com'
  }
}

async function loadGroups() {
  currentUser.value = localStorage.getItem('student_user_name') || 'Manho'
  groups.value = await database.studyGroups.getAll()
}

onMounted(() => {
  loadGroups()
})

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
  if (activeFilter.value === 'available') {
    list = list.filter((item) => Number(item.members) < Number(item.maxMembers))
  } else if (activeFilter.value === 'joined') {
    list = list.filter(
      (item) =>
        (item.memberList && item.memberList.includes(currentUser.value)) ||
        item.creator === currentUser.value
    )
  }

  return list
})

async function handleCreate(formData) {
  try {
    const activeUser = getActiveUserObject()
    const newGroup = await database.studyGroups.create(formData, activeUser)
    await loadGroups()
    isDialogOpen.value = false

    await database.notifications.send({
      type: 'STUDY_REMINDER',
      title: 'New Study Group Created 📚',
      message: `${activeUser.name} initiated "${formData.name}" for ${formData.subject}.`,
      entityType: 'study',
      entityId: newGroup.id,
      senderId: activeUser.id,
      senderName: activeUser.name,
      targetUserId: 'all'
    })

    ElMessage.success('Study group created! Classmates can now discover and join.')
  } catch (err) {
    ElMessage.error(err.message || 'Failed to create study group')
  }
}

async function handleJoin(id) {
  try {
    const activeUser = getActiveUserObject()
    await database.studyGroups.join(id, activeUser)
    await loadGroups()
    ElMessage.success('You joined the study group!')
  } catch (err) {
    ElMessage.error(err.message || 'Could not join study group')
  }
}

async function handleLeave(id) {
  try {
    const activeUser = getActiveUserObject()
    await database.studyGroups.leave(id, activeUser)
    await loadGroups()
    ElMessage.info('You left the study group.')
  } catch (err) {
    ElMessage.error(err.message || 'Could not leave study group')
  }
}
</script>
