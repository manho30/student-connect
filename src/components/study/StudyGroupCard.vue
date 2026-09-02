<template>
  <div
    :id="'study-group-card-' + group.id"
    :class="[
      'bg-white rounded-2xl p-6 border shadow-xs flex flex-col justify-between transition-all duration-200 cursor-pointer',
      isFull
        ? 'border-slate-200 opacity-80'
        : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
    ]"
    @click="$emit('select', group.id)"
  >
    <div class="space-y-4">
      <!-- Subject Badge & Member Status -->
      <div class="flex justify-between items-start">
        <span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <i class="fi fi-rr-book-alt"></i>
          <span>{{ group.subject }}</span>
        </span>

        <span
          :class="[
            'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
            isFull
              ? 'bg-slate-100 text-slate-500'
              : 'bg-emerald-100 text-emerald-700'
          ]"
        >
          {{ isFull ? 'Group Full' : `${group.members}/${group.maxMembers} Members` }}
        </span>
      </div>

      <!-- Group Name & Description -->
      <div class="space-y-1.5">
        <h4 class="text-base font-bold text-slate-900 leading-snug line-clamp-1">
          {{ group.name }}
        </h4>
        <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {{ group.description }}
        </p>
      </div>

      <!-- Meta Grid -->
      <div class="grid grid-cols-2 gap-2 pt-1">
        <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80">
          <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Date & Time</div>
          <div class="text-xs font-semibold text-slate-800 truncate mt-0.5">{{ group.date }} · {{ group.time }}</div>
        </div>
        <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80">
          <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Location</div>
          <div class="text-xs font-semibold text-slate-800 truncate mt-0.5">{{ group.location }}</div>
        </div>
      </div>
    </div>

    <!-- Actions & Footer -->
    <div class="mt-6 space-y-3" @click.stop>
      <div class="text-xs text-slate-500 flex justify-between items-center px-1">
        <span>Hosted by <strong class="text-slate-700">{{ group.creator || 'Student' }}</strong></span>
        <span class="text-slate-400 text-[11px]">{{ group.members }} of {{ group.maxMembers }} filled</span>
      </div>

      <div>
        <button
          v-if="isJoined"
          :id="'leave-group-' + group.id"
          class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          @click="$emit('leave', group.id)"
        >
          <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Joined (Leave)</span>
        </button>

        <button
          v-else-if="!isFull"
          :id="'join-group-' + group.id"
          class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
          @click="$emit('join', group.id)"
        >
          Join Study Pod
        </button>

        <button
          v-else
          disabled
          :id="'join-group-' + group.id"
          class="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
        >
          Group is Full
        </button>
      </div>
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
    type: String,
    default: 'Manho'
  }
})

defineEmits(['join', 'leave', 'select'])

/**
 * Checks if the study group capacity has reached maximum members.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isFull = computed(() => {
  return Number(props.group.members) >= Number(props.group.maxMembers)
})

/**
 * Checks if the current student has joined this study group.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isJoined = computed(() => {
  if (Array.isArray(props.group.memberList)) {
    return props.group.memberList.includes(props.currentUser)
  }
  return false
})
</script>
