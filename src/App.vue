<template>
  <div
      class="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans pb-20 md:pb-0"
  >
    <!-- =========================================================
         DESKTOP / MOBILE TOP BAR
         ========================================================= -->
    <nav
        v-if="isNotLoginPage"
        class="bg-white border-b border-slate-200 h-16 sticky top-0 z-30 shadow-xs shrink-0"
    >
      <div
          class="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between"
      >
        <!-- Brand -->
        <router-link
            to="/carpool"
            class="flex items-center gap-2.5 group shrink-0"
        >
          <div
              class="mx-auto flex h-14 w-14 items-center justify-center"
          >
            <img
                src="@/assets/icon.png"
                alt="Student Connect Logo"
                class="h-8 w-8 object-contain"
            />
          </div>

          <span
              class="font-bold text-lg sm:text-xl tracking-tight text-brand-950"
          >
            Student Connect
          </span>
        </router-link>

        <!-- =====================================================
             DESKTOP NAVIGATION
             ===================================================== -->
        <div class="hidden md:flex items-center gap-1 ml-6">
          <!-- Carpool -->
          <router-link
              to="/carpool"
              class="px-3.5 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              active-class="!bg-brand-50 !text-brand-700 !font-semibold"
          >
            <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>

            <span>Carpool</span>
          </router-link>

          <!-- Errands -->
          <router-link
              to="/errands"
              class="px-3.5 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              active-class="!bg-brand-50 !text-brand-700 !font-semibold"
          >
            <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>

            <span>Errands</span>
          </router-link>

          <!-- Study -->
          <router-link
              to="/study"
              class="px-3.5 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              active-class="!bg-brand-50 !text-brand-700 !font-semibold"
          >
            <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>

            <span>Study</span>
          </router-link>

          <!-- Activities -->
          <router-link
              to="/activities"
              class="px-3.5 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              active-class="!bg-brand-50 !text-brand-700 !font-semibold"
          >
            <i class="fi fi-rr-calendar text-sm"></i>

            <span>Activities</span>
          </router-link>

          <!-- Admin -->
          <el-dropdown
              v-if="isAdministrator"
              trigger="click"
              @command="handleAdminMenuCommand"
          >
            <button
                type="button"
                class="px-3.5 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors text-slate-500 hover:bg-slate-100 hover:text-slate-800 cursor-pointer outline-none border-none bg-transparent"
            >
              <i class="fi fi-rr-shield-check text-sm"></i>

              <span>Admin</span>

              <i class="fi fi-rr-angle-small-down text-[10px]"></i>
            </button>

            <template #dropdown>
              <el-dropdown-menu class="!p-1.5 !rounded-xl min-w-[170px]">
                <el-dropdown-item
                    command="users"
                    class="!rounded-lg text-xs font-semibold py-2"
                >
                  <i class="fi fi-rr-users-alt mr-2 text-brand-600"></i>
                  <span>User Management</span>
                </el-dropdown-item>

                <el-dropdown-item
                    v-if="isSuperadmin"
                    command="statistics"
                    class="!rounded-lg text-xs font-semibold py-2"
                >
                  <i class="fi fi-rr-chart-histogram mr-2 text-brand-600"></i>
                  <span>Statistics</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- =====================================================
             USER MENU
             ===================================================== -->
        <el-dropdown
            trigger="click"
            @command="handleUserMenuCommand"
        >
          <button
              type="button"
              class="flex items-center gap-2 sm:gap-2.5 px-1.5 sm:px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer outline-none border-none bg-transparent"
          >
            <!-- Desktop user information -->
            <div class="text-right hidden lg:block">
              <div
                  class="text-sm font-semibold text-slate-900 leading-tight"
              >
                {{ currentUser.name }}
              </div>

              <div class="text-[11px] text-slate-500 max-w-[160px] truncate">
                {{ currentUser.email }}
              </div>
            </div>

            <!-- Avatar -->
            <div
                class="w-8 h-8 sm:w-9 sm:h-9 bg-brand-100 text-brand-700 rounded-full border border-brand-200 overflow-hidden shadow-xs flex items-center justify-center font-bold text-xs sm:text-sm shrink-0"
            >
              {{ currentUser.initial }}
            </div>

            <svg
                class="w-3.5 h-3.5 text-slate-400 hidden sm:block"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <template #dropdown>
            <el-dropdown-menu
                class="!p-1.5 !rounded-xl min-w-[210px]"
            >
              <!-- User information -->
              <div class="px-3 py-2.5 border-b border-slate-100 mb-1">
                <div class="flex items-center gap-2.5">
                  <div
                      class="w-9 h-9 shrink-0 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm"
                  >
                    {{ currentUser.initial }}
                  </div>

                  <div class="min-w-0">
                    <p
                        class="text-xs font-bold text-slate-800 truncate"
                    >
                      {{ currentUser.name }}
                    </p>

                    <p
                        class="text-[11px] text-slate-500 truncate"
                    >
                      {{ currentUser.email }}
                    </p>

                    <p
                        v-if="currentUserRole"
                        class="text-[10px] text-brand-600 font-semibold uppercase tracking-wide mt-0.5"
                    >
                      {{ currentUserRole }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Profile -->
              <el-dropdown-item
                  command="profile"
                  class="!rounded-lg text-xs font-semibold py-2"
              >
                <i class="fi fi-rr-user mr-2 text-brand-600"></i>
                <span>Profile</span>
              </el-dropdown-item>

              <!-- my services -->
              <el-dropdown-item
                  command='services'
                  class="!rounded-lg text-xs font-semibold py-2"
              >
                <i class="fi fi-rr-list mr-2 text-brand-600"></i>
                <span>Services</span>
              </el-dropdown-item>

              <!-- Admin section -->
              <div
                  v-if="isAdministrator"
                  class="my-1 border-t border-slate-100 pt-1"
              >
                <el-dropdown-item
                    command="users"
                    class="!rounded-lg text-xs font-semibold py-2"
                >
                  <i class="fi fi-rr-users-alt mr-2 text-brand-600"></i>
                  <span>User Management</span>
                </el-dropdown-item>

                <el-dropdown-item
                    v-if="isSuperadmin"
                    command="statistics"
                    class="!rounded-lg text-xs font-semibold py-2"
                >
                  <i class="fi fi-rr-chart-histogram mr-2 text-brand-600"></i>
                  <span>Statistics</span>
                </el-dropdown-item>
              </div>

              <!-- Logout -->
              <el-dropdown-item
                  command="logout"
                  divided
                  class="!rounded-lg text-xs font-semibold text-rose-600 hover:!bg-rose-50 py-2"
              >
                <i class="fi fi-rr-sign-out-alt mr-2 text-rose-500"></i>
                <span>Logout</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </nav>

    <!-- =========================================================
         MAIN CONTENT
         ========================================================= -->
    <main
        :class="[
        'flex-1 w-full mx-auto flex flex-col',
        isNotLoginPage
          ? 'max-w-7xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 gap-6'
          : 'p-0 justify-center'
      ]"
    >
      <router-view v-slot="{ Component }">
        <transition
            name="fade"
            mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- =========================================================
         FOOTER
         ========================================================= -->
    <footer
        v-if="isNotLoginPage"
        class="hidden w-full border-t border-slate-200 bg-white px-4 py-8 md:block md:px-6"
    >
      <div
          class="mx-auto flex max-w-7xl items-center justify-between gap-6"
      >
        <!-- Brand -->
        <div class="flex min-w-0 items-center gap-3">
          <a
              href="/"
              aria-label="Student Connect Home"
              class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <img
                src="/src/assets/icon.png"
                alt="Student Connect Logo"
                width="28"
                height="28"
                loading="lazy"
                class="size-7 select-none object-contain"
            />
          </a>

          <div class="min-w-0">
            <a
                href="/"
                class="text-sm font-semibold text-slate-900 no-underline transition-opacity hover:opacity-80"
            >
              Student Connect
            </a>

            <p class="mt-0.5 text-xs text-slate-500">
              Connecting students, simplifying campus life.
            </p>
          </div>
        </div>

        <!-- Links -->
        <nav
            aria-label="Footer"
            class="flex shrink-0 items-center gap-5"
        >
          <RouterLink
              to="/about"
              class="text-xs font-medium text-slate-500 no-underline transition-colors hover:text-brand-600"
          >
            About
          </RouterLink>

          <RouterLink
              to="/mission"
              class="text-xs font-medium text-slate-500 no-underline transition-colors hover:text-brand-600"
          >
            Mission
          </RouterLink>
        </nav>
      </div>
    </footer>

    <!-- =========================================================
         MOBILE BOTTOM NAVIGATION

         Only the 4 primary student services are shown here.
         Profile, Admin and Statistics are accessed from the
         top-right avatar menu.
         ========================================================= -->
    <nav
        v-if="isNotLoginPage"
        class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]"
    >
      <div
          class="grid grid-cols-4 gap-1 max-w-lg mx-auto"
      >
        <!-- Carpool -->
        <router-link
            to="/carpool"
            class="relative flex flex-col items-center justify-center min-h-[54px] px-1 py-1.5 rounded-xl text-[10px] font-semibold text-slate-500 transition-all duration-200"
            active-class="!text-brand-700 !bg-brand-50"
        >
          <svg
              class="w-5 h-5 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>

          <span>Carpool</span>
        </router-link>

        <!-- Errands -->
        <router-link
            to="/errands"
            class="relative flex flex-col items-center justify-center min-h-[54px] px-1 py-1.5 rounded-xl text-[10px] font-semibold text-slate-500 transition-all duration-200"
            active-class="!text-brand-700 !bg-brand-50"
        >
          <svg
              class="w-5 h-5 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>

          <span>Errands</span>
        </router-link>

        <!-- Study -->
        <router-link
            to="/study"
            class="relative flex flex-col items-center justify-center min-h-[54px] px-1 py-1.5 rounded-xl text-[10px] font-semibold text-slate-500 transition-all duration-200"
            active-class="!text-brand-700 !bg-brand-50"
        >
          <svg
              class="w-5 h-5 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>

          <span>Study</span>
        </router-link>

        <!-- Activities -->
        <router-link
            to="/activities"
            class="relative flex flex-col items-center justify-center min-h-[54px] px-1 py-1.5 rounded-xl text-[10px] font-semibold text-slate-500 transition-all duration-200"
            active-class="!text-brand-700 !bg-brand-50"
        >
          <i class="fi fi-rr-calendar text-base mb-1"></i>

          <span>Activities</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import studentConnect from '@/api'
import {
  currentUserProfile,
  getIdToken,
  logout,
  setCurrentUserProfile,
  user
} from '@/services/auth'

const route = useRoute()
const router = useRouter()

const debugAuthEnabled =
    import.meta.env.VITE_DEBUG_AUTH_TOKEN === 'true'

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

watch(
    user,
    refreshDebugToken,
    {
      immediate: true
    }
)

/**
 * Loads the authoritative backend profile for the authenticated Firebase user.
 *
 * @returns {Promise<void>} Resolves when the shared profile state is updated.
 */
async function loadCurrentUserProfile() {
  if (!user.value) {
    setCurrentUserProfile(null)
    return
  }

  try {
    const response =
        await studentConnect.getCurrentUserProfile()

    setCurrentUserProfile(
        response.data
    )
  } catch {
    setCurrentUserProfile(null)
  }
}

watch(
    user,
    loadCurrentUserProfile,
    {
      immediate: true
    }
)

/**
 * Determines whether the current view is not the authentication page.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isNotLoginPage = computed(() => {
  return route.path !== '/login'
})

/**
 * Computes current active user profile details.
 *
 * @type {import('vue').ComputedRef<{
 *   name: string,
 *   email: string,
 *   initial: string
 * }>}
 */
const currentUser = computed(() => {
  const name =
      currentUserProfile.value?.name ||
      user.value?.displayName ||
      user.value?.email ||
      'Unknown User'

  const email =
      currentUserProfile.value?.email ||
      user.value?.email ||
      ''

  const initial =
      name
          ? name.trim().charAt(0).toUpperCase()
          : 'S'

  return {
    name,
    email,
    initial
  }
})

/**
 * Returns the current user's backend role.
 *
 * @returns {string} Current role label.
 */
const currentUserRole = computed(() => {
  return String(
      currentUserProfile.value?.role || ''
  ).trim()
})

/**
 * Determines whether the current backend profile can access
 * user management.
 *
 * @returns {boolean} True for administrators and superadministrators.
 */
const isAdministrator = computed(() => {
  return [
    'admin',
    'superadmin'
  ].includes(
      currentUserProfile.value?.role
  )
})

/**
 * Determines whether the current backend profile is a superadministrator.
 *
 * @returns {boolean} True when the current user may access statistics.
 */
const isSuperadmin = computed(() => {
  return (
      currentUserProfile.value?.role ===
      'superadmin'
  )
})

/**
 * Handles dropdown user menu selections.
 *
 * @param {string} command Selected action command.
 * @returns {Promise<void>} Resolves after navigation or logout completes.
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

    return
  }

  if (command === 'profile') {
    await router.push('/profile')
    return
  }

  if (command === 'services') {
    await router.push('/profile/services')
    return
  }

  if (command === 'users') {
    await router.push('/admin/users')
    return
  }

  if (command === 'statistics') {
    await router.push('/admin/statistics')
  }

  if (command === 'services') {
    await router.push('/my-services')
  }
}

/**
 * Handles desktop admin navigation selections.
 *
 * @param {string} command Selected admin destination.
 * @returns {Promise<void>} Resolves after navigation completes.
 */
async function handleAdminMenuCommand(command) {
  if (command === 'users') {
    await router.push('/admin/users')
    return
  }

  if (command === 'statistics') {
    await router.push('/admin/statistics')
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
