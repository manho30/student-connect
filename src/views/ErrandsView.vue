<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Post & fulfill student errands</h1>
        <p class="text-slate-500 text-sm sm:text-base">Need a favor or heading to the store? Help a campus peer today.</p>
      </div>
      <button
        id="open-create-errand-btn"
        class="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap"
        @click="isDialogOpen = true"
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

      <div class="hidden md:block w-px h-8 bg-slate-200 self-center"></div>

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :id="'category-tab-' + cat.id"
          :class="[
            'px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5',
            activeCategory === cat.id
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          ]"
          @click="activeCategory = cat.id"
        >
          <i :class="cat.icon" class="text-xs"></i>
          <span>{{ cat.label }}</span>
        </button>
      </div>
    </section>

    <!-- Errand List Component -->
    <ErrandList
      :errands="filteredErrands"
      :current-user="currentUser"
      @accept="handleAccept"
      @complete="handleComplete"
      @open-create="isDialogOpen = true"
    />

    <!-- Create Errand Dialog -->
    <el-dialog
      v-model="isDialogOpen"
      title="Post a Student Errand Request"
      width="90%"
      class="max-w-lg !rounded-2xl"
      destroy-on-close
    >
      <div class="mb-4 text-xs text-slate-500">
        Describe what you need help with so a fellow student nearby can assist.
      </div>
      <ErrandForm
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
import ErrandList from '../components/errands/ErrandList.vue'
import ErrandForm from '../components/errands/ErrandForm.vue'

const currentUser = ref(localStorage.getItem('student_user_name') || 'Manho')
const errands = ref([])
const searchQuery = ref('')
const activeCategory = ref('all')
const isDialogOpen = ref(false)

const categories = [
  { id: 'all', label: 'All Tasks', icon: 'fi fi-rr-apps' },
  { id: 'Food', label: 'Food', icon: 'fi fi-rr-restaurant' },
  { id: 'Parcel', label: 'Parcel', icon: 'fi fi-rr-box-alt' },
  { id: 'Printing', label: 'Printing', icon: 'fi fi-rr-print' },
  { id: 'Stationery', label: 'Stationery', icon: 'fi fi-rr-pencil' }
]

function getActiveUserObject() {
  return {
    id: localStorage.getItem('student_user_id') || 'student-001',
    name: currentUser.value || 'Manho',
    email: localStorage.getItem('student_user_email') || 'student@student.com'
  }
}

async function loadErrands() {
  currentUser.value = localStorage.getItem('student_user_name') || 'Manho'
  errands.value = await database.errands.getAll()
}

onMounted(() => {
  loadErrands()
})

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

  // Category filter
  if (activeCategory.value !== 'all') {
    list = list.filter((item) => item.category === activeCategory.value)
  }

  return list
})

async function handleCreate(formData) {
  try {
    const activeUser = getActiveUserObject()
    const newErrand = await database.errands.create(formData, activeUser)
    await loadErrands()
    isDialogOpen.value = false

    // Post notification
    await database.notifications.send({
      type: 'GENERAL',
      title: 'New Student Errand Posted 📦',
      message: `${activeUser.name} requested help: "${formData.title}" (${formData.category || 'General'}).`,
      entityType: 'errand',
      entityId: newErrand.id,
      senderId: activeUser.id,
      senderName: activeUser.name,
      targetUserId: 'all'
    })

    ElMessage.success('Errand posted! Nearby students can now see your request.')
  } catch (err) {
    ElMessage.error(err.message || 'Failed to post errand')
  }
}

async function handleAccept(id) {
  try {
    const activeUser = getActiveUserObject()
    const updated = await database.errands.accept(id, activeUser)
    await loadErrands()

    // Send notification to errand owner
    await database.notifications.send({
      type: 'ERRAND_ACCEPTED',
      title: 'Errand Accepted! 📦',
      message: `${activeUser.name} has accepted your errand: "${updated.title}".`,
      entityType: 'errand',
      entityId: updated.id,
      senderId: activeUser.id,
      senderName: activeUser.name,
      targetUserId: updated.creatorId || 'all',
      targetUserName: updated.creator || 'Student'
    })

    ElMessage.success('You accepted this errand! Thank you for helping a peer.')
  } catch (err) {
    ElMessage.error(err.message || 'Could not accept errand')
  }
}

async function handleComplete(id) {
  try {
    const activeUser = getActiveUserObject()
    const updated = await database.errands.complete(id)
    await loadErrands()

    await database.notifications.send({
      type: 'ERRAND_COMPLETED',
      title: 'Errand Completed 🎉',
      message: `${activeUser.name} marked "${updated.title}" as completed.`,
      entityType: 'errand',
      entityId: updated.id,
      senderId: activeUser.id,
      senderName: activeUser.name,
      targetUserId: updated.creatorId || 'all'
    })

    ElMessage.success('Errand marked as completed! Great job.')
  } catch (err) {
    ElMessage.error(err.message || 'Could not complete errand')
  }
}
</script>
