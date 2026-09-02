<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold text-slate-900 tracking-tight">Find students going your way</h1>
        <p class="text-slate-500 text-sm sm:text-base">Share rides, save costs, and meet new friends on campus.</p>
      </div>
      <button
        id="open-create-carpool-btn"
        class="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap"
        @click="openCreateDialog"
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
      @edit="handleOpenEdit"
      @notify-ready="handleOpenNotifyReady"
      @open-create="openCreateDialog"
    />

    <!-- Broadcast Status / Notify All Members Dialog -->
    <el-dialog
      v-model="isNotifyDialogOpen"
      title="Notify Passengers — Ride Status"
      width="90%"
      class="max-w-lg !rounded-2xl"
      destroy-on-close
    >
      <div v-if="notifyingCarpool" class="space-y-4">
        <!-- Ride summary card -->
        <div class="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-[11px] uppercase font-bold text-indigo-700 tracking-wider">Active Trip</span>
            <span class="text-xs font-semibold text-slate-700">{{ notifyingCarpool.time }}</span>
          </div>
          <div class="font-bold text-slate-800 text-sm">
            {{ notifyingCarpool.from }} ➔ {{ notifyingCarpool.to }}
          </div>
          <div class="text-xs text-slate-500 flex items-center gap-2">
            <span>{{ notifyingCarpool.joined || (notifyingCarpool.participants && notifyingCarpool.participants.length) || 1 }} passengers joined</span>
          </div>
        </div>

        <!-- Preset status options -->
        <div class="space-y-2">
          <label class="block text-xs font-bold text-slate-700">Choose quick status update</label>
          <div class="grid grid-cols-1 gap-2">
            <button
              v-for="preset in statusPresets"
              :key="preset.id"
              type="button"
              :class="[
                'p-3 text-left rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center justify-between',
                selectedPresetId === preset.id
                  ? 'border-indigo-500 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-200'
                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
              ]"
              @click="selectPreset(preset)"
            >
              <div class="flex items-center gap-2.5">
                <span class="text-base">{{ preset.icon }}</span>
                <div>
                  <div class="font-bold text-slate-800">{{ preset.title }}</div>
                  <div class="text-[11px] text-slate-500">{{ preset.message }}</div>
                </div>
              </div>
              <i v-if="selectedPresetId === preset.id" class="fi fi-rr-check text-indigo-600 font-bold ml-2"></i>
            </button>
          </div>
        </div>

        <!-- Custom Message -->
        <div class="space-y-1">
          <label class="block text-xs font-bold text-slate-700">Custom message (optional)</label>
          <el-input
            v-model="customNotifyMessage"
            type="textarea"
            :rows="2"
            placeholder="e.g. Look for silver Honda Civic at Gate 2."
            class="w-full text-xs"
          />
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            @click="isNotifyDialogOpen = false"
          >
            Cancel
          </button>
          <button
            id="confirm-notify-all-btn"
            type="button"
            :disabled="isSendingNotification"
            class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            @click="handleSendBroadcastAlert"
          >
            <i class="fi fi-rr-paper-plane text-xs"></i>
            <span>{{ isSendingNotification ? 'Sending Alert...' : 'Send Alert to All Members' }}</span>
          </button>
        </div>
      </div>
    </el-dialog>

    <!-- Create / Edit Carpool Dialog -->
    <el-dialog
      v-model="isDialogOpen"
      :title="editingCarpool ? 'Edit Carpool Ride' : 'Create a New Student Carpool'"
      width="90%"
      class="max-w-lg !rounded-2xl"
      destroy-on-close
    >
      <div class="mb-4 text-xs text-slate-500">
        {{ editingCarpool ? 'Update your ride details below.' : 'Share your upcoming trip details with fellow students.' }}
      </div>
      <CarpoolForm
        :initial-data="editingCarpool"
        :is-edit="!!editingCarpool"
        @submit="handleSubmitForm"
        @cancel="isDialogOpen = false"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import database from '../database'
import CarpoolList from '../components/carpool/CarpoolList.vue'
import CarpoolForm from '../components/carpool/CarpoolForm.vue'

const currentUser = ref(localStorage.getItem('student_user_name') || 'Manho')
const carpools = ref([])
const searchQuery = ref('')
const activeFilter = ref('all')
const isDialogOpen = ref(false)
const editingCarpool = ref(null)

// Broadcast Notification states
const isNotifyDialogOpen = ref(false)
const notifyingCarpool = ref(null)
const selectedPresetId = ref('ready')
const customNotifyMessage = ref('')
const isSendingNotification = ref(false)

const statusPresets = [
  {
    id: 'ready',
    icon: '🚗',
    title: 'Ride is Ready to Depart',
    message: 'Vehicle is ready and waiting at the pickup location. Please head over!'
  },
  {
    id: 'departing_5m',
    icon: '⏱️',
    title: 'Departing in 5 Minutes',
    message: 'We are leaving in 5 minutes! Please be at the pickup point promptly.'
  },
  {
    id: 'arrived',
    icon: '📍',
    title: 'Driver Arrived at Spot',
    message: 'I have reached the pickup point. Look out for the vehicle.'
  },
  {
    id: 'slight_delay',
    icon: '🚦',
    title: 'Slight Delay (10 mins)',
    message: 'Traffic delay of approx 10 minutes. Will notify as soon as I arrive.'
  }
]

function selectPreset(preset) {
  selectedPresetId.value = preset.id
}

function handleOpenNotifyReady(carpool) {
  notifyingCarpool.value = carpool
  selectedPresetId.value = 'ready'
  customNotifyMessage.value = ''
  isNotifyDialogOpen.value = true
}

async function handleSendBroadcastAlert() {
  if (!notifyingCarpool.value) return

  const preset = statusPresets.find((p) => p.id === selectedPresetId.value) || statusPresets[0]
  const activeUser = getActiveUserObject()

  const finalTitle = preset.title
  const finalMessage = customNotifyMessage.value.trim()
    ? `${preset.message} (Note: ${customNotifyMessage.value.trim()})`
    : preset.message

  try {
    isSendingNotification.value = true
    const result = await database.notifications.notifyRideMembers(
      notifyingCarpool.value.id,
      {
        title: `${finalTitle} 🚗`,
        message: finalMessage
      },
      activeUser
    )

    isNotifyDialogOpen.value = false
    ElMessage({
      message: `Alert broadcasted! Notified ${result.recipientsCount || 'all'} joined passenger${result.recipientsCount === 1 ? '' : 's'}.`,
      type: 'success',
      duration: 3500
    })
  } catch (err) {
    ElMessage.error(err.message || 'Failed to broadcast notification')
  } finally {
    isSendingNotification.value = false
  }
}

const filterTabs = [
  { id: 'all', label: 'All Carpools' },
  { id: 'available', label: 'Available Seats' },
  { id: 'joined', label: 'My Carpools' }
]

function getActiveUserObject() {
  return {
    id: localStorage.getItem('student_user_id') || 'student-001',
    name: currentUser.value || 'Manho',
    email: localStorage.getItem('student_user_email') || 'student@student.com'
  }
}

async function loadCarpools() {
  currentUser.value = localStorage.getItem('student_user_name') || 'Manho'
  carpools.value = await database.carpool.getAll()
}

onMounted(() => {
  loadCarpools()
})

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

function openCreateDialog() {
  editingCarpool.value = null
  isDialogOpen.value = true
}

function handleOpenEdit(carpool) {
  editingCarpool.value = { ...carpool }
  isDialogOpen.value = true
}

async function handleSubmitForm(formData) {
  try {
    const activeUser = getActiveUserObject()
    if (editingCarpool.value) {
      await database.carpool.update(editingCarpool.value.id, formData, activeUser)
      ElMessage.success('Ride details updated successfully!')
    } else {
      await database.carpool.create(formData, activeUser)
      ElMessage.success('Carpool created successfully! Your ride is now live.')
    }
    await loadCarpools()
    isDialogOpen.value = false
    editingCarpool.value = null
  } catch (err) {
    ElMessage.error(err.message || 'Failed to save carpool')
  }
}

async function handleJoin(id) {
  try {
    const activeUser = getActiveUserObject()
    await database.carpool.join(id, activeUser)
    await loadCarpools()
    ElMessage.success('You joined the carpool!')
  } catch (err) {
    ElMessage.error(err.message || 'Could not join carpool')
  }
}

async function handleLeave(id) {
  try {
    const activeUser = getActiveUserObject()
    await database.carpool.leave(id, activeUser)
    await loadCarpools()
    ElMessage.info('You left the carpool.')
  } catch (err) {
    ElMessage.error(err.message || 'Could not leave carpool')
  }
}
</script>
