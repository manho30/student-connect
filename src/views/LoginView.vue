<template>
  <div class="min-h-[85vh] flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
      <!-- Header & Branding -->
      <div class="space-y-4 text-center">
        <div
            class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-[0_6px_20px_rgba(15,23,42,0.08)] ring-1 ring-slate-100"
        >
          <img
              src="@/public/icon.png"
              alt="Student Connect Logo"
              class="h-8 w-8 object-contain"
          />
        </div>

        <div>
          <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
            Student Connect
          </h1>

          <p class="mt-1.5 text-sm text-slate-500">
            Your campus, connected.
          </p>
        </div>
      </div>

      <!-- Mode Switcher -->
      <div class="bg-slate-100 p-1 rounded-2xl flex gap-1">
        <button
            type="button"
            :class="[
        'flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center',
        mode === 'login'
          ? 'bg-white text-brand-700 shadow-xs'
          : 'text-slate-600 hover:text-slate-900'
      ]"
            @click="switchMode('login')"
        >
          Sign In
        </button>

        <button
            type="button"
            :class="[
        'flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center',
        mode === 'register'
          ? 'bg-white text-brand-700 shadow-xs'
          : 'text-slate-600 hover:text-slate-900'
      ]"
            @click="switchMode('register')"
        >
          Register Account
        </button>
      </div>

      <!-- Login Form -->
      <form
          v-if="mode === 'login'"
          id="student-login-form"
          class="space-y-4"
          @submit.prevent="handleLogin"
      >
        <!-- Email -->
        <div>
          <label
              class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              for="student-email-input"
          >
            Email
          </label>

          <el-input
              id="student-email-input"
              v-model="loginForm.email"
              placeholder="e.g. student@student.com"
              size="large"
              clearable
          >
            <template #prefix>
              <i class="fi fi-rr-envelope text-slate-400 mr-1 text-base"></i>
            </template>
          </el-input>

          <p
              v-if="loginErrors.email"
              class="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1"
          >
            <i class="fi fi-rr-info text-rose-400"></i>
            {{ loginErrors.email }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label
              class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              for="student-password-input"
          >
            Password
          </label>

          <el-input
              id="student-password-input"
              v-model="loginForm.password"
              type="password"
              placeholder="Enter your password"
              size="large"
              show-password
          >
            <template #prefix>
              <i class="fi fi-rr-lock text-slate-400 mr-1 text-base"></i>
            </template>
          </el-input>

          <p
              v-if="loginErrors.password"
              class="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1"
          >
            <i class="fi fi-rr-info text-rose-400"></i>
            {{ loginErrors.password }}
          </p>
        </div>

        <!-- Submit Button -->
        <button
            id="student-login-submit-btn"
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
          >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            ></circle>

            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>

          <span>{{ isLoading ? 'Signing In...' : 'Sign In' }}</span>
        </button>

        <div class="flex items-center gap-3 py-1">
          <div class="h-px flex-1 bg-slate-200"></div>
          <span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        or
      </span>
          <div class="h-px flex-1 bg-slate-200"></div>
        </div>

        <!-- Google Sign-In -->
        <button
            id="student-google-signin-btn"
            type="button"
            :disabled="isLoading"
            class="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            @click="handleGoogleSignIn"
        >
          <svg
              class="h-5 w-5"
              viewBox="0 0 24 24"
              aria-hidden="true"
          >
            <path
                fill="#4285F4"
                d="M21.35 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.22Z"
            />
            <path
                fill="#34A853"
                d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.5Z"
            />
            <path
                fill="#FBBC05"
                d="M6.54 13.59a5.86 5.86 0 0 1 0-3.18V7.88H3.3a9.75 9.75 0 0 0 0 8.24l3.24-2.53Z"
            />
            <path
                fill="#EA4335"
                d="M12 6.38c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.48 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8.1 9.46 6.38 12 6.38Z"
            />
          </svg>

          <span>
        {{ isLoading ? 'Connecting...' : 'Continue with Google' }}
      </span>
        </button>

        <!-- Switch to Register -->
        <div class="text-center text-xs text-slate-500 pt-1">
          <span>New student? </span>

          <button
              type="button"
              class="text-brand-600 font-bold hover:underline underline-offset-4 cursor-pointer"
              @click="switchMode('register')"
          >
            Create an account
          </button>
        </div>
      </form>

      <!-- Register Form -->
      <form
          v-else
          id="student-register-form"
          class="space-y-4"
          @submit.prevent="handleRegister"
      >
        <!-- Full Name -->
        <div>
          <label
              class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              for="student-register-name"
          >
            Full Name <span class="text-rose-500">*</span>
          </label>

          <el-input
              id="student-register-name"
              v-model="registerForm.name"
              placeholder="e.g. Alex Tan"
              size="large"
              clearable
          >
            <template #prefix>
              <i class="fi fi-rr-user text-slate-400 mr-1 text-base"></i>
            </template>
          </el-input>

          <p
              v-if="registerErrors.name"
              class="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1"
          >
            <i class="fi fi-rr-info text-rose-400"></i>
            {{ registerErrors.name }}
          </p>
        </div>

        <!-- Email -->
        <div>
          <label
              class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              for="student-register-email"
          >
            Email <span class="text-rose-500">*</span>
          </label>

          <el-input
              id="student-register-email"
              v-model="registerForm.email"
              placeholder="e.g. alex@student.com"
              size="large"
              clearable
          >
            <template #prefix>
              <i class="fi fi-rr-envelope text-slate-400 mr-1 text-base"></i>
            </template>
          </el-input>

          <p
              v-if="registerErrors.email"
              class="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1"
          >
            <i class="fi fi-rr-info text-rose-400"></i>
            {{ registerErrors.email }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label
              class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              for="student-register-password"
          >
            Password <span class="text-rose-500">*</span>
          </label>

          <el-input
              id="student-register-password"
              v-model="registerForm.password"
              type="password"
              placeholder="At least 6 characters"
              size="large"
              show-password
          >
            <template #prefix>
              <i class="fi fi-rr-lock text-slate-400 mr-1 text-base"></i>
            </template>
          </el-input>

          <p
              v-if="registerErrors.password"
              class="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1"
          >
            <i class="fi fi-rr-info text-rose-400"></i>
            {{ registerErrors.password }}
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label
              class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5"
              for="student-register-confirm"
          >
            Confirm Password <span class="text-rose-500">*</span>
          </label>

          <el-input
              id="student-register-confirm"
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="Re-enter password"
              size="large"
              show-password
          >
            <template #prefix>
              <i class="fi fi-rr-check text-slate-400 mr-1 text-base"></i>
            </template>
          </el-input>

          <p
              v-if="registerErrors.confirmPassword"
              class="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1"
          >
            <i class="fi fi-rr-info text-rose-400"></i>
            {{ registerErrors.confirmPassword }}
          </p>
        </div>

        <!-- Register Submit -->
        <button
            id="student-register-submit-btn"
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
          >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            ></circle>

            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>

          <span>
        {{ isLoading ? 'Creating Account...' : 'Register Student Account' }}
      </span>
        </button>

        <!-- Switch to Sign In -->
        <div class="text-center text-xs text-slate-500 pt-1">
          <span>Already have an account? </span>

          <button
              type="button"
              class="text-brand-600 font-bold hover:underline underline-offset-4 cursor-pointer"
              @click="switchMode('login')"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import studentConnect from '@/api'
import { login, register, signInWithGoogle } from '@/services/auth'

const route = useRoute()
const router = useRouter()

const isLoading = ref(false)
const mode = ref('login')

const loginForm = reactive({
  email: '',
  password: ''
})

const loginErrors = reactive({
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

const registerErrors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

/**
 * Toggles the authentication form between sign-in and registration modes.
 *
 * @param {'login'|'register'} newMode - The mode to activate.
 * @returns {void}
 */
function switchMode(newMode) {
  mode.value = newMode

  loginErrors.email = ''
  loginErrors.password = ''

  registerErrors.name = ''
  registerErrors.email = ''
  registerErrors.password = ''
  registerErrors.confirmPassword = ''
}

/**
 * Validates an email address against a standard email format.
 *
 * @param {string} email - Email address to validate.
 * @returns {boolean} True when the email format is valid.
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

/**
 * Converts Firebase, backend, and browser authentication errors
 * into safe user-facing messages.
 *
 * @param {Error & {code?: string}} error - Authentication error.
 * @returns {string} Safe user-facing error message.
 */
function getAuthErrorMessage(error) {
  const errorCode = error?.code || ''

  const messages = {
    'auth/popup-closed-by-user':
        'Google sign-in was cancelled.',

    'auth/cancelled-popup-request':
        'Google sign-in was cancelled.',

    'auth/popup-blocked':
        'Google sign-in was blocked by your browser. Please allow popups and try again.',

    'auth/account-exists-with-different-credential':
        'An account already exists with this email using a different sign-in method.',

    'auth/credential-already-in-use':
        'This Google account is already associated with another account.',

    'auth/operation-not-allowed':
        'Google sign-in is currently unavailable.',

    'auth/network-request-failed':
        'Network error. Please check your internet connection and try again.',

    'auth/invalid-credential':
        'Invalid email or password.',

    'auth/invalid-email':
        'Please enter a valid email address.',

    'auth/email-already-in-use':
        'An account already exists for this email.',

    'auth/weak-password':
        'Password must be at least 6 characters.',

    'auth/too-many-requests':
        'Too many attempts. Please try again later.',

    'auth/user-disabled':
        'This account has been disabled.',

    'auth/user-not-found':
        'Account not found.',

    'auth/user-token-expired':
        'Your session has expired. Please sign in again.',

    'auth/web-storage-unsupported':
        'Your browser does not support the required sign-in storage.',

    'auth/unauthorized-domain':
        'This website is not authorized for Google sign-in.',

    'auth/invalid-api-key':
        'Authentication is temporarily unavailable.',

    'auth/app-not-authorized':
        'This application is not authorized for authentication.'
  }

  if (messages[errorCode]) {
    return messages[errorCode]
  }

  if (
      error?.message &&
      (
          error.message.includes('Authentication is required') ||
          error.message.includes('Backend returned')
      )
  ) {
    return 'Unable to connect to the Student Connect server. Please try again.'
  }

  if (
      error?.name === 'TypeError' ||
      error?.message?.toLowerCase().includes('network')
  ) {
    return 'Network error. Please check your internet connection and try again.'
  }

  return 'Unable to sign in. Please try again.'
}

/**
 * Signs in with Google and initializes the authenticated backend profile.
 *
 * @returns {Promise<void>} Resolves after authentication and navigation.
 */
async function handleGoogleSignIn() {
  if (isLoading.value) {
    return
  }

  isLoading.value = true

  try {
    const credential = await signInWithGoogle()

    if (!credential?.user) {
      throw new Error('Google authentication did not return a user.')
    }

    await studentConnect.getCurrentUserProfile()

    const destination =
        typeof route.query.redirect === 'string'
            ? route.query.redirect
            : '/carpool'

    ElMessage.success(
        `Welcome, ${
            credential.user.displayName ||
            credential.user.email ||
            'Student'
        }!`
    )

    await router.push(destination)
  } catch (error) {
    console.error('Google sign-in failed:', error)
    ElMessage.error(getAuthErrorMessage(error))
  } finally {
    isLoading.value = false
  }
}

/**
 * Handles submission of the student login form.
 *
 * @returns {Promise<void>}
 */
async function handleLogin() {
  loginErrors.email = ''
  loginErrors.password = ''

  if (!loginForm.email || !loginForm.email.trim()) {
    loginErrors.email = 'Email cannot be empty'
  } else if (!validateEmail(loginForm.email.trim())) {
    loginErrors.email = 'Please enter a valid email address'
  }

  if (!loginForm.password) {
    loginErrors.password = 'Password cannot be empty'
  }

  if (loginErrors.email || loginErrors.password) {
    return
  }

  isLoading.value = true

  try {
    const credential = await login(
        loginForm.email.trim(),
        loginForm.password
    )

    const destination =
        typeof route.query.redirect === 'string'
            ? route.query.redirect
            : '/carpool'

    ElMessage.success(
        `Welcome back, ${
            credential.user.displayName ||
            credential.user.email ||
            'Student'
        }!`
    )

    await router.push(destination)
  } catch (error) {
    ElMessage.error(getAuthErrorMessage(error))
  } finally {
    isLoading.value = false
  }
}

/**
 * Handles submission of the student registration form.
 *
 * @returns {Promise<void>}
 */
async function handleRegister() {
  registerErrors.name = ''
  registerErrors.email = ''
  registerErrors.password = ''
  registerErrors.confirmPassword = ''

  if (!registerForm.name || !registerForm.name.trim()) {
    registerErrors.name = 'Please enter your full name'
  }

  if (!registerForm.email || !registerForm.email.trim()) {
    registerErrors.email = 'Please enter your student email'
  } else if (!validateEmail(registerForm.email.trim())) {
    registerErrors.email = 'Please enter a valid email address'
  }

  if (!registerForm.password || registerForm.password.length < 6) {
    registerErrors.password = 'Password must be at least 6 characters'
  }

  if (registerForm.password !== registerForm.confirmPassword) {
    registerErrors.confirmPassword = 'Passwords do not match'
  }

  if (
      registerErrors.name ||
      registerErrors.email ||
      registerErrors.password ||
      registerErrors.confirmPassword
  ) {
    return
  }

  isLoading.value = true

  try {
    const credential = await register(
        registerForm.email.trim(),
        registerForm.password,
        registerForm.name.trim()
    )

    const destination =
        typeof route.query.redirect === 'string'
            ? route.query.redirect
            : '/carpool'

    ElMessage.success(
        `Account created successfully! Welcome, ${
            credential.user.displayName || 'Student'
        }!`
    )

    await router.push(destination)
  } catch (error) {
    ElMessage.error(getAuthErrorMessage(error))
  } finally {
    isLoading.value = false
  }
}
</script>
