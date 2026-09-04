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
            to="/study"
            class="px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            active-class="!bg-indigo-50 !text-indigo-700 !font-semibold"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
            <span>Study Groups</span>
          </router-link>
        </div>
      </div>

      <!-- Current User Profile & Dropdown -->
      <div class="flex items-center gap-2 sm:gap-3.5">
        <el-dropdown trigger="click" @command="handleUserMenuCommand">
          <button class="flex items-center gap-2 sm:gap-2.5 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer outline-none border-none bg-transparent">
            <div class="text-right hidden sm:block">
              <div class="text-sm font-semibold text-slate-900 leading-tight">{{ currentUser.name }}</div>
              <div class="text-[11px] text-slate-500">{{ currentUser.email }}</div>
            </div>
              <div class="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-100 text-indigo-700 rounded-full border border-indigo-200 overflow-hidden shadow-xs flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
              {{ currentUser.initial }}
            </div>
            <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <template #dropdown>
            <el-dropdown-menu class="!p-1.5 !rounded-xl min-w-[180px]">
              <div class="px-3 py-2 border-b border-slate-100 mb-1">
                <p class="text-xs font-bold text-slate-800">{{ currentUser.name }}</p>
                <p class="text-[11px] text-slate-500 truncate">{{ currentUser.email }}</p>
              </div>
              <el-dropdown-item command="profile" class="!rounded-lg text-xs font-semibold py-2">
                <i class="fi fi-rr-user mr-2 text-indigo-600"></i>
                <span>Active Profile</span>
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

    <!-- Footer (Hidden on Login Page) -->
    <footer
      v-if="isNotLoginPage"
      class="bg-white border-t border-slate-200 px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 text-xs font-medium text-slate-500"
    >
      <div class="flex items-center gap-4 text-xs font-medium text-slate-500">
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 bg-indigo-500 rounded-full"></span>
          <span>Student Carpools</span>
        </span>
        <span class="flex items-center gap-1.5">
          <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
          <span>Campus Errands</span>
        </span>
        <span class="hidden sm:flex items-center gap-1.5">
          <span class="w-2 h-2 bg-amber-500 rounded-full"></span>
          <span>Study Groups</span>
        </span>
      </div>
      <div class="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
        Student Connect Frontend
      </div>
    </footer>

    <!-- Mobile Bottom Navigation Bar (Hidden on Login Page) -->
    <nav
      v-if="isNotLoginPage"
      class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-2"
    >
      <div class="grid grid-cols-3 gap-1 max-w-md mx-auto">
        <router-link
          to="/carpool"
          class="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-[11px] font-semibold text-slate-500 transition-colors"
          active-class="!text-indigo-700 !bg-indigo-50"
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
          </svg>
          <span>Carpool</span>
        </router-link>

        <router-link
          to="/errands"
          class="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-[11px] font-semibold text-slate-500 transition-colors"
          active-class="!text-indigo-700 !bg-indigo-50"
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
          </svg>
          <span>Errands</span>
        </router-link>

        <router-link
          to="/study"
          class="flex flex-col items-center justify-center py-1.5 px-2 rounded-xl text-[11px] font-semibold text-slate-500 transition-colors"
          active-class="!text-indigo-700 !bg-indigo-50"
        >
          <svg class="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <span>Study Groups</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getIdToken, logout, user } from '@/services/auth'

const route = useRoute()
const router = useRouter()
const debugAuthEnabled = import.meta.env.VITE_DEBUG_AUTH_TOKEN === 'true'
const debugToken = ref('')

/**
 * Loads the current Firebase ID token for local debugging only.
 *
 * The token is kept in Vue memory and is never persisted.
 *
 * @returns {Promise<void>} Resolves after the debug token state is refreshed.
 */
async function refreshDebugToken() {
  if (!debugAuthEnabled || !user.value) {
    debugToken.value = ''
    return
  }

  try {
    debugToken.value = await getIdToken()
  } catch {
    debugToken.value = ''
  }
}

watch(user, refreshDebugToken, { immediate: true })

/**
 * Determines whether the current view is not the authentication page.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isNotLoginPage = computed(() => {
  return route.path !== '/login'
})

/**
 * Computes current active user profile details from Firebase Authentication.
 *
 * @type {import('vue').ComputedRef<{name: string, email: string, initial: string}>}
 */
const currentUser = computed(() => {
  const name = user.value?.displayName || user.value?.email || 'Unknown User'
  const email = user.value?.email || ''
  const initial = name ? name.trim().charAt(0).toUpperCase() : 'S'

  return {
    name,
    email,
    initial
  }
})

/**
 * Handles dropdown user menu selections such as profile inspection or logging out.
 *
 * @param {string} command - Selected action command ('profile' | 'logout').
 * @returns {Promise<void>}
 */
async function handleUserMenuCommand(command) {
  if (command === 'logout') {
    await logout()
    ElMessage({
      message: 'Logged out successfully.',
      type: 'info',
      duration: 1500
    })
    await router.push('/login')
  } else if (command === 'profile') {
    ElMessage({
      message: `Signed in as ${currentUser.value.name} (${currentUser.value.email})`,
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
