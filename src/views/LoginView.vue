<template>
  <div class="min-h-[85vh] flex items-center justify-center p-4">
    <div
        class="w-full max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
    >
      <!-- Logo / Header -->
      <div class="mb-8 text-center">
        <img
            src="@/assets/icon.png"
            alt="Lend a Hand Logo"
            class="mx-auto mb-4 h-16 w-16 rounded-2xl"
        />

        <h1 class="text-2xl font-bold text-slate-900">
          Lend a Hand
        </h1>

        <p class="mt-1 text-sm text-slate-500">
          Your campus, connected.
        </p>
      </div>

      <!-- Mode Switcher -->
      <div
          class="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1"
      >
        <button
            type="button"
            @click="mode = 'login'"
            :class="[
            'rounded-lg px-4 py-2.5 text-sm font-medium transition',
            mode === 'login'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          ]"
        >
          Sign In
        </button>

        <button
            type="button"
            @click="mode = 'register'"
            :class="[
            'rounded-lg px-4 py-2.5 text-sm font-medium transition',
            mode === 'register'
              ? 'bg-white text-brand-700 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          ]"
        >
          Register Account
        </button>
      </div>

      <!-- ========================= -->
      <!-- LOGIN -->
      <!-- ========================= -->

      <form
          v-if="mode === 'login'"
          @submit.prevent="handleLogin"
          class="space-y-4"
      >
        <div>
          <label
              for="login-email"
              class="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email
          </label>

          <input
              id="login-email"
              v-model="loginForm.email"
              type="email"
              autocomplete="email"
              placeholder="Enter your email"
              required
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
          />
        </div>

        <div>
          <label
              for="login-password"
              class="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              autocomplete="current-password"
              placeholder="Enter your password"
              required
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
          />
        </div>

        <button
            type="submit"
            :disabled="isLoading"
            class="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ isLoading ? 'Signing In...' : 'Sign In' }}
        </button>

        <!-- Divider -->
        <div class="relative py-2">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200"></div>
          </div>

          <div class="relative flex justify-center">
            <span
                class="bg-white px-3 text-xs text-slate-400"
            >
              OR
            </span>
          </div>
        </div>

        <!-- Google -->
        <button
            type="button"
            @click="handleGoogleSignIn"
            :disabled="isLoading"
            class="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true" > <path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.22Z" /> <path fill="#34A853" d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z" /> <path fill="#FBBC05" d="M6.54 13.59a5.86 5.86 0 0 1 0-3.18V7.88H3.3a9.75 9.75 0 0 0 0 8.24l3.24-2.53Z" /> <path fill="#EA4335" d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38Z" /> </svg>

          <span>
            {{
              isLoading
                  ? 'Signing In...'
                  : 'Continue with Google'
            }}
          </span>
        </button>
      </form>

      <!-- ========================= -->
      <!-- REGISTER -->
      <!-- ========================= -->

      <form
          v-else
          @submit.prevent="handleRegister"
          class="space-y-4"
      >
        <div>
          <label
              for="register-name"
              class="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Full Name
          </label>

          <input
              id="register-name"
              v-model="registerForm.name"
              type="text"
              autocomplete="name"
              placeholder="Enter your full name"
              maxlength="100"
              required
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
          />
        </div>

        <div>
          <label
              for="register-email"
              class="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Email
          </label>

          <input
              id="register-email"
              v-model="registerForm.email"
              type="email"
              autocomplete="email"
              placeholder="Enter your email"
              required
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
          />
        </div>

        <div>
          <label
              for="register-password"
              class="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Password
          </label>

          <input
              id="register-password"
              v-model="registerForm.password"
              type="password"
              autocomplete="new-password"
              placeholder="Create a password"
              required
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
          />
        </div>

        <div>
          <label
              for="register-confirm-password"
              class="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Confirm Password
          </label>

          <input
              id="register-confirm-password"
              v-model="registerForm.confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="Confirm your password"
              required
              class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
          />
        </div>

        <button
            type="submit"
            :disabled="isLoading"
            class="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>

        <!-- Divider -->
        <div class="relative py-2">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-slate-200"></div>
          </div>

          <div class="relative flex justify-center">
            <span
                class="bg-white px-3 text-xs text-slate-400"
            >
              OR
            </span>
          </div>
        </div>

        <!-- Google -->
        <button
            type="button"
            @click="handleGoogleSignIn"
            :disabled="isLoading"
            class="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <i class="fi fi-brands-google text-base"></i>

          <span>
            {{
              isLoading
                  ? 'Signing In...'
                  : 'Continue with Google'
            }}
          </span>
        </button>
      </form>
    </div>

    <!-- ====================================== -->
    <!-- GOOGLE PROFILE NAME FORM -->
    <!-- ====================================== -->

    <div
        v-if="showNameForm"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
    >
      <div
          class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          @click.stop
      >
        <!-- Header -->
        <div class="mb-6">
          <div
              class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700"
          >
            <i class="fi fi-rr-user text-lg"></i>
          </div>

          <h2 class="text-xl font-semibold text-slate-900">
            Complete Your Profile
          </h2>

          <p class="mt-1.5 text-sm leading-6 text-slate-500">
            We need your name to create your Student Connect
            profile.
          </p>
        </div>

        <!-- Form -->
        <form
            @submit.prevent="submitGoogleProfileName"
            class="space-y-5"
        >
          <div>
            <label
                for="google-profile-name"
                class="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Full Name
            </label>

            <input
                id="google-profile-name"
                v-model="googleProfileName"
                type="text"
                autocomplete="name"
                placeholder="e.g. Alex Tan"
                maxlength="100"
                required
                autofocus
                class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
            />

            <p
                v-if="googleProfileNameError"
                class="mt-1.5 text-xs text-red-500"
            >
              {{ googleProfileNameError }}
            </p>
          </div>

          <button
              type="submit"
              :disabled="isSavingGoogleProfile"
              class="w-full rounded-xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{
              isSavingGoogleProfile
                  ? 'Saving...'
                  : 'Continue'
            }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import studentConnect from '@/api'

import {
  login,
  register,
  setCurrentUserProfile,
  signInWithGoogle
} from '@/services/auth'

const router = useRouter()
const route = useRoute()

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const mode = ref('login')
const isLoading = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const registerForm = reactive({
  name: '',
  email: '',
  matricNo: '',
  password: '',
  confirmPassword: ''
})

/*
|--------------------------------------------------------------------------
| Google Profile Form
|--------------------------------------------------------------------------
*/

const showNameForm = ref(false)
const googleProfileName = ref('')
const googleProfileNameError = ref('')
const isSavingGoogleProfile = ref(false)

/*
|--------------------------------------------------------------------------
| Authentication Error
|--------------------------------------------------------------------------
*/

function getAuthErrorMessage(error) {
  const code = error?.code || ''

  const messages = {
    'auth/invalid-email':
        'Please enter a valid email address.',

    'auth/user-not-found':
        'No account was found with this email.',

    'auth/wrong-password':
        'Incorrect email or password.',

    'auth/invalid-credential':
        'Incorrect email or password.',

    'auth/email-already-in-use':
        'An account already exists with this email.',

    'auth/weak-password':
        'Password is too weak.',

    'auth/popup-closed-by-user':
        'Google sign-in was cancelled.',

    'auth/cancelled-popup-request':
        'Google sign-in was cancelled.',

    'auth/popup-blocked':
        'The Google sign-in popup was blocked by your browser.'
  }

  return (
      messages[code] ||
      error?.message ||
      'Something went wrong. Please try again.'
  )
}

/*
|--------------------------------------------------------------------------
| Destination
|--------------------------------------------------------------------------
*/

function getDestination() {
  return typeof route.query.redirect === 'string'
      ? route.query.redirect
      : '/carpool'
}

/*
|--------------------------------------------------------------------------
| Normal Login
|--------------------------------------------------------------------------
*/

async function handleLogin() {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    const credential = await login(
        loginForm.email.trim(),
        loginForm.password
    )

    if (!credential?.user) {
      throw new Error(
          'Authentication did not return a user.'
      )
    }

    await studentConnect.getCurrentUserProfile()

    ElMessage.success(
        `Welcome back, ${
            credential.user.displayName ||
            credential.user.email ||
            'Student'
        }!`
    )

    await router.push(getDestination())
  } catch (error) {
    console.error('Login failed:', error)

    ElMessage.error(
        getAuthErrorMessage(error)
    )
  } finally {
    isLoading.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Normal Registration
|--------------------------------------------------------------------------
*/

async function handleRegister() {
  if (isLoading.value) {
    return
  }

  const name = registerForm.name.trim()
  const email = registerForm.email.trim()

  if (!name) {
    ElMessage.error('Please enter your full name.')
    return
  }

  if (name.length < 2) {
    ElMessage.error(
        'Name must be at least 2 characters.'
    )
    return
  }

  if (name.length > 100) {
    ElMessage.error(
        'Name must not exceed 100 characters.'
    )
    return
  }

  if (!email) {
    ElMessage.error(
        'Please enter your email address.'
    )
    return
  }

  if (!registerForm.password) {
    ElMessage.error(
        'Please enter your password.'
    )
    return
  }

  if (registerForm.password.length < 6) {
    ElMessage.error(
        'Password must be at least 6 characters.'
    )
    return
  }

  if (
      registerForm.password !==
      registerForm.confirmPassword
  ) {
    ElMessage.error(
        'Passwords do not match.'
    )
    return
  }

  isLoading.value = true

  try {
    const credential = await register(
        email,
        registerForm.password,
        name
    )

    if (!credential?.user) {
      throw new Error(
          'Registration did not return a user.'
      )
    }

    /*
     * Save the profile through the Student Connect API.
     * Keep the API schema unchanged.
     */
    await studentConnect.getCurrentUserProfile()

    const profileResponse =
        await studentConnect.updateCurrentUserProfile({
      name,
      matricNo: registerForm.matricNo.trim()
    })

    setCurrentUserProfile(profileResponse?.data)

    ElMessage.success(
        'Account created successfully!'
    )

    await router.push(getDestination())
  } catch (error) {
    console.error(
        'Registration failed:',
        error
    )

    ElMessage.error(
        getAuthErrorMessage(error)
    )
  } finally {
    isLoading.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Google Sign In
|--------------------------------------------------------------------------
*/

async function handleGoogleSignIn() {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    const credential = await signInWithGoogle()

    if (!credential?.user) {
      throw new Error(
          'Google authentication did not return a user.'
      )
    }

    /*
     * Get the Student Connect profile after
     * Firebase Google authentication.
     */
    const profileResponse =
        await studentConnect.getCurrentUserProfile()

    const profile =
        profileResponse?.data || null

    const existingName =
        profile?.name?.trim() || ''

    /*
     * Google account has authenticated successfully,
     * but the Student Connect profile does not have
     * a name yet.
     *
     * Show the normal HTML form.
     */
    if (!existingName) {
      googleProfileName.value =
          credential.user.displayName?.trim() || ''

      googleProfileNameError.value = ''

      showNameForm.value = true

      return
    }

    ElMessage.success(
        `Welcome, ${
            existingName ||
            credential.user.email ||
            'Student'
        }!`
    )

    await router.push(getDestination())
  } catch (error) {
    console.error(
        'Google sign-in failed:',
        error
    )

    ElMessage.error(
        getAuthErrorMessage(error)
    )
  } finally {
    isLoading.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Save Google Profile Name
|--------------------------------------------------------------------------
*/

async function submitGoogleProfileName() {
  const name =
      googleProfileName.value.trim()

  googleProfileNameError.value = ''

  if (!name) {
    googleProfileNameError.value =
        'Please enter your full name.'

    return
  }

  if (name.length < 2) {
    googleProfileNameError.value =
        'Name must be at least 2 characters.'

    return
  }

  if (name.length > 100) {
    googleProfileNameError.value =
        'Name must not exceed 100 characters.'

    return
  }

  isSavingGoogleProfile.value = true

  try {
    const profileResponse =
        await studentConnect.updateCurrentUserProfile({
      name
    })

    setCurrentUserProfile(profileResponse?.data)

    showNameForm.value = false

    googleProfileName.value = ''
    googleProfileNameError.value = ''

    ElMessage.success(
        'Profile name saved successfully.'
    )

    await router.push(getDestination())
  } catch (error) {
    console.error(
        'Failed to save Google profile:',
        error
    )

    googleProfileNameError.value =
        error?.message ||
        'Unable to save your name. Please try again.'
  } finally {
    isSavingGoogleProfile.value = false
  }
}
</script>
