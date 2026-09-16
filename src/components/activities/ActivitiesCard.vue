<template>
  <article
      :id="`activity-card-${activity.id}`"
      class="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-xs transition-shadow duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-brand-200"
      tabindex="0"
      role="button"
      :aria-label="`View activity: ${activity.title}`"
      @click="emit('select', activity.id)"
      @keydown.enter="emit('select', activity.id)"
      @keydown.space.prevent="emit('select', activity.id)"
  >
    <!-- Poster -->
    <div class="relative aspect-video overflow-hidden bg-brand-50">
      <img
          v-if="activity.posterUrl"
          :src="activity.posterUrl"
          :alt="`${activity.title} poster`"
          class="h-full w-full object-cover"
          loading="lazy"
      />

      <div
          v-else
          class="flex h-full items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 text-brand-400"
      >
        <div class="flex flex-col items-center gap-2">
          <i class="fi fi-rr-calendar-star text-4xl"></i>

          <span
              class="text-[11px] font-semibold uppercase tracking-wider text-brand-500"
          >
            Activity
          </span>
        </div>
      </div>

      <!-- Poster Overlay -->
      <div
          class="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3"
      >
        <span
            class="max-w-[65%] truncate rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-brand-700 shadow-sm backdrop-blur"
        >
          {{ activity.category || 'Activity' }}
        </span>

        <span
            class="shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider shadow-sm backdrop-blur"
            :class="statusClass"
        >
          {{ statusLabel }}
        </span>
      </div>

      <!-- Date Badge -->
      <div
          v-if="eventDateParts"
          class="absolute bottom-3 left-3 flex w-14 flex-col overflow-hidden rounded-xl bg-white text-center shadow-md"
      >
        <span
            class="bg-brand-600 px-1 py-1 text-[9px] font-extrabold uppercase tracking-wider text-white"
        >
          {{ eventDateParts.month }}
        </span>

        <span
            class="px-1 py-1.5 text-xl font-black leading-none text-slate-900"
        >
          {{ eventDateParts.day }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-1 flex-col p-5">
      <!-- Title -->
      <div class="space-y-2">
        <h3
            class="line-clamp-2 text-base font-bold leading-snug text-slate-900"
        >
          {{ activity.title }}
        </h3>

        <p
            v-if="activity.description"
            class="line-clamp-2 text-xs leading-relaxed text-slate-500"
        >
          {{ activity.description }}
        </p>
      </div>

      <!-- Event Information -->
      <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- Date -->
        <div class="flex items-start gap-3">
          <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600"
          >
            <i class="fi fi-rr-calendar text-sm"></i>
          </div>

          <div class="min-w-0">
            <p
                class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
            >
              Event Date
            </p>

            <p
                class="mt-1 text-sm font-semibold leading-snug text-slate-700"
            >
              {{ formatDate(activity.eventDate) }}
            </p>
          </div>
        </div>

        <!-- Registration -->
        <div
            v-if="activity.registrationDeadline"
            class="flex items-start gap-3"
        >
          <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600"
          >
            <i class="fi fi-rr-clock text-sm"></i>
          </div>

          <div class="min-w-0">
            <p
                class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
            >
              Registration
            </p>

            <p
                class="mt-1 text-sm font-semibold leading-snug text-slate-700"
            >
              Closes at {{ formatDate(activity.registrationDeadline) }}
            </p>
          </div>
        </div>

        <!-- Participants -->
        <div
            v-if="hasParticipantInformation"
            class="flex items-start gap-3"
        >
          <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600"
          >
            <i class="fi fi-rr-users text-sm"></i>
          </div>

          <div class="min-w-0">
            <p
                class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
            >
              Participants
            </p>

            <p
                class="mt-1 text-sm font-semibold leading-snug"
                :class="isFull ? 'text-amber-600' : 'text-slate-700'"
            >
              {{ participantLabel }}
            </p>
          </div>
        </div>

        <!-- Location -->
        <div class="flex items-start gap-3">
          <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500"
          >
            <i class="fi fi-rr-marker text-sm"></i>
          </div>

          <div class="min-w-0">
            <p
                class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
            >
              Location
            </p>

            <p
                class="mt-1 break-words text-sm font-semibold leading-snug text-slate-700"
                :title="activity.location || 'Location not specified'"
            >
              {{ activity.location || 'Location not specified' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div
          class="mt-5 flex items-center justify-between gap-3 pt-4"
          @click.stop
      >
        <!-- Organizer -->
        <div class="min-w-0">
          <p
              class="text-[10px] font-medium uppercase tracking-wider text-slate-400"
          >
            Organised by
          </p>

<!--          add (your) name here if you are the organizer -->

          <p class="mt-0.5 truncate text-xs font-semibold text-slate-600">
            {{ activity.owner?.name || 'Student' }} <v-if v-if="isOwner" class="text-xs font-normal text-slate-500">(You)</v-if>
          </p>
        </div>

        <!-- Actions -->
        <div class="flex shrink-0 items-center gap-2">
          <!-- Join / Leave -->
          <button
              v-if="showParticipationAction"
              :id="`activity-${activity.id}-participation-btn`"
              type="button"
              :disabled="participationLoading || isFull"
              class="flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60"
              :class="isJoined
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-brand-600 text-white shadow-sm hover:bg-brand-700'"
              @click="handleParticipation"
          >
            <i
                v-if="participationLoading"
                class="fi fi-rr-spinner animate-spin text-sm"
            ></i>

            <i
                v-else
                :class="isJoined
                    ? 'fi fi-rr-user-remove'
                    : 'fi fi-rr-user-add'"
                class="text-sm"
            ></i>

            <span>
              {{
                participationLoading
                    ? 'Please wait'
                    : isJoined
                        ? 'Leave'
                        : isFull
                            ? 'Full'
                            : 'Join'
              }}
            </span>
          </button>

          <!-- View -->
          <button
              :id="`view-activity-${activity.id}-btn`"
              type="button"
              class="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-brand-700"
              @click="emit('select', activity.id)"
          >
            View

            <i class="fi fi-rr-arrow-small-right text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import studentConnect from '@/api'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  },

  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['select'])

const participationLoading = ref(false)

/**
 * Converts common API timestamp formats into Unix seconds.
 *
 * @param {*} value - Timestamp value from the API.
 * @returns {number} Unix timestamp or zero.
 */
function getTimestamp(value) {
  if (typeof value === 'number') {
    return value > 100000000000
        ? Math.floor(value / 1000)
        : value
  }

  if (
      typeof value === 'string' &&
      /^\d+$/.test(value)
  ) {
    const numericValue = Number(value)

    return numericValue > 100000000000
        ? Math.floor(numericValue / 1000)
        : numericValue
  }

  const parsed = Date.parse(value || '')

  return Number.isNaN(parsed)
      ? 0
      : Math.floor(parsed / 1000)
}

/**
 * Returns the participant limit when provided by the API.
 *
 * @returns {number} Positive participant limit or zero.
 */
const participantsLimit = computed(() => {
  const value =
      Number(props.activity.participantsLimit)

  return Number.isInteger(value) && value > 0
      ? value
      : 0
})

/**
 * Returns the current number of students who joined the activity.
 *
 * The API excludes the activity owner from this array.
 *
 * @returns {number} Current participant count.
 */
const participantCount = computed(() => {
  return Array.isArray(props.activity.participants)
      ? props.activity.participants.length
      : 0
})

/**
 * Returns whether participant data is available from the API.
 *
 * @returns {boolean} True when the participants array exists.
 */
const hasParticipantInformation = computed(() => {
  return Array.isArray(
      props.activity.participants
  )
})

/**
 * Returns the current authenticated user's identifier.
 *
 * @returns {string} User identifier.
 */
const currentUserId = computed(() => {
  return String(
      props.currentUser?.id ||
      props.currentUser?.uid ||
      props.currentUser?.userId ||
      ''
  )
})

/**
 * Returns the activity owner's identifier.
 *
 * @returns {string} Owner identifier.
 */
const ownerId = computed(() => {
  return String(
      props.activity.owner?.id ||
      props.activity.owner?.uid ||
      props.activity.owner?.userId ||
      props.activity.ownerId ||
      ''
  )
})

/**
 * Returns whether the current user owns this activity.
 *
 * @returns {boolean} True when the authenticated user is the owner.
 */
const isOwner = computed(() => {
  return Boolean(
      currentUserId.value &&
      ownerId.value &&
      currentUserId.value === ownerId.value
  )
})

/**
 * Returns whether the current user has joined the activity.
 *
 * @returns {boolean} True when the current user is a participant.
 */
const isJoined = computed(() => {
  if (!currentUserId.value) {
    return false
  }

  if (!Array.isArray(props.activity.participants)) {
    return false
  }

  return props.activity.participants.some(
      (participant) => {
        const participantId =
            participant?.id ||
            participant?.uid ||
            participant?.userId ||
            ''

        return (
            String(participantId) ===
            currentUserId.value
        )
      }
  )
})

/**
 * Returns whether the activity has reached its participant limit.
 *
 * The activity owner is not included in this calculation.
 *
 * @returns {boolean} True when the participant limit has been reached.
 */
const isFull = computed(() => {
  return (
      participantsLimit.value > 0 &&
      participantCount.value >=
      participantsLimit.value
  )
})

/**
 * Returns whether the join/leave action should be displayed.
 *
 * @returns {boolean} True when the current user can participate.
 */
const showParticipationAction = computed(() => {
  return (
      Boolean(currentUserId.value) &&
      !isOwner.value &&
      statusKey.value === 'open' &&
      hasParticipantInformation.value
  )
})

/**
 * Returns the participant information displayed on the card.
 *
 * @returns {string} Participant count or capacity information.
 */
const participantLabel = computed(() => {
  if (!hasParticipantInformation.value) {
    return participantsLimit.value > 0
        ? `Up to ${participantsLimit.value}`
        : ''
  }

  if (participantsLimit.value > 0) {
    return isFull.value
        ? `${participantCount.value} / ${participantsLimit.value} · Full`
        : `${participantCount.value} / ${participantsLimit.value}`
  }

  return participantCount.value === 1
      ? '1 joined'
      : `${participantCount.value} joined`
})

/**
 * Returns the activity's lifecycle status.
 *
 * @returns {string} Activity lifecycle status.
 */
const statusKey = computed(() => {
  const explicitStatus =
      String(
          props.activity.status || ''
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

  const registrationDeadline =
      getTimestamp(
          props.activity.registrationDeadline
      )

  const eventDate =
      getTimestamp(
          props.activity.eventDate
      )

  const now =
      Math.floor(Date.now() / 1000)

  if (
      registrationDeadline > 0 &&
      registrationDeadline <= now
  ) {
    return 'expired'
  }

  if (
      registrationDeadline <= 0 &&
      eventDate > 0 &&
      eventDate <= now
  ) {
    return 'expired'
  }

  return 'open'
})

/**
 * Handles joining or leaving the activity.
 *
 * @returns {Promise<void>} Resolves after the membership request completes.
 */
async function handleParticipation() {
  if (
      participationLoading.value ||
      !currentUserId.value ||
      isOwner.value ||
      statusKey.value !== 'open'
  ) {
    return
  }

  if (
      !isJoined.value &&
      isFull.value
  ) {
    ElMessage.warning(
        'This activity is already full.'
    )

    return
  }

  participationLoading.value = true

  try {
    if (isJoined.value) {
      await studentConnect.leaveActivity(
          props.activity.id
      )

      ElMessage.success(
          'You have left the activity.'
      )
    } else {
      await studentConnect.joinActivity(
          props.activity.id
      )

      ElMessage.success(
          'You joined the activity.'
      )
    }

    const response =
        await studentConnect.getActivity(
            props.activity.id
        )

    if (response?.success && response.data) {
      Object.assign(
          props.activity,
          response.data
      )
    }
  } catch (error) {
    ElMessage.error(
        error?.message ||
        'Unable to update activity participation.'
    )

    /*
     * Refresh after a failed request as well.
     *
     * This handles race conditions such as another student
     * taking the final available place immediately before
     * this request reaches the backend.
     */
    try {
      const response =
          await studentConnect.getActivity(
              props.activity.id
          )

      if (
          response?.success &&
          response.data
      ) {
        Object.assign(
            props.activity,
            response.data
        )
      }
    } catch {
      // Keep the original participation error.
    }
  } finally {
    participationLoading.value = false
  }
}

/**
 * Returns the visible activity status label.
 *
 * @returns {string} Human-readable status.
 */
const statusLabel = computed(() => {
  return {
    open: 'Open',
    completed: 'Completed',
    cancelled: 'Cancelled',
    expired: 'Expired'
  }[statusKey.value] || 'Open'
})

/**
 * Returns the activity status badge styling.
 *
 * @returns {string} Tailwind classes.
 */
const statusClass = computed(() => {
  return {
        open: 'bg-emerald-500 text-white',
        completed: 'bg-slate-600 text-white',
        cancelled: 'bg-rose-500 text-white',
        expired: 'bg-amber-500 text-white'
      }[statusKey.value] ||
      'bg-slate-100 text-slate-600'
})

/**
 * Returns the event date split into month and day.
 *
 * @returns {{month: string, day: string}|null} Date parts or null.
 */
const eventDateParts = computed(() => {
  const timestamp =
      getTimestamp(
          props.activity.eventDate
      )

  if (!timestamp) {
    return null
  }

  const date =
      new Date(timestamp * 1000)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  const month =
      new Intl.DateTimeFormat(
          'en-MY',
          { month: 'short' }
      ).format(date)

  return {
    month: month.toUpperCase(),
    day: String(
        date.getDate()
    ).padStart(2, '0')
  }
})

/**
 * Formats a Unix timestamp for activity display.
 *
 * @param {*} value - Unix timestamp or date value.
 * @returns {string} Local date and time.
 */
function formatDate(value) {
  const timestamp =
      getTimestamp(value)

  if (!timestamp) {
    return 'Date unavailable'
  }

  const date =
      new Date(timestamp * 1000)

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable'
  }

  return new Intl.DateTimeFormat(
      'en-MY',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
  ).format(date)
}
</script>
