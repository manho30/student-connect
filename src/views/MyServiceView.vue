<template>
  <div class="min-h-full space-y-6">
    <!-- Header -->
    <header class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">
          My Services
        </h1>

        <p class="mt-1 text-sm text-slate-500">
          Services you created or joined
        </p>
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
    </header>

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
        class="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center"
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
      <section
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div class="mb-5">
          <div class="flex items-center gap-2">
            <div
                class="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600"
            >
              <i class="fi fi-rr-apps"></i>
            </div>

            <div>
              <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">
                Service Overview
              </h2>

              <p class="mt-0.5 text-xs text-slate-400">
                Your activity across Student Connect
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div
              v-for="summary in serviceSummary"
              :key="summary.label"
              class="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3"
          >
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {{ summary.label }}
            </p>

            <p class="mt-1 text-lg font-bold leading-none text-slate-800">
              {{ summary.value }}
            </p>
          </div>
        </div>
      </section>

      <!-- Created Services -->
      <section
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div class="mb-4 flex items-end justify-between">
          <div>
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">
              Created
            </h2>

            <p class="mt-1 text-xs text-slate-400">
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
                  <div class="flex min-w-0 flex-wrap items-center gap-2">
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

                  <h3 class="mt-1 truncate text-sm font-semibold text-slate-800">
                    {{ serviceTitle(item, collection.key) }}
                  </h3>

                  <div
                      class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400"
                  >
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
                  <span class="hidden sm:inline">
                    View
                  </span>

                  <i class="fi fi-rr-arrow-small-right sm:ml-1"></i>
                </el-button>
              </div>
            </div>
          </template>

          <!-- Empty -->
          <div
              v-if="!createdServiceCount"
              class="px-4 py-10 text-center"
          >
            <i class="fi fi-rr-layer-plus text-lg text-slate-300"></i>

            <p class="mt-2 text-xs font-medium text-slate-500">
              You haven't created any services yet.
            </p>
          </div>
        </div>
      </section>

      <!-- Joined Services -->
      <section
          class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div class="mb-4 flex items-end justify-between">
          <div>
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">
              Joined
            </h2>

            <p class="mt-1 text-xs text-slate-400">
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
                  <div class="flex min-w-0 flex-wrap items-center gap-2">
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

                  <h3 class="mt-1 truncate text-sm font-semibold text-slate-800">
                    {{ serviceTitle(item, collection.key) }}
                  </h3>

                  <div
                      class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400"
                  >
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
                  <span class="hidden sm:inline">
                    View
                  </span>

                  <i class="fi fi-rr-arrow-small-right sm:ml-1"></i>
                </el-button>
              </div>
            </div>
          </template>

          <!-- Empty -->
          <div
              v-if="!joinedServiceCount"
              class="px-4 py-10 text-center"
          >
            <i class="fi fi-rr-users text-lg text-slate-300"></i>

            <p class="mt-2 text-xs font-medium text-slate-500">
              You haven't joined any services yet.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref
} from 'vue'

import {
  useRouter
} from 'vue-router'

import studentConnect from '@/api'

import {
  currentUserProfile,
  user
} from '@/services/auth'

const router = useRouter()

const servicesLoading = ref(false)
const servicesLoadError = ref(false)

const carpools = ref([])
const errands = ref([])
const studyGroups = ref([])
const activities = ref([])

/**
 * Returns the current Firebase user's identifier and display details.
 *
 * @returns {{id: string, name: string}} Current authenticated user details.
 */
const currentUser = computed(() => ({
  id: String(user.value?.uid || ''),
  name:
      user.value?.displayName ||
      currentUserProfile.value?.name ||
      user.value?.email ||
      'Student'
}))

/**
 * Extracts a comparable identifier from a backend user reference.
 *
 * @param {Object|string|null} reference - Backend user reference.
 * @returns {string} Comparable user identifier.
 */
function getReferenceId(reference) {
  if (!reference) return ''

  if (typeof reference === 'string') {
    return reference
  }

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
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  if (Array.isArray(response?.data?.activities)) {
    return response.data.activities
  }

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
 * Normalizes a timestamp into milliseconds.
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

  if (
      typeof value === 'number' ||
      (typeof value === 'string' && /^\d+$/.test(value))
  ) {
    const numericValue = Number(value)

    if (!Number.isFinite(numericValue)) {
      return 0
    }

    return numericValue < 100000000000
        ? numericValue * 1000
        : numericValue
  }

  const parsed = Date.parse(value || '')

  return Number.isFinite(parsed)
      ? parsed
      : 0
}

/**
 * Sorts service records by most recently updated, then created date.
 *
 * @param {Object} first - First service record.
 * @param {Object} second - Second service record.
 * @returns {number} Sort comparison result.
 */
function compareServices(first, second) {
  const firstDate = normalizeServiceDate(
      first?.updatedAt || first?.createdAt
  )

  const secondDate = normalizeServiceDate(
      second?.updatedAt || second?.createdAt
  )

  return secondDate - firstDate
}

/**
 * Returns the title displayed for a service.
 *
 * @param {Object} item - Service record.
 * @param {string} type - Service type.
 * @returns {string} Display title.
 */
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

/**
 * Returns the primary date used for a service.
 *
 * @param {Object} item - Service record.
 * @param {string} type - Service type.
 * @returns {string} Formatted service date.
 */
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

/**
 * Returns the primary time used for a service.
 *
 * @param {Object} item - Service record.
 * @param {string} type - Service type.
 * @returns {string} Formatted service time.
 */
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

/**
 * Returns the timestamp displayed for a service.
 *
 * @param {Object} item - Service record.
 * @param {string} type - Service type.
 * @returns {number|null} Timestamp in milliseconds.
 */
function getServiceTimestamp(item, type) {
  if (type === 'carpool') {
    return normalizeServiceDate(item.departure)
  }

  if (type === 'errands') {
    return normalizeServiceDate(item.deadline)
  }

  if (type === 'study') {
    return normalizeServiceDate(item.schedule?.startTime)
  }

  if (type === 'activities') {
    return normalizeServiceDate(item.eventDate)
  }

  return null
}

/**
 * Returns compact secondary metadata for a service.
 *
 * @param {Object} item - Service record.
 * @param {string} type - Service type.
 * @returns {string} Metadata text.
 */
function serviceMeta(item, type) {
  if (type === 'carpool') {
    const participants = getParticipantIds(
        item.participants || item.participantIds
    ).length

    const capacity = Number(item.capacity || 0)

    return capacity
        ? `${participants}/${capacity} joined`
        : `${participants} joined`
  }

  if (type === 'errands') {
    return item.location || ''
  }

  if (type === 'study') {
    const members = getParticipantIds(
        item.members || item.memberIds || item.participants
    ).length

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

/**
 * Returns the icon used for service metadata.
 *
 * @param {string} type - Service type.
 * @returns {string} Flaticon class.
 */
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

/**
 * Returns the primary icon for a service type.
 *
 * @param {string} type - Service type.
 * @returns {string} Flaticon class.
 */
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

/**
 * Returns the background and text classes for a service type icon.
 *
 * @param {string} type - Service type.
 * @returns {string} Tailwind classes.
 */
function serviceTypeIconClass(type) {
  if (type === 'carpool') {
    return 'bg-brand-50 text-brand-600'
  }

  if (type === 'errands') {
    return 'bg-amber-50 text-amber-600'
  }

  if (type === 'study') {
    return 'bg-emerald-50 text-emerald-600'
  }

  if (type === 'activities') {
    return 'bg-brand-50 text-brand-600'
  }

  return 'bg-slate-50 text-slate-600'
}

/**
 * Determines whether the current user created a carpool.
 *
 * @param {Object} carpool - Carpool service.
 * @returns {boolean} True when the current user created it.
 */
function isCreatedCarpool(carpool) {
  return (
      getReferenceId(carpool?.owner) === currentUser.value.id ||
      getReferenceId(carpool?.ownerId) === currentUser.value.id
  )
}

/**
 * Determines whether the current user created an errand.
 *
 * @param {Object} errand - Errand service.
 * @returns {boolean} True when the current user created it.
 */
function isCreatedErrand(errand) {
  return (
      getReferenceId(errand?.requester) === currentUser.value.id ||
      getReferenceId(errand?.requesterId) === currentUser.value.id
  )
}

/**
 * Determines whether the current user created a study group.
 *
 * @param {Object} group - Study group service.
 * @returns {boolean} True when the current user created it.
 */
function isCreatedStudy(group) {
  return (
      getReferenceId(group?.owner) === currentUser.value.id ||
      getReferenceId(group?.ownerId) === currentUser.value.id
  )
}

/**
 * Determines whether the current user created an activity.
 *
 * Activities are promotion-only and cannot be joined.
 *
 * @param {Object} activity - Activity service.
 * @returns {boolean} True when the current user created it.
 */
function isCreatedActivity(activity) {
  return (
      getReferenceId(activity?.owner) === currentUser.value.id ||
      getReferenceId(activity?.ownerId) === currentUser.value.id
  )
}

/**
 * Determines whether the current user participates in a service.
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
 * Returns the normalized status key for a service.
 *
 * @param {Object} service - Service record.
 * @param {string} type - Service type.
 * @returns {string} Status key.
 */
function getServiceStatusKey(service, type) {
  const explicitStatus = String(
      service?.status || ''
  ).toLowerCase()

  if (
      [
        'cancelled',
        'expired',
        'completed',
        'accepted'
      ].includes(explicitStatus)
  ) {
    return explicitStatus
  }

  if (type === 'errands') {
    const deadline = normalizeServiceDate(service?.deadline)

    return deadline > 0 && deadline < Date.now()
        ? 'expired'
        : 'open'
  }

  if (type === 'carpool') {
    const departure = normalizeServiceDate(
        service?.departure
    )

    if (departure > 0 && departure < Date.now()) {
      return 'expired'
    }

    const capacity = Number(service?.capacity)
    const participantCount = getParticipantIds(
        service?.participants || service?.participantIds
    ).length

    return capacity > 0 && participantCount >= capacity
        ? 'full'
        : 'open'
  }

  if (type === 'activities') {
    const registrationDeadline = normalizeServiceDate(
        service?.registrationDeadline
    )

    const eventDate = normalizeServiceDate(
        service?.eventDate
    )

    return (
        (registrationDeadline > 0 &&
            registrationDeadline < Date.now()) ||
        (eventDate > 0 &&
            eventDate < Date.now())
    )
        ? 'expired'
        : 'open'
  }

  const capacity = Number(service?.capacity)

  const memberCount = getParticipantIds(
      service?.members ||
      service?.memberIds ||
      service?.participants
  ).length

  const startTime = normalizeServiceDate(
      service?.schedule?.startTime
  )

  if (startTime > 0 && startTime < Date.now()) {
    return 'expired'
  }

  return capacity > 0 && memberCount >= capacity
      ? 'full'
      : 'open'
}

/**
 * Returns the visible service status label.
 *
 * @param {Object} service - Service record.
 * @param {string} type - Service type.
 * @returns {string} Human-readable status.
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

  return labels[
      getServiceStatusKey(service, type)
      ] || 'Open'
}

/**
 * Returns the Tailwind classes for a service status badge.
 *
 * @param {Object} service - Service record.
 * @param {string} type - Service type.
 * @returns {string} Tailwind classes.
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

  return (
      classes[
          getServiceStatusKey(service, type)
          ] || classes.open
  )
}

/**
 * Loads all service collections without applying list-page archive filters.
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

    const [
      carpoolResult,
      errandResult,
      studyResult,
      activityResult
    ] = results

    const failedResults = results.filter(
        (result) => result.status === 'rejected'
    )

    carpools.value =
        carpoolResult.status === 'fulfilled'
            ? extractServiceList(carpoolResult.value)
            : []

    errands.value =
        errandResult.status === 'fulfilled'
            ? extractServiceList(errandResult.value)
            : []

    studyGroups.value =
        studyResult.status === 'fulfilled'
            ? extractServiceList(studyResult.value)
            : []

    activities.value =
        activityResult.status === 'fulfilled'
            ? extractServiceList(activityResult.value)
            : []

    if (failedResults.length) {
      failedResults.forEach((result) => {
        console.error(
            'Failed to load a My Services collection:',
            result.reason
        )
      })

      servicesLoadError.value = true
    }
  } finally {
    servicesLoading.value = false
  }
}

/**
 * Returns all services created by the current user.
 *
 * @returns {Array<Object>} Created service collections.
 */
const createdServiceCollections = computed(() => {
  return [
    {
      key: 'carpool',
      title: 'Carpool',
      route: '/carpool',
      items: carpools.value
          .filter(isCreatedCarpool)
          .sort(compareServices)
    },
    {
      key: 'errands',
      title: 'Errands',
      route: '/errands',
      items: errands.value
          .filter(isCreatedErrand)
          .sort(compareServices)
    },
    {
      key: 'study',
      title: 'Study',
      route: '/study',
      items: studyGroups.value
          .filter(isCreatedStudy)
          .sort(compareServices)
    },
    {
      key: 'activities',
      title: 'Activities',
      route: '/activities',
      items: activities.value
          .filter(isCreatedActivity)
          .sort(compareServices)
    }
  ]
})

/**
 * Returns all services joined by the current user.
 *
 * Activities are intentionally excluded because they are
 * promotion-only and do not support participation.
 *
 * @returns {Array<Object>} Joined service collections.
 */
const joinedServiceCollections = computed(() => {
  const joinedCarpools = carpools.value
      .filter((carpool) => {
        return (
            !isCreatedCarpool(carpool) &&
            includesCurrentUser(
                carpool,
                getParticipantIds(
                    carpool?.participants ||
                    carpool?.participantIds
                )
            )
        )
      })
      .sort(compareServices)

  const joinedErrands = errands.value
      .filter((errand) => {
        return (
            !isCreatedErrand(errand) &&
            getReferenceId(errand?.helper) ===
            currentUser.value.id
        )
      })
      .sort(compareServices)

  const joinedStudyGroups = studyGroups.value
      .filter((group) => {
        return (
            !isCreatedStudy(group) &&
            includesCurrentUser(
                group,
                getParticipantIds(
                    group?.members ||
                    group?.memberIds ||
                    group?.participants
                )
            )
        )
      })
      .sort(compareServices)

  return [
    {
      key: 'carpool',
      title: 'Carpool',
      route: '/carpool',
      items: joinedCarpools
    },
    {
      key: 'errands',
      title: 'Errands',
      route: '/errands',
      items: joinedErrands
    },
    {
      key: 'study',
      title: 'Study',
      route: '/study',
      items: joinedStudyGroups
    }
  ]
})

/**
 * Returns the number of created services.
 *
 * @returns {number} Created service count.
 */
const createdServiceCount = computed(() => {
  return createdServiceCollections.value.reduce(
      (total, collection) =>
          total + collection.items.length,
      0
  )
})

/**
 * Returns the number of joined services.
 *
 * @returns {number} Joined service count.
 */
const joinedServiceCount = computed(() => {
  return joinedServiceCollections.value.reduce(
      (total, collection) =>
          total + collection.items.length,
      0
  )
})

/**
 * Returns summary counters for the current user's services.
 *
 * @returns {Array<{label: string, value: number}>} Summary counters.
 */
const serviceSummary = computed(() => {
  const created =
      createdServiceCollections.value.flatMap(
          (collection) =>
              collection.items.map((item) => ({
                item,
                type: collection.key
              }))
      )

  const joined =
      joinedServiceCollections.value.flatMap(
          (collection) =>
              collection.items.map((item) => ({
                item,
                type: collection.key
              }))
      )

  const allServices = [
    ...created,
    ...joined
  ]

  const activeCount = allServices.filter(
      ({ item, type }) => {
        return [
          'open',
          'accepted'
        ].includes(
            getServiceStatusKey(item, type)
        )
      }
  ).length

  return [
    {
      label: 'Created',
      value: created.length
    },
    {
      label: 'Joined',
      value: joined.length
    },
    {
      label: 'Active',
      value: activeCount
    },
    {
      label: 'History',
      value: allServices.length - activeCount
    }
  ]
})

/**
 * Determines whether at least one service exists.
 *
 * @returns {boolean} True when a created or joined service exists.
 */
const hasMyServices = computed(() => {
  return (
      createdServiceCollections.value.some(
          (collection) =>
              collection.items.length
      ) ||
      joinedServiceCollections.value.some(
          (collection) =>
              collection.items.length
      )
  )
})

/**
 * Opens an existing service detail route.
 *
 * @param {string} path - Service route.
 * @param {string|number} id - Service identifier.
 * @returns {Promise<void>} Resolves after navigation.
 */
async function openService(path, id) {
  if (!id) return

  await router.push({
    path,
    query: {
      id: String(id)
    }
  })
}

onMounted(() => {
  loadMyServices()
})
</script>
