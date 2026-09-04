<!-- components/errands/ErrandCard.vue -->
<template>
  <div
      :id="'errand-card-' + errand.id"
      :class="[
      'bg-white rounded-2xl p-6 border shadow-xs flex flex-col justify-between transition-all duration-200 cursor-pointer',
      errand.status === 'completed' || errand.status === 'cancelled'
        ? 'border-slate-200 opacity-80'
        : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
    ]"
      @click="$emit('select', errand.id)"
  >
    <div class="space-y-4">
      <!-- Category & Status Badge -->
      <div class="flex justify-between items-start gap-3">
        <span
            class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
        >
          <i class="fi fi-rr-shopping-bag"></i>
          <span>Student Errand</span>
        </span>

        <span
            :class="[
            'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
            errand.status === 'completed'
              ? 'bg-slate-100 text-slate-500'
              : errand.status === 'cancelled'
                ? 'bg-rose-100 text-rose-600'
                : errand.status === 'accepted'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-emerald-100 text-emerald-700'
          ]"
        >
          {{ statusLabel }}
        </span>
      </div>

      <!-- Title & Description -->
      <div class="space-y-1.5">
        <h4
            class="text-base font-bold text-slate-900 leading-snug line-clamp-1"
        >
          {{ errand.title }}
        </h4>

        <p
            class="text-xs text-slate-500 line-clamp-2 leading-relaxed"
        >
          {{ errand.description }}
        </p>
      </div>

      <!-- Meta Grid -->
      <div class="grid grid-cols-2 gap-2 pt-1">
        <div
            class="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80"
        >
          <div
              class="text-[10px] text-slate-500 uppercase font-bold tracking-wider"
          >
            Location
          </div>

          <div
              class="text-xs font-semibold text-slate-800 truncate mt-0.5"
          >
            {{ errand.location }}
          </div>
        </div>

        <div
            class="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80"
        >
          <div
              class="text-[10px] text-slate-500 uppercase font-bold tracking-wider"
          >
            Needed By
          </div>

          <div
              class="text-xs font-semibold text-slate-800 truncate mt-0.5"
          >
            {{ formatDeadline(errand.deadline) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Actions & Footer -->
    <div
        class="mt-6 space-y-3"
        @click.stop
    >
      <!-- Requester / Helper Information -->
      <div
          class="text-xs text-slate-500 flex justify-between items-center px-1 gap-3"
      >
        <span class="truncate">
          By
          <strong class="text-slate-700">
            {{ errand.requester?.name || 'Student' }}
          </strong>
        </span>

        <!-- Accepted information -->
        <span
            v-if="errand.status === 'accepted'"
            class="text-indigo-600 font-semibold text-[11px] text-right truncate"
        >
          {{
            isAcceptedByMe
                ? 'Accepted by you'
                : `Accepted by ${errand.helper?.name || 'a peer'}`
          }}
        </span>

        <!-- Own errand -->
        <span
            v-else-if="isRequester"
            class="text-slate-400 font-semibold text-[11px]"
        >
          Your errand
        </span>
      </div>

      <div>
        <!--
          OPEN STATE

          Requester:
          Cannot accept their own errand.

          Other students:
          Can accept the errand.
        -->
        <button
            v-if="errand.status === 'open' && !isRequester"
            :id="'accept-errand-' + errand.id"
            class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
            @click="$emit('accept', errand.id)"
        >
          Accept Errand
        </button>

        <!-- Requester's own open errand -->
        <button
            v-else-if="errand.status === 'open' && isRequester"
            :id="'own-errand-' + errand.id"
            disabled
            class="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
        >
          Your Errand
        </button>

        <!--
          ACCEPTED BY CURRENT STUDENT

          Only the helper can mark the errand completed.
          The requester will never reach this branch.
        -->
        <button
            v-else-if="
            errand.status === 'accepted' &&
            isAcceptedByMe &&
            !isRequester
          "
            :id="'complete-errand-' + errand.id"
            class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            @click="$emit('complete', errand.id)"
        >
          <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
            />
          </svg>

          <span>Mark Completed</span>
        </button>

        <!--
          ACCEPTED BY SOMEONE ELSE

          This includes the requester.
        -->
        <button
            v-else-if="
            errand.status === 'accepted' &&
            !isAcceptedByMe
          "
            disabled
            class="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
        >
          Accepted by other student
        </button>

        <!-- Completed -->
        <button
            v-else-if="errand.status === 'completed'"
            disabled
            class="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          <svg
              class="w-4 h-4 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
          >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
            />
          </svg>

          <span>Completed</span>
        </button>

        <!-- Cancelled -->
        <button
            v-else-if="errand.status === 'cancelled'"
            disabled
            class="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
        >
          Cancelled
        </button>
      </div>
    </div>
  </div>
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
 * Requesters cannot accept or complete their own errands.
 *
 * @returns {boolean} True when the current user is the requester.
 */
const isRequester = computed(() => {
  return Boolean(
      props.currentUser?.id &&
      props.errand?.requester?.id &&
      props.currentUser.id === props.errand.requester.id
  )
})

/**
 * Determines whether the current authenticated student
 * is the helper assigned to the errand.
 *
 * @returns {boolean} True when the current user is the helper.
 */
const isAcceptedByMe = computed(() => {
  return Boolean(
      props.currentUser?.id &&
      props.errand?.helper?.id &&
      props.currentUser.id === props.errand.helper.id
  )
})

/**
 * Returns the human-readable label for the errand status.
 *
 * @returns {string} Display status label.
 */
const statusLabel = computed(() => {
  switch (props.errand?.status) {
    case 'accepted':
      return 'Accepted'

    case 'completed':
      return 'Completed'

    case 'cancelled':
      return 'Cancelled'

    case 'open':
    default:
      return 'Open'
  }
})

/**
 * Formats a Unix deadline timestamp for display.
 *
 * @param {number|string} deadline Unix timestamp in seconds.
 * @returns {string} Formatted local date and time.
 */
function formatDeadline(deadline) {
  const timestamp = Number(deadline)

  if (
      !Number.isFinite(timestamp) ||
      timestamp <= 0
  ) {
    return 'No deadline'
  }

  const date = new Date(
      timestamp * 1000
  )

  if (Number.isNaN(date.getTime())) {
    return 'Invalid deadline'
  }

  return date.toLocaleString(
      'en-GB',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
  )
}
</script>
