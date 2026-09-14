<!-- components/carpool/CarpoolDetail.vue -->
<!-- Route: /carpool?id=<id> -->

<template>
  <div
      id="carpool-detail-container"
      class="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6"
  >
    <!-- Back & Navigation Bar -->
    <div
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <button
          id="back-to-carpools-btn"
          class="inline-flex w-fit items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors cursor-pointer bg-white px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs"
          type="button"
          @click="navigateTo('/carpool')"
      >
        <svg
            class="w-4 h-4 shrink-0"
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

        <span>Back to Carpools</span>
      </button>

      <div
          v-if="carpool"
          class="flex items-center gap-2"
      >
        <!-- Share -->
        <button
            id="share-carpool-btn"
            class="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200 shadow-xs"
            type="button"
            @click="shareCarpool"
        >
          <i class="fi fi-rr-share text-xs"></i>
          <span>Share</span>
        </button>

        <!-- Edit -->
        <button
            v-if="isOwner && canEdit"
            id="edit-carpool-detail-btn"
            class="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors cursor-pointer border border-brand-200"
            type="button"
            @click="navigateToEdit"
        >
          <i class="fi fi-rr-edit text-xs"></i>
          <span>Edit Ride</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
        v-if="loading"
        id="carpool-detail-loading"
        class="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center shadow-xs"
    >
      <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-600 border-t-transparent mb-3"
      ></div>

      <p class="text-sm font-semibold text-slate-600">
        Loading carpool details...
      </p>
    </div>

    <!-- Error State -->
    <div
        v-else-if="error || !carpool"
        id="carpool-detail-error"
        class="bg-white rounded-2xl border border-rose-200 p-6 sm:p-10 text-center shadow-xs space-y-4"
    >
      <div
          class="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto"
      >
        <i class="fi fi-rr-exclamation text-2xl"></i>
      </div>

      <div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">
          Carpool Not Found
        </h3>

        <p class="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          {{
            error ||
            'The requested carpool could not be retrieved.'
          }}
        </p>
      </div>

      <button
          id="view-all-carpools-btn"
          class="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
          type="button"
          @click="navigateTo('/carpool')"
      >
        View All Carpools
      </button>
    </div>

    <!-- Main Detail Card -->
    <div
        v-else
        id="carpool-detail-card"
        class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
    >
      <!-- Hero Header -->
      <div
          class="bg-gradient-to-r from-brand-900 to-slate-900 text-white p-5 sm:p-8"
      >
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5"
        >
          <div class="flex items-center gap-2 flex-wrap">
            <span
                :class="[
                'px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider',
                statusBadgeClass
              ]"
            >
              {{ statusLabel }}
            </span>

            <span
                class="px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold bg-white/10 text-brand-200 border border-white/10"
            >
              {{ carpool.capacity }} Pax
            </span>

            <span
                v-if="isOwner"
                class="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-brand-500/30 text-brand-200 border border-brand-400/30"
            >
              Your Ride
            </span>
          </div>

          <div
              class="text-xl sm:text-2xl font-bold text-white flex items-baseline gap-1"
          >
            <span>
              {{
                Number(carpool.cost) > 0
                    ? `RM${Number(carpool.cost).toFixed(2)}`
                    : 'Free'
              }}
            </span>

            <span class="text-[10px] sm:text-xs font-normal text-slate-300">
              / passenger
            </span>
          </div>
        </div>

        <!-- Route Visual -->
        <div class="pt-1">
          <div class="flex items-stretch gap-3 sm:gap-4">
            <!-- Route Line -->
            <div class="flex flex-col items-center pt-1">
              <div
                  class="w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-brand-900 shrink-0"
              ></div>

              <div class="w-0.5 flex-1 min-h-10 bg-brand-400/40 my-1"></div>

              <div
                  class="w-3.5 h-3.5 rounded-full bg-brand-400 border-2 border-brand-900 shrink-0"
              ></div>
            </div>

            <!-- Route Information -->
            <div class="space-y-5 flex-1 min-w-0">
              <div>
                <span
                    class="text-[9px] sm:text-[10px] text-brand-200 uppercase font-bold tracking-wider"
                >
                  Departure Point
                </span>

                <p
                    class="text-base sm:text-lg font-bold text-white leading-snug break-words"
                >
                  {{ carpool.origin || '—' }}
                </p>
              </div>

              <div>
                <span
                    class="text-[9px] sm:text-[10px] text-brand-200 uppercase font-bold tracking-wider"
                >
                  Destination
                </span>

                <p
                    class="text-base sm:text-lg font-bold text-white leading-snug break-words"
                >
                  {{ carpool.destination || '—' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Grid & Information -->
      <div class="p-4 sm:p-8 space-y-5 sm:space-y-6">
        <!-- Key Metadata Grid -->
        <div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          <!-- Date -->
          <div
              class="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100 min-w-0"
          >
            <div
                class="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider"
            >
              Date
            </div>

            <div
                class="text-xs sm:text-sm font-bold text-slate-800 mt-1.5 flex items-start gap-1.5"
            >
              <i class="fi fi-rr-calendar text-brand-500 mt-0.5 shrink-0"></i>

              <span class="break-words">
                {{ formatDateTime(carpool.departure).date || '—' }}
              </span>
            </div>
          </div>

          <!-- Departure Time -->
          <div
              class="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100 min-w-0"
          >
            <div
                class="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider"
            >
              Departure Time
            </div>

            <div
                class="text-xs sm:text-sm font-bold text-slate-800 mt-1.5 flex items-start gap-1.5"
            >
              <i class="fi fi-rr-clock-three text-brand-500 mt-0.5 shrink-0"></i>

              <span class="break-words">
                {{ formatDateTime(carpool.departure).time || '—' }}
              </span>
            </div>
          </div>

          <!-- Seats Filled -->
          <div
              class="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100 min-w-0"
          >
            <div
                class="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider"
            >
              Seats Filled
            </div>

            <div
                class="text-xs sm:text-sm font-bold text-slate-800 mt-1.5 flex items-start gap-1.5"
            >
              <i class="fi fi-rr-users text-brand-500 mt-0.5 shrink-0"></i>

              <span>
                {{ participantCount }} / {{ carpool.capacity }}
              </span>
            </div>
          </div>

          <!-- Available Slots -->
          <div
              class="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100 min-w-0"
          >
            <div
                class="text-[9px] sm:text-[10px] text-slate-400 uppercase font-bold tracking-wider"
            >
              Available Slots
            </div>

            <div
                class="text-xs sm:text-sm font-bold text-emerald-600 mt-1.5 flex items-start gap-1.5"
            >
              <i class="fi fi-rr-chair text-emerald-500 mt-0.5 shrink-0"></i>

              <span>
                {{ availableSeats }} Seats Open
              </span>
            </div>
          </div>
        </div>

        <!-- Meeting Notes & Instructions -->
        <div
            v-if="carpool.notes"
            class="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3.5 sm:p-4"
        >
          <h4
              class="text-[10px] sm:text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
          >
            <i class="fi fi-rr-info text-amber-600 shrink-0"></i>

            <span>Pickup & Ride Notes</span>
          </h4>

          <p
              class="text-xs text-amber-950 leading-relaxed break-words"
          >
            {{ carpool.notes }}
          </p>
        </div>

        <!-- Participants -->
        <div class="space-y-3 pt-2 border-t border-slate-100">
          <div class="flex items-center justify-between gap-3">
            <h4
                class="text-[10px] sm:text-xs font-bold text-slate-800 uppercase tracking-wider"
            >
              Students on this trip
            </h4>

            <span
                class="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold shrink-0"
            >
              {{ participantCount }}
            </span>
          </div>

          <div
              v-if="participants.length > 0"
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3"
          >
            <div
                v-for="participant in participants"
                :key="participant.id"
                class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl transition-all duration-200 hover:shadow-sm min-w-0"
            >
              <!-- Avatar -->
              <div
                  class="w-9 h-9 shrink-0 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs"
              >
                {{ getParticipantInitial(participant) }}
              </div>

              <!-- Name -->
              <div class="min-w-0 flex-1">
                <p class="text-xs font-semibold text-slate-700 truncate">
                  {{ participant.name || 'Student' }}
                </p>

                <p
                    v-if="participant.id === carpool.owner?.id"
                    class="text-[10px] text-slate-400 mt-0.5"
                >
                  Trip host
                </p>

                <p
                    v-else-if="participant.id === currentUser?.id"
                    class="text-[10px] text-slate-400 mt-0.5"
                >
                  You
                </p>

                <p
                    v-else
                    class="text-[10px] text-slate-400 mt-0.5"
                >
                  Participant
                </p>
              </div>

              <!-- Role badge -->
              <span
                  v-if="participant.id === carpool.owner?.id"
                  class="shrink-0 px-2 py-1 rounded-lg bg-brand-100 text-brand-700 text-[9px] font-bold uppercase tracking-wide"
              >
                Host
              </span>

              <span
                  v-else-if="participant.id === currentUser?.id"
                  class="shrink-0 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wide"
              >
                You
              </span>
            </div>
          </div>

          <!-- Empty state -->
          <div
              v-else
              class="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200"
          >
            <div
                class="w-9 h-9 shrink-0 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <i class="fi fi-rr-users text-slate-400 text-xs"></i>
            </div>

            <p class="text-xs text-slate-400 leading-relaxed">
              No students have joined this carpool yet.
            </p>
          </div>
        </div>

        <!-- Bottom Actions -->
        <div
            class="pt-4 border-t border-slate-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <!-- Host -->
          <div class="text-xs text-slate-500 leading-relaxed">
            Trip hosted by
            <strong class="text-slate-800">
              {{ carpool.owner?.name || 'Student' }}

              <span
                  v-if="carpool.owner?.id === currentUser?.id"
                  class="text-slate-500 font-normal"
              >
                (You)
              </span>
            </strong>
          </div>

          <!-- Actions -->
          <div class="flex items-stretch gap-2.5 w-full sm:w-auto">
            <!-- Owner Actions -->
            <template v-if="isOwner && canEdit">
              <button
                  id="owner-edit-carpool-btn"
                  class="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl font-bold text-xs transition-colors border border-brand-200 cursor-pointer"
                  type="button"
                  @click="navigateToEdit"
              >
                Edit Details
              </button>

              <button
                  id="owner-leave-carpool-btn"
                  class="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs transition-colors border border-rose-200 cursor-pointer"
                  type="button"
                  @click="handleDelete"
              >
                Cancel Carpool
              </button>
            </template>

            <!-- Joined Participant Action -->
            <template v-else-if="isJoined && canLeave">
              <button
                  id="passenger-leave-carpool-btn"
                  class="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  type="button"
                  @click="handleLeave"
              >
                <i class="fi fi-rr-sign-out-alt"></i>

                <span>Leave Carpool</span>
              </button>
            </template>

            <!-- Departure Has Passed -->
            <template v-else-if="statusKey === 'expired'">
              <button
                  id="join-carpool-detail-btn"
                  class="w-full sm:w-auto px-6 py-2.5 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
                  disabled
                  type="button"
              >
                Ride Departed
              </button>
            </template>

            <!-- Available to Join -->
            <template v-else-if="canParticipate">
              <button
                  id="join-carpool-detail-btn"
                  class="w-full sm:w-auto px-6 sm:px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
                  type="button"
                  @click="handleJoin"
              >
                Join This Carpool
              </button>
            </template>

            <!-- Fully Booked / Terminal -->
            <template v-else>
              <button
                  id="fully-booked-carpool-btn"
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
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'
import { useRouter } from 'vue-router'
import {
  ElMessage,
  ElMessageBox
} from 'element-plus'
import studentConnect from '@/api'
import { formatDateTime } from '@/helper/dateTimeConvert'

const props = defineProps({
  carpoolId: {
    type: String,
    required: true
  },

  currentUser: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const carpool = ref(null)
const loading = ref(true)
const error = ref('')

const currentTimestamp = ref(
    Math.floor(Date.now() / 1000)
)

let timeUpdateInterval = null

/**
 * Returns the current list of participants in the carpool.
 *
 * @returns {Array<Object>} Participant objects from the carpool resource.
 */
const participants = computed(() => {
  if (!carpool.value) {
    return []
  }

  return Array.isArray(carpool.value.participants)
      ? carpool.value.participants
      : []
})

/**
 * Calculates the number of students currently participating.
 *
 * @returns {number} Number of participants.
 */
const participantCount = computed(() => {
  return participants.value.length
})

/**
 * Calculates the number of seats still available.
 *
 * @returns {number} Number of available seats.
 */
const availableSeats = computed(() => {
  if (!carpool.value) {
    return 0
  }

  const capacity = Number(
      carpool.value.capacity || 0
  )

  return Math.max(
      0,
      capacity - participantCount.value
  )
})

/**
 * Determines whether the carpool has reached its capacity.
 *
 * @returns {boolean} True when no additional students can join.
 */
const isFull = computed(() => {
  if (!carpool.value) {
    return false
  }

  const capacity = Number(
      carpool.value.capacity || 0
  )

  return participantCount.value >= capacity
})

/**
 * Determines whether the carpool departure time has passed.
 *
 * @returns {boolean} True when the current time is at or after departure.
 */
const isDeparturePassed = computed(() => {
  const departure = Number(
      carpool.value?.departure
  )

  if (!Number.isFinite(departure) || departure <= 0) {
    return false
  }

  return currentTimestamp.value >= departure
})

/**
 * Returns the backend-aligned carpool status.
 *
 * @returns {string} open, full, cancelled, or expired.
 */
const statusKey = computed(() => {
  const explicitStatus = String(
      carpool.value?.status || ''
  ).toLowerCase()

  if (
      explicitStatus === 'cancelled' ||
      explicitStatus === 'expired'
  ) {
    return explicitStatus
  }

  if (isDeparturePassed.value) {
    return 'expired'
  }

  return isFull.value ? 'full' : 'open'
})

/**
 * Returns the visible carpool status label.
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
 * Returns the status badge styling for the carpool detail header.
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
 * Determines whether the current student owns the carpool.
 *
 * @returns {boolean} True when the current user's ID matches owner.id.
 */
const isOwner = computed(() => {
  if (!carpool.value || !props.currentUser?.id) {
    return false
  }

  return carpool.value.owner?.id === props.currentUser.id
})

/**
 * Determines whether the current student has joined the carpool.
 *
 * @returns {boolean} True when the current user's ID exists in participants.
 */
const isJoined = computed(() => {
  if (!props.currentUser?.id) {
    return false
  }

  return participants.value.some(
      (participant) =>
          participant?.id === props.currentUser.id
  )
})

/**
 * Determines whether the owner may edit or cancel the carpool.
 *
 * @returns {boolean} True for non-terminal carpools.
 */
const canEdit = computed(() => {
  return ['open', 'full'].includes(
      statusKey.value
  )
})

/**
 * Determines whether the current participant may leave the carpool.
 *
 * @returns {boolean} True for active carpools.
 */
const canLeave = computed(() => {
  return ['open', 'full'].includes(
      statusKey.value
  )
})

/**
 * Determines whether a non-participant may join the carpool.
 *
 * @returns {boolean} True when the carpool is open and not departed.
 */
const canParticipate = computed(() => {
  return (
      statusKey.value === 'open' &&
      !isDeparturePassed.value
  )
})

/**
 * Updates the local current Unix timestamp.
 *
 * @returns {void} Updates the reactive current timestamp.
 */
function updateCurrentTimestamp() {
  currentTimestamp.value = Math.floor(
      Date.now() / 1000
  )
}

/**
 * Gets the first letter used for a participant avatar.
 *
 * @param {Object} participant - Participant object containing a name.
 * @returns {string} Uppercase first character of the participant's name.
 */
function getParticipantInitial(participant) {
  const name = String(
      participant?.name || 'Student'
  ).trim()

  return name.charAt(0).toUpperCase()
}

/**
 * Creates or updates a meta tag in the document head.
 *
 * @param {string} key - Meta tag name or property.
 * @param {string} content - Meta tag content.
 * @param {string} attribute - Attribute used to identify the meta tag.
 * @returns {void} Updates the corresponding meta element.
 */
function setMeta(
    key,
    content,
    attribute = 'name'
) {
  let meta = document.head.querySelector(
      `meta[${attribute}="${key}"]`
  )

  if (!meta) {
    meta = document.createElement('meta')

    meta.setAttribute(
        attribute,
        key
    )

    document.head.appendChild(meta)
  }

  meta.setAttribute(
      'content',
      content
  )
}

/**
 * Updates document and social sharing metadata for the current carpool.
 *
 * @returns {void} Updates the document title and relevant meta tags.
 */
function updatePageMetadata() {
  if (!carpool.value) {
    return
  }

  const origin = window.location.origin

  const url = `${origin}/carpool?id=${encodeURIComponent(
      carpool.value.id
  )}`

  const originName =
      carpool.value.origin ||
      'Unknown origin'

  const destinationName =
      carpool.value.destination ||
      'Unknown destination'

  const title =
      `${originName} → ${destinationName} | Student Connect`

  const description =
      `Join this student carpool from ${originName} to ${destinationName}.`

  document.title = title

  setMeta(
      'description',
      description
  )

  setMeta(
      'og:title',
      title,
      'property'
  )

  setMeta(
      'og:description',
      description,
      'property'
  )

  setMeta(
      'og:url',
      url,
      'property'
  )

  setMeta(
      'og:type',
      'website',
      'property'
  )

  setMeta(
      'og:site_name',
      'Student Connect',
      'property'
  )

  setMeta(
      'twitter:card',
      'summary'
  )

  setMeta(
      'twitter:title',
      title
  )

  setMeta(
      'twitter:description',
      description
  )
}

/**
 * Resets the page metadata to the Student Connect defaults.
 *
 * @returns {void} Restores the default document metadata.
 */
function resetPageMetadata() {
  document.title = 'Student Connect'

  setMeta(
      'description',
      'Student Connect helps students connect, share rides, and discover campus services.'
  )

  setMeta(
      'og:title',
      'Student Connect',
      'property'
  )

  setMeta(
      'og:description',
      'Connect with students and discover campus services.',
      'property'
  )

  setMeta(
      'og:url',
      window.location.origin,
      'property'
  )

  setMeta(
      'og:type',
      'website',
      'property'
  )

  setMeta(
      'og:site_name',
      'Student Connect',
      'property'
  )

  setMeta(
      'twitter:card',
      'summary'
  )

  setMeta(
      'twitter:title',
      'Student Connect'
  )

  setMeta(
      'twitter:description',
      'Connect with students and discover campus services.'
  )
}

/**
 * Shares the current carpool using the Web Share API or clipboard fallback.
 *
 * @returns {Promise<void>} Resolves after the share operation completes.
 */
async function shareCarpool() {
  if (!carpool.value?.id) {
    ElMessage.error('Carpool ID is missing')
    return
  }

  const url =
      `${window.location.origin}/carpool?id=${encodeURIComponent(
          carpool.value.id
      )}`

  const originName =
      carpool.value.origin ||
      'Unknown origin'

  const destinationName =
      carpool.value.destination ||
      'Unknown destination'

  const title =
      `${originName} → ${destinationName} | Student Connect`

  const description =
      `Join this student carpool from ${originName} to ${destinationName}.`

  try {
    if (
        navigator.share &&
        typeof navigator.share === 'function'
    ) {
      await navigator.share({
        title,
        text: description,
        url
      })

      return
    }

    if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
    ) {
      await navigator.clipboard.writeText(url)

      ElMessage.success(
          'Carpool link copied to clipboard.'
      )

      return
    }

    ElMessage.warning(
        'Sharing is not supported on this device.'
    )
  } catch (err) {
    if (err?.name === 'AbortError') {
      return
    }

    ElMessage.error(
        'Could not share the carpool.'
    )
  }
}

/**
 * Fetches a specific carpool resource from the Student Connect API.
 *
 * The backend-generated ID is passed through unchanged.
 *
 * @param {string} id - Backend-generated carpool resource identifier.
 * @returns {Promise<void>} Resolves when the carpool has been loaded.
 * @throws {Error} When the API request fails or returns an unsuccessful response.
 */
async function fetchCarpoolDetails(id) {
  if (!id) {
    error.value = 'No carpool ID provided.'
    carpool.value = null
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response =
        await studentConnect.getCarPool(id)

    if (!response?.success) {
      throw new Error(
          response?.message ||
          'Failed to load carpool details'
      )
    }

    carpool.value =
        response.data ||
        null

    if (!carpool.value) {
      throw new Error(
          response?.message ||
          'The requested carpool could not be retrieved.'
      )
    }

    updatePageMetadata()
  } catch (err) {
    carpool.value = null

    error.value =
        err?.message ||
        'Failed to load carpool details'

    resetPageMetadata()

    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

watch(
    () => props.carpoolId,
    (newId) => {
      fetchCarpoolDetails(newId)
    },
    {
      immediate: true
    }
)

onMounted(() => {
  timeUpdateInterval =
      window.setInterval(
          updateCurrentTimestamp,
          1000
      )
})

onUnmounted(() => {
  if (timeUpdateInterval !== null) {
    window.clearInterval(
        timeUpdateInterval
    )

    timeUpdateInterval = null
  }

  resetPageMetadata()
})

/**
 * Navigates to an internal Student Connect route.
 *
 * @param {string} path - Target application route.
 * @returns {void} Performs router navigation.
 */
function navigateTo(path) {
  router.push(path)
}

/**
 * Navigates to the edit page for the current carpool.
 *
 * The carpool ID comes directly from the backend resource.
 *
 * @returns {void} Performs router navigation when the carpool ID exists.
 */
function navigateToEdit() {
  if (!carpool.value?.id) {
    ElMessage.error(
        'Carpool ID is missing'
    )

    return
  }

  router.push({
    path: '/carpool/edit',
    query: {
      id: String(carpool.value.id)
    }
  })
}

/**
 * Joins the current carpool through the Student Connect API.
 *
 * The frontend prevents joining after departure, while the backend
 * remains responsible for final authorization and capacity validation.
 *
 * @returns {Promise<void>} Resolves after the join operation completes.
 * @throws {Error} When the join request fails or returns an unsuccessful response.
 */
async function handleJoin() {
  if (!carpool.value?.id) {
    ElMessage.error(
        'Carpool ID is missing'
    )

    return
  }

  if (isDeparturePassed.value) {
    ElMessage.warning(
        'This carpool has already departed.'
    )

    return
  }

  try {
    const response =
        await studentConnect.joinCarPool(
            carpool.value.id
        )

    if (!response?.success) {
      throw new Error(
          response?.message ||
          'Could not join carpool'
      )
    }

    if (response.data) {
      carpool.value =
          response.data

      updatePageMetadata()
    } else {
      await fetchCarpoolDetails(
          carpool.value.id
      )
    }

    ElMessage.success(
        response.message ||
        'You joined this carpool!'
    )
  } catch (err) {
    ElMessage.error(
        err?.message ||
        'Could not join carpool'
    )
  }
}

/**
 * Deletes the current carpool through the Student Connect API.
 *
 * The backend remains responsible for participant membership updates and
 * carpool deletion.
 *
 * @returns {Promise<void>} Resolves after the delete operation completes.
 * @throws {Error} When the delete request fails or returns an unsuccessful response.
 */
async function handleDelete() {
  const confirmed =
      await ElMessageBox.confirm(
          'Are you sure you want to cancel this carpool? This action cannot be undone.',
          'Confirm Cancellation',
          {
            confirmButtonText: 'Yes, Cancel',
            cancelButtonText: 'No, Keep',
            type: 'warning'
          }
      ).catch(() => false)

  if (!confirmed) {
    return
  }

  if (!carpool.value?.id) {
    ElMessage.error(
        'Carpool ID is missing'
    )

    return
  }

  try {
    const response =
        await studentConnect.deleteCarPool(
            carpool.value.id
        )

    if (!response?.success) {
      throw new Error(
          response?.message ||
          'Could not delete carpool'
      )
    }

    ElMessage.success(
        response.message ||
        'Carpool deleted successfully.'
    )

    navigateTo('/carpool')
  } catch (err) {
    ElMessage.error(
        err?.message ||
        'Could not delete carpool'
    )
  }
}

/**
 * Leaves the current carpool through the Student Connect API.
 *
 * The backend remains responsible for participant membership updates.
 *
 * @returns {Promise<void>} Resolves after the leave operation completes.
 * @throws {Error} When the leave request fails or returns an unsuccessful response.
 */
async function handleLeave() {
  if (!carpool.value?.id) {
    ElMessage.error(
        'Carpool ID is missing'
    )

    return
  }

  try {
    const response =
        await studentConnect.leaveCarPool(
            carpool.value.id
        )

    if (!response?.success) {
      throw new Error(
          response?.message ||
          'Could not leave carpool'
      )
    }

    if (response.data) {
      carpool.value =
          response.data

      updatePageMetadata()
    } else {
      await fetchCarpoolDetails(
          carpool.value.id
      )
    }

    ElMessage.success(
        response.message ||
        'You left the carpool.'
    )
  } catch (err) {
    ElMessage.error(
        err?.message ||
        'Could not leave carpool'
    )
  }
}
</script>
