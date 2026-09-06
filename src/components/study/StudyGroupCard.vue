<!-- components/study/StudyGroupCard.vue -->

<template>
  <div
      :id="'study-group-card-' + group.id"
      :class="[
        'bg-white rounded-2xl p-6 border shadow-xs flex flex-col justify-between transition-all duration-200 cursor-pointer',
        isFull
          ? 'border-slate-200 opacity-80'
          : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
      ]"
      @click="handleSelect"
  >
    <div class="space-y-4">

      <!-- Subject & Capacity -->
      <div class="flex justify-between items-start gap-3">
        <span
            class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
        >
          <i class="fi fi-rr-book-alt"></i>

          <span>
            {{ group.subject || 'General' }}
          </span>
        </span>

        <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap',
              isFull
                ? 'bg-slate-100 text-slate-500'
                : 'bg-emerald-100 text-emerald-700'
            ]"
        >
          {{
            isFull
                ? 'Group Full'
                : `${memberCount}/${capacity} Members`
          }}
        </span>
      </div>

      <!-- Title & Description -->
      <div class="space-y-1.5">
        <h4
            class="text-base font-bold text-slate-900 leading-snug line-clamp-1"
        >
          {{ group.title }}
        </h4>

        <p
            class="text-xs text-slate-500 line-clamp-2 leading-relaxed"
        >
          {{
            group.description ||
            'No description provided.'
          }}
        </p>
      </div>

      <!-- Meta Information -->
      <div class="grid grid-cols-2 gap-2 pt-1">

        <!-- Schedule -->
        <div
            class="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80"
        >
          <div
              class="text-[10px] text-slate-500 uppercase font-bold tracking-wider"
          >
            Schedule
          </div>

          <div
              class="text-xs font-semibold text-slate-800 truncate mt-0.5"
              :title="scheduleText"
          >
            {{ scheduleText }}
          </div>
        </div>

        <!-- Location -->
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
              :title="group.location"
          >
            {{
              group.location ||
              'Not specified'
            }}
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div
        class="mt-6 space-y-3"
        @click.stop
    >

      <!-- Owner & Capacity -->
      <div
          class="text-xs text-slate-500 flex justify-between items-center gap-3 px-1"
      >
        <span class="truncate">
          Hosted by
          <strong class="text-slate-700">
            {{ ownerName }}
          </strong>
        </span>

        <span
            class="text-slate-400 text-[11px] whitespace-nowrap"
        >
          {{ memberCount }} of {{ capacity }} filled
        </span>
      </div>

      <!-- Owner -->
      <button
          v-if="isOwner"
          :id="'owner-group-' + group.id"
          class="w-full py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-default"
          disabled
      >
        <i class="fi fi-rr-crown"></i>

        <span>Your Study Group</span>
      </button>

      <!-- Joined -->
      <button
          v-else-if="isJoined"
          :id="'leave-group-' + group.id"
          class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          @click="emit('leave', group.id)"
      >
        <svg
            class="w-4 h-4 text-emerald-600"
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

        <span>Joined · Leave Group</span>
      </button>

      <!-- Can Join -->
      <button
          v-else-if="canJoin"
          :id="'join-group-' + group.id"
          class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
          @click="emit('join', group.id)"
      >
        Join Study Group
      </button>

      <!-- Full -->
      <button
          v-else
          :id="'join-group-' + group.id"
          disabled
          class="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
      >
        Group is Full
      </button>
    </div>
  </div>
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
      !isFull.value
  )
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
