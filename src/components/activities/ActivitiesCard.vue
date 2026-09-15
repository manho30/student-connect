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
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Event Date
            </p>

            <p class="mt-1 text-sm font-semibold leading-snug text-slate-700">
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
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Registration
            </p>

            <p class="mt-1 text-sm font-semibold leading-snug text-slate-700">
              Closes {{ formatDate(activity.registrationDeadline) }}
            </p>
          </div>
        </div>

        <!-- Participant Limit -->
        <div
            v-if="hasParticipantsLimit"
            class="flex items-start gap-3"
        >
          <div
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600"
          >
            <i class="fi fi-rr-users text-sm"></i>
          </div>

          <div class="min-w-0">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Participants
            </p>

            <p class="mt-1 text-sm font-semibold leading-snug text-slate-700">
              Up to {{ participantsLimit }}
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
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
        <div class="min-w-0">
          <p
              class="text-[10px] font-medium uppercase tracking-wider text-slate-400"
          >
            Promoted by
          </p>

          <p class="mt-0.5 truncate text-xs font-semibold text-slate-600">
            {{ activity.owner?.name || 'Student' }}
          </p>
        </div>

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
  </article>
</template>

<script setup>
import { computed } from 'vue'

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

  if (typeof value === 'string' && /^\d+$/.test(value)) {
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
 * Returns the activity participant limit when provided by the API.
 *
 * @returns {number} Positive participant limit or zero.
 */
const participantsLimit = computed(() => {
  const value = Number(props.activity.participantsLimit)

  return Number.isInteger(value) && value > 0
      ? value
      : 0
})

/**
 * Returns whether the activity contains a valid participant limit.
 *
 * @returns {boolean} True when a participant limit exists.
 */
const hasParticipantsLimit = computed(() => {
  return participantsLimit.value > 0
})

/**
 * Returns the activity's derived lifecycle status.
 *
 * @returns {string} Activity lifecycle status.
 */
const statusKey = computed(() => {
  const explicitStatus = String(
      props.activity.status || ''
  ).toLowerCase()

  if (
      ['cancelled', 'completed', 'expired'].includes(explicitStatus)
  ) {
    return explicitStatus
  }

  const registrationDeadline = getTimestamp(
      props.activity.registrationDeadline
  )

  const eventDate = getTimestamp(
      props.activity.eventDate
  )

  const now = Math.floor(Date.now() / 1000)

  return (
      (registrationDeadline > 0 && registrationDeadline <= now) ||
      (eventDate > 0 && eventDate <= now)
  )
      ? 'expired'
      : 'open'
})

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
  }[statusKey.value] || 'bg-slate-100 text-slate-600'
})

/**
 * Returns the event date split into month and day for the poster badge.
 *
 * @returns {{month: string, day: string}|null} Date parts or null.
 */
const eventDateParts = computed(() => {
  const timestamp = getTimestamp(props.activity.eventDate)

  if (!timestamp) {
    return null
  }

  const date = new Date(timestamp * 1000)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  const month = new Intl.DateTimeFormat('en-MY', {
    month: 'short'
  }).format(date)

  return {
    month: month.toUpperCase(),
    day: String(date.getDate()).padStart(2, '0')
  }
})

/**
 * Formats a Unix timestamp for activity display.
 *
 * @param {*} value - Unix timestamp or date value.
 * @returns {string} Local date and time.
 */
function formatDate(value) {
  const timestamp = getTimestamp(value)

  if (!timestamp) {
    return 'Date unavailable'
  }

  const date = new Date(timestamp * 1000)

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable'
  }

  return new Intl.DateTimeFormat('en-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>
