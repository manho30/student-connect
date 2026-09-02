<template>
  <div class="relative">
    <!-- Bell Button Trigger -->
    <button
      id="notification-center-trigger-btn"
      type="button"
      class="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer outline-none border-none bg-transparent flex items-center justify-center"
      :title="`Notifications (${unreadCount} unread)`"
      @click="toggleNotificationCenter"
    >
      <i class="fi fi-rr-bell text-lg"></i>
      
      <!-- Unread Indicator Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Desktop Dropdown Popover -->
    <div
      v-if="isOpen && !isMobile"
      v-click-outside="closeNotificationCenter"
      class="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <!-- Header -->
      <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
            <i class="fi fi-rr-bell"></i>
          </div>
          <div>
            <h3 class="text-sm font-bold text-slate-800">Notification Center</h3>
            <p class="text-[11px] text-slate-400">
              {{ unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1.5">
          <button
            v-if="unreadCount > 0"
            type="button"
            class="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline px-2 py-1 rounded-md cursor-pointer"
            @click="handleMarkAllRead"
          >
            Mark all read
          </button>
          <button
            type="button"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            @click="closeNotificationCenter"
          >
            <i class="fi fi-rr-cross-small text-base"></i>
          </button>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="flex items-center gap-1 px-3 py-2 border-b border-slate-100 bg-white text-xs overflow-x-auto no-scrollbar">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          type="button"
          :class="[
            'px-2.5 py-1 rounded-lg font-semibold text-xs whitespace-nowrap transition-colors cursor-pointer',
            activeTab === tab.id
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
          <span
            v-if="tab.id === 'unread' && unreadCount > 0"
            class="ml-1 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-bold"
          >
            {{ unreadCount }}
          </span>
        </button>
      </div>

      <!-- Notification List -->
      <div class="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
        <div v-if="filteredNotifications.length === 0" class="py-12 px-4 text-center">
          <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2 text-lg">
            <i class="fi fi-rr-bell-slash"></i>
          </div>
          <p class="text-xs font-semibold text-slate-700">No notifications here</p>
          <p class="text-[11px] text-slate-400 mt-0.5">You're all caught up with student updates.</p>
        </div>

        <div
          v-for="item in filteredNotifications"
          :key="item.id"
          :class="[
            'p-3.5 hover:bg-slate-50 transition-colors flex gap-3 items-start cursor-pointer relative group',
            !item.read ? 'bg-indigo-50/30' : ''
          ]"
          @click="handleNotificationClick(item)"
        >
          <!-- Icon avatar -->
          <div
            :class="[
              'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-sm shadow-2xs',
              getNotifIconStyle(item.type)
            ]"
          >
            <i :class="getNotifIcon(item.type)"></i>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0 pr-4">
            <div class="flex items-center justify-between gap-1 mb-0.5">
              <h4 :class="['text-xs truncate font-bold', !item.read ? 'text-slate-900' : 'text-slate-700']">
                {{ item.title }}
              </h4>
              <span class="text-[10px] text-slate-400 shrink-0 whitespace-nowrap">
                {{ formatTime(item.createdAt) }}
              </span>
            </div>
            <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {{ item.message }}
            </p>
            <div class="flex items-center gap-2 mt-1.5">
              <span class="text-[10px] font-medium text-slate-400">
                From <strong class="text-slate-600">{{ item.senderName }}</strong>
              </span>
              <span
                v-if="item.type === 'CARPOOL_READY'"
                class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800"
              >
                Ready Alert
              </span>
            </div>
          </div>

          <!-- Unread Dot / Mark read on hover -->
          <div class="shrink-0 flex items-center self-center">
            <span
              v-if="!item.read"
              class="w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-indigo-100"
              title="Unread"
            ></span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs">
        <button
          type="button"
          class="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1.5 cursor-pointer hover:underline"
          @click="goToFullPage"
        >
          <span>Open Full Notification Page (/notify)</span>
          <i class="fi fi-rr-arrow-right text-[10px]"></i>
        </button>

        <button
          v-if="notifications.length > 0"
          type="button"
          class="text-[11px] text-slate-400 hover:text-rose-600 font-semibold cursor-pointer"
          @click="handleClearAll"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Mobile Drawer for smaller screens -->
    <el-drawer
      v-if="isMobile"
      v-model="isOpen"
      title="Notification Center"
      direction="btt"
      size="82%"
      class="!rounded-t-3xl"
      :show-close="true"
    >
      <template #header>
        <div class="flex items-center justify-between w-full pr-2">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              <i class="fi fi-rr-bell"></i>
            </div>
            <div>
              <h3 class="text-base font-bold text-slate-800">Notification Center</h3>
              <p class="text-xs text-slate-400">{{ unreadCount }} unread alert{{ unreadCount === 1 ? '' : 's' }}</p>
            </div>
          </div>
          <button
            v-if="unreadCount > 0"
            type="button"
            class="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
            @click="handleMarkAllRead"
          >
            Mark all read
          </button>
        </div>
      </template>

      <!-- Mobile Tabs -->
      <div class="flex items-center gap-1.5 pb-3 border-b border-slate-100 overflow-x-auto no-scrollbar mb-2">
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          type="button"
          :class="[
            'px-3 py-1.5 rounded-xl font-semibold text-xs whitespace-nowrap transition-colors cursor-pointer',
            activeTab === tab.id
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Mobile List -->
      <div class="divide-y divide-slate-100 overflow-y-auto max-h-[50vh]">
        <div v-if="filteredNotifications.length === 0" class="py-10 text-center">
          <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2 text-lg">
            <i class="fi fi-rr-bell-slash"></i>
          </div>
          <p class="text-xs font-semibold text-slate-700">No notifications</p>
          <p class="text-[11px] text-slate-400 mt-0.5">You're all caught up!</p>
        </div>

        <div
          v-for="item in filteredNotifications"
          :key="item.id"
          :class="[
            'py-3 px-2 flex gap-3 items-start cursor-pointer rounded-xl transition-colors',
            !item.read ? 'bg-indigo-50/40' : ''
          ]"
          @click="handleNotificationClick(item)"
        >
          <div
            :class="[
              'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base shadow-2xs',
              getNotifIconStyle(item.type)
            ]"
          >
            <i :class="getNotifIcon(item.type)"></i>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1 mb-0.5">
              <h4 :class="['text-xs truncate font-bold', !item.read ? 'text-slate-900' : 'text-slate-700']">
                {{ item.title }}
              </h4>
              <span class="text-[10px] text-slate-400 shrink-0">
                {{ formatTime(item.createdAt) }}
              </span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              {{ item.message }}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] text-slate-400">By {{ item.senderName }}</span>
              <span
                v-if="item.type === 'CARPOOL_READY'"
                class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800"
              >
                Ready Alert
              </span>
            </div>
          </div>

          <div v-if="!item.read" class="w-2 h-2 rounded-full bg-indigo-600 shrink-0 self-center"></div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between pt-2 gap-2">
          <button
            type="button"
            class="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            @click="goToFullPage"
          >
            <span>Full Page (/notify)</span>
            <i class="fi fi-rr-arrow-right text-[10px]"></i>
          </button>
          
          <div class="flex items-center gap-2">
            <button
              v-if="notifications.length > 0"
              type="button"
              class="text-xs text-rose-500 font-semibold cursor-pointer px-2 py-1"
              @click="handleClearAll"
            >
              Clear
            </button>
            <button
              type="button"
              class="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
              @click="closeNotificationCenter"
            >
              Close
            </button>
          </div>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import database from '../../database'

const router = useRouter()
const isOpen = ref(false)
const isMobile = ref(false)
const activeTab = ref('all')
const notifications = ref([])

const filterTabs = [
  { id: 'all', label: 'All Alerts' },
  { id: 'unread', label: 'Unread' },
  { id: 'rides', label: 'Carpools 🚗' },
  { id: 'errands', label: 'Errands 📦' },
  { id: 'study', label: 'Study 📚' }
]

function checkMobile() {
  if (typeof window !== 'undefined') {
    isMobile.value = window.innerWidth < 640
  }
}

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length
})

const filteredNotifications = computed(() => {
  let list = notifications.value
  if (activeTab.value === 'unread') {
    return list.filter((n) => !n.read)
  }
  if (activeTab.value === 'rides') {
    return list.filter((n) => n.entityType === 'carpool' || n.type.includes('CARPOOL'))
  }
  if (activeTab.value === 'errands') {
    return list.filter((n) => n.entityType === 'errand' || n.type.includes('ERRAND'))
  }
  if (activeTab.value === 'study') {
    return list.filter((n) => n.entityType === 'study' || n.type.includes('STUDY'))
  }
  return list
})

async function fetchNotifications() {
  try {
    const activeUser = {
      id: localStorage.getItem('student_user_id') || 'student-001',
      name: localStorage.getItem('student_user_name') || 'Manho',
      email: localStorage.getItem('student_user_email') || 'student@student.com'
    }
    const data = await database.notifications.getAll(activeUser)
    notifications.value = data
  } catch (e) {
    console.error('Failed to load notifications:', e)
  }
}

function toggleNotificationCenter() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    fetchNotifications()
  }
}

function closeNotificationCenter() {
  isOpen.value = false
}

function goToFullPage() {
  isOpen.value = false
  router.push('/notify')
}

async function handleNotificationClick(item) {
  try {
    if (!item.read) {
      await database.notifications.markAsRead(item.id)
      item.read = true
    }
    isOpen.value = false

    // Route navigation depending on entity type
    if (item.entityType === 'carpool') {
      router.push('/carpool')
    } else if (item.entityType === 'errand') {
      router.push('/errands')
    } else if (item.entityType === 'study') {
      router.push('/study-groups')
    }
  } catch (e) {
    console.error(e)
  }
}

async function handleMarkAllRead() {
  try {
    const activeUser = {
      id: localStorage.getItem('student_user_id') || 'student-001',
      name: localStorage.getItem('student_user_name') || 'Manho'
    }
    await database.notifications.markAllAsRead(activeUser)
    notifications.value.forEach((n) => (n.read = true))
    ElMessage.success('All notifications marked as read')
  } catch (e) {
    ElMessage.error('Failed to mark notifications as read')
  }
}

async function handleClearAll() {
  try {
    const activeUser = {
      id: localStorage.getItem('student_user_id') || 'student-001',
      name: localStorage.getItem('student_user_name') || 'Manho'
    }
    await database.notifications.clearAll(activeUser)
    notifications.value = []
    ElMessage.info('Notifications cleared')
  } catch (e) {
    ElMessage.error('Failed to clear notifications')
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
      return 'fi fi-rr-bell'
  }
}

function getNotifIconStyle(type) {
  switch (type) {
    case 'CARPOOL_READY':
      return 'bg-emerald-50 text-emerald-600 border border-emerald-200'
    case 'CARPOOL_UPDATE':
      return 'bg-indigo-50 text-indigo-600 border border-indigo-200'
    case 'ERRAND_ACCEPTED':
    case 'ERRAND_COMPLETED':
      return 'bg-amber-50 text-amber-600 border border-amber-200'
    case 'STUDY_REMINDER':
      return 'bg-violet-50 text-violet-600 border border-violet-200'
    default:
      return 'bg-slate-50 text-slate-600 border border-slate-200'
  }
}

function formatTime(isoString) {
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

// Click outside directive helper
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event) => {
      const trigger = document.getElementById('notification-center-trigger-btn')
      if (
        !(el === event.target || el.contains(event.target)) &&
        !(trigger && (trigger === event.target || trigger.contains(event.target)))
      ) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler)
  }
}

let pollInterval = null

onMounted(() => {
  checkMobile()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', checkMobile)
  }
  fetchNotifications()
  // Poll every 8 seconds for new incoming notifications
  pollInterval = setInterval(fetchNotifications, 8000)
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkMobile)
  }
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})

defineExpose({
  fetchNotifications
})
</script>
