<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
            <i class="fi fi-rr-bell"></i>
          </div>
          <span class="text-xs uppercase font-bold tracking-wider text-indigo-600">Notification Center</span>
        </div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Campus Alerts & Broadcasts</h1>
        <p class="text-xs sm:text-sm text-slate-500 mt-1">
          Stay informed on ride ready statuses, errand acceptances, study pod reminders, and student announcements.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-2 shrink-0">
        <button
          v-if="unreadCount > 0"
          type="button"
          class="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          @click="handleMarkAllAsRead"
        >
          <i class="fi fi-rr-check-double text-xs text-indigo-600"></i>
          <span>Mark All Read</span>
        </button>

        <button
          v-if="notifications.length > 0"
          type="button"
          class="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          @click="handleClearAll"
        >
          <i class="fi fi-rr-trash text-xs"></i>
          <span>Clear All</span>
        </button>

        <button
          id="open-broadcast-dialog-btn"
          type="button"
          class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          @click="isBroadcastDialogOpen = true"
        >
          <i class="fi fi-rr-megaphone text-xs"></i>
          <span>Post Broadcast Alert</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div class="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Alerts</span>
          <div class="text-lg sm:text-xl font-black text-slate-900">{{ notifications.length }}</div>
        </div>
        <div class="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-sm">
          <i class="fi fi-rr-inbox"></i>
        </div>
      </div>

      <div class="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-rose-500 uppercase tracking-wider">Unread</span>
          <div class="text-lg sm:text-xl font-black text-rose-600">{{ unreadCount }}</div>
        </div>
        <div class="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-sm">
          <i class="fi fi-rr-envelope-dot"></i>
        </div>
      </div>

      <div class="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Carpools Ready</span>
          <div class="text-lg sm:text-xl font-black text-emerald-700">{{ readyCarpoolCount }}</div>
        </div>
        <div class="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
          <i class="fi fi-rr-steering-wheel"></i>
        </div>
      </div>

      <div class="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <span class="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">Auto-Sync</span>
          <div class="text-xs font-bold text-slate-700 flex items-center gap-1.5 mt-1">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Polling</span>
          </div>
        </div>
        <div class="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm">
          <i class="fi fi-rr-refresh"></i>
        </div>
      </div>
    </div>

    <!-- Filters & Search Bar -->
    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
      <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <!-- Search Input -->
        <div class="relative flex-1">
          <i class="fi fi-rr-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search notifications by title, keywords or sender..."
            class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            @click="searchQuery = ''"
          >
            <i class="fi fi-rr-cross-small"></i>
          </button>
        </div>

        <!-- Sort dropdown -->
        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs font-semibold text-slate-500">Sort:</span>
          <select
            v-model="sortBy"
            class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="unread">Unread First</option>
          </select>
        </div>
      </div>

      <!-- Filter tabs -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :class="[
            'px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5',
            activeTab === tab.id
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          ]"
          @click="activeTab = tab.id"
        >
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.count !== undefined"
            :class="[
              'px-1.5 py-0.2 rounded-full text-[10px] font-black',
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            ]"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>
    </div>

    <!-- Notification Cards Feed -->
    <div class="space-y-3">
      <!-- Empty state -->
      <div
        v-if="filteredNotifications.length === 0"
        class="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs"
      >
        <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-3 text-2xl">
          <i class="fi fi-rr-bell-slash"></i>
        </div>
        <h3 class="text-base font-bold text-slate-800">No Notifications Found</h3>
        <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          {{ searchQuery ? `No alerts match your search "${searchQuery}".` : 'You have no alerts in this category.' }}
        </p>
        <div class="mt-5 flex justify-center gap-2">
          <button
            v-if="searchQuery || activeTab !== 'all'"
            type="button"
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            @click="resetFilters"
          >
            Reset Filters
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            @click="isBroadcastDialogOpen = true"
          >
            Post a Broadcast
          </button>
        </div>
      </div>

      <!-- Feed List -->
      <div
        v-for="item in filteredNotifications"
        :key="item.id"
        :class="[
          'bg-white rounded-2xl border transition-all p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between shadow-xs hover:border-slate-300',
          !item.read ? 'border-indigo-200 bg-indigo-50/20' : 'border-slate-200'
        ]"
      >
        <div class="flex items-start gap-3.5 flex-1 min-w-0">
          <!-- Icon Badge -->
          <div
            :class="[
              'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base shadow-2xs',
              getNotifStyle(item.type)
            ]"
          >
            <i :class="getNotifIcon(item.type)"></i>
          </div>

          <!-- Main Info -->
          <div class="flex-1 min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <h3 :class="['text-sm font-bold truncate', !item.read ? 'text-slate-900' : 'text-slate-700']">
                {{ item.title }}
              </h3>
              
              <!-- Badge Tags -->
              <span
                v-if="item.type === 'CARPOOL_READY'"
                class="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider"
              >
                Ready Alert
              </span>
              <span
                v-else-if="item.entityType === 'carpool'"
                class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800"
              >
                Carpool
              </span>
              <span
                v-else-if="item.entityType === 'errand'"
                class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800"
              >
                Errand
              </span>
              <span
                v-else-if="item.entityType === 'study'"
                class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-100 text-violet-800"
              >
                Study Pod
              </span>
              <span
                v-else
                class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700"
              >
                Announcement
              </span>

              <span
                v-if="!item.read"
                class="w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-indigo-100"
                title="Unread"
              ></span>
            </div>

            <!-- Message Body -->
            <p class="text-xs text-slate-600 leading-relaxed break-words">
              {{ item.message }}
            </p>

            <!-- Metadata Row -->
            <div class="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-0.5">
              <span>
                From: <strong class="text-slate-600 font-semibold">{{ item.senderName }}</strong>
              </span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <i class="fi fi-rr-clock text-[10px]"></i>
                <span>{{ formatFullTime(item.createdAt) }}</span>
                <span>({{ formatRelativeTime(item.createdAt) }})</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <button
            v-if="item.entityType && item.entityType !== 'general'"
            type="button"
            class="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
            @click="handleNavigateToEntity(item)"
          >
            <span>View Details</span>
            <i class="fi fi-rr-arrow-right text-[10px]"></i>
          </button>

          <button
            type="button"
            class="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 text-xs transition-colors cursor-pointer"
            :title="item.read ? 'Mark as unread' : 'Mark as read'"
            @click="handleToggleRead(item)"
          >
            <i :class="item.read ? 'fi fi-rr-envelope' : 'fi fi-rr-envelope-open'"></i>
          </button>

          <button
            type="button"
            class="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs transition-colors cursor-pointer"
            title="Delete notification"
            @click="handleDelete(item.id)"
          >
            <i class="fi fi-rr-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Post Broadcast Alert Dialog -->
    <el-dialog
      v-model="isBroadcastDialogOpen"
      title="Post Campus Broadcast Alert"
      width="90%"
      class="max-w-lg !rounded-2xl"
      destroy-on-close
    >
      <div class="space-y-4">
        <p class="text-xs text-slate-500">
          Broadcast an alert to notify other students across campus in real-time.
        </p>

        <!-- Alert Title -->
        <div class="space-y-1">
          <label class="block text-xs font-bold text-slate-700">Alert Title *</label>
          <el-input
            v-model="broadcastForm.title"
            placeholder="e.g. Carpool leaving in 10 mins / Study Room moved to Lib 3B"
            class="w-full"
          />
        </div>

        <!-- Category -->
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Category *</label>
            <el-select v-model="broadcastForm.category" class="w-full">
              <el-option label="Carpool / Ride Alert 🚗" value="carpool" />
              <el-option label="Errand Update 📦" value="errand" />
              <el-option label="Study Group 📚" value="study" />
              <el-option label="Campus Announcement 📢" value="general" />
            </el-select>
          </div>

          <div class="space-y-1">
            <label class="block text-xs font-bold text-slate-700">Audience</label>
            <el-select v-model="broadcastForm.audience" class="w-full">
              <el-option label="All Campus Students" value="all" />
              <el-option label="Ride Passengers Only" value="ride_members" />
              <el-option label="Study Group Classmates" value="study_members" />
            </el-select>
          </div>
        </div>

        <!-- Alert Message Body -->
        <div class="space-y-1">
          <label class="block text-xs font-bold text-slate-700">Message Details *</label>
          <el-input
            v-model="broadcastForm.message"
            type="textarea"
            :rows="3"
            placeholder="Provide clear details, location, and instructions for your peers..."
            class="w-full"
          />
        </div>

        <!-- Footer Actions -->
        <div class="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
            @click="isBroadcastDialogOpen = false"
          >
            Cancel
          </button>
          <button
            id="submit-broadcast-alert-btn"
            type="button"
            :disabled="isSubmittingBroadcast"
            class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            @click="handleSendBroadcast"
          >
            <i class="fi fi-rr-paper-plane text-xs"></i>
            <span>{{ isSubmittingBroadcast ? 'Posting Alert...' : 'Broadcast Alert Now' }}</span>
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import database from '../database'

const router = useRouter()
const notifications = ref([])
const activeTab = ref('all')
const searchQuery = ref('')
const sortBy = ref('newest')

// Broadcast dialog states
const isBroadcastDialogOpen = ref(false)
const isSubmittingBroadcast = ref(false)
const broadcastForm = ref({
  title: '',
  category: 'general',
  audience: 'all',
  message: ''
})

let pollTimer = null

function getActiveUser() {
  return {
    id: localStorage.getItem('student_user_id') || 'student-001',
    name: localStorage.getItem('student_user_name') || 'Manho',
    email: localStorage.getItem('student_user_email') || 'student@student.com'
  }
}

async function loadNotifications() {
  try {
    const user = getActiveUser()
    const list = await database.notifications.getAll(user)
    notifications.value = list
  } catch (err) {
    console.error('Failed to load notifications:', err)
  }
}

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length
})

const readyCarpoolCount = computed(() => {
  return notifications.value.filter((n) => n.type === 'CARPOOL_READY').length
})

const tabs = computed(() => {
  const all = notifications.value.length
  const unread = unreadCount.value
  const carpool = notifications.value.filter((n) => n.entityType === 'carpool' || n.type.includes('CARPOOL')).length
  const errands = notifications.value.filter((n) => n.entityType === 'errand' || n.type.includes('ERRAND')).length
  const study = notifications.value.filter((n) => n.entityType === 'study' || n.type.includes('STUDY')).length
  const broadcast = notifications.value.filter((n) => n.entityType === 'general' || n.type === 'GENERAL').length

  return [
    { id: 'all', label: 'All Alerts', count: all },
    { id: 'unread', label: 'Unread', count: unread },
    { id: 'carpool', label: 'Carpools 🚗', count: carpool },
    { id: 'errands', label: 'Errands 📦', count: errands },
    { id: 'study', label: 'Study Groups 📚', count: study },
    { id: 'general', label: 'Broadcasts 📢', count: broadcast }
  ]
})

const filteredNotifications = computed(() => {
  let list = [...notifications.value]

  // Tab Filtering
  if (activeTab.value === 'unread') {
    list = list.filter((n) => !n.read)
  } else if (activeTab.value === 'carpool') {
    list = list.filter((n) => n.entityType === 'carpool' || n.type.includes('CARPOOL'))
  } else if (activeTab.value === 'errands') {
    list = list.filter((n) => n.entityType === 'errand' || n.type.includes('ERRAND'))
  } else if (activeTab.value === 'study') {
    list = list.filter((n) => n.entityType === 'study' || n.type.includes('STUDY'))
  } else if (activeTab.value === 'general') {
    list = list.filter((n) => n.entityType === 'general' || n.type === 'GENERAL')
  }

  // Search filtering
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(
      (n) =>
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.message && n.message.toLowerCase().includes(q)) ||
        (n.senderName && n.senderName.toLowerCase().includes(q))
    )
  }

  // Sorting
  if (sortBy.value === 'oldest') {
    list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  } else if (sortBy.value === 'unread') {
    list.sort((a, b) => {
      if (!a.read && b.read) return -1
      if (a.read && !b.read) return 1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  } else {
    // Newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return list
})

function resetFilters() {
  activeTab.value = 'all'
  searchQuery.value = ''
  sortBy.value = 'newest'
}

async function handleToggleRead(item) {
  try {
    await database.notifications.toggleRead(item.id)
    item.read = !item.read
  } catch (err) {
    ElMessage.error('Failed to update notification state')
  }
}

async function handleDelete(id) {
  try {
    await database.notifications.delete(id)
    notifications.value = notifications.value.filter((n) => n.id !== id)
    ElMessage.info('Notification removed')
  } catch (err) {
    ElMessage.error('Failed to delete notification')
  }
}

async function handleMarkAllAsRead() {
  try {
    const user = getActiveUser()
    await database.notifications.markAllAsRead(user)
    notifications.value.forEach((n) => (n.read = true))
    ElMessage.success('All notifications marked as read')
  } catch (err) {
    ElMessage.error('Failed to mark all as read')
  }
}

async function handleClearAll() {
  try {
    await ElMessageBox.confirm('Are you sure you want to clear all alerts for your session?', 'Clear Notifications', {
      confirmButtonText: 'Clear All',
      cancelButtonText: 'Cancel',
      type: 'warning'
    })

    const user = getActiveUser()
    await database.notifications.clearAll(user)
    notifications.value = []
    ElMessage.info('All notifications cleared')
  } catch (e) {
    // user cancelled
  }
}

async function handleNavigateToEntity(item) {
  if (!item.read) {
    await database.notifications.markAsRead(item.id)
    item.read = true
  }

  if (item.entityType === 'carpool') {
    router.push('/carpool')
  } else if (item.entityType === 'errand') {
    router.push('/errands')
  } else if (item.entityType === 'study') {
    router.push('/study-groups')
  }
}

async function handleSendBroadcast() {
  if (!broadcastForm.value.title.trim()) {
    ElMessage.warning('Please enter an alert title')
    return
  }
  if (!broadcastForm.value.message.trim()) {
    ElMessage.warning('Please enter the alert message details')
    return
  }

  try {
    isSubmittingBroadcast.value = true
    const activeUser = getActiveUser()

    await database.notifications.send({
      type:
        broadcastForm.value.category === 'carpool'
          ? 'CARPOOL_UPDATE'
          : broadcastForm.value.category === 'study'
          ? 'STUDY_REMINDER'
          : broadcastForm.value.category === 'errand'
          ? 'ERRAND_ACCEPTED'
          : 'GENERAL',
      title: broadcastForm.value.title.trim(),
      message: broadcastForm.value.message.trim(),
      entityType: broadcastForm.value.category,
      entityId: null,
      senderId: activeUser.id,
      senderName: activeUser.name,
      targetUserId: broadcastForm.value.audience === 'all' ? 'all' : 'group_members',
      targetUserName: broadcastForm.value.audience === 'all' ? 'All Campus Students' : 'Group Members',
      isBroadcast: true
    })

    isBroadcastDialogOpen.value = false
    broadcastForm.value = {
      title: '',
      category: 'general',
      audience: 'all',
      message: ''
    }

    await loadNotifications()
    ElMessage.success('Broadcast alert posted successfully!')
  } catch (err) {
    ElMessage.error(err.message || 'Failed to post alert')
  } finally {
    isSubmittingBroadcast.value = false
  }
}

function getNotifIcon(type) {
  switch (type) {
    case 'CARPOOL_READY':
      return 'fi fi-rr-steering-wheel'
    case 'CARPOOL_UPDATE':
      return 'fi fi-rr-car'
    case 'ERRAND_ACCEPTED':
    case 'ERRAND_COMPLETED':
      return 'fi fi-rr-box-alt'
    case 'STUDY_REMINDER':
      return 'fi fi-rr-book-alt'
    default:
      return 'fi fi-rr-megaphone'
  }
}

function getNotifStyle(type) {
  switch (type) {
    case 'CARPOOL_READY':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    case 'CARPOOL_UPDATE':
      return 'bg-indigo-100 text-indigo-700 border border-indigo-200'
    case 'ERRAND_ACCEPTED':
    case 'ERRAND_COMPLETED':
      return 'bg-amber-100 text-amber-700 border border-amber-200'
    case 'STUDY_REMINDER':
      return 'bg-violet-100 text-violet-700 border border-violet-200'
    default:
      return 'bg-blue-100 text-blue-700 border border-blue-200'
  }
}

function formatRelativeTime(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays}d ago`
}

function formatFullTime(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  loadNotifications()
  pollTimer = setInterval(loadNotifications, 7000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>
