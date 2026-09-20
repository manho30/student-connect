<!-- components/activities/ActivitiesDetail.vue -->

<template>
  <div class="mx-auto max-w-4xl">
    <!-- Loading -->
    <div
        v-if="loading"
        class="flex min-h-[400px] items-center justify-center"
    >
      <i class="fi fi-rr-spinner animate-spin text-3xl text-brand-600"></i>
    </div>

    <!-- Error -->
    <div
        v-else-if="error"
        class="rounded-2xl bg-rose-50 p-8 text-center text-rose-700"
    >
      <p class="font-semibold">
        {{ error }}
      </p>

      <button
          type="button"
          class="mt-4 font-bold underline underline-offset-2"
          @click="loadActivity"
      >
        Try again
      </button>
    </div>

    <!-- Activity -->
    <div
        v-else-if="activity"
        class="space-y-6"
    >
      <!-- Top Navigation -->
      <div class="flex items-center justify-between gap-4">
        <button
            type="button"
            class="flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-brand-600"
            @click="emit('back')"
        >
          <i class="fi fi-rr-arrow-left"></i>
          Back to Activities
        </button>

        <div class="flex items-center gap-2">
          <!-- Share -->
          <button
              id="share-activity-btn"
              type="button"
              class="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition-colors hover:bg-brand-50 hover:text-brand-700"
              @click="shareActivity"
          >
            <i class="fi fi-rr-share"></i>

            <span class="hidden sm:inline">
              Share
            </span>
          </button>

          <!-- Owner Actions -->
          <template v-if="isOwner">
            <button
                v-if="!isTerminal"
                type="button"
                class="rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition-colors hover:text-brand-700"
                @click="emit('edit', activity.id)"
            >
              Edit
            </button>

            <button
                v-if="!isTerminal"
                type="button"
                class="rounded-xl bg-white px-4 py-2 text-xs font-bold text-rose-600 shadow-xs transition-colors hover:bg-rose-50"
                @click="emit('delete', activity.id)"
            >
              Delete
            </button>
          </template>
        </div>
      </div>

      <!-- Activity Card -->
      <article
          class="overflow-hidden rounded-2xl bg-white shadow-xs"
      >
        <!-- Poster -->
        <div
            v-if="activity.posterUrl"
            class="relative overflow-hidden bg-slate-100"
        >
          <img
              :src="activity.posterUrl"
              :alt="posterAlt"
              class="mx-auto block max-h-[520px] w-full object-contain"
              loading="eager"
              fetchpriority="high"
              decoding="async"
          />

          <div
              class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent"
          ></div>
        </div>

        <!-- Content -->
        <div class="space-y-7 p-6 md:p-8">

          <!-- Badges -->
          <div class="flex flex-wrap items-center gap-2">
            <span
                class="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-brand-700"
            >
              {{ activity.category || 'Activity' }}
            </span>

            <span
                :class="[
                'rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider',
                statusClass
              ]"
            >
              {{ statusLabel }}
            </span>

            <!-- Full Badge -->
            <span
                v-if="isFull && statusKey === 'open'"
                class="rounded-full bg-amber-100 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-700"
            >
              Full
            </span>
          </div>

          <!-- Title + Description -->
          <div>
            <h1
                class="text-2xl font-black leading-tight text-slate-900 md:text-3xl"
            >
              {{ activity.title }}
            </h1>

            <p
                v-if="activity.description"
                class="mt-4 whitespace-pre-line text-[15px] leading-7 text-slate-600 md:text-base"
            >
              {{ activity.description }}
            </p>
          </div>

          <!-- Details -->
          <div
              class="grid gap-5 border-y border-slate-100 py-6 sm:grid-cols-2"
          >
            <!-- Event Date -->
            <div class="flex gap-3">
              <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"
              >
                <i class="fi fi-rr-calendar text-sm"></i>
              </div>

              <div class="min-w-0">
                <p
                    class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400"
                >
                  Event Date
                </p>

                <p class="mt-1 text-sm font-semibold text-slate-800">
                  {{ formatDate(activity.eventDate) }}
                </p>
              </div>
            </div>

            <!-- Registration Deadline -->
            <div class="flex gap-3">
              <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"
              >
                <i class="fi fi-rr-clock text-sm"></i>
              </div>

              <div class="min-w-0">
                <p
                    class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400"
                >
                  Registration Deadline
                </p>

                <p
                    class="mt-1 text-sm font-semibold"
                    :class="
                    deadlinePassed
                      ? 'text-amber-600'
                      : 'text-slate-800'
                  "
                >
                  {{
                    activity.registrationDeadline
                        ? formatDate(
                            activity.registrationDeadline
                        )
                        : 'Not specified'
                  }}
                </p>
              </div>
            </div>

            <!-- Location -->
            <div class="flex gap-3">
              <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"
              >
                <i class="fi fi-rr-marker text-sm"></i>
              </div>

              <div class="min-w-0">
                <p
                    class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400"
                >
                  Location
                </p>

                <!-- Google Maps Location -->
                <a
                    v-if="locationHref"
                    :href="locationHref"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
                >
                  <span class="break-words">
                    {{ activity.location }}
                  </span>

                  <i class="fi fi-rr-arrow-up-right-from-square text-[10px]"></i>
                </a>

                <!-- Normal Location -->
                <p
                    v-else
                    class="mt-1 break-words text-sm font-semibold text-slate-800"
                >
                  {{ activity.location || 'Not specified' }}
                </p>
              </div>
            </div>

            <!-- Contact -->
            <div class="flex gap-3">
              <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"
              >
                <i class="fi fi-rr-phone-call text-sm"></i>
              </div>

              <div class="min-w-0">
                <p
                    class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400"
                >
                  Contact
                </p>

                <a
                    v-if="contactHref"
                    :href="contactHref"
                    class="mt-1 inline-flex items-center text-sm font-semibold text-brand-700 hover:underline"
                >
                  {{ formattedContact }}
                </a>

                <p
                    v-else
                    class="mt-1 text-sm font-semibold text-slate-800"
                >
                  {{ formattedContact }}
                </p>
              </div>
            </div>
          </div>

          <!-- Participant Action -->
          <div
              v-if="showParticipantAction"
              class="rounded-2xl border border-brand-100 bg-brand-50/60 p-5"
          >
            <div
                class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <div
                      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-xs"
                  >
                    <i class="fi fi-rr-user-add text-xs"></i>
                  </div>

                  <p class="text-sm font-bold text-slate-900">
                    {{ participantActionTitle }}
                  </p>
                </div>

                <p class="mt-2 text-xs leading-relaxed text-slate-500">
                  {{ participantActionDescription }}
                </p>
              </div>

              <!-- Join -->
              <button
                  v-if="canJoin"
                  id="join-activity-btn"
                  type="button"
                  :disabled="joining"
                  class="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                  @click="joinActivity"
              >
                <i
                    v-if="joining"
                    class="fi fi-rr-spinner animate-spin"
                ></i>

                <i
                    v-else
                    class="fi fi-rr-user-add"
                ></i>

                {{ joining ? 'Joining...' : 'Join Activity' }}
              </button>

              <!-- Leave -->
              <button
                  v-else-if="canLeave"
                  id="leave-activity-btn"
                  type="button"
                  :disabled="leaving"
                  class="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-rose-600 shadow-xs transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                  @click="leaveActivity"
              >
                <i
                    v-if="leaving"
                    class="fi fi-rr-spinner animate-spin"
                ></i>

                <i
                    v-else
                    class="fi fi-rr-user-remove"
                ></i>

                {{ leaving ? 'Leaving...' : 'Leave Activity' }}
              </button>

              <!-- Full -->
              <span
                  v-else-if="isFull"
                  class="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-100 px-5 py-2.5 text-xs font-bold text-amber-700"
              >
                <i class="fi fi-rr-users"></i>
                Full
              </span>
            </div>
          </div>

          <!-- Organizer -->
          <div class="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
            <div class="text-xs text-slate-500 leading-relaxed">
              Organized by
              <strong class="text-slate-800">
                {{ organizerName }}

                <span
                    v-if="isOwner"
                    class="ml-1 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-700"
                >
                (You)
              </span>
              </strong>
            </div>
          </div>

          <!-- Participants -->
          <div
              v-if="hasParticipantInformation"
              class="space-y-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div>
                <p
                    class="text-[11px] font-extrabold uppercase tracking-wider text-slate-400"
                >
                  Participants
                </p>

                <p class="mt-1 text-sm font-bold text-slate-800">
                  {{ participantSummary }}
                </p>
              </div>

              <span
                  v-if="isFull"
                  class="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-700"
              >
                Full
              </span>
            </div>

            <!-- Participant List -->
            <div
                v-if="participants.length"
                class="grid gap-2 sm:grid-cols-2"
            >
              <div
                  v-for="participant in participants"
                  :key="participant.id"
                  class="flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5"
              >
                <div
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-xs"
                >
                  <i class="fi fi-rr-user text-xs"></i>
                </div>

                <p
                    class="min-w-0 truncate text-sm font-semibold text-slate-700"
                >
                  {{ participant.name || 'Student' }}
                </p>
              </div>
            </div>

            <!-- Empty State -->
            <div
                v-else
                class="rounded-xl bg-brand-50/60 px-4 py-5 text-center"
            >
              <div
                  class="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-600 shadow-xs"
              >
                <i class="fi fi-rr-users text-xs"></i>
              </div>

              <p class="mt-3 text-sm font-bold text-slate-800">
                Be the first to join!
              </p>

              <p class="mt-1 text-xs text-slate-500">
                Join this activity and meet other students.
              </p>
            </div>
          </div>
        </div>
      </article>
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

import { ElMessage } from 'element-plus'

import studentConnect from '@/api'

const props = defineProps({
  activityId: {
    type: String,
    required: true
  },

  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'back',
  'edit',
  'delete'
])

const activity = ref(null)
const loading = ref(true)
const error = ref('')

const joining = ref(false)
const leaving = ref(false)

/**
 * Returns the current activity URL.
 *
 * @returns {string} Shareable activity URL.
 */
const activityUrl = computed(() => {
  if (!activity.value?.id) {
    return window.location.href
  }

  return `${window.location.origin}/activities?id=${encodeURIComponent(activity.value.id)}`
})

/**
 * Returns the activity organizer name.
 *
 * @returns {string} Organizer display name.
 */
const organizerName = computed(() => {
  return (
      activity.value?.owner?.name ||
      activity.value?.owner?.displayName ||
      activity.value?.owner?.email ||
      'Lend a Hand student'
  )
})

/**
 * Returns the activity participant list.
 *
 * The API excludes the Activity owner from this list.
 *
 * @returns {Array<Object>} Current joined participants.
 */
const participants = computed(() => {
  return Array.isArray(activity.value?.participants)
      ? activity.value.participants
      : []
})

/**
 * Determines whether participant information was returned by the API.
 *
 * @returns {boolean} True when participants is an array.
 */
const hasParticipantInformation = computed(() => {
  return Array.isArray(activity.value?.participants)
})

/**
 * Returns the current number of joined students.
 *
 * The Activity owner is not included in this count.
 *
 * @returns {number} Participant count.
 */
const participantCount = computed(() => {
  return participants.value.length
})

/**
 * Returns the participant limit.
 *
 * @returns {number} Positive participant limit or zero.
 */
const participantsLimit = computed(() => {
  const value =
      Number(
          activity.value?.participantsLimit
      )

  return Number.isInteger(value) && value > 0
      ? value
      : 0
})

/**
 * Determines whether the Activity has a participant limit.
 *
 * @returns {boolean} True when a valid limit exists.
 */
const hasParticipantsLimit = computed(() => {
  return participantsLimit.value > 0
})

/**
 * Determines whether the Activity has reached its participant limit.
 *
 * The owner is deliberately excluded from this calculation.
 *
 * @returns {boolean} True when the Activity is full.
 */
const isFull = computed(() => {
  return (
      hasParticipantsLimit.value &&
      participantCount.value >=
      participantsLimit.value
  )
})

/**
 * Returns the participant summary shown to the user.
 *
 * @returns {string} Participant summary.
 */
const participantSummary = computed(() => {
  if (hasParticipantsLimit.value) {
    return `${participantCount.value} / ${participantsLimit.value} students joined`
  }

  return participantCount.value === 1
      ? '1 student joined'
      : `${participantCount.value} students joined`
})

/**
 * Returns whether the current user is a participant.
 *
 * @returns {boolean} True when the current user has joined.
 */
const isParticipant = computed(() => {
  const currentUserId =
      props.currentUser?.id ||
      props.currentUser?.uid ||
      props.currentUser?.userId ||
      ''

  if (!currentUserId) {
    return false
  }

  return participants.value.some(
      participant =>
          String(
              participant?.id ||
              participant?.uid ||
              participant?.userId ||
              ''
          ) === String(currentUserId)
  )
})

/**
 * Returns whether the current user can join the Activity.
 *
 * @returns {boolean} True when joining is currently allowed.
 */
const canJoin = computed(() => {
  return Boolean(
      !isOwner.value &&
      !isParticipant.value &&
      !isTerminal.value &&
      statusKey.value === 'open' &&
      !isFull.value
  )
})

/**
 * Returns whether the current user can leave the Activity.
 *
 * @returns {boolean} True when leaving is currently allowed.
 */
const canLeave = computed(() => {
  return Boolean(
      !isOwner.value &&
      isParticipant.value &&
      !isTerminal.value &&
      statusKey.value === 'open'
  )
})

/**
 * Determines whether a participant action area should be displayed.
 *
 * @returns {boolean} True when a participant action is relevant.
 */
const showParticipantAction = computed(() => {
  if (isOwner.value) {
    return false
  }

  if (!props.currentUser) {
    return false
  }

  if (isTerminal.value) {
    return false
  }

  return (
      canJoin.value ||
      canLeave.value ||
      isFull.value
  )
})

/**
 * Returns the participant action title.
 *
 * @returns {string} Action title.
 */
const participantActionTitle = computed(() => {
  if (canLeave.value) {
    return 'You have joined this activity.'
  }

  if (isFull.value) {
    return 'This activity is full.'
  }

  return 'Interested in joining?'
})

/**
 * Returns the participant action description.
 *
 * @returns {string} Action description.
 */
const participantActionDescription = computed(() => {
  if (canLeave.value) {
    return hasParticipantsLimit.value
        ? `You are one of ${participantCount.value} joined students. You can leave at any time while the activity is open.`
        : 'You are currently a participant. You can leave at any time while the activity is open.'
  }

  if (isFull.value) {
    return 'The participant limit has been reached. You cannot join unless another student leaves.'
  }

  if (hasParticipantsLimit.value) {
    return `${participantCount.value} of ${participantsLimit.value} participant slots are currently available.`
  }

  return 'Join this activity to participate with other students.'
})

/**
 * Returns a formatted Malaysian phone number.
 *
 * @returns {string} Formatted contact information.
 */
const formattedContact = computed(() => {
  const value =
      String(
          activity.value?.contact || ''
      ).trim()

  if (!value) {
    return 'Not specified'
  }

  const digits =
      value.replace(/\D/g, '')

  if (
      digits.length === 10 &&
      digits.startsWith('01')
  ) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)} ${digits.slice(6)}`
  }

  if (
      digits.length === 11 &&
      digits.startsWith('01')
  ) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)} ${digits.slice(7)}`
  }

  return value
})

/**
 * Returns a tel URL for the contact number.
 *
 * @returns {string} Telephone URL or empty string.
 */
const contactHref = computed(() => {
  const value =
      String(
          activity.value?.contact || ''
      ).trim()

  const digits =
      value.replace(/\D/g, '')

  if (
      digits.length === 10 &&
      digits.startsWith('01')
  ) {
    return `tel:+60${digits.slice(1)}`
  }

  if (
      digits.length === 11 &&
      digits.startsWith('01')
  ) {
    return `tel:+60${digits.slice(1)}`
  }

  return ''
})

/**
 * Returns a Google Maps search URL for the activity location.
 *
 * @returns {string} Google Maps URL or empty string.
 */
const locationHref = computed(() => {
  const location =
      String(
          activity.value?.location || ''
      ).trim()

  if (!location) {
    return ''
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
})

/**
 * Determines whether the registration deadline has passed.
 *
 * @returns {boolean} True when registration is closed.
 */
const deadlinePassed = computed(() => {
  const deadline =
      Number(
          activity.value?.registrationDeadline
      )

  return (
      Number.isFinite(deadline) &&
      deadline > 0 &&
      deadline <=
      Math.floor(Date.now() / 1000)
  )
})

/**
 * Returns a safe poster alt text.
 *
 * @returns {string} Poster alternative text.
 */
const posterAlt = computed(() => {
  return activity.value?.title
      ? `${activity.value.title} poster`
      : 'Lend a Hand activity poster'
})

/**
 * Loads the requested activity from the shared API client.
 *
 * @returns {Promise<void>} Resolves when loading completes.
 */
async function loadActivity() {
  loading.value = true
  error.value = ''

  try {
    const response =
        await studentConnect.getActivity(
            props.activityId
        )

    if (response?.success === false) {
      throw new Error(
          response.message ||
          'Unable to load this activity.'
      )
    }

    activity.value =
        response?.data ||
        null

    if (!activity.value) {
      error.value =
          'This activity could not be found.'

      return
    }

    updatePageMetadata()
  } catch (requestError) {
    error.value =
        requestError.message ||
        'Unable to load this activity.'
  } finally {
    loading.value = false
  }
}

/**
 * Joins the current Activity.
 *
 * The backend determines the authenticated user from
 * the Firebase ID token and enforces the participant limit.
 *
 * @returns {Promise<void>} Resolves after the join request.
 */
async function joinActivity() {
  if (
      joining.value ||
      !canJoin.value ||
      !activity.value?.id
  ) {
    return
  }

  joining.value = true

  try {
    const response =
        await studentConnect.joinActivity(
            activity.value.id
        )

    if (response?.success === false) {
      throw createApiError(response)
    }

    ElMessage.success(
        response?.message ||
        'You joined this activity.'
    )

    await loadActivity()
  } catch (requestError) {
    handleMembershipError(
        requestError,
        'Unable to join this activity.'
    )
  } finally {
    joining.value = false
  }
}

/**
 * Leaves the current Activity.
 *
 * The backend removes the current user's membership
 * while preserving participant history.
 *
 * @returns {Promise<void>} Resolves after the leave request.
 */
async function leaveActivity() {
  if (
      leaving.value ||
      !canLeave.value ||
      !activity.value?.id
  ) {
    return
  }

  leaving.value = true

  try {
    const response =
        await studentConnect.leaveActivity(
            activity.value.id
        )

    if (response?.success === false) {
      throw createApiError(response)
    }

    ElMessage.success(
        response?.message ||
        'You left this activity.'
    )

    await loadActivity()
  } catch (requestError) {
    handleMembershipError(
        requestError,
        'Unable to leave this activity.'
    )
  } finally {
    leaving.value = false
  }
}

/**
 * Creates a normal Error while preserving the backend error code.
 *
 * @param {Object} response - API response.
 * @returns {Error} Error containing API metadata.
 */
function createApiError(response) {
  const apiError =
      new Error(
          response?.message ||
          'The request could not be completed.'
      )

  apiError.code =
      response?.error ||
      ''

  return apiError
}

/**
 * Handles join/leave errors returned by the API.
 *
 * @param {Error} requestError - Request error.
 * @param {string} fallbackMessage - Default error message.
 * @returns {void}
 */
function handleMembershipError(
    requestError,
    fallbackMessage
) {
  const messages = {
    ACTIVITY_FULL:
        'This activity is already full.',

    ALREADY_JOINED:
        'You have already joined this activity.',

    NOT_PARTICIPANT:
        'You are not a participant of this activity.',

    OWNER_CANNOT_JOIN:
        'The activity owner cannot join their own activity.',

    OWNER_CANNOT_LEAVE:
        'The activity owner cannot leave their own activity.',

    REGISTRATION_CLOSED:
        'Registration for this activity has closed.',

    ACTIVITY_EXPIRED:
        'This activity is no longer accepting participants.',

    ACTIVITY_CANCELLED:
        'This activity has been cancelled.',

    ACTIVITY_NOT_FOUND:
        'This activity could not be found.'
  }

  ElMessage.error(
      messages[requestError?.code] ||
      requestError?.message ||
      fallbackMessage
  )

  if (
      [
        'ACTIVITY_FULL',
        'ALREADY_JOINED',
        'NOT_PARTICIPANT'
      ].includes(requestError?.code)
  ) {
    loadActivity()
  }
}

/**
 * Returns the derived lifecycle status.
 *
 * @returns {string} Activity status key.
 */
const statusKey = computed(() => {
  const explicitStatus =
      String(
          activity.value?.status || ''
      ).toLowerCase()

  if (
      [
        'cancelled',
        'completed',
        'expired'
      ].includes(explicitStatus)
  ) {
    return explicitStatus
  }

  const now =
      Math.floor(Date.now() / 1000)

  const registrationDeadline =
      Number(
          activity.value?.registrationDeadline
      )

  const eventDate =
      Number(
          activity.value?.eventDate
      )

  return (
      (
          registrationDeadline > 0 &&
          registrationDeadline <= now
      ) ||
      (
          eventDate > 0 &&
          eventDate <= now
      )
  )
      ? 'expired'
      : 'open'
})

/**
 * Returns the visible lifecycle status.
 *
 * @returns {string} Human-readable status.
 */
const statusLabel = computed(() => ({
  open: 'Open',
  completed: 'Completed',
  cancelled: 'Cancelled',
  expired: 'Expired'
}[statusKey.value] || 'Open'))

/**
 * Returns status badge classes.
 *
 * @returns {string} Tailwind classes.
 */
const statusClass = computed(() => ({
  open: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-slate-100 text-slate-500',
  cancelled: 'bg-rose-100 text-rose-600',
  expired: 'bg-amber-100 text-amber-700'
}[statusKey.value]))

/**
 * Determines whether the activity is terminal.
 *
 * @returns {boolean} True for completed, cancelled, or expired.
 */
const isTerminal = computed(() => {
  return [
    'cancelled',
    'completed',
    'expired'
  ].includes(statusKey.value)
})

/**
 * Determines whether the current user owns the activity.
 *
 * @returns {boolean} True when the current user is the owner.
 */
const isOwner = computed(() => {
  const currentUserId =
      props.currentUser?.id ||
      props.currentUser?.uid ||
      props.currentUser?.userId ||
      ''

  const ownerId =
      activity.value?.owner?.id ||
      activity.value?.owner?.uid ||
      activity.value?.owner?.userId ||
      activity.value?.ownerId ||
      ''

  return Boolean(
      currentUserId &&
      ownerId &&
      String(currentUserId) ===
      String(ownerId)
  )
})

/**
 * Formats a Unix timestamp for detail display.
 *
 * Existing timestamps are rounded to the nearest
 * 15-minute interval for a cleaner visual presentation.
 *
 * @param {number|string} value - Unix timestamp in seconds.
 * @returns {string} Formatted date.
 */
function formatDate(value) {
  const timestamp =
      Number(value)

  if (
      !Number.isFinite(timestamp) ||
      timestamp <= 0
  ) {
    return 'Date unavailable'
  }

  const date =
      new Date(timestamp * 1000)

  if (
      Number.isNaN(
          date.getTime()
      )
  ) {
    return 'Date unavailable'
  }

  const minutes =
      date.getMinutes()

  const roundedMinutes =
      Math.round(minutes / 15) * 15

  if (
      roundedMinutes === 60
  ) {
    date.setHours(
        date.getHours() + 1
    )

    date.setMinutes(0)
  } else {
    date.setMinutes(
        roundedMinutes
    )
  }

  return new Intl.DateTimeFormat(
      'en-MY',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }
  ).format(date)
}

/**
 * Sets browser and social metadata for the current activity.
 *
 * @returns {void}
 */
function updatePageMetadata() {
  if (!activity.value) {
    return
  }

  const title =
      activity.value.title ||
      'Activity | Lend a Hand'

  const description =
      activity.value.description ||
      'Discover this activity on Lend a Hand.'

  const image =
      activity.value.posterUrl ||
      `${window.location.origin}/og-image.png`

  const url =
      activityUrl.value

  document.title =
      `${title} | Lend a Hand`

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
      'og:image',
      image,
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
      'Lend a Hand',
      'property'
  )

  setMeta(
      'twitter:card',
      'summary_large_image'
  )

  setMeta(
      'twitter:title',
      title
  )

  setMeta(
      'twitter:description',
      description
  )

  setMeta(
      'twitter:image',
      image
  )

  updateStructuredData({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: title,
    description,
    image: [image],
    startDate: toIsoDate(
        activity.value.eventDate
    ),
    maximumAttendeeCapacity:
        hasParticipantsLimit.value
            ? participantsLimit.value
            : undefined,
    attendeeCount:
        hasParticipantInformation.value
            ? participantCount.value
            : undefined,
    location: activity.value.location
        ? {
          '@type': 'Place',
          name: activity.value.location
        }
        : undefined,
    organizer: {
      '@type': 'Person',
      name: organizerName.value
    },
    url
  })
}

/**
 * Creates or updates a meta tag.
 *
 * @param {string} name - Metadata name.
 * @param {string} content - Metadata value.
 * @param {string} attribute - Attribute used to identify the tag.
 * @returns {void}
 */
function setMeta(
    name,
    content,
    attribute = 'name'
) {
  let element =
      document.head.querySelector(
          `meta[${attribute}="${name}"]`
      )

  if (!element) {
    element =
        document.createElement('meta')

    element.setAttribute(
        attribute,
        name
    )

    document.head.appendChild(element)
  }

  element.setAttribute(
      'content',
      content || ''
  )
}

/**
 * Converts a Unix timestamp into an ISO date.
 *
 * @param {number|string} value - Unix timestamp.
 * @returns {string|undefined} ISO date.
 */
function toIsoDate(value) {
  const timestamp =
      Number(value)

  if (
      !Number.isFinite(timestamp) ||
      timestamp <= 0
  ) {
    return undefined
  }

  return new Date(
      timestamp * 1000
  ).toISOString()
}

/**
 * Creates or updates the activity structured-data script.
 *
 * @param {Object} data - Schema.org Event data.
 * @returns {void}
 */
function updateStructuredData(data) {
  let script =
      document.getElementById(
          'activity-structured-data'
      )

  if (!script) {
    script =
        document.createElement('script')

    script.id =
        'activity-structured-data'

    script.type =
        'application/ld+json'

    document.head.appendChild(script)
  }

  script.textContent =
      JSON.stringify(data)
}

/**
 * Shares the current activity using the native Web Share API
 * when available, otherwise copies the activity URL.
 *
 * @returns {Promise<void>} Resolves after sharing or copying.
 */
async function shareActivity() {
  const title =
      activity.value?.title ||
      'Lend a Hand Activity'

  const text =
      activity.value?.description
          ? `${title}\n\n${activity.value.description}`
          : title

  try {
    if (
        navigator.share &&
        typeof navigator.share === 'function'
    ) {
      await navigator.share({
        title,
        text,
        url: activityUrl.value
      })

      return
    }

    await navigator.clipboard.writeText(
        activityUrl.value
    )

    ElMessage.success(
        'Activity link copied.'
    )
  } catch (shareError) {
    if (
        shareError?.name ===
        'AbortError'
    ) {
      return
    }

    try {
      await navigator.clipboard.writeText(
          activityUrl.value
      )

      ElMessage.success(
          'Activity link copied.'
      )
    } catch {
      ElMessage.error(
          'Unable to share this activity.'
      )
    }
  }
}

watch(
    () => activity.value,
    () => {
      updatePageMetadata()
    }
)

onMounted(loadActivity)

onUnmounted(() => {
  document.title = 'Lend a Hand'

  const structuredData =
      document.getElementById(
          'activity-structured-data'
      )

  if (structuredData) {
    structuredData.remove()
  }
})
</script>
