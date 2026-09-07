<template>
  <div class="min-h-full space-y-6">
    <!-- Header -->
    <header>
      <h1 class="text-2xl font-bold text-slate-800">
        Profile
      </h1>

      <p class="mt-1 text-sm text-slate-500">
        Manage your Student Connect account
      </p>
    </header>

    <!-- Profile Overview -->
    <section
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div class="h-24 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>

      <div class="px-5 pb-5 sm:px-6">
        <div class="-mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between">
          <div>
            <el-avatar
                :size="80"
                shape="square"
                class="!border-4 !border-white !bg-indigo-100 !text-2xl !font-bold !text-indigo-600 !shadow-md"
            >
              {{ userInitial }}
            </el-avatar>

            <div class="mt-3">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-xl font-bold text-slate-800">
                  {{ userName }}
                </h2>

                <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                    :class="roleBadgeClass"
                >
                  <span
                      class="h-1.5 w-1.5 rounded-full"
                      :class="roleDotClass"
                  ></span>

                  {{ userRole }}
                </span>
              </div>

              <p class="mt-1 break-all text-sm text-slate-500">
                {{ userEmail }}
              </p>
            </div>
          </div>

          <div class="mt-4 sm:mt-0 sm:pb-1">
            <div
                class="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2"
            >
              <span class="relative flex h-2 w-2">
                <span
                    class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"
                ></span>

                <span
                    class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"
                ></span>
              </span>

              <span class="text-xs font-semibold text-emerald-700">
                Active account
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Account Information -->
    <section
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <!-- Section Header -->
      <div class="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-800">
            Account Information
          </h3>

          <p class="mt-1 text-xs text-slate-400">
            Information associated with your Student Connect account
          </p>
        </div>

        <!-- Edit / Cancel -->
        <el-button
            v-if="!isEditing"
            type="primary"
            plain
            size="small"
            @click="startEditing"
        >
          <i class="fi fi-rr-pencil mr-1.5"></i>
          Edit
        </el-button>

        <el-button
            v-else
            size="small"
            @click="cancelEditing"
        >
          Cancel
        </el-button>
      </div>

      <!-- Information Grid -->
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Name -->
        <div
            class="rounded-xl border border-slate-100 bg-slate-50 p-4 transition"
            :class="isEditing ? 'border-indigo-100 bg-indigo-50/30' : 'hover:border-indigo-100 hover:bg-indigo-50/30'"
        >
          <div class="mb-2 flex items-center gap-2">
            <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"
            >
              <i class="fi fi-rr-user text-xs"></i>
            </div>

            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Name
            </span>
          </div>

          <el-input
              v-if="isEditing"
              v-model="editForm.name"
              size="default"
              placeholder="Enter your name"
              maxlength="100"
              show-word-limit
          />

          <p
              v-else
              class="truncate text-sm font-semibold text-slate-800"
          >
            {{ userName }}
          </p>
        </div>

        <!-- Email -->
        <div
            class="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/30"
        >
          <div class="mb-2 flex items-center gap-2">
            <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"
            >
              <i class="fi fi-rr-envelope text-xs"></i>
            </div>

            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Email
            </span>
          </div>

          <p class="break-all text-sm font-semibold text-slate-800">
            {{ userEmail }}
          </p>

          <p class="mt-1 text-[10px] text-slate-400">
            Email cannot be changed here
          </p>
        </div>

        <!-- Phone -->
        <div
            class="rounded-xl border border-slate-100 bg-slate-50 p-4 transition"
            :class="isEditing ? 'border-indigo-100 bg-indigo-50/30' : 'hover:border-indigo-100 hover:bg-indigo-50/30'"
        >
          <div class="mb-2 flex items-center gap-2">
            <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"
            >
              <i class="fi fi-rr-phone-call text-xs"></i>
            </div>

            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Phone
            </span>
          </div>

          <el-input
              v-if="isEditing"
              v-model="editForm.phone"
              size="default"
              placeholder="Enter your phone number"
              maxlength="30"
          />

          <p
              v-else
              class="text-sm font-semibold text-slate-800"
          >
            {{ userPhone || 'Not provided' }}
          </p>
        </div>

        <!-- Role -->
        <div
            class="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/30"
        >
          <div class="mb-2 flex items-center gap-2">
            <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"
            >
              <i class="fi fi-rr-badge text-xs"></i>
            </div>

            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Role
            </span>
          </div>

          <p class="text-sm font-bold uppercase text-slate-800">
            {{ userRole }}
          </p>

          <p class="mt-1 text-[10px] text-slate-400">
            Managed by administrators
          </p>
        </div>

        <!-- Provider -->
        <div
            class="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-indigo-100 hover:bg-indigo-50/30"
        >
          <div class="mb-2 flex items-center gap-2">
            <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"
            >
              <i class="fi fi-rr-shield-check text-xs"></i>
            </div>

            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Sign-in Provider
            </span>
          </div>

          <p class="text-sm font-semibold text-slate-800">
            {{ providerName }}
          </p>
        </div>

        <!-- Status -->
        <div
            class="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-emerald-100 hover:bg-emerald-50/30"
        >
          <div class="mb-2 flex items-center gap-2">
            <div
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600"
            >
              <i class="fi fi-rr-check-circle text-xs"></i>
            </div>

            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Account Status
            </span>
          </div>

          <p class="text-sm font-bold text-emerald-600">
            Verified & Active
          </p>
        </div>
      </div>

      <!-- Edit Actions -->
      <div
          v-if="isEditing"
          class="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div
            v-if="profileError"
            class="flex items-start gap-2 rounded-xl border border-rose-100 bg-rose-50 p-3 sm:max-w-md"
        >
          <i class="fi fi-rr-exclamation mt-0.5 text-rose-500"></i>

          <p class="text-xs font-semibold leading-relaxed text-rose-600">
            {{ profileError }}
          </p>
        </div>

        <div
            v-else
            class="flex items-center gap-2 text-xs text-slate-400"
        >
          <i class="fi fi-rr-info"></i>
          <span>You can update your name and phone number.</span>
        </div>

        <div class="flex gap-2 sm:ml-auto">
          <el-button
              size="large"
              :disabled="savingProfile"
              @click="cancelEditing"
          >
            Cancel
          </el-button>

          <el-button
              type="primary"
              size="large"
              :loading="savingProfile"
              @click="saveProfile"
          >
            <i
                v-if="!savingProfile"
                class="fi fi-rr-check mr-1.5"
            ></i>
            Save Changes
          </el-button>
        </div>
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
          class="group flex w-full items-center justify-between rounded-xl border border-rose-100 bg-rose-50 p-4 text-left transition hover:bg-rose-100"
          @click="handleLogout"
      >
        <div class="flex items-center gap-3">
          <div
              class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm"
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

        <i
            class="fi fi-rr-angle-small-right text-rose-400 transition-transform group-hover:translate-x-1"
        ></i>
      </button>
    </section>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'

import {
  ElMessage
} from 'element-plus'

import studentConnect from '@/api'

import {
  currentUserProfile,
  logout,
  setCurrentUserProfile,
  user
} from '@/services/auth'

const router = useRouter()

const isEditing = ref(false)
const savingProfile = ref(false)
const profileError = ref('')

const editForm = reactive({
  name: '',
  phone: ''
})

/**
 * Loads the authenticated user's backend profile.
 *
 * @returns {Promise<void>} Resolves after the profile is loaded.
 * @throws {Error} Handled internally and displayed to the user.
 */
async function loadProfile() {
  try {
    const response = await studentConnect.getCurrentUserProfile()
    const profile = response?.data

    setCurrentUserProfile(profile)

    editForm.name = profile?.name || ''
    editForm.phone = profile?.phone || ''
  } catch (error) {
    profileError.value =
        error?.message || 'Unable to load your profile.'
  }
}

/**
 * Initializes the inline profile editor using the current profile.
 *
 * @returns {void} Enables editing and clears previous errors.
 */
function startEditing() {
  editForm.name = currentUserProfile.value?.name || ''
  editForm.phone = currentUserProfile.value?.phone || ''

  profileError.value = ''
  isEditing.value = true
}

/**
 * Cancels inline profile editing and restores the saved values.
 *
 * @returns {void} Discards unsaved form changes.
 */
function cancelEditing() {
  editForm.name = currentUserProfile.value?.name || ''
  editForm.phone = currentUserProfile.value?.phone || ''

  profileError.value = ''
  isEditing.value = false
}

/**
 * Saves the authenticated user's editable profile fields.
 *
 * @returns {Promise<void>} Resolves after the profile has been updated.
 * @throws {Error} Handled internally and displayed to the user.
 */
async function saveProfile() {
  profileError.value = ''

  const name = editForm.name.trim()
  const phone = editForm.phone.trim()

  if (!name) {
    profileError.value = 'Name is required.'
    return
  }

  savingProfile.value = true

  try {
    const response =
        await studentConnect.updateCurrentUserProfile({
          name,
          phone
        })

    const profile = response?.data

    setCurrentUserProfile(profile)

    editForm.name = profile?.name || name
    editForm.phone = profile?.phone || phone

    isEditing.value = false

    ElMessage.success('Profile updated successfully.')
  } catch (error) {
    profileError.value =
        error?.message || 'Unable to update your profile.'
  } finally {
    savingProfile.value = false
  }
}

/**
 * Returns the authenticated user's display name.
 *
 * @returns {string} User display name or fallback value.
 */
const userName = computed(() => {
  return (
      currentUserProfile.value?.name ||
      user.value?.displayName ||
      user.value?.email ||
      'Student'
  )
})

/**
 * Returns the authenticated user's email address.
 *
 * @returns {string} User email or fallback text.
 */
const userEmail = computed(() => {
  return (
      currentUserProfile.value?.email ||
      user.value?.email ||
      'No email available'
  )
})

/**
 * Returns the backend-managed phone number.
 *
 * @returns {string} User phone number or an empty string.
 */
const userPhone = computed(() => {
  return currentUserProfile.value?.phone || ''
})

/**
 * Returns the backend-managed application role.
 *
 * @returns {string} User role.
 */
const userRole = computed(() => {
  return currentUserProfile.value?.role || 'user'
})

/**
 * Returns the CSS classes for the user's role badge.
 *
 * @returns {string} Tailwind CSS classes for the role badge.
 */
const roleBadgeClass = computed(() => {
  switch (userRole.value) {
    case 'superadmin':
      return 'bg-rose-50 text-rose-700'

    case 'admin':
      return 'bg-amber-50 text-amber-700'

    default:
      return 'bg-indigo-50 text-indigo-700'
  }
})

/**
 * Returns the CSS classes for the role indicator.
 *
 * @returns {string} Tailwind CSS classes for the role indicator.
 */
const roleDotClass = computed(() => {
  switch (userRole.value) {
    case 'superadmin':
      return 'bg-rose-500'

    case 'admin':
      return 'bg-amber-500'

    default:
      return 'bg-indigo-500'
  }
})

/**
 * Returns the first character of the user's name for the avatar.
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
 * Returns a human-readable Firebase authentication provider name.
 *
 * @returns {string} Authentication provider name.
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

onMounted(loadProfile)
</script>
