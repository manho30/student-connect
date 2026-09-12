<template>
  <article
      :id="`activity-card-${activity.id}`"
      class="flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-200 hover:border-indigo-300 hover:shadow-sm"
      @click="emit('select', activity.id)"
  >
    <div class="space-y-4">
      <div class="relative aspect-video overflow-hidden rounded-xl bg-indigo-50">
        <img
            v-if="activity.posterUrl"
            :src="activity.posterUrl"
            :alt="`${activity.title} poster`"
            class="h-full w-full object-cover"
        />
        <div v-else class="flex h-full items-center justify-center text-indigo-400">
          <i class="fi fi-rr-calendar-star text-4xl"></i>
        </div>
      </div>

      <div class="flex items-start justify-between gap-3">
        <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
          {{ activity.category || 'Activity' }}
        </span>
        <span
            class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider"
            :class="statusClass"
        >
          {{ statusLabel }}
        </span>
      </div>

      <div class="space-y-1.5">
        <h3 class="line-clamp-2 text-base font-bold leading-snug text-slate-900">
          {{ activity.title }}
        </h3>
        <p class="line-clamp-2 text-xs leading-relaxed text-slate-500">
          {{ activity.description }}
        </p>
      </div>

      <div class="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
        <p class="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <i class="fi fi-rr-calendar text-indigo-500"></i>
          {{ formatDate(activity.eventDate) }}
        </p>
        <p class="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <i class="fi fi-rr-clock text-indigo-500"></i>
          Registration {{ activity.registrationDeadline ? `closes ${formatDate(activity.registrationDeadline)}` : 'deadline not specified' }}
        </p>
        <p class="flex items-center gap-2 truncate text-xs font-semibold text-slate-700">
          <i class="fi fi-rr-marker text-rose-500"></i>
          {{ activity.location }}
        </p>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-between gap-3" @click.stop>
      <span class="truncate text-[11px] text-slate-400">
        By {{ activity.owner?.name || 'Student' }}
      </span>
      <button
          type="button"
          class="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-indigo-700"
          @click="emit('select', activity.id)"
      >
        View Activity
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activity: { type: Object, required: true },
  currentUser: { type: Object, default: null }
})

const emit = defineEmits(['select'])

/**
 * Returns the activity's derived lifecycle status.
 *
 * @returns {string} open, completed, cancelled, or expired.
 */
const statusKey = computed(() => {
  const explicitStatus = String(props.activity.status || '').toLowerCase()
  if (['cancelled', 'completed'].includes(explicitStatus)) return explicitStatus

  const registrationDeadline = Number(props.activity.registrationDeadline)
  const eventDate = Number(props.activity.eventDate)
  const now = Math.floor(Date.now() / 1000)
  return registrationDeadline > 0 && registrationDeadline <= now ||
    eventDate > 0 && eventDate <= now
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
    open: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-slate-100 text-slate-500',
    cancelled: 'bg-rose-100 text-rose-600',
    expired: 'bg-amber-100 text-amber-700'
  }[statusKey.value]
})

/**
 * Formats a Unix timestamp for activity display.
 *
 * @param {number|string} value - Unix timestamp in seconds.
 * @returns {string} Local date and time.
 */
function formatDate(value) {
  const date = new Date(Number(value) * 1000)
  return Number.isNaN(date.getTime())
      ? 'Date unavailable'
      : new Intl.DateTimeFormat('en-MY', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
}
</script>
