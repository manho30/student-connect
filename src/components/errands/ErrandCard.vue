<template>
  <article
      :id="`errand-card-${errand.id}`"
      :class="[
      'group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white shadow-xs transition-all duration-200',
      isActive
        ? 'border-slate-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md'
        : 'border-slate-200'
    ]"
      tabindex="0"
      role="button"
      :aria-label="`View errand: ${errand.title}`"
      @click="$emit('select', errand.id)"
      @keydown.enter="$emit('select', errand.id)"
      @keydown.space.prevent="$emit('select', errand.id)"
  >
    <!-- Header -->
    <div class="flex items-center justify-between gap-3 px-5 pt-5">
      <div class="flex min-w-0 items-center gap-2">
        <span
            :class="[
            'shrink-0 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider',
            statusBadgeClass
          ]"
        >
          {{ statusLabel }}
        </span>

        <span
            v-if="isRequester"
            class="truncate rounded-full border border-brand-200 bg-brand-50 px-2.5 py-1 text-[10px] font-bold text-brand-700"
        >
          Your Errand
        </span>
      </div>

      <!-- Accepted Indicator -->
      <div
          v-if="currentStatus === 'accepted'"
          class="flex shrink-0 items-center gap-1.5 text-[10px] font-bold text-blue-600"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
        In progress
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 flex-col px-5 pb-5 pt-5">
      <!-- Title -->
      <div>
        <h3
            class="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-700"
        >
          {{ errand.title }}
        </h3>

        <p
            v-if="errand.description"
            class="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500"
        >
          {{ errand.description }}
        </p>
      </div>

      <!-- Errand Information -->
      <div class="mt-5 space-y-3">
        <!-- Location -->
        <div class="flex items-start gap-3">
          <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-500"
          >
            <i class="fi fi-rr-marker text-sm"></i>
          </div>

          <div class="min-w-0 pt-0.5">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Location
            </p>

            <p
                class="mt-0.5 truncate text-xs font-semibold text-slate-700"
                :title="errand.location || 'Location not specified'"
            >
              {{ errand.location || 'Location not specified' }}
            </p>
          </div>
        </div>

        <!-- Deadline -->
        <div class="flex items-start gap-3">
          <div
              :class="[
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
              deadlineUrgencyClass
            ]"
          >
            <i class="fi fi-rr-clock text-sm"></i>
          </div>

          <div class="min-w-0 pt-0.5">
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Needed By
            </p>

            <p
                :class="[
                'mt-0.5 truncate text-xs font-semibold',
                deadlineTextClass
              ]"
            >
              {{ formatDeadline(errand.deadline) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Requester / Helper -->
      <div class="mt-5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
        <div class="flex items-center justify-between gap-3">
          <!-- Requester -->
          <div class="flex min-w-0 items-center gap-2">
            <div class="min-w-0">
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Requested by
              </p>

              <p class="truncate text-xs font-semibold text-slate-700">
                {{ errand.requester?.name || 'Student' }}
              </p>
            </div>
          </div>

          <!-- Helper -->
          <div
              v-if="currentStatus === 'accepted'"
              class="min-w-0 text-right"
          >
            <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Helper
            </p>

            <p class="truncate text-xs font-semibold text-blue-600">
              {{ isAcceptedByMe ? 'You' : errand.helper?.name || 'Peer' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-5" @click.stop>
        <!-- Open / Other Student -->
        <button
            v-if="currentStatus === 'open' && !isRequester"
            :id="`accept-errand-${errand.id}`"
            type="button"
            class="group/action flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-600 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-md active:scale-[0.99]"
            @click="$emit('accept', errand.id)"
        >
          Accept Errand
          <i class="fi fi-rr-arrow-small-right text-sm transition-transform group-hover/action:translate-x-0.5"></i>
        </button>

        <!-- Own Open Errand -->
        <button
            v-else-if="currentStatus === 'open' && isRequester"
            :id="`own-errand-${errand.id}`"
            type="button"
            disabled
            class="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-400"
        >
          <i class="fi fi-rr-user text-sm"></i>
          Your Errand
        </button>

        <!-- Accepted By Me -->
        <button
            v-else-if="
            currentStatus === 'accepted' &&
            isAcceptedByMe &&
            !isRequester
          "
            :id="`complete-errand-${errand.id}`"
            type="button"
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.99]"
            @click="$emit('complete', errand.id)"
        >
          <i class="fi fi-rr-check text-sm"></i>
          Mark Completed
        </button>

        <!-- Accepted By Someone Else -->
        <button
            v-else-if="
            currentStatus === 'accepted' &&
            !isAcceptedByMe
          "
            :id="`accepted-errand-${errand.id}`"
            type="button"
            disabled
            class="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-blue-50 py-3 text-xs font-bold text-blue-500"
        >
          <i class="fi fi-rr-user text-sm"></i>
          Accepted by another student
        </button>

        <!-- Completed -->
        <button
            v-else-if="currentStatus === 'completed'"
            :id="`completed-errand-${errand.id}`"
            type="button"
            disabled
            class="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-400"
        >
          <i class="fi fi-rr-check text-sm text-emerald-500"></i>
          Completed
        </button>

        <!-- Cancelled -->
        <button
            v-else-if="currentStatus === 'cancelled'"
            :id="`cancelled-errand-${errand.id}`"
            type="button"
            disabled
            class="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-400"
        >
          <i class="fi fi-rr-cross-circle text-sm"></i>
          Cancelled
        </button>

        <!-- Expired -->
        <button
            v-else
            :id="`expired-errand-${errand.id}`"
            type="button"
            disabled
            class="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 py-3 text-xs font-bold text-slate-400"
        >
          <i class="fi fi-rr-time-past text-sm"></i>
          Expired
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  errand: {
    type: Object,
    required: true
  },

  currentUser: {
    type: Object,
    default: () => ({
      id: '',
      name: 'Student'
    })
  }
})

defineEmits([
  'accept',
  'complete',
  'select'
])

/**
 * Determines whether the current authenticated student
 * is the requester who created the errand.
 *
 * @returns {boolean} True when the current user is the requester.
 */
const isRequester = computed(() => {
  if (!props.currentUser?.id) {
    return false
  }

  return String(props.currentUser.id) ===
      String(props.errand?.requester?.id || '')
})

/**
 * Determines whether the current authenticated student
 * is the helper assigned to the errand.
 *
 * @returns {boolean} True when the current user is the helper.
 */
const isAcceptedByMe = computed(() => {
  if (!props.currentUser?.id) {
    return false
  }

  return String(props.currentUser.id) ===
      String(props.errand?.helper?.id || '')
})

/**
 * Returns the backend-aligned errand status.
 *
 * @returns {string} open, accepted, completed, cancelled, or expired.
 */
const currentStatus = computed(() => {
  const status = String(
      props.errand?.status || ''
  ).toLowerCase()

  if (
      ['accepted', 'completed', 'cancelled', 'expired']
          .includes(status)
  ) {
    return status
  }

  const deadline = getTimestamp(
      props.errand?.deadline
  )

  return deadline > 0 &&
  Math.floor(Date.now() / 1000) >= deadline
      ? 'expired'
      : 'open'
})

/**
 * Returns whether the errand is currently active.
 *
 * @returns {boolean} True for open or accepted errands.
 */
const isActive = computed(() => {
  return ['open', 'accepted'].includes(
      currentStatus.value
  )
})

/**
 * Returns the visible errand status label.
 *
 * @returns {string} Human-readable status.
 */
const statusLabel = computed(() => {
  return {
    open: 'Available',
    accepted: 'Accepted',
    completed: 'Completed',
    cancelled: 'Cancelled',
    expired: 'Expired'
  }[currentStatus.value] || 'Available'
})

/**
 * Returns the status badge styling.
 *
 * @returns {string} Tailwind classes.
 */
const statusBadgeClass = computed(() => {
  return {
    open: 'bg-emerald-100 text-emerald-700',
    accepted: 'bg-blue-100 text-blue-700',
    completed: 'bg-slate-100 text-slate-500',
    cancelled: 'bg-rose-100 text-rose-600',
    expired: 'bg-amber-100 text-amber-700'
  }[currentStatus.value] || 'bg-slate-100 text-slate-600'
})

/**
 * Returns the deadline urgency styling.
 *
 * @returns {string} Tailwind classes.
 */
const deadlineUrgencyClass = computed(() => {
  if (currentStatus.value === 'expired') {
    return 'bg-amber-50 text-amber-600'
  }

  const deadline = getTimestamp(
      props.errand?.deadline
  )

  if (!deadline) {
    return 'bg-slate-100 text-slate-500'
  }

  const remaining =
      deadline - Math.floor(Date.now() / 1000)

  if (remaining <= 60 * 60 * 6) {
    return 'bg-rose-50 text-rose-500'
  }

  if (remaining <= 60 * 60 * 24) {
    return 'bg-amber-50 text-amber-600'
  }

  return 'bg-brand-50 text-brand-600'
})

/**
 * Returns the deadline text styling.
 *
 * @returns {string} Tailwind classes.
 */
const deadlineTextClass = computed(() => {
  if (currentStatus.value === 'expired') {
    return 'text-amber-600'
  }

  const deadline = getTimestamp(
      props.errand?.deadline
  )

  if (!deadline) {
    return 'text-slate-500'
  }

  const remaining =
      deadline - Math.floor(Date.now() / 1000)

  if (remaining <= 60 * 60 * 6) {
    return 'text-rose-600'
  }

  if (remaining <= 60 * 60 * 24) {
    return 'text-amber-600'
  }

  return 'text-slate-700'
})

/**
 * Converts common API timestamp formats into Unix seconds.
 *
 * @param {*} value - Timestamp value.
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
 * Formats a Unix deadline timestamp for display.
 *
 * @param {*} deadline - Timestamp value.
 * @returns {string} Formatted local date and time.
 */
function formatDeadline(deadline) {
  const timestamp = getTimestamp(deadline)

  if (!timestamp) {
    return 'No deadline'
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
