<template>
  <div id="study-group-list-container">
    <!-- List of Study Groups with 3-column grid -->
    <div
      v-if="groups && groups.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <StudyGroupCard
        v-for="item in groups"
        :key="item.id"
        :group="item"
        :current-user="currentUser"
        @join="$emit('join', $event)"
        @leave="$emit('leave', $event)"
        @select="$emit('select', $event)"
      />

      <!-- Prompt card to create a new study group -->
      <div class="bg-white rounded-2xl p-6 border-2 border-dashed border-slate-200 shadow-xs flex flex-col justify-between bg-slate-50/50 group hover:border-indigo-300 transition-all min-h-[220px]">
        <div class="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-100 group-hover:scale-110 transition-transform">
            <svg class="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
          </div>
          <div class="space-y-1">
            <h3 class="font-bold text-slate-800 text-base">Studying a new subject?</h3>
            <p class="text-xs text-slate-500 max-w-[200px] leading-relaxed">Form a study group and invite peers to study for exams together.</p>
          </div>
          <button
            id="prompt-create-study-btn"
            class="text-indigo-600 font-bold text-sm hover:underline underline-offset-4 cursor-pointer"
            @click="$emit('open-create')"
          >
            Create a study group
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      id="study-empty-state"
      class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center my-6 shadow-xs"
    >
      <div class="w-16 h-16 mx-auto mb-4 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      </div>
      <h3 class="text-lg font-bold text-slate-800 mb-1">No study groups found</h3>
      <p class="text-sm text-slate-500 max-w-md mx-auto mb-6">
        No active study sessions found matching your search. Create a study group and invite classmates to prepare together!
      </p>
      <button
        id="empty-create-study-btn"
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
        @click="$emit('open-create')"
      >
        Create Study Group
      </button>
    </div>
  </div>
</template>

<script setup>
import StudyGroupCard from './StudyGroupCard.vue'

defineProps({
  groups: {
    type: Array,
    default: () => []
  },
  currentUser: {
    type: String,
    default: 'Manho'
  }
})

defineEmits(['join', 'leave', 'open-create', 'select'])
</script>
