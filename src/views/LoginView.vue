<template>
  <div class="min-h-[85vh] flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-6">
      <!-- Header & Branding -->
      <div class="text-center space-y-3">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 text-white mx-auto mb-1">
          <svg class="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Student Connect</h1>
          <p class="text-slate-500 font-medium text-sm mt-1">Students helping students.</p>
        </div>
      </div>

      <!-- Mode Switcher: Sign In vs Register -->
      <div class="bg-slate-100 p-1 rounded-2xl flex gap-1">
        <button
          type="button"
          :class="[
            'flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center',
            mode === 'login'
              ? 'bg-white text-indigo-700 shadow-xs'
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
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          ]"
          @click="switchMode('register')"
        >
          Register Account
        </button>
      </div>

      <!-- Login Form -->
      <form v-if="mode === 'login'" id="student-login-form" @submit.prevent="handleLogin" class="space-y-4">
        <!-- Student Email -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" for="student-email-input">
            Student Email
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
          <p v-if="loginErrors.email" class="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
            <i class="fi fi-rr-info text-rose-400"></i>
            {{ loginErrors.email }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <div class="flex justify-between items-center mb-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-700" for="student-password-input">
              Password
            </label>
          </div>
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
          <p v-if="loginErrors.password" class="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
            <i class="fi fi-rr-info text-rose-400"></i>
            {{ loginErrors.password }}
          </p>
        </div>

        <!-- Submit Button -->
        <button
          id="student-login-submit-btn"
          type="submit"
          :disabled="isLoading"
          class="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isLoading ? 'Signing In...' : 'Sign In' }}</span>
        </button>

        <!-- Don't have an account / Create account -->
        <div class="text-center text-xs text-slate-500 pt-1">
          <span>New student? </span>
          <button
            type="button"
            class="text-indigo-600 font-bold hover:underline underline-offset-4 cursor-pointer"
            @click="switchMode('register')"
          >
            Create an account
          </button>
        </div>
      </form>

      <!-- Register Form -->
      <form v-else id="student-register-form" @submit.prevent="handleRegister" class="space-y-4">
        <!-- Full Name -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" for="student-register-name">
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
          <p v-if="registerErrors.name" class="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
            <i class="fi fi-rr-info text-rose-400"></i>
            {{ registerErrors.name }}
          </p>
        </div>

        <!-- Student Email -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" for="student-register-email">
            Student Email <span class="text-rose-500">*</span>
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
          <p v-if="registerErrors.email" class="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
            <i class="fi fi-rr-info text-rose-400"></i>
            {{ registerErrors.email }}
          </p>
        </div>

        <!-- Matric No (Optional) -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" for="student-register-matric">
            Matric / Student ID (Optional)
          </label>
          <el-input
            id="student-register-matric"
            v-model="registerForm.matricNo"
            placeholder="e.g. MS202499"
            size="large"
            clearable
          >
            <template #prefix>
              <i class="fi fi-rr-id-badge text-slate-400 mr-1 text-base"></i>
            </template>
          </el-input>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" for="student-register-password">
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
          <p v-if="registerErrors.password" class="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
            <i class="fi fi-rr-info text-rose-400"></i>
            {{ registerErrors.password }}
          </p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5" for="student-register-confirm">
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
          <p v-if="registerErrors.confirmPassword" class="text-xs font-semibold text-rose-500 mt-1.5 flex items-center gap-1">
            <i class="fi fi-rr-info text-rose-400"></i>
            {{ registerErrors.confirmPassword }}
          </p>
        </div>

        <!-- Register Submit Button -->
        <button
          id="student-register-submit-btn"
          type="submit"
          :disabled="isLoading"
          class="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isLoading ? 'Creating Account...' : 'Register Student Account' }}</span>
        </button>

        <!-- Switch to login -->
        <div class="text-center text-xs text-slate-500 pt-1">
          <span>Already have an account? </span>
          <button
            type="button"
            class="text-indigo-600 font-bold hover:underline underline-offset-4 cursor-pointer"
            @click="switchMode('login')"
          >
            Sign in
          </button>
        </div>
      </form>

      <!-- Demo Account Quick Hint -->
      <div v-if="mode === 'login'" class="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs space-y-2">
        <div class="flex items-center justify-between text-slate-700">
          <span class="font-bold uppercase tracking-wider text-[10px] text-slate-400">Prototype Demo Credentials</span>
          <button
            type="button"
            class="text-indigo-600 font-semibold hover:underline text-[11px] cursor-pointer"
            @click="fillDemoAccount"
          >
            Quick Fill
          </button>
        </div>
        <div class="font-mono text-slate-700 text-xs bg-white p-2 rounded-lg border border-slate-200 flex flex-col gap-0.5">
          <div><span class="text-slate-400">Email:</span> student@student.com</div>
          <div><span class="text-slate-400">Password:</span> 123456</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import database from '../database'

const router = useRouter()
const isLoading = ref(false)
const mode = ref('login') // 'login' or 'register'

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

function switchMode(newMode) {
  mode.value = newMode
  loginErrors.email = ''
  loginErrors.password = ''
  registerErrors.name = ''
  registerErrors.email = ''
  registerErrors.password = ''
  registerErrors.confirmPassword = ''
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

function fillDemoAccount() {
  loginForm.email = 'student@student.com'
  loginForm.password = '123456'
  loginErrors.email = ''
  loginErrors.password = ''
  ElMessage({
    message: 'Demo credentials loaded!',
    type: 'info',
    duration: 1800
  })
}

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
    const user = await database.auth.login(loginForm.email, loginForm.password)
    localStorage.setItem('student_logged_in', 'true')
    localStorage.setItem('student_user_id', user.id)
    localStorage.setItem('student_user_name', user.name)
    localStorage.setItem('student_user_email', user.email)
    localStorage.setItem('student_user_matric', user.matricNo || '')

    ElMessage.success(`Welcome back, ${user.name}!`)
    router.push('/carpool')
  } catch (err) {
    ElMessage.error(err.message || 'Invalid login credentials')
  } finally {
    isLoading.value = false
  }
}

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
    const user = await database.auth.register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
      matricNo: registerForm.matricNo
    })

    localStorage.setItem('student_logged_in', 'true')
    localStorage.setItem('student_user_id', user.id)
    localStorage.setItem('student_user_name', user.name)
    localStorage.setItem('student_user_email', user.email)
    localStorage.setItem('student_user_matric', user.matricNo || '')

    ElMessage.success(`Account created successfully! Welcome, ${user.name}!`)
    router.push('/carpool')
  } catch (err) {
    ElMessage.error(err.message || 'Registration failed')
  } finally {
    isLoading.value = false
  }
}
</script>
