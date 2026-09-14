<template>
  <article
      :id="`carpool-card-${carpool.id}`"
      class="flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm"
      tabindex="0"
      role="button"
      :aria-label="`View carpool from ${carpool.origin} to ${carpool.destination}`"
      @click="$emit('select', carpool.id)"
      @keydown.enter="$emit('select', carpool.id)"
      @keydown.space.prevent="$emit('select', carpool.id)"
  >
    <!-- Header -->
    <div class="flex items-center justify-between gap-3 px-5 pt-5">
      <div class="flex min-w-0 items-center gap-2">
        <span
            :class="[
            'shrink-0 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide',
            statusBadgeClass
          ]"
        >
          {{ statusLabel }}
        </span>

        <span
            v-if="isCreator"
            class="truncate text-[10px] font-medium text-brand-600"
        >
          Your ride
        </span>
      </div>

      <span
          :class="[
          'shrink-0 text-sm font-semibold',
          statusKey === 'open'
            ? 'text-brand-600'
            : 'text-slate-400'
        ]"
      >
        {{
          carpool.cost !== undefined && Number(carpool.cost) > 0
              ? `RM${Number(carpool.cost).toFixed(2)}`
              : 'Free'
        }}
      </span>
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 flex-col px-5 pb-5 pt-4">

      <!-- Route -->
      <div class="relative">

        <!-- Route connector -->
        <div
            class="absolute left-[9px] top-[10px] bottom-[10px] w-px bg-slate-200"
        ></div>

        <!-- Origin -->
        <div class="relative flex items-start gap-3">
          <div
              class="relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white"
          >
            <span class="h-2 w-2 rounded-full bg-slate-400 ring-4 ring-slate-100"></span>
          </div>

          <div class="min-w-0 flex-1 pb-4">
            <p class="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
              From
            </p>

            <p
                class="mt-1 truncate text-sm font-medium leading-tight text-slate-700"
                :title="carpool.origin"
            >
              {{ carpool.origin }}
            </p>
          </div>
        </div>

        <!-- Destination -->
        <div class="relative flex items-start gap-3">
          <div
              class="relative z-10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50"
          >
            <i class="fi fi-rr-marker text-[8px] text-brand-600"></i>
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-[9px] font-semibold uppercase tracking-wider text-brand-600">
              To
            </p>

            <p
                class="mt-1 truncate text-sm font-medium leading-tight text-slate-800"
                :title="carpool.destination"
            >
              {{ carpool.destination }}
            </p>
          </div>
        </div>

      </div>

      <!-- Trip Information -->
      <div class="mt-5 grid grid-cols-2 gap-3">
        <!-- Departure -->
        <div class="rounded-xl bg-brand-50/50 px-3 py-2.5">
          <div class="flex items-center gap-1.5">
            <i class="fi fi-rr-calendar text-[10px] text-brand-600"></i>

            <span class="text-[9px] font-medium uppercase tracking-wider text-brand-700">
              Departure
            </span>
          </div>

          <p class="mt-1 text-xs font-medium text-slate-700">
            {{ formatDateTime(carpool.departure).date }}
          </p>

          <p class="text-[11px] text-brand-700">
            {{ formatDateTime(carpool.departure).time }}
          </p>
        </div>

        <!-- Seats -->
        <div class="rounded-xl bg-slate-50 px-3 py-2.5">
          <div class="flex items-center gap-1.5">
            <i class="fi fi-rr-users text-[10px] text-slate-400"></i>

            <span class="text-[9px] font-medium uppercase tracking-wider text-slate-500">
              Seats
            </span>
          </div>

          <div class="mt-1 flex items-baseline gap-1">
            <span class="text-xs font-semibold text-slate-700">
              {{ participantCount }}
            </span>

            <span class="text-[11px] text-slate-400">
              / {{ capacity }}
            </span>
          </div>

          <div class="mt-2 h-1 overflow-hidden rounded-full bg-slate-200">
            <div
                class="h-full rounded-full"
                :class="seatProgressClass"
                :style="{ width: `${seatProgress}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Host -->
      <div class="mt-4 flex items-center gap-2">
        <div
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400"
        >
          <i class="fi fi-rr-user text-[9px]"></i>
        </div>

        <div class="min-w-0">
          <p class="text-[9px] font-medium uppercase tracking-wider text-slate-400">
            Hosted by
          </p>

          <p class="truncate text-[11px] font-medium text-slate-600">
            {{ carpool.owner?.name || 'Student' }}

            <span
                v-if="isCreator"
                class="text-brand-600"
            >
              · You
            </span>
          </p>
        </div>

        <span
            v-if="participantCount > 0"
            class="ml-auto shrink-0 text-[10px] text-slate-400"
        >
          {{ participantCount }}
          {{ participantCount === 1 ? 'student' : 'students' }}
        </span>
      </div>

      <!-- Notes -->
      <div
          v-if="carpool.notes"
          class="mt-3 flex items-start gap-2"
      >
        <i class="fi fi-rr-info mt-0.5 shrink-0 text-[10px] text-slate-300"></i>

        <p class="line-clamp-2 text-[11px] leading-relaxed text-slate-400">
          {{ carpool.notes }}
        </p>
      </div>

      <!-- Actions -->
      <div
          class="mt-4"
          @click.stop
      >
        <!-- Creator -->
        <template v-if="isCreator && canEdit">
          <div class="grid grid-cols-2 gap-2">
            <button
                :id="`edit-creator-btn-${carpool.id}`"
                type="button"
                class="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand-50 py-2 text-[11px] font-medium text-brand-700"
                @click="$emit('edit', carpool)"
            >
              <i class="fi fi-rr-edit text-[10px]"></i>
              Edit Ride
            </button>

            <button
                :id="`leave-carpool-${carpool.id}`"
                type="button"
                class="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-slate-50 py-2 text-[11px] font-medium text-slate-600"
                @click="$emit('leave', carpool.id)"
            >
              Cancel Spot
            </button>
          </div>
        </template>

        <!-- Passenger -->
        <button
            v-else-if="isJoined && canLeave"
            :id="`leave-carpool-${carpool.id}`"
            type="button"
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-slate-50 py-2.5 text-[11px] font-medium text-slate-600"
            @click="$emit('leave', carpool.id)"
        >
          <i class="fi fi-rr-sign-out-alt text-xs"></i>
          Leave Carpool
        </button>

        <!-- Expired / Cancelled -->
        <button
            v-else-if="statusKey === 'expired' || statusKey === 'cancelled'"
            :id="`join-carpool-${carpool.id}`"
            type="button"
            disabled
            class="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-slate-50 py-2.5 text-[11px] font-medium text-slate-400"
        >
          <i
              :class="
              statusKey === 'cancelled'
                ? 'fi fi-rr-cross-circle'
                : 'fi fi-rr-time-past'
            "
          ></i>

          {{ statusLabel }}
        </button>

        <!-- Available -->
        <button
            v-else-if="statusKey === 'open'"
            :id="`join-carpool-${carpool.id}`"
            type="button"
            class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand-600 py-2.5 text-[11px] font-semibold text-white"
            @click="$emit('join', carpool.id)"
        >
          Join Ride
          <i class="fi fi-rr-arrow-small-right text-xs"></i>
        </button>

        <!-- Full -->
        <button
            v-else
            :id="`join-carpool-${carpool.id}`"
            type="button"
            disabled
            class="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-slate-50 py-2.5 text-[11px] font-medium text-slate-400"
        >
          <i class="fi fi-rr-users text-xs"></i>
          {{ statusLabel }}
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { formatDateTime } from '@/helper/dateTimeConvert'

const props = defineProps({
  carpool: {
    type: Object,
    required: true
  },

  currentUser: {
    type: Object,
    required: true
  }
})

defineEmits([
  'join',
  'leave',
  'edit',
  'select'
])

const currentTimestamp = ref(
    Math.floor(Date.now() / 1000)
)

let timeUpdateInterval = null

/**
 * Determines whether the current user owns the carpool.
 *
 * @returns {boolean} True when the current user owns the carpool.
 */
const isCreator = computed(() => {
  if (!props.currentUser?.id) {
    return false
  }

  return String(props.carpool.owner?.id || '') ===
      String(props.currentUser.id)
})

/**
 * Calculates the number of students currently participating.
 *
 * @returns {number} Number of participants.
 */
const participantCount = computed(() => {
  if (Array.isArray(props.carpool.participants)) {
    return props.carpool.participants.length
  }

  if (
      props.carpool.participants &&
      typeof props.carpool.participants === 'object'
  ) {
    return Object.keys(props.carpool.participants).length
  }

  return 0
})

/**
 * Returns the configured carpool capacity.
 *
 * @returns {number} Carpool capacity.
 */
const capacity = computed(() => {
  const value = Number(props.carpool.capacity)

  return Number.isFinite(value) && value > 0
      ? value
      : 0
})

/**
 * Determines whether the carpool has reached its capacity.
 *
 * @returns {boolean} True when the carpool is full.
 */
const isFull = computed(() => {
  return capacity.value > 0 &&
      participantCount.value >= capacity.value
})

/**
 * Calculates the percentage of occupied seats.
 *
 * @returns {number} Occupancy percentage.
 */
const seatProgress = computed(() => {
  if (!capacity.value) {
    return 0
  }

  return Math.min(
      100,
      Math.round(
          (participantCount.value / capacity.value) * 100
      )
  )
})

/**
 * Returns the seat progress bar styling.
 *
 * @returns {string} Tailwind classes.
 */
const seatProgressClass = computed(() => {
  if (statusKey.value === 'full') {
    return 'bg-slate-400'
  }

  if (seatProgress.value >= 75) {
    return 'bg-amber-500'
  }

  return 'bg-brand-500'
})

/**
 * Determines whether the current departure time has passed.
 *
 * @returns {boolean} True when departure has passed.
 */
const isDeparturePassed = computed(() => {
  const departure = Number(props.carpool.departure)

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
      props.carpool.status || ''
  ).toLowerCase()

  if (
      ['cancelled', 'expired'].includes(explicitStatus)
  ) {
    return explicitStatus
  }

  if (isDeparturePassed.value) {
    return 'expired'
  }

  return isFull.value
      ? 'full'
      : 'open'
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
 * Returns the status badge styling.
 *
 * @returns {string} Tailwind classes.
 */
const statusBadgeClass = computed(() => {
  return {
    open: 'bg-emerald-100 text-emerald-700',
    full: 'bg-slate-100 text-slate-500',
    cancelled: 'bg-rose-100 text-rose-600',
    expired: 'bg-amber-100 text-amber-700'
  }[statusKey.value] || 'bg-slate-100 text-slate-600'
})

/**
 * Determines whether the owner may edit the carpool.
 *
 * @returns {boolean} True when the carpool is editable.
 */
const canEdit = computed(() => {
  return ['open', 'full'].includes(statusKey.value)
})

/**
 * Determines whether a participant may leave the carpool.
 *
 * @returns {boolean} True when leaving is allowed.
 */
const canLeave = computed(() => {
  return ['open', 'full'].includes(statusKey.value)
})

/**
 * Determines whether the current user has joined the carpool.
 *
 * @returns {boolean} True when the current user is a participant.
 */
const isJoined = computed(() => {
  if (!props.currentUser?.id) {
    return false
  }

  const currentUserId = String(
      props.currentUser.id
  )

  if (Array.isArray(props.carpool.participants)) {
    return props.carpool.participants.some(
        (participant) =>
            String(participant?.id || '') === currentUserId
    )
  }

  if (
      props.carpool.participants &&
      typeof props.carpool.participants === 'object'
  ) {
    return Object.prototype.hasOwnProperty.call(
        props.carpool.participants,
        currentUserId
    )
  }

  return false
})

/**
 * Updates the current Unix timestamp.
 *
 * @returns {void}
 */
function updateCurrentTimestamp() {
  currentTimestamp.value = Math.floor(
      Date.now() / 1000
  )
}

onMounted(() => {
  timeUpdateInterval = window.setInterval(
      updateCurrentTimestamp,
      1000
  )
})

onUnmounted(() => {
  if (timeUpdateInterval !== null) {
    window.clearInterval(timeUpdateInterval)
    timeUpdateInterval = null
  }
})
</script>
