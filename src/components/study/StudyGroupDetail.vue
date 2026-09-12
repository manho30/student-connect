<!-- components/study/StudyGroupDetail.vue -->
<!-- Route: /study?id=<id> -->

<template>
  <div
      id="study-detail-container"
      class="max-w-4xl mx-auto space-y-6"
  >
    <!-- Back & Navigation Bar -->
    <div class="flex items-center justify-between">
      <button
          id="back-to-study-btn"
          class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
          type="button"
          @click="navigateTo('/study')"
      >
        <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
          />
        </svg>

        <span>Back to Study</span>
      </button>

      <div
          v-if="study && isOwner && canEdit"
          class="flex items-center gap-2"
      >
        <button
            id="edit-study-detail-btn"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer border border-indigo-200"
            type="button"
            @click="navigateToEdit"
        >
          <i class="fi fi-rr-edit text-xs"></i>
          <span>Edit Study</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
        v-if="loading"
        id="study-detail-loading"
        class="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs"
    >
      <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"
      ></div>

      <p class="text-sm font-semibold text-slate-600">
        Loading study details...
      </p>
    </div>

    <!-- Error State -->
    <div
        v-else-if="error || !study"
        id="study-detail-error"
        class="bg-white rounded-2xl border border-rose-200 p-10 text-center shadow-xs space-y-4"
    >
      <div
          class="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto"
      >
        <i class="fi fi-rr-exclamation text-2xl"></i>
      </div>

      <div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">
          Study Not Found
        </h3>

        <p class="text-xs text-slate-500 max-w-md mx-auto">
          {{
            error ||
            'The requested study session could not be retrieved.'
          }}
        </p>
      </div>

      <button
          id="view-all-study-btn"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
          type="button"
          @click="navigateTo('/study')"
      >
        View All Study
      </button>
    </div>

    <!-- Main Detail Card -->
    <div
        v-else
        id="study-detail-card"
        class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
    >
      <!-- Hero Header -->
      <div
          class="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 sm:p-8"
      >
        <div
            class="flex flex-wrap items-center justify-between gap-3 mb-4"
        >
          <div class="flex items-center gap-2 flex-wrap">
            <span
                :class="[
                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                statusBadgeClass
              ]"
            >
              {{ statusLabel }}
            </span>

            <span
                class="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/10"
            >
              {{ study.subject || 'Study' }}
            </span>

            <span
                v-if="isOwner"
                class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30"
            >
              Your Study
            </span>
          </div>

          <div
              class="text-2xl font-bold text-white flex items-baseline gap-1"
          >
            <span>
              {{ memberCount }}
            </span>

            <span class="text-xs font-normal text-slate-300">
              / {{ study.capacity }} members
            </span>
          </div>
        </div>

        <div class="pt-2">
          <h1
              class="text-2xl sm:text-3xl font-bold text-white leading-tight"
          >
            {{ study.title || 'Untitled Study' }}
          </h1>

          <p
              v-if="study.description"
              class="text-sm text-slate-300 mt-3 max-w-2xl leading-relaxed"
          >
            {{ study.description }}
          </p>
        </div>
      </div>

      <!-- Detail Grid & Information -->
      <div class="p-6 sm:p-8 space-y-6">
        <!-- Key Metadata Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div
              class="bg-slate-50 p-3.5 rounded-xl border border-slate-100"
          >
            <div
                class="text-[10px] text-slate-400 uppercase font-bold tracking-wider"
            >
              Subject
            </div>

            <div
                class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5"
            >
              <i class="fi fi-rr-book-alt text-indigo-500"></i>

              <span class="truncate">
                {{ study.subject || '—' }}
              </span>
            </div>
          </div>

          <div
              class="bg-slate-50 p-3.5 rounded-xl border border-slate-100"
          >
            <div
                class="text-[10px] text-slate-400 uppercase font-bold tracking-wider"
            >
              Members
            </div>

            <div
                class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5"
            >
              <i class="fi fi-rr-users text-indigo-500"></i>

              <span>
                {{ memberCount }} / {{ study.capacity }}
              </span>
            </div>
          </div>

          <div
              class="bg-slate-50 p-3.5 rounded-xl border border-slate-100"
          >
            <div
                class="text-[10px] text-slate-400 uppercase font-bold tracking-wider"
            >
              Available Slots
            </div>

            <div
                :class="[
                'text-sm font-bold mt-1 flex items-center gap-1.5',
                availableSlots > 0
                  ? 'text-emerald-600'
                  : 'text-slate-400'
              ]"
            >
              <i class="fi fi-rr-chair"></i>

              <span>
                {{ availableSlots }} Open
              </span>
            </div>
          </div>
        </div>

        <!-- Session Schedule -->
        <div
            class="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4"
        >
          <!-- Header -->
          <div class="flex items-center justify-between gap-3 mb-6">
            <h4
                class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2"
            >
              <i class="fi fi-rr-calendar text-indigo-600"></i>
              <span>Session Schedule</span>
            </h4>

            <span
                v-if="scheduleDuration"
                class="text-[10px] font-semibold text-indigo-500"
            >
      {{ scheduleDuration }}
    </span>
          </div>

          <!-- Horizontal Timeline -->
          <div class="px-2">
            <div class="relative">
              <!-- Connecting Line -->
              <div
                  class="absolute left-[7px] right-[7px] top-[5px] h-px bg-indigo-200"
                  aria-hidden="true"
              ></div>

              <div class="relative flex justify-between">
                <!-- Start -->
                <div class="flex flex-col items-start">
                  <div
                      class="w-[11px] h-[11px] rounded-full bg-indigo-600 ring-4 ring-indigo-50 mb-4"
                  ></div>

                  <span
                      class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider"
                  >
            Starts
          </span>

                  <p class="text-sm font-bold text-slate-800 mt-1">
                    {{ schedule.start.date }}
                  </p>

                  <p class="text-xs font-semibold text-slate-500 mt-0.5">
                    {{ schedule.start.time }}
                  </p>
                </div>

                <!-- End -->
                <div class="flex flex-col items-end text-right">
                  <div
                      class="w-[11px] h-[11px] rounded-full bg-indigo-400 ring-4 ring-indigo-50 mb-4"
                  ></div>

                  <span
                      class="text-[10px] font-bold text-indigo-500 uppercase tracking-wider"
                  >
            Ends
          </span>

                  <p class="text-sm font-bold text-slate-800 mt-1">
                    {{ schedule.end.date }}
                  </p>

                  <p class="text-xs font-semibold text-slate-500 mt-0.5">
                    {{ schedule.end.time }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div
            v-if="study.location"
            class="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4"
        >
          <h4
              class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5"
          >
            <i class="fi fi-rr-marker text-indigo-500"></i>
            <span>Location</span>
          </h4>

          <p
              class="text-sm font-semibold text-slate-700 leading-relaxed"
          >
            {{ study.location }}
          </p>
        </div>

        <!-- Description -->
        <div
            v-if="study.description"
            class="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4"
        >
          <h4
              class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5"
          >
            <i class="fi fi-rr-info text-indigo-500"></i>
            <span>About This Study</span>
          </h4>

          <p
              class="text-xs text-slate-600 leading-relaxed"
          >
            {{ study.description }}
          </p>
        </div>


        <!-- Members -->
        <div
            class="space-y-3 pt-2 border-t border-slate-100"
        >
          <div
              class="flex items-center justify-between"
          >
            <h4
                class="text-xs font-bold text-slate-800 uppercase tracking-wider"
            >
              Students in this Study
            </h4>

            <span
                class="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold"
            >
              {{ memberCount }}
            </span>
          </div>

          <div
              v-if="members.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            <div
                v-for="member in members"
                :key="member.id"
                class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 transition-all duration-200 hover:shadow-sm"
            >
              <div
                  class="w-9 h-9 shrink-0 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs"
              >
                {{ getMemberInitial(member) }}
              </div>

              <div class="min-w-0 flex-1">
                <p
                    class="text-xs font-semibold text-slate-700 truncate"
                >
                  {{ member.name || 'Student' }}
                </p>

                <p
                    v-if="getUserId(member) === getOwnerId()"
                    class="text-[10px] text-slate-400 mt-0.5"
                >
                  Study host
                </p>

                <p
                    v-else-if="getUserId(member) === currentUserId"
                    class="text-[10px] text-slate-400 mt-0.5"
                >
                  You
                </p>

                <p
                    v-else
                    class="text-[10px] text-slate-400 mt-0.5"
                >
                  Member
                </p>
              </div>

              <span
                  v-if="getUserId(member) === getOwnerId()"
                  class="shrink-0 px-2 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-wide"
              >
                Host
              </span>

              <span
                  v-else-if="getUserId(member) === currentUserId"
                  class="shrink-0 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wide"
              >
                You
              </span>
            </div>
          </div>

          <div
              v-else
              class="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200"
          >
            <div
                class="w-9 h-9 shrink-0 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <i class="fi fi-rr-users text-slate-400 text-xs"></i>
            </div>

            <p class="text-xs text-slate-400">
              No students have joined this study yet.
            </p>
          </div>
        </div>

        <!-- Bottom Actions -->
        <div
            class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <div class="text-xs text-slate-500">
            Study hosted by

            <strong class="text-slate-800">
              {{ study.owner?.name || 'Student' }}

              <span
                  v-if="getOwnerId() === currentUserId"
                  class="text-xs text-slate-500 font-normal"
              >
                (You)
              </span>
            </strong>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <!-- Owner -->
            <template v-if="isOwner && canEdit">
              <button
                  id="owner-edit-study-btn"
                  class="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition-colors border border-indigo-200 cursor-pointer"
                  type="button"
                  @click="navigateToEdit"
              >
                Edit Details
              </button>
            </template>

            <!-- Joined -->
            <template v-else-if="isJoined && canLeave">
              <button
                  id="leave-study-btn"
                  class="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs border border-slate-200 cursor-pointer transition-colors"
                  type="button"
                  @click="handleLeave"
              >
                <i class="fi fi-rr-check mr-1 text-emerald-600"></i>
                <span>Joined · Leave Study</span>
              </button>
            </template>

            <!-- Available -->
            <template v-else-if="canParticipate">
              <button
                  id="join-study-detail-btn"
                  class="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
                  type="button"
                  @click="handleJoin"
              >
                Join This Study
              </button>
            </template>

            <!-- Full -->
            <template v-else>
              <button
                  id="fully-booked-study-btn"
                  class="w-full sm:w-auto px-6 py-2.5 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
                  disabled
                  type="button"
              >
                {{ statusLabel }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import studentConnect from '@/api'
import { user } from '@/services/auth'

const props = defineProps({
  studyId: {
    type: String,
    required: true
  },

  currentUser: {
    type: Object,
    default: null
  }
})

const router = useRouter()

const study = ref(null)
const loading = ref(true)
const error = ref('')

/**
 * Returns the authenticated user's Firebase UID.
 *
 * @returns {string} Current user identifier.
 */
const currentUserId = computed(() => {
  return String(
      user.value?.uid ||
      props.currentUser?.uid ||
      props.currentUser?.id ||
      ''
  )
})

/**
 * Returns the study members safely.
 *
 * @returns {Array<Object>} Study members.
 */
const members = computed(() => {
  return Array.isArray(study.value?.members)
      ? study.value.members
      : []
})

/**
 * Returns the number of current study members.
 *
 * @returns {number} Member count.
 */
const memberCount = computed(() => {
  return members.value.length
})

/**
 * Returns the number of remaining membership slots.
 *
 * @returns {number} Available slots.
 */
const availableSlots = computed(() => {
  const capacity = Number(study.value?.capacity || 0)

  return Math.max(
      0,
      capacity - memberCount.value
  )
})

/**
 * Determines whether the study is full.
 *
 * @returns {boolean} True when no membership slots remain.
 */
const isFull = computed(() => {
  const capacity = Number(study.value?.capacity || 0)

  return capacity > 0 &&
      memberCount.value >= capacity
})

/**
 * Determines whether the study session has passed its scheduled start.
 *
 * @returns {boolean} True when the session is expired.
 */
const isStudyExpired = computed(() => {
  const startTime = Number(study.value?.schedule?.startTime)
  return Number.isFinite(startTime) &&
      startTime > 0 &&
      Date.now() >= startTime * 1000
})

/**
 * Returns the backend-aligned study status.
 *
 * @returns {string} open, full, cancelled, or expired.
 */
const statusKey = computed(() => {
  const explicitStatus = String(study.value?.status || '').toLowerCase()
  if (explicitStatus === 'cancelled' || explicitStatus === 'expired') {
    return explicitStatus
  }
  if (isStudyExpired.value) return 'expired'
  return isFull.value ? 'full' : 'open'
})

/**
 * Returns the visible study status label.
 *
 * @returns {string} Human-readable status.
 */
const statusLabel = computed(() => {
  return {
    open: 'Open',
    full: 'Full',
    cancelled: 'Cancelled',
    expired: 'Expired'
  }[statusKey.value] || 'Open'
})

/**
 * Returns the status badge styling for the study detail header.
 *
 * @returns {string} Tailwind classes.
 */
const statusBadgeClass = computed(() => {
  return {
    open: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
    full: 'bg-slate-700 text-slate-300',
    cancelled: 'bg-rose-500/20 text-rose-300 border border-rose-400/30',
    expired: 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
  }[statusKey.value]
})

/**
 * Returns the backend owner identifier.
 *
 * @returns {string} Owner identifier.
 */
function getOwnerId() {
  return String(
      study.value?.owner?.id ||
      study.value?.owner?.uid ||
      ''
  )
}

/**
 * Determines whether the current user owns the study.
 *
 * @returns {boolean} True when the current user is the owner.
 */
const isOwner = computed(() => {
  return Boolean(
      currentUserId.value &&
      getOwnerId() &&
      currentUserId.value === getOwnerId()
  )
})

/**
 * Returns a normalized identifier for a user or member.
 *
 * @param {Object|string|null} member User or member object.
 * @returns {string} Comparable identifier.
 */
function getUserId(member) {
  if (!member) {
    return ''
  }

  if (typeof member === 'string') {
    return member
  }

  return String(
      member.uid ||
      member.id ||
      member.userId ||
      member.firebaseUid ||
      ''
  )
}

/**
 * Determines whether the current user is a study member.
 *
 * @returns {boolean} True when the user is already a member.
 */
const isJoined = computed(() => {
  if (!currentUserId.value) {
    return false
  }

  return members.value.some((member) => {
    return getUserId(member) === currentUserId.value
  })
})

/**
 * Determines whether the owner may edit this study session.
 *
 * @returns {boolean} True for non-terminal sessions.
 */
const canEdit = computed(() => {
  return ['open', 'full'].includes(statusKey.value)
})

/**
 * Determines whether the current member may leave the study session.
 *
 * @returns {boolean} True for active sessions.
 */
const canLeave = computed(() => {
  return ['open', 'full'].includes(statusKey.value)
})

/**
 * Determines whether a non-member may join the study session.
 *
 * @returns {boolean} True when the session is open and active.
 */
const canParticipate = computed(() => {
  return statusKey.value === 'open'
})

/**
 * Converts a backend Unix timestamp in seconds to a Date.
 *
 * @param {number|string} timestamp Unix timestamp in seconds.
 * @returns {Date|null} Converted Date or null when invalid.
 */
function unixSecondsToDate(timestamp) {
  const seconds = Number(timestamp)

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return null
  }

  const date = new Date(seconds * 1000)

  return Number.isNaN(date.getTime())
      ? null
      : date
}

/**
 * Formats a Study schedule timestamp.
 *
 * @param {number|string} timestamp Unix timestamp in seconds.
 * @returns {{date: string, time: string}} Formatted date and time.
 */
function formatScheduleTimestamp(timestamp) {
  const date = unixSecondsToDate(timestamp)

  if (!date) {
    return {
      date: '—',
      time: '—'
    }
  }

  return {
    date: new Intl.DateTimeFormat('en-MY', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date),

    time: new Intl.DateTimeFormat('en-MY', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }
}

/**
 * Returns the formatted Study session schedule.
 *
 * @returns {{start: Object, end: Object}} Formatted schedule.
 */
const schedule = computed(() => {
  return {
    start: formatScheduleTimestamp(
        study.value?.schedule?.startTime
    ),

    end: formatScheduleTimestamp(
        study.value?.schedule?.endTime
    )
  }
})

/**
 * Calculates the Study session duration.
 *
 * @returns {string} Human-readable duration.
 */
const scheduleDuration = computed(() => {
  const start = Number(
      study.value?.schedule?.startTime
  )

  const end = Number(
      study.value?.schedule?.endTime
  )

  if (
      !Number.isFinite(start) ||
      !Number.isFinite(end) ||
      start <= 0 ||
      end <= start
  ) {
    return ''
  }

  const durationMinutes = Math.round(
      (end - start) / 60
  )

  const hours = Math.floor(
      durationMinutes / 60
  )

  const minutes = durationMinutes % 60

  if (hours === 0) {
    return `${minutes} min`
  }

  if (minutes === 0) {
    return `${hours} hr`
  }

  return `${hours} hr ${minutes} min`
})

/**
 * Returns the first character of a member's display name.
 *
 * @param {Object} member Study member.
 * @returns {string} Uppercase member initial.
 */
function getMemberInitial(member) {
  const name = String(
      member?.name || 'Student'
  ).trim()

  return name.charAt(0).toUpperCase()
}

/**
 * Fetches the requested Study from the backend.
 *
 * @param {string} id Study identifier.
 * @returns {Promise<void>} Resolves when loading finishes.
 */
async function fetchStudyDetails(id) {
  if (!id) {
    error.value = 'No study ID provided.'
    study.value = null
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response =
        await studentConnect.getStudyGroup(id)

    if (!response?.success) {
      throw new Error(
          response?.message ||
          'Failed to load study details'
      )
    }

    study.value =
        response.data || null

    if (!study.value) {
      throw new Error(
          response?.message ||
          'The requested study could not be retrieved.'
      )
    }
  } catch (err) {
    study.value = null

    error.value =
        err?.message ||
        'Failed to load study details'

    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

/**
 * Joins the current Study through the backend API.
 *
 * @returns {Promise<void>} Resolves after the operation completes.
 */
async function handleJoin() {
  if (!study.value?.id) {
    return
  }

  try {
    const response =
        await studentConnect.joinStudyGroup(
            study.value.id
        )

    study.value =
        response?.data ?? response

    ElMessage.success(
        'You joined the study.'
    )
  } catch (err) {
    console.error(
        'Failed to join study:',
        err
    )

    ElMessage.error(
        err?.message ||
        'Could not join this study.'
    )
  }
}

/**
 * Leaves the current Study through the backend API.
 *
 * @returns {Promise<void>} Resolves after the operation completes.
 */
async function handleLeave() {
  if (!study.value?.id) {
    return
  }

  try {
    const response =
        await studentConnect.leaveStudyGroup(
            study.value.id
        )

    study.value =
        response?.data ?? response

    ElMessage.success(
        'You left the study.'
    )
  } catch (err) {
    console.error(
        'Failed to leave study:',
        err
    )

    ElMessage.error(
        err?.message ||
        'Could not leave this study.'
    )
  }
}

/**
 * Watches the route-provided Study ID and loads its details.
 *
 * @returns {void}
 */
watch(
    () => props.studyId,
    (newId) => {
      fetchStudyDetails(newId)
    },
    {
      immediate: true
    }
)

/**
 * Navigates to an internal application route.
 *
 * @param {string} path Target route.
 * @returns {void}
 */
function navigateTo(path) {
  router.push(path)
}

/**
 * Navigates to the Study edit page.
 *
 * @returns {void}
 */
function navigateToEdit() {
  if (!study.value?.id) {
    ElMessage.error('Study ID is missing')
    return
  }

  router.push({
    path: '/study/edit',
    query: {
      id: String(study.value.id)
    }
  })
}
</script>
