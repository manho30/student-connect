<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans pb-20 md:pb-0">
    <!-- Top Navigation Bar (Hidden on Login Page) -->
    <nav
      v-if="isNotLoginPage"
      class="bg-white border-b border-slate-200 px-4 sm:px-8 h-16 flex items-center justify-between shadow-xs sticky top-0 z-30 shrink-0"
    >
      <div class="flex items-center gap-6 lg:gap-8">
        <!-- Brand Logo -->
        <router-link to="/carpool" class="flex items-center gap-2.5 group">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <span class="font-bold text-xl tracking-tight text-indigo-950">Student Connect</span>
        </router-link>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center gap-1">
          <router-link
            to="/carpool"
            class="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            active-class="!bg-indigo-50 !text-indigo-700 !font-semibold"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
            <span>Carpool</span>
          </router-link>

          <router-link
            to="/errands"
            class="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            active-class="!bg-indigo-50 !text-indigo-700 !font-semibold"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            <span>Errands</span>
          </router-link>

          <router-link
            to="/study-groups"
            class="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            active-class="!bg-indigo-50 !text-indigo-700 !font-semibold"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <span>Study Groups</span>
          </router-link>

          <router-link
            to="/notify"
            class="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-800 relative"
            active-class="!bg-indigo-50 !text-indigo-700 !font-semibold"
          >
            <i class="fi fi-rr-bell text-xs"></i>
            <span>Notifications</span>
            <span
              v-if="unreadNotifCount > 0"
              class="ml-0.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[10px] font-bold"
            >
              {{ unreadNotifCount > 99 ? '99+' : unreadNotifCount }}
            </span>
          </router-link>
        </div>
      </div>

      <!-- Current Student Profile, Notification Center & Dropdown -->
      <div class="flex items-center gap-2 sm:gap-3.5">
        <!-- Notification Center Component -->
        <NotificationCenter ref="notifCenterRef" />

        <el-dropdown trigger="click" @command="handleUserMenuCommand">
          <button class="flex items-center gap-2 sm:gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer outline-none border-none bg-transparent">
            <div class="text-right hidden sm:block">
              <div class="text-sm font-semibold text-slate-900 leading-tight">{{ currentStudent.name }}</div>
              <div class="text-[11px] text-slate-500">{{ currentStudent.email }}</div>
            </div>
            <div class="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200 overflow-hidden shadow-xs flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
              {{ currentStudent.initial }}
            </div>
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <template #dropdown>
            <el-dropdown-menu class="!p-1.5 !rounded-xl min-w-[180px]">
              <div class="px-3 py-2 border-b border-slate-100 mb-1">
                <p class="text-xs font-bold text-slate-800">{{ currentStudent.name }}</p>
                <p class="text-[11px] text-slate-500 truncate">{{ currentStudent.email }}</p>
                <p v-if="currentStudent.matric" class="text-[10px] text-indigo-600 font-mono mt-0.5">{{ currentStudent.matric }}</p>
              </div>
              <el-dropdown-item command="profile" class="!rounded-lg text-xs font-semibold py-2">
                <i class="fi fi-rr-user mr-2 text-indigo-600"></i>
                <span>Active Profile</span>
              </el-dropdown-item>
              <el-dropdown-item command="notifications" class="!rounded-lg text-xs font-semibold py-2">
                <i class="fi fi-rr-bell mr-2 text-indigo-600"></i>
                <span>Notification Center</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided class="!rounded-lg text-xs font-semibold text-rose-600 hover:!bg-rose-50 py-2">
                <i class="fi fi-rr-sign-out-alt mr-2 text-rose-500"></i>
                <span>Logout</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main
      :class="[
        'flex-1 w-full mx-auto flex flex-col',
        isNotLoginPage ? 'max-w-7xl p-4 sm:p-8 gap-6' : 'p-0 justify-center'
      ]"
    >
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Professional Footer (Hidden on Login Page) -->
    <footer
      v-if="isNotLoginPage"
      class="bg-white border-t border-slate-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 text-xs font-medium text-slate-500"
    >
      <div class="flex items-center gap-4 text-xs font-medium text-slate-500">
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
          <span>12 Active Rides</span>
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
          <span>8 Errands Nearby</span>
        </span>
        <span class="hidden sm:flex items-center gap-1.5">
          <span class="w-2 h-2 bg-amber-500 rounded-full"></span>
          <span>6 Active Study Groups</span>
        </span>
      </div>
      <div class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
        Innovation Prototype v1.0.4
      </div>
    </footer>

    <!-- Mobile Bottom Navigation Bar (Hidden on Login Page) -->
    <nav
      v-if="isNotLoginPage"
      class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-2"
    >
      <div class="grid grid-cols-4 gap-1 max-w-md mx-auto">
        <router-link
          to="/carpool"
          class="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-semibold text-slate-500 transition-colors"
          active-class="!text-indigo-700 !bg-indigo-50"
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
          </svg>
          <span>Carpool</span>
        </router-link>

        <router-link
          to="/errands"
          class="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-semibold text-slate-500 transition-colors"
          active-class="!text-indigo-700 !bg-indigo-50"
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <span>Errands</span>
        </router-link>

        <router-link
          to="/study-groups"
          class="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-semibold text-slate-500 transition-colors"
          active-class="!text-indigo-700 !bg-indigo-50"
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <span>Study</span>
        </router-link>

        <router-link
          to="/notify"
          class="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-semibold text-slate-500 transition-colors relative"
          active-class="!text-indigo-700 !bg-indigo-50"
        >
          <div class="relative">
            <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <span
              v-if="unreadNotifCount > 0"
              class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white"
            ></span>
          </div>
          <span>Alerts</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import NotificationCenter from './components/common/NotificationCenter.vue'
import database from './database'

const route = useRoute()
const router = useRouter()
const notifCenterRef = ref(null)
const unreadNotifCount = ref(0)
let pollTimer = null

const isNotLoginPage = computed(() => {
  return route.path !== '/login'
})

const currentStudent = computed(() => {
  // Read dynamically from localStorage whenever route or session changes
  const name = localStorage.getItem('student_user_name') || 'Student'
  const email = localStorage.getItem('student_user_email') || 'student@student.com'
  const matric = localStorage.getItem('student_user_matric') || ''
  const initial = name ? name.trim().charAt(0).toUpperCase() : 'S'

  return {
    name,
    email,
    matric,
    initial
  }
})

async function updateUnreadCount() {
  if (!localStorage.getItem('student_logged_in')) {
    unreadNotifCount.value = 0
    return
  }
  try {
    const user = {
      id: localStorage.getItem('student_user_id') || 'student-001',
      name: localStorage.getItem('student_user_name') || 'Manho'
    }
    const list = await database.notifications.getAll(user)
    unreadNotifCount.value = list.filter((n) => !n.read).length
  } catch (e) {
    // ignore
  }
}

watch(
  () => route.path,
  () => {
    updateUnreadCount()
  }
)

onMounted(() => {
  updateUnreadCount()
  pollTimer = setInterval(updateUnreadCount, 6000)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
})

function handleUserMenuCommand(command) {
  if (command === 'logout') {
    localStorage.removeItem('student_logged_in')
    localStorage.removeItem('student_user_id')
    localStorage.removeItem('student_user_name')
    localStorage.removeItem('student_user_email')
    localStorage.removeItem('student_user_matric')
    ElMessage({
      message: 'Logged out successfully.',
      type: 'info',
      duration: 1500
    })
    router.push('/login')
  } else if (command === 'notifications') {
    router.push('/notify')
  } else if (command === 'profile') {
    ElMessage({
      message: `Signed in as ${currentStudent.value.name} (${currentStudent.value.email})`,
      type: 'success',
      duration: 2500
    })
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
