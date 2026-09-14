<!-- components/study/StudyGroupCard.vue -->

<template>
  <article
      :id="'study-group-card-' + group.id"
      :class="[
        'group bg-white rounded-2xl border shadow-xs overflow-hidden transition-all duration-200',
        'flex flex-col cursor-pointer',
        isActive
          ? 'border-slate-200 hover:border-brand-300 hover:shadow-md hover:-translate-y-0.5'
          : 'border-slate-200 opacity-80'
      ]"
      role="button"
      tabindex="0"
      @click="handleSelect"
      @keydown.enter.prevent="handleSelect"
      @keydown.space.prevent="handleSelect"
  >
    <!-- Main Content -->
    <div class="p-5 flex-1">

      <!-- Header -->
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <div
              class="inline-flex items-center gap-1.5 max-w-full px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 text-[10px] font-bold uppercase tracking-wider"
          >
            <i class="fi fi-rr-book-alt text-[10px] shrink-0"></i>

            <span class="truncate">
              {{ group.subject || 'General' }}
            </span>
          </div>
        </div>

        <!-- Status -->
        <span
            :class="[
              'shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider',
              statusBadgeClass
            ]"
        >
          {{ statusLabel }}
        </span>
      </div>

      <!-- Title -->
      <div class="mt-4">
        <h3
            class="text-base font-bold text-slate-900 leading-snug line-clamp-2 transition-colors group-hover:text-brand-700"
        >
          {{ group.title || 'Untitled Study Group' }}
        </h3>

        <p
            class="mt-1.5 text-xs text-slate-500 leading-relaxed line-clamp-2"
        >
          {{
            group.description ||
            'No description provided.'
          }}
        </p>
      </div>

      <!-- Study Details -->
      <div class="mt-4 space-y-2">

        <!-- Schedule -->
        <div
            class="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100"
        >
          <div
              class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0"
          >
            <i class="fi fi-rr-calendar text-brand-600 text-sm"></i>
          </div>

          <div class="min-w-0 flex-1">
            <div
                class="text-[10px] text-slate-400 uppercase font-bold tracking-wider"
            >
              Schedule
            </div>

            <div
                class="mt-0.5 text-xs font-semibold text-slate-800 truncate"
                :title="scheduleText"
            >
              {{ scheduleText }}
            </div>
          </div>
        </div>

        <!-- Location -->
        <div
            class="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100"
        >
          <div
              class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0"
          >
            <i class="fi fi-rr-marker text-brand-600 text-sm"></i>
          </div>

          <div class="min-w-0 flex-1">
            <div
                class="text-[10px] text-slate-400 uppercase font-bold tracking-wider"
            >
              Location
            </div>

            <div
                class="mt-0.5 text-xs font-semibold text-slate-800 truncate"
                :title="group.location || 'Not specified'"
            >
              {{ group.location || 'Not specified' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Capacity -->
      <div class="mt-4">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-1.5 min-w-0">
            <i class="fi fi-rr-users text-slate-400 text-xs"></i>

            <span
                class="text-[10px] font-bold uppercase tracking-wider text-slate-400"
            >
              Members
            </span>
          </div>

          <span
              class="text-[11px] font-semibold text-slate-600 whitespace-nowrap"
          >
            {{ memberCount }} / {{ capacity }}
          </span>
        </div>

        <!-- Capacity Bar -->
        <div
            v-if="capacity > 0"
            class="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden"
        >
          <div
              :class="[
                'h-full rounded-full transition-all duration-300',
                capacityProgressClass
              ]"
              :style="{ width: capacityPercentage + '%' }"
          ></div>
        </div>

        <div
            v-else
            class="mt-2 text-[11px] text-slate-400"
        >
          Capacity not specified
        </div>
      </div>
    </div>

    <!-- Footer / Action -->
    <div
        class="px-5 pb-5"
        @click.stop
    >
      <!-- Host -->
      <div
          class="flex items-center justify-between gap-3 mb-3 px-1"
      >
        <div class="flex items-center gap-2 min-w-0">
          <div
              class="w-7 h-7 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center shrink-0"
          >
            <i class="fi fi-rr-user text-[11px]"></i>
          </div>

          <div class="min-w-0">
            <div
                class="text-[9px] text-slate-400 uppercase font-bold tracking-wider"
            >
              Hosted by
            </div>

            <div
                class="text-[11px] font-semibold text-slate-700 truncate"
                :title="ownerName"
            >
              {{ ownerName }}
            </div>
          </div>
        </div>
      </div>

      <!-- Owner -->
      <button
          v-if="isOwner && canEdit"
          :id="'owner-group-' + group.id"
          type="button"
          disabled
          class="w-full py-2.5 px-4 bg-brand-50 text-brand-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-default"
      >
        <i class="fi fi-rr-crown"></i>

        <span>Your Study Group</span>
      </button>

      <!-- Joined -->
      <button
          v-else-if="isJoined && canLeave"
          :id="'leave-group-' + group.id"
          type="button"
          class="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          @click="emit('leave', group.id)"
      >
        <i class="fi fi-rr-check-circle text-emerald-600"></i>

        <span>Joined · Leave Group</span>
      </button>

      <!-- Can Join -->
      <button
          v-else-if="canJoin"
          :id="'join-group-' + group.id"
          type="button"
          class="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold text-xs shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          @click="emit('join', group.id)"
      >
        <span>Join Study Group</span>

        <i class="fi fi-rr-arrow-right text-[10px] transition-transform group-hover:translate-x-0.5"></i>
      </button>

      <!-- Terminal / Full -->
      <button
          v-else
          :id="'join-group-' + group.id"
          type="button"
          disabled
          class="w-full py-2.5 px-4 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2"
      >
        <i
            :class="[
              statusKey === 'expired'
                ? 'fi fi-rr-clock'
                : statusKey === 'cancelled'
                  ? 'fi fi-rr-ban'
                  : 'fi fi-rr-users-alt'
            ]"
        ></i>

        <span>{{ statusLabel }}</span>
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  group: {
    type: Object,
    required: true
  },

  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'join',
  'leave',
  'select'
])

/**
 * Returns the group's members as a safe array.
 *
 * @returns {Array<Object>} Current group members.
 */
const members = computed(() => {
  return Array.isArray(props.group.members)
      ? props.group.members
      : []
})

/**
 * Returns the number of members currently in the group.
 *
 * @returns {number} Current member count.
 */
const memberCount = computed(() => {
  return members.value.length
})

/**
 * Returns the group's configured capacity.
 *
 * @returns {number} Positive group capacity, or zero when invalid.
 */
const capacity = computed(() => {
  const value = Number(props.group.capacity)

  return Number.isFinite(value) && value > 0
      ? value
      : 0
})

/**
 * Determines whether the group has reached its capacity.
 *
 * @returns {boolean} True when the group is full.
 */
const isFull = computed(() => {
  if (capacity.value <= 0) {
    return false
  }

  return memberCount.value >= capacity.value
})

/**
 * Returns the current capacity percentage.
 *
 * @returns {number} Capacity percentage from 0 to 100.
 */
const capacityPercentage = computed(() => {
  if (capacity.value <= 0) {
    return 0
  }

  return Math.min(
      100,
      Math.round(
          (memberCount.value / capacity.value) * 100
      )
  )
})

/**
 * Returns the capacity progress bar styling.
 *
 * @returns {string} Tailwind classes.
 */
const capacityProgressClass = computed(() => {
  if (capacityPercentage.value >= 100) {
    return 'bg-slate-400'
  }

  if (capacityPercentage.value >= 80) {
    return 'bg-amber-500'
  }

  return 'bg-brand-500'
})

/**
 * Returns the backend-aligned study status.
 *
 * @returns {string} open, full, cancelled, or expired.
 */
const statusKey = computed(() => {
  const explicitStatus =
      String(props.group.status || '').toLowerCase()

  if (
      explicitStatus === 'cancelled' ||
      explicitStatus === 'expired'
  ) {
    return explicitStatus
  }

  const startTime =
      Number(props.group.schedule?.startTime)

  if (
      Number.isFinite(startTime) &&
      startTime > 0 &&
      Date.now() >= startTime * 1000
  ) {
    return 'expired'
  }

  return isFull.value
      ? 'full'
      : 'open'
})

/**
 * Returns whether the study group is currently active.
 *
 * @returns {boolean} True when the group is open or full.
 */
const isActive = computed(() => {
  return ['open', 'full'].includes(statusKey.value)
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
 * Returns the study-card status badge styling.
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
 * Returns the authenticated user's identifier.
 *
 * @returns {string} Firebase UID or compatible user ID.
 */
const currentUserId = computed(() => {
  return (
      props.currentUser?.uid ||
      props.currentUser?.id ||
      ''
  )
})

/**
 * Returns the group owner as a safe object.
 *
 * @returns {Object} Group owner.
 */
const owner = computed(() => {
  return props.group.owner || {}
})

/**
 * Determines whether the authenticated user owns the group.
 *
 * @returns {boolean} True when the current user is the owner.
 */
const isOwner = computed(() => {
  if (!currentUserId.value) {
    return false
  }

  const ownerId =
      owner.value.id ||
      owner.value.uid ||
      owner.value.userId ||
      ''

  return String(ownerId) === String(currentUserId.value)
})

/**
 * Determines whether the authenticated user is already a member.
 *
 * @returns {boolean} True when the user belongs to the group.
 */
const isJoined = computed(() => {
  if (!currentUserId.value) {
    return false
  }

  return members.value.some((member) => {
    const memberId =
        member?.id ||
        member?.uid ||
        member?.userId ||
        ''

    return String(memberId) === String(currentUserId.value)
  })
})

/**
 * Determines whether the authenticated user can join the group.
 *
 * @returns {boolean} True when joining is currently allowed.
 */
const canJoin = computed(() => {
  return (
      !isOwner.value &&
      !isJoined.value &&
      statusKey.value === 'open'
  )
})

/**
 * Determines whether the owner may edit this study group.
 *
 * @returns {boolean} True when the study group is not terminal.
 */
const canEdit = computed(() => {
  return ['open', 'full'].includes(statusKey.value)
})

/**
 * Determines whether a member may leave this study group.
 *
 * @returns {boolean} True when the study group is active.
 */
const canLeave = computed(() => {
  return ['open', 'full'].includes(statusKey.value)
})

/**
 * Returns a readable name for the group owner.
 *
 * @returns {string} Owner display name.
 */
const ownerName = computed(() => {
  return (
      owner.value.name ||
      owner.value.displayName ||
      owner.value.email ||
      'Student'
  )
})

/**
 * Formats the study start timestamp for card display.
 *
 * Backend Study timestamps are Unix seconds, while JavaScript
 * Date values use milliseconds.
 *
 * @returns {string} Formatted schedule text.
 */
const scheduleText = computed(() => {
  const startTime =
      props.group.schedule?.startTime

  if (!startTime) {
    return 'Not scheduled'
  }

  const timestamp = Number(startTime)

  if (
      !Number.isFinite(timestamp) ||
      timestamp <= 0
  ) {
    return 'Invalid schedule'
  }

  const date =
      new Date(timestamp * 1000)

  if (Number.isNaN(date.getTime())) {
    return 'Invalid schedule'
  }

  return new Intl.DateTimeFormat(
      'en-MY',
      {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }
  ).format(date)
})

/**
 * Emits the selected study group ID to the parent.
 *
 * @returns {void}
 */
function handleSelect() {
  emit(
      'select',
      props.group.id
  )
}
</script>
