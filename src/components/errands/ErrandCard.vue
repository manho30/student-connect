<template>
  <div
    :id="'errand-card-' + errand.id"
    :class="[
      'bg-white rounded-2xl p-6 border shadow-xs flex flex-col justify-between transition-all duration-200 cursor-pointer',
      errand.status === 'completed'
        ? 'border-slate-200 opacity-80'
        : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
    ]"
    @click="$emit('select', errand.id)"
  >
    <div class="space-y-4">
      <!-- Category & Status Badge -->
      <div class="flex justify-between items-start">
        <span class="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <i :class="getCategoryIcon(errand.category)"></i>
          <span>{{ errand.category || 'Errand' }}</span>
        </span>

        <span
          :class="[
            'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
            errand.status === 'completed'
              ? 'bg-slate-100 text-slate-500'
              : errand.status === 'accepted'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-emerald-100 text-emerald-700'
          ]"
        >
          {{ errand.status === 'completed' ? 'Completed' : errand.status === 'accepted' ? 'Accepted' : 'Available' }}
        </span>
      </div>

      <!-- Title & Description -->
      <div class="space-y-1.5">
        <h4 class="text-base font-bold text-slate-900 leading-snug line-clamp-1">
          {{ errand.title }}
        </h4>
        <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
          {{ errand.description }}
        </p>
      </div>

      <!-- Meta Grid -->
      <div class="grid grid-cols-2 gap-2 pt-1">
        <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80">
          <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Location</div>
          <div class="text-xs font-semibold text-slate-800 truncate mt-0.5">{{ errand.location }}</div>
        </div>
        <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80">
          <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Needed By</div>
          <div class="text-xs font-semibold text-slate-800 truncate mt-0.5">{{ errand.deadline }}</div>
        </div>
      </div>
    </div>

    <!-- Actions & Footer -->
    <div class="mt-6 space-y-3" @click.stop>
      <div class="text-xs text-slate-500 flex justify-between items-center px-1">
        <span>By <strong class="text-slate-700">{{ errand.creator || 'Student' }}</strong></span>
        <span v-if="errand.status === 'accepted'" class="text-indigo-600 font-semibold text-[11px]">
          {{ isAcceptedByMe ? 'Accepted by you' : `Accepted by ${errand.acceptedBy}` }}
        </span>
      </div>

      <div>
        <!-- Available State: Accept Button -->
        <button
          v-if="errand.status === 'available'"
          :id="'accept-errand-' + errand.id"
          class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
          @click="$emit('accept', errand.id)"
        >
          Accept Errand
        </button>

        <!-- Accepted by current student: Mark Completed Button -->
        <button
          v-else-if="errand.status === 'accepted' && isAcceptedByMe"
          :id="'complete-errand-' + errand.id"
          class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          @click="$emit('complete', errand.id)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Mark Completed</span>
        </button>

        <!-- Accepted by someone else -->
        <button
          v-else-if="errand.status === 'accepted' && !isAcceptedByMe"
          disabled
          class="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
        >
          In Progress
        </button>

        <!-- Completed State -->
        <button
          v-else-if="errand.status === 'completed'"
          disabled
          class="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>Completed</span>
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
    type: String,
    default: 'Manho'
  }
})

defineEmits(['accept', 'complete', 'select'])

/**
 * Checks if the current student is the one who accepted this errand.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isAcceptedByMe = computed(() => {
  return props.errand.acceptedBy === props.currentUser
})

/**
 * Returns the matching Flaticon icon class based on the errand category.
 *
 * @param {string} category - Errand category name.
 * @returns {string} Flaticon CSS class.
 */
function getCategoryIcon(category) {
  switch (category) {
    case 'Food':
      return 'fi fi-rr-restaurant'
    case 'Parcel':
      return 'fi fi-rr-box-alt'
    case 'Printing':
      return 'fi fi-rr-print'
    case 'Stationery':
      return 'fi fi-rr-pencil'
    default:
      return 'fi fi-rr-shopping-bag'
  }
}
</script>
