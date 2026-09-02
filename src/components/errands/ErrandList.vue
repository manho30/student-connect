<template>
  <div id="errand-list-container">
    <!-- List of Errands with 3-column grid -->
    <div
      v-if="errands && errands.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <ErrandCard
        v-for="item in errands"
        :key="item.id"
        :errand="item"
        :current-user="currentUser"
        @accept="$emit('accept', $event)"
        @complete="$emit('complete', $event)"
        @select="$emit('select', $event)"
      />

      <!-- Prompt card to create a new errand -->
      <div class="bg-white rounded-2xl p-6 border-2 border-dashed border-slate-200 shadow-xs flex flex-col justify-between bg-slate-50/50 group hover:border-indigo-300 transition-all min-h-[220px]">
        <div class="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-100 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <div class="space-y-1">
            <h3 class="font-bold text-slate-800 text-base">Need a favor on campus?</h3>
            <p class="text-xs text-slate-500 max-w-[200px] leading-relaxed">Ask peers for help with deliveries, printing, or food.</p>
          </div>
          <button
            id="prompt-create-errand-btn"
            class="text-indigo-600 font-bold text-sm hover:underline underline-offset-4 cursor-pointer"
            @click="$emit('open-create')"
          >
            Post a new errand
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      id="errand-empty-state"
      class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center my-6 shadow-xs"
    >
      <div class="w-16 h-16 mx-auto mb-4 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-slate-800 mb-1">No student errands found</h3>
      <p class="text-sm text-slate-500 max-w-md mx-auto mb-6">
        Need someone to pick up food, collect a parcel, or print notes? Post an errand to ask fellow students!
      </p>
      <button
        id="empty-create-errand-btn"
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
        @click="$emit('open-create')"
      >
        Post First Errand
      </button>
    </div>
  </div>
</template>

<script setup>
import ErrandCard from './ErrandCard.vue'

defineProps({
  errands: {
    type: Array,
    default: () => []
  },
  currentUser: {
    type: String,
    default: 'Manho'
  }
})

defineEmits(['accept', 'complete', 'open-create', 'select'])
</script>
