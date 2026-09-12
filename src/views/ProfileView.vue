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

    <!-- My Services -->
    <section
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div class="flex items-center gap-2">
            <div
                class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"
            >
              <i class="fi fi-rr-apps"></i>
            </div>

            <div>
              <h3 class="text-sm font-bold uppercase tracking-wider text-slate-800">
                My Services
              </h3>

              <p class="mt-0.5 text-xs text-slate-400">
                Services you created or joined
              </p>
            </div>
          </div>
        </div>

        <el-button
            size="small"
            :loading="servicesLoading"
            :disabled="servicesLoading"
            @click="loadMyServices"
        >
          <i
              v-if="!servicesLoading"
              class="fi fi-rr-refresh mr-1.5"
          ></i>
          Refresh
        </el-button>
      </div>

      <!-- Loading -->
      <div
          v-if="servicesLoading"
          class="space-y-3"
      >
        <div
            v-for="index in 5"
            :key="index"
            class="h-20 animate-pulse rounded-xl bg-slate-100"
        ></div>
      </div>

      <!-- Initial Error -->
      <div
          v-else-if="servicesLoadError && !hasMyServices"
          class="rounded-xl border border-rose-100 bg-rose-50 p-5 text-center"
      >
        <i class="fi fi-rr-exclamation text-xl text-rose-500"></i>

        <p class="mt-2 text-sm font-semibold text-rose-700">
          Unable to load your services
        </p>

        <p class="mt-1 text-xs text-rose-600">
          Some service history may be temporarily unavailable.
        </p>

        <el-button
            class="mt-3"
            size="small"
            type="danger"
            plain
            @click="loadMyServices"
        >
          Try Again
        </el-button>
      </div>

      <div
          v-else
          class="space-y-7"
      >
        <!-- Partial Error -->
        <div
            v-if="servicesLoadError"
            class="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5"
        >
          <i class="fi fi-rr-info mt-0.5 text-amber-600"></i>

          <p class="text-xs leading-relaxed text-amber-700">
            Some service types could not be loaded. The available services are shown below.
          </p>
        </div>

        <!-- Summary -->
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div
              v-for="summary in serviceSummary"
              :key="summary.label"
              class="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
          >
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {{ summary.label }}
            </p>

            <p class="mt-1 text-lg font-bold leading-none text-slate-800">
              {{ summary.value }}
            </p>
          </div>
        </div>

        <!-- Created -->
        <div>
          <div class="mb-3 flex items-end justify-between">
            <div>
              <h4 class="text-sm font-bold text-slate-800">
                Created
              </h4>

              <p class="mt-0.5 text-xs text-slate-400">
                Services you created
              </p>
            </div>

            <span class="text-xs font-semibold text-slate-400">
          {{ createdServiceCount }}
        </span>
          </div>

          <div class="overflow-hidden rounded-xl border border-slate-200">
            <template
                v-for="collection in createdServiceCollections"
                :key="`created-${collection.key}`"
            >
              <div
                  v-if="collection.items.length"
                  class="divide-y divide-slate-100"
              >
                <div
                    v-for="item in collection.items"
                    :key="`created-${collection.key}-${item.id}`"
                    class="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50"
                >
                  <!-- Service Icon -->
                  <div
                      class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:flex"
                      :class="serviceTypeIconClass(collection.key)"
                  >
                    <i :class="serviceTypeIcon(collection.key)"></i>
                  </div>

                  <!-- Main -->
                  <div class="min-w-0 flex-1">
                    <div class="flex min-w-0 items-center gap-2">
                  <span
                      class="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400"
                  >
                    {{ collection.title }}
                  </span>

                      <span
                          class="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                          :class="serviceStatusClass(item, collection.key)"
                      >
                    {{ serviceStatusLabel(item, collection.key) }}
                  </span>
                    </div>

                    <h5 class="mt-1 truncate text-sm font-semibold text-slate-800">
                      {{ serviceTitle(item, collection.key) }}
                    </h5>

                    <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                  <span class="inline-flex items-center gap-1">
                    <i class="fi fi-rr-calendar"></i>
                    {{ serviceDate(item, collection.key) }}
                  </span>

                      <span
                          v-if="serviceTime(item, collection.key)"
                          class="inline-flex items-center gap-1"
                      >
                    <i class="fi fi-rr-clock"></i>
                    {{ serviceTime(item, collection.key) }}
                  </span>

                      <span
                          v-if="serviceMeta(item, collection.key)"
                          class="inline-flex items-center gap-1"
                      >
                    <i :class="serviceMetaIcon(collection.key)"></i>
                    {{ serviceMeta(item, collection.key) }}
                  </span>
                    </div>
                  </div>

                  <!-- Action -->
                  <el-button
                      size="small"
                      plain
                      class="!shrink-0"
                      @click="openService(collection.route, item.id)"
                  >
                    <span class="hidden sm:inline">View</span>
                    <i class="fi fi-rr-arrow-small-right sm:ml-1"></i>
                  </el-button>
                </div>
              </div>
            </template>

            <!-- Empty -->
            <div
                v-if="!createdServiceCount"
                class="px-4 py-8 text-center"
            >
              <i class="fi fi-rr-layer-plus text-lg text-slate-300"></i>

              <p class="mt-2 text-xs font-medium text-slate-500">
                You haven't created any services yet.
              </p>
            </div>
          </div>
        </div>

        <!-- Joined -->
        <div>
          <div class="mb-3 flex items-end justify-between">
            <div>
              <h4 class="text-sm font-bold text-slate-800">
                Joined
              </h4>

              <p class="mt-0.5 text-xs text-slate-400">
                Services you participated in
              </p>
            </div>

            <span class="text-xs font-semibold text-slate-400">
          {{ joinedServiceCount }}
        </span>
          </div>

          <div class="overflow-hidden rounded-xl border border-slate-200">
            <template
                v-for="collection in joinedServiceCollections"
                :key="`joined-${collection.key}`"
            >
              <div
                  v-if="collection.items.length"
                  class="divide-y divide-slate-100"
              >
                <div
                    v-for="item in collection.items"
                    :key="`joined-${collection.key}-${item.id}`"
                    class="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50"
                >
                  <!-- Service Icon -->
                  <div
                      class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:flex"
                      :class="serviceTypeIconClass(collection.key)"
                  >
                    <i :class="serviceTypeIcon(collection.key)"></i>
                  </div>

                  <!-- Main -->
                  <div class="min-w-0 flex-1">
                    <div class="flex min-w-0 items-center gap-2">
                  <span
                      class="shrink-0 text-[10px] font-bold uppercase tracking-wider text-slate-400"
                  >
                    {{ collection.title }}
                  </span>

                      <span
                          class="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                          :class="serviceStatusClass(item, collection.key)"
                      >
                    {{ serviceStatusLabel(item, collection.key) }}
                  </span>
                    </div>

                    <h5 class="mt-1 truncate text-sm font-semibold text-slate-800">
                      {{ serviceTitle(item, collection.key) }}
                    </h5>

                    <div class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                  <span class="inline-flex items-center gap-1">
                    <i class="fi fi-rr-calendar"></i>
                    {{ serviceDate(item, collection.key) }}
                  </span>

                      <span
                          v-if="serviceTime(item, collection.key)"
                          class="inline-flex items-center gap-1"
                      >
                    <i class="fi fi-rr-clock"></i>
                    {{ serviceTime(item, collection.key) }}
                  </span>

                      <span
                          v-if="serviceMeta(item, collection.key)"
                          class="inline-flex items-center gap-1"
                      >
                    <i :class="serviceMetaIcon(collection.key)"></i>
                    {{ serviceMeta(item, collection.key) }}
                  </span>
                    </div>
                  </div>

                  <!-- Action -->
                  <el-button
                      size="small"
                      plain
                      class="!shrink-0"
                      @click="openService(collection.route, item.id)"
                  >
                    <span class="hidden sm:inline">View</span>
                    <i class="fi fi-rr-arrow-small-right sm:ml-1"></i>
                  </el-button>
                </div>
              </div>
            </template>

            <!-- Empty -->
            <div
                v-if="!joinedServiceCount"
                class="px-4 py-8 text-center"
            >
              <i class="fi fi-rr-users text-lg text-slate-300"></i>

              <p class="mt-2 text-xs font-medium text-slate-500">
                You haven't joined any services yet.
              </p>
            </div>
          </div>
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

import CarpoolCard from '@/components/carpool/CarpoolCard.vue'
import ErrandCard from '@/components/errands/ErrandCard.vue'
import StudyGroupCard from '@/components/study/StudyGroupCard.vue'
import ActivitiesCard from '@/components/activities/ActivitiesCard.vue'

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
const servicesLoading = ref(false)
const servicesLoadError = ref(false)
const carpools = ref([])
const errands = ref([])
const studyGroups = ref([])
const activities = ref([])

const editForm = reactive({
  name: '',
  phone: ''
})

const createdServiceCount = computed(() => {
  return createdServiceCollections.value.reduce(
    (total, collection) => total + collection.items.length,
    0
  )
})

const joinedServiceCount = computed(() => {
  return joinedServiceCollections.value.reduce(
    (total, collection) => total + collection.items.length,
    0
  )
})

function serviceTitle(item, type) {
  if (type === 'carpool') {
    return item.destination || item.title || 'Carpool'
  }

  if (type === 'errands') {
    return item.title || 'Errand'
  }

  if (type === 'study') {
    return item.title || item.subject || 'Study'
  }

  if (type === 'activities') {
    return item.title || 'Activity'
  }

  return 'Service'
}

function serviceDate(item, type) {
  const timestamp = getServiceTimestamp(item, type)

  if (!timestamp) {
    return 'Date unavailable'
  }

  return new Intl.DateTimeFormat('en-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(timestamp))
}

function serviceTime(item, type) {
  const timestamp = getServiceTimestamp(item, type)

  if (!timestamp) {
    return ''
  }

  return new Intl.DateTimeFormat('en-MY', {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(timestamp))
}

function getParticipantCount(item) {
  return item.participantIds ? Object.keys(item.participantIds).length : 0
}

function getMemberCount(item) {
  return item.memberIds ? Object.keys(item.memberIds).length : 0
}

function getServiceTimestamp(item, type) {
  if (type === 'carpool') {
    return normalizeTimestamp(item.departure)
  }

  if (type === 'errands') {
    return normalizeTimestamp(item.deadline)
  }

  if (type === 'study') {
    return normalizeTimestamp(item.schedule?.startTime)
  }

  if (type === 'activities') {
    return normalizeTimestamp(item.eventDate)
  }

  return null
}

function normalizeTimestamp(value) {
  if (!value) {
    return null
  }

  if (typeof value === 'number') {
    return value < 10000000000 ? value * 1000 : value
  }

  const timestamp = new Date(value).getTime()

  return Number.isNaN(timestamp) ? null : timestamp
}

function serviceMeta(item, type) {
  if (type === 'carpool') {
    const participants = getParticipantCount(item)
    const capacity = Number(item.capacity || 0)

    return capacity
      ? `${participants}/${capacity} joined`
: `${participants} joined`
}

if (type === 'errands') {
  return item.location || ''
}

if (type === 'study') {
  const members = getMemberCount(item)
  const capacity = Number(item.capacity || 0)

  return capacity
      ? `${members}/${capacity} members`
      : `${members} members`
}

if (type === 'activities') {
  return item.location || ''
}

return ''
}

function serviceMetaIcon(type) {
  if (type === 'carpool') {
    return 'fi fi-rr-users'
  }

  if (type === 'errands') {
    return 'fi fi-rr-marker'
  }

  if (type === 'study') {
    return 'fi fi-rr-users-alt'
  }

  if (type === 'activities') {
    return 'fi fi-rr-marker'
  }

  return 'fi fi-rr-info'
}

function serviceTypeIcon(type) {
  if (type === 'carpool') {
    return 'fi fi-rr-car'
  }

  if (type === 'errands') {
    return 'fi fi-rr-shopping-bag'
  }

  if (type === 'study') {
    return 'fi fi-rr-book-alt'
  }

  if (type === 'activities') {
    return 'fi fi-rr-calendar'
  }

  return 'fi fi-rr-apps'
}

function serviceTypeIconClass(type) {
  if (type === 'carpool') {
    return 'bg-indigo-50 text-indigo-600'
  }

  if (type === 'errands') {
    return 'bg-amber-50 text-amber-600'
  }

  if (type === 'study') {
    return 'bg-emerald-50 text-emerald-600'
  }

  if (type === 'activities') {
    return 'bg-indigo-50 text-indigo-600'
  }

  return 'bg-slate-50 text-slate-600'
}

/**
 * Returns the current Firebase user's identifier and display details.
 *
 * @returns {{id: string, name: string}} Current authenticated user details.
 */
const currentUser = computed(() => ({
  id: String(user.value?.uid || ''),
  name: user.value?.displayName || user.value?.email || 'Student'
}))

/**
 * Extracts a comparable identifier from a backend user reference.
 *
 * @param {Object|string|null} reference - Backend user reference.
 * @returns {string} Comparable user identifier.
 */
function getReferenceId(reference) {
  if (!reference) return ''
  if (typeof reference === 'string') return reference

  return String(
      reference.uid ||
      reference.id ||
      reference.userId ||
      reference.firebaseUid ||
      ''
  )
}

/**
 * Extracts an array from the standard or legacy list response shape.
 *
 * @param {Object|Array|null} response - API response.
 * @returns {Array<Object>} Service records.
 */
function extractServiceList(response) {
  if (Array.isArray(response)) return response
  if (Array.isArray(response?.data)) return response.data
  if (Array.isArray(response?.data?.activities)) return response.data.activities
  return []
}

/**
 * Returns participant identifiers from array or object-map service data.
 *
 * @param {Object|Array|null} participants - Participant collection.
 * @returns {string[]} Participant identifiers.
 */
function getParticipantIds(participants) {
  if (Array.isArray(participants)) {
    return participants
        .map(getReferenceId)
        .filter(Boolean)
  }

  if (participants && typeof participants === 'object') {
    return Object.entries(participants)
        .map(([key, value]) => getReferenceId(value) || key)
        .filter(Boolean)
  }

  return []
}

/**
 * Returns the service timestamp used for newest-first sorting.
 *
 * @param {*} value - Timestamp in seconds, milliseconds, ISO, or object form.
 * @returns {number} Timestamp in milliseconds, or zero when invalid.
 */
function normalizeServiceDate(value) {
  if (value && typeof value === 'object') {
    value = value.toDate
        ? value.toDate()
        : value.timestamp || value.seconds || value.value
  }

  if (value instanceof Date) {
    return value.getTime()
  }

  if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) {
    const numericValue = Number(value)
    if (!Number.isFinite(numericValue)) return 0
    return numericValue < 100000000000 ? numericValue * 1000 : numericValue
  }

  const parsed = Date.parse(value || '')
  return Number.isFinite(parsed) ? parsed : 0
}

/**
 * Sorts service records by most recently updated, then created date.
 *
 * @param {Object} first - First service record.
 * @param {Object} second - Second service record.
 * @returns {number} Sort comparison result.
 */
function compareServices(first, second) {
  const firstDate = normalizeServiceDate(first?.updatedAt || first?.createdAt)
  const secondDate = normalizeServiceDate(second?.updatedAt || second?.createdAt)
  return secondDate - firstDate
}

/**
 * Returns the normalized display status for a profile service.
 *
 * @param {Object} service - Service record.
 * @param {string} type - Service type key.
 * @returns {string} Status key used by the profile badge.
 */
function getServiceStatusKey(service, type) {
  const explicitStatus = String(service?.status || '').toLowerCase()

  if (['cancelled', 'expired', 'completed', 'accepted'].includes(explicitStatus)) {
    return explicitStatus
  }

  if (type === 'errands') {
    const deadline = normalizeServiceDate(service?.deadline)
    return deadline > 0 && deadline < Date.now() ? 'expired' : 'open'
  }

  if (type === 'carpool') {
    const departure = normalizeServiceDate(service?.departure)
    if (departure > 0 && departure < Date.now()) return 'expired'

    const capacity = Number(service?.capacity)
    const participantCount = getParticipantIds(service?.participants).length
    return capacity > 0 && participantCount >= capacity ? 'full' : 'open'
  }

  if (type === 'activities') {
    const registrationDeadline = normalizeServiceDate(service?.registrationDeadline)
    const eventDate = normalizeServiceDate(service?.eventDate)
    return (registrationDeadline > 0 && registrationDeadline < Date.now()) ||
      (eventDate > 0 && eventDate < Date.now()) ? 'expired' : 'open'
  }

  const capacity = Number(service?.capacity)
  const memberCount = getParticipantIds(service?.members || service?.participants).length
  const startTime = normalizeServiceDate(service?.schedule?.startTime)

  if (startTime > 0 && startTime < Date.now()) return 'expired'
  return capacity > 0 && memberCount >= capacity ? 'full' : 'open'
}

/**
 * Returns the human-readable status label for a profile service.
 *
 * @param {Object} service - Service record.
 * @param {string} type - Service type key.
 * @returns {string} Visible status label.
 */
function serviceStatusLabel(service, type) {
  const labels = {
    open: 'Open',
    full: 'Full',
    accepted: 'Accepted',
    completed: 'Completed',
    cancelled: 'Cancelled',
    expired: 'Expired'
  }
  return labels[getServiceStatusKey(service, type)] || 'Open'
}

/**
 * Returns the visual classes for a service status badge.
 *
 * @param {Object} service - Service record.
 * @param {string} type - Service type key.
 * @returns {string} Tailwind classes for the status badge.
 */
function serviceStatusClass(service, type) {
  const classes = {
    open: 'bg-emerald-50 text-emerald-700',
    full: 'bg-slate-100 text-slate-600',
    accepted: 'bg-blue-50 text-blue-700',
    completed: 'bg-slate-100 text-slate-500',
    cancelled: 'bg-rose-50 text-rose-700',
    expired: 'bg-amber-50 text-amber-700'
  }
  return classes[getServiceStatusKey(service, type)] || classes.open
}

/**
 * Determines whether a service belongs to the current user as a carpool owner.
 *
 * @param {Object} carpool - Carpool service.
 * @returns {boolean} True when the current user created the carpool.
 */
function isCreatedCarpool(carpool) {
  return getReferenceId(carpool?.owner) === currentUser.value.id ||
    getReferenceId(carpool?.ownerId) === currentUser.value.id
}

/**
 * Determines whether a service was joined by the current user.
 *
 * @param {Object} service - Service record.
 * @param {string[]} participantIds - Participant identifiers.
 * @returns {boolean} True when the current user participates.
 */
function includesCurrentUser(service, participantIds) {
  return Boolean(
      currentUser.value.id &&
      participantIds.includes(currentUser.value.id)
  )
}

/**
 * Determines whether the current user created an errand.
 *
 * @param {Object} errand - Errand service.
 * @returns {boolean} True when the current user is the requester.
 */
function isCreatedErrand(errand) {
  return getReferenceId(errand?.requester) === currentUser.value.id ||
    getReferenceId(errand?.requesterId) === currentUser.value.id
}

/**
 * Determines whether the current user created a study group.
 *
 * @param {Object} group - Study group service.
 * @returns {boolean} True when the current user is the owner.
 */
function isCreatedStudy(group) {
  return getReferenceId(group?.owner) === currentUser.value.id ||
    getReferenceId(group?.ownerId) === currentUser.value.id
}

/**
 * Determines whether the current user created an activity announcement.
 *
 * @param {Object} activity - Activity announcement.
 * @returns {boolean} True when the current user is the organizer.
 */
function isCreatedActivity(activity) {
  return getReferenceId(activity?.owner) === currentUser.value.id ||
    getReferenceId(activity?.ownerId) === currentUser.value.id
}

/**
 * Loads all service collections without applying the list-page archive filter.
 *
 * Each service endpoint is independent so profile information and successful
 * service responses remain usable when one endpoint is unavailable.
 *
 * @returns {Promise<void>} Resolves after service collections are refreshed.
 */
async function loadMyServices() {
  servicesLoading.value = true
  servicesLoadError.value = false

  try {
    const results = await Promise.allSettled([
      studentConnect.getAllCarPoolList(),
      studentConnect.getAllErrands(),
      studentConnect.getAllStudyGroups(),
      studentConnect.getAllActivities()
    ])

    const [carpoolResult, errandResult, studyResult, activityResult] = results
    const failedResults = results.filter((result) => result.status === 'rejected')

    carpools.value = carpoolResult.status === 'fulfilled'
        ? extractServiceList(carpoolResult.value)
        : []
    errands.value = errandResult.status === 'fulfilled'
        ? extractServiceList(errandResult.value)
        : []
    studyGroups.value = studyResult.status === 'fulfilled'
        ? extractServiceList(studyResult.value)
        : []
    activities.value = activityResult.status === 'fulfilled'
        ? extractServiceList(activityResult.value)
        : []

    if (failedResults.length) {
      failedResults.forEach((result) => {
        console.error('Failed to load a My Services collection:', result.reason)
      })
      servicesLoadError.value = true
    }
  } finally {
    servicesLoading.value = false
  }
}

/**
 * Returns all created services grouped for the profile UI.
 *
 * @returns {Array<Object>} Created service collection definitions.
 */
const createdServiceCollections = computed(() => {
  return [
    {
      key: 'carpool',
      title: 'Carpool',
      prop: 'carpool',
      route: '/carpool',
      component: CarpoolCard,
      items: carpools.value.filter(isCreatedCarpool).sort(compareServices)
    },
    {
      key: 'errands',
      title: 'Errands',
      prop: 'errand',
      route: '/errands',
      component: ErrandCard,
      items: errands.value.filter(isCreatedErrand).sort(compareServices)
    },
    {
      key: 'study',
      title: 'Study',
      prop: 'group',
      route: '/study',
      component: StudyGroupCard,
      items: studyGroups.value.filter(isCreatedStudy).sort(compareServices)
    },
    {
      key: 'activities',
      title: 'Activities',
      prop: 'activity',
      route: '/activities',
      component: ActivitiesCard,
      items: activities.value.filter(isCreatedActivity).sort(compareServices)
    }
  ]
})

/**
 * Returns all joined services while excluding records created by the user.
 *
 * @returns {Array<Object>} Joined service collection definitions.
 */
const joinedServiceCollections = computed(() => {
  const joinedCarpools = carpools.value.filter((carpool) => {
    return !isCreatedCarpool(carpool) &&
      includesCurrentUser(carpool, getParticipantIds(carpool?.participants))
  }).sort(compareServices)

  const joinedErrands = errands.value.filter((errand) => {
    return !isCreatedErrand(errand) &&
      getReferenceId(errand?.helper) === currentUser.value.id
  }).sort(compareServices)

  const joinedStudyGroups = studyGroups.value.filter((group) => {
    return !isCreatedStudy(group) &&
      includesCurrentUser(group, getParticipantIds(group?.members || group?.participants))
  }).sort(compareServices)

  return [
    {
      key: 'carpool',
      title: 'Carpool',
      prop: 'carpool',
      route: '/carpool',
      component: CarpoolCard,
      items: joinedCarpools
    },
    {
      key: 'errands',
      title: 'Errands',
      prop: 'errand',
      route: '/errands',
      component: ErrandCard,
      items: joinedErrands
    },
    {
      key: 'study',
      title: 'Study',
      prop: 'group',
      route: '/study',
      component: StudyGroupCard,
      items: joinedStudyGroups
    },
    {
      key: 'activities',
      title: 'Activities',
      prop: 'activity',
      route: '/activities',
      component: ActivitiesCard,
      items: []
    }
  ]
})

/**
 * Returns lightweight ownership, participation, and history counters.
 *
 * @returns {Array<{label: string, value: number}>} Summary counters.
 */
const serviceSummary = computed(() => {
  const created = createdServiceCollections.value.flatMap((collection) => {
    return collection.items.map((item) => ({ item, type: collection.key }))
  })
  const joined = joinedServiceCollections.value.flatMap((collection) => {
    return collection.items.map((item) => ({ item, type: collection.key }))
  })
  const allServices = [...created, ...joined]
  const activeCount = allServices.filter(({ item, type }) => {
    return ['open', 'accepted'].includes(getServiceStatusKey(item, type))
  }).length

  return [
    { label: 'Created', value: created.length },
    { label: 'Joined', value: joined.length },
    { label: 'Active', value: activeCount },
    { label: 'History', value: allServices.length - activeCount }
  ]
})

/**
 * Determines whether at least one related service was found.
 *
 * @returns {boolean} True when created or joined services exist.
 */
const hasMyServices = computed(() => {
  return createdServiceCollections.value.some((collection) => collection.items.length) ||
    joinedServiceCollections.value.some((collection) => collection.items.length)
})

/**
 * Opens an existing service detail route from a profile card.
 *
 * @param {string} path - Existing service route.
 * @param {string|number} id - Service identifier.
 * @returns {Promise<void>} Resolves after navigation completes.
 */
async function openService(path, id) {
  if (!id) return
  await router.push({ path, query: { id: String(id) } })
}

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

onMounted(() => {
  loadProfile()
  loadMyServices()
})
</script>
