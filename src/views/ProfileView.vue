<template>
  <div class="min-h-full space-y-6">
    <!-- Header -->
    <header>
      <div>
        <h1 class="text-2xl font-bold text-slate-800">
          Profile
        </h1>


        <p class="mt-1 text-sm text-slate-500">
          Manage your Student Connect account
        </p>
      </div>
    </header>

    <!-- Profile Card -->
    <el-card shadow="never">
      <div class="h-24 bg-gradient-to-r from-indigo-500 to-indigo-600 -mx-5 -mt-5"></div>

      <div class="-mt-10">
        <el-avatar
            :size="80"
            shape="square"
            class="!border-4 !border-white !bg-indigo-100 !text-2xl !font-bold !text-indigo-600"
        >
          {{ userInitial }}
        </el-avatar>

        <div class="mt-3">
          <h2 class="text-xl font-bold text-slate-800">
            {{ userName }}
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            {{ userEmail }}
          </p>
        </div>
      </div>
    </el-card>

    <!-- Account Information -->
    <section
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div class="mb-5">
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-800">
          Account Information
        </h3>

        <p class="mt-1 text-xs text-slate-400">
          Your information from your Student Connect account
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- Name -->
        <div
            class="rounded-xl border border-slate-100 bg-slate-50 p-4"
        >
          <div class="mb-2 flex items-center gap-2">
            <i class="fi fi-rr-user text-indigo-500"></i>

            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Name
        </span>
          </div>

          <p class="text-sm font-semibold text-slate-800">
            {{ userName }}
          </p>
        </div>

        <!-- Email -->
        <div
            class="rounded-xl border border-slate-100 bg-slate-50 p-4"
        >
          <div class="mb-2 flex items-center gap-2">
            <i class="fi fi-rr-envelope text-indigo-500"></i>

            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Email
        </span>
          </div>

          <p class="break-all text-sm font-semibold text-slate-800">
            {{ userEmail }}
          </p>
        </div>

        <!-- Account Provider -->
        <div
            class="rounded-xl border border-slate-100 bg-slate-50 p-4"
        >
          <div class="mb-2 flex items-center gap-2">
            <i class="fi fi-rr-shield-check text-indigo-500"></i>

            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Sign-in Provider
        </span>
          </div>

          <p class="text-sm font-semibold text-slate-800">
            {{ providerName }}
          </p>
        </div>

        <!-- Account Status -->
        <div
            class="rounded-xl border border-slate-100 bg-slate-50 p-4"
        >
          <div class="mb-2 flex items-center gap-2">
            <i class="fi fi-rr-check-circle text-indigo-500"></i>

            <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Account Status
        </span>
          </div>

          <p class="text-sm font-semibold text-emerald-600">
            Verified & Active
          </p>
        </div>
      </div>
    </section>

    <!-- Quick Access -->
    <section
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div class="mb-5">
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-800">
          Quick Access
        </h3>

        <p class="mt-1 text-xs text-slate-400">
          Manage your Student Connect activities
        </p>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <!-- Carpool -->
        <button
            type="button"
            class="group rounded-xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-indigo-100 hover:bg-indigo-50/50"
            @click="goTo('/carpool')"
        >
          <div
              class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white"
          >
            <i class="fi fi-rr-car"></i>
          </div>

          <h4 class="text-sm font-bold text-slate-800">
            Carpool
          </h4>

          <p class="mt-1 text-xs leading-relaxed text-slate-500">
            Find or create a ride with other students.
          </p>
        </button>

        <!-- Errands -->
        <button
            type="button"
            class="group rounded-xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-indigo-100 hover:bg-indigo-50/50"
            @click="goTo('/errands')"
        >
          <div
              class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white"
          >
            <i class="fi fi-rr-shopping-bag"></i>
          </div>

          <h4 class="text-sm font-bold text-slate-800">
            Errands
          </h4>

          <p class="mt-1 text-xs leading-relaxed text-slate-500">
            Request or help with errands around campus.
          </p>
        </button>

        <!-- Study -->
        <button
            type="button"
            class="group rounded-xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-indigo-100 hover:bg-indigo-50/50"
            @click="goTo('/study')"
        >
          <div
              class="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white"
          >
            <i class="fi fi-rr-book-open-cover"></i>
          </div>

          <h4 class="text-sm font-bold text-slate-800">
            Study
          </h4>

          <p class="mt-1 text-xs leading-relaxed text-slate-500">
            Join or create a study session.
          </p>
        </button>
      </div>
    </section>

    <!-- Account Actions -->
    <section
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div class="mb-5">
        <h3 class="text-sm font-bold uppercase tracking-wider text-slate-800">
          Account
        </h3>

        <p class="mt-1 text-xs text-slate-400">
          Manage your current session
        </p>
      </div>

      <button
          type="button"
          class="flex w-full items-center justify-between rounded-xl border border-rose-100 bg-rose-50 p-4 text-left transition hover:bg-rose-100"
          @click="handleLogout"
      >
        <div class="flex items-center gap-3">
          <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-500"
          >
            <i class="fi fi-rr-sign-out-alt"></i>
          </div>

          <div>
            <h4 class="text-sm font-bold text-slate-800">
              Sign Out
            </h4>

            <p class="mt-0.5 text-xs text-slate-500">
              Sign out from this Student Connect account.
            </p>
          </div>
        </div>

        <i class="fi fi-rr-angle-small-right text-rose-400"></i>
      </button>
    </section>

  </div>
</template>

<script setup>
import {
  computed
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  logout,
  user
} from '@/services/auth'

const router = useRouter()

/**
 * Returns the currently authenticated user's display name.
 *
 * @returns {string} User display name or fallback text.
 */
const userName = computed(() => {
  return user.value?.displayName ||
      user.value?.email ||
      'Student'
})

/**
 * Returns the currently authenticated user's email address.
 *
 * @returns {string} User email or fallback text.
 */
const userEmail = computed(() => {
  return user.value?.email || 'No email available'
})

/**
 * Returns the first character used for the user's avatar.
 *
 * @returns {string} Uppercase avatar initial.
 */
const userInitial = computed(() => {
  const name = userName.value.trim()

  return name
      ? name.charAt(0).toUpperCase()
      : 'S'
})

/**
 * Returns the authentication provider used by the account.
 *
 * @returns {string} Human-readable provider name.
 */
const providerName = computed(() => {
  const providerId =
      user.value?.providerData?.[0]?.providerId

  if (providerId === 'password') {
    return 'Email & Password'
  }

  if (providerId === 'google.com') {
    return 'Google'
  }

  if (providerId) {
    return providerId
  }

  return 'Firebase Authentication'
})

/**
 * Navigates to a Student Connect application route.
 *
 * @param {string} path - Target application path.
 * @returns {Promise<void>} Resolves after navigation completes.
 */
async function goTo(path) {
  await router.push(path)
}

/**
 * Signs out the current Firebase user and redirects to login.
 *
 * @returns {Promise<void>} Resolves after logout and navigation.
 */
async function handleLogout() {
  await logout()
  await router.replace('/login')
}
</script>
