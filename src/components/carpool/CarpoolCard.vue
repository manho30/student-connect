<template>
  <div
      :id="'carpool-card-' + carpool.id"
      :class="[
      'bg-white rounded-2xl p-6 border shadow-xs flex flex-col justify-between transition-all duration-200 relative cursor-pointer',
      statusKey !== 'open'
        ? 'border-slate-200 opacity-85'
        : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
    ]"
      @click="$emit('select', carpool.id)"
  >
    <div class="space-y-4">
      <!-- Status Badge & Cost & Creator Edit -->
      <div class="flex justify-between items-center gap-2">
        <div class="flex items-center gap-2">
          <span
              :class="[
              'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
              statusBadgeClass
            ]"
          >
            {{ statusLabel }}
          </span>

          <span
              v-if="isCreator && canEdit"
              class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
          >
        Your Ride
      </span>
        </div>

        <div class="flex items-center gap-2" @click.stop>
          <button
              v-if="isCreator"
              :id="'edit-carpool-btn-' + carpool.id"
              type="button"
              class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors flex items-center gap-1 cursor-pointer border border-indigo-100"
              title="Edit this ride"
              @click="$emit('edit', carpool)"
          >
            <i class="fi fi-rr-edit text-xs"></i>
            <span>Edit</span>
          </button>

          <span
              :class="[
          'font-bold text-lg',
          statusKey !== 'open' ? 'text-slate-400' : 'text-indigo-600'
        ]"
          >
        {{
              carpool.cost !== undefined && Number(carpool.cost) > 0
                  ? `RM${Number(carpool.cost).toFixed(2)}`
                  : 'Free'
            }}
      </span>
        </div>
      </div>

      <!-- Route Visual Line -->
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-slate-300 shrink-0"></div>

          <div class="font-semibold text-slate-800 text-sm truncate">
            {{ carpool.origin }}
          </div>
        </div>

        <div
            class="h-6 border-l-2 border-dashed border-slate-200 ml-[3px]"
        ></div>

        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>

          <div class="font-semibold text-slate-800 text-sm truncate">
            {{ carpool.destination }}
          </div>
        </div>
      </div>

      <!-- Meta Grid -->
      <div class="grid grid-cols-2 gap-2 pt-2">
        <div
            class="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80"
        >
          <div
              class="text-[10px] text-slate-500 uppercase font-bold tracking-wider"
          >
            Date & Time
          </div>

          <div class="text-xs font-semibold text-slate-800 mt-0.5">
            {{
              formatDateTime(carpool.departure).date
            }} at {{
              formatDateTime(carpool.departure).time
            }}
          </div>
        </div>

        <div
            class="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80"
        >
          <div
              class="text-[10px] text-slate-500 uppercase font-bold tracking-wider"
          >
            Joined
          </div>

          <div class="text-xs font-semibold text-slate-800 mt-0.5">
            {{ participantCount }} / {{ carpool.capacity }} Seats
          </div>
        </div>
      </div>

      <!-- Host & Notes -->
      <div class="space-y-1.5">
        <div
            class="text-[11px] text-slate-400 flex items-center justify-between"
        >
          <div class="flex items-center gap-1.5">
            <i class="fi fi-rr-user text-xs"></i>

            <span>
          Hosted by
          <strong class="text-slate-600 font-semibold">
            {{ carpool.owner?.name || 'Student' }}
            <strong
                v-if="carpool.owner?.id === currentUser.id"
                class="text-xs text-indigo-600 font-normal"
            >
              (You)
            </strong>
          </strong>
        </span>
          </div>

          <div
              v-if="participantCount > 0"
              class="text-[10px] text-indigo-600 font-medium"
          >
            {{ participantCount }}
            student{{ participantCount === 1 ? '' : 's' }}
            on board
          </div>
        </div>

        <p
            v-if="carpool.notes"
            class="text-xs text-slate-500 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100 line-clamp-2"
        >
          <i class="fi fi-rr-info text-slate-400 mr-1"></i>
          {{ carpool.notes }}
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-6 space-y-2" @click.stop>
      <!-- Host Actions -->
      <div v-if="isCreator && canEdit" class="grid grid-cols-2 gap-2">
        <button
            :id="'edit-creator-btn-' + carpool.id"
            type="button"
            class="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-200"
            @click="$emit('edit', carpool)"
        >
          <i class="fi fi-rr-edit text-xs"></i>
          <span>Edit Ride</span>
        </button>

        <button
            :id="'leave-carpool-' + carpool.id"
            type="button"
            class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            @click="$emit('leave', carpool.id)"
        >
          <span>Cancel Spot</span>
        </button>
      </div>

      <!-- Current User Is a Passenger -->
      <button
          v-else-if="isJoined && canLeave"
          :id="'leave-carpool-' + carpool.id"
          type="button"
          class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          @click="$emit('leave', carpool.id)"
      >
        <svg
            class="w-4 h-4 text-shadow-rose-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>

        <span>Leave Carpool</span>
      </button>

      <!-- Departure Has Passed -->
      <button
          v-else-if="statusKey === 'expired' || statusKey === 'cancelled'"
          :id="'join-carpool-' + carpool.id"
          type="button"
          disabled
          class="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
      >
        {{ statusLabel }}
      </button>

      <!-- Seats Available -->
      <button
          v-else-if="statusKey === 'open'"
          :id="'join-carpool-' + carpool.id"
          type="button"
          class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
          @click="$emit('join', carpool.id)"
      >
        Join Ride
      </button>

      <!-- Fully Booked -->
      <button
          v-else
          :id="'join-carpool-' + carpool.id"
          type="button"
          disabled
          class="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
      >
        {{ statusLabel }}
      </button>
    </div>

  </div>
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

const currentTimestamp = ref(Math.floor(Date.now() / 1000))
let timeUpdateInterval = null

/**
 * Determines whether the current user owns the carpool.
 *
 * @returns {boolean} True when the current user's ID matches owner.id.
 */
const isCreator = computed(() => {
  if (!props.currentUser?.id) {
    return false
  }

  return props.carpool.owner?.id === props.currentUser.id
})

/**
 * Calculates the number of students currently participating in the carpool.
 *
 * @returns {number} Number of participants.
 */
const participantCount = computed(() => {
  if (!Array.isArray(props.carpool.participants)) {
    return 0
  }

  return props.carpool.participants.length
})

/**
 * Determines whether the carpool has reached its capacity.
 *
 * @returns {boolean} True when the participant count reaches the carpool capacity.
 */
const isFull = computed(() => {
  const capacity = Number(props.carpool.capacity || 0)

  return participantCount.value >= capacity
})

/**
 * Determines whether the carpool departure time has passed.
 *
 * @returns {boolean} True when the current time is at or after departure.
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
  const explicitStatus = String(props.carpool.status || '').toLowerCase()
  if (explicitStatus === 'cancelled' || explicitStatus === 'expired') {
    return explicitStatus
  }
  if (isDeparturePassed.value) return 'expired'
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
 * Returns the list-card status badge styling.
 *
 * @returns {string} Tailwind classes.
 */
const statusBadgeClass = computed(() => {
  return {
    open: 'bg-emerald-100 text-emerald-700',
    full: 'bg-slate-100 text-slate-500',
    cancelled: 'bg-rose-100 text-rose-600',
    expired: 'bg-amber-100 text-amber-700'
  }[statusKey.value]
})

/**
 * Determines whether the owner may edit this carpool.
 *
 * @returns {boolean} True when the carpool is not terminal.
 */
const canEdit = computed(() => {
  return ['open', 'full'].includes(statusKey.value)
})

/**
 * Determines whether a participant may leave this carpool.
 *
 * @returns {boolean} True when the carpool is active.
 */
const canLeave = computed(() => {
  return ['open', 'full'].includes(statusKey.value)
})

/**
 * Determines whether the current user is already a participant.
 *
 * @returns {boolean} True when the current user's ID exists in participants.
 */
const isJoined = computed(() => {
  if (!props.currentUser?.id) {
    return false
  }

  if (!Array.isArray(props.carpool.participants)) {
    return false
  }

  return props.carpool.participants.some(
      (participant) => participant?.id === props.currentUser.id
  )
})

/**
 * Updates the local current Unix timestamp.
 *
 * @returns {void}
 */
function updateCurrentTimestamp() {
  currentTimestamp.value = Math.floor(Date.now() / 1000)
}

onMounted(() => {
  timeUpdateInterval = window.setInterval(updateCurrentTimestamp, 1000)
})

onUnmounted(() => {
  if (timeUpdateInterval !== null) {
    window.clearInterval(timeUpdateInterval)
    timeUpdateInterval = null
  }
})
</script>
