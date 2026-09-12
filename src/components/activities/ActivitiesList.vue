<template>
  <div>
    <div
        v-if="activities.length"
        class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <ActivitiesCard
          v-for="activity in activities"
          :key="activity.id"
          :activity="activity"
          :current-user="currentUser"
          @select="emit('select', $event)"
      />
      <div
          v-if="showCreatePrompt"
          class="flex min-h-[220px] flex-col justify-between rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 shadow-xs transition-all hover:border-indigo-300"
      >
        <div class="flex flex-1 flex-col items-center justify-center space-y-4 text-center">
          <div class="flex h-14 w-14 items-center justify-center rounded-full border border-slate-100 bg-white shadow-xs">
            <i class="fi fi-rr-calendar-star text-2xl text-indigo-500"></i>
          </div>
          <div>
            <h3 class="font-bold text-slate-800">Promote an opportunity</h3>
            <p class="mt-1 max-w-[210px] text-xs leading-relaxed text-slate-500">
              Share an event, competition, workshop, or programme with students.
            </p>
          </div>
          <button class="cursor-pointer text-sm font-bold text-indigo-600 hover:underline" @click="emit('open-create')">
            Promote Activity
          </button>
        </div>
      </div>
    </div>

    <div v-else class="my-6 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
      <i class="fi fi-rr-calendar-star text-3xl text-indigo-400"></i>
      <h3 class="mb-1 mt-4 text-lg font-bold text-slate-800">No activities found</h3>
      <p class="mx-auto mb-6 max-w-md text-sm text-slate-500">
        Discover student opportunities or promote the next one.
      </p>
      <button
          v-if="showCreatePrompt"
          class="cursor-pointer rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700"
          @click="emit('open-create')"
      >
        Promote Activity
      </button>
    </div>
  </div>
</template>

<script setup>
import ActivitiesCard from './ActivitiesCard.vue'

defineProps({
  activities: { type: Array, default: () => [] },
  currentUser: { type: Object, default: null },
  showCreatePrompt: { type: Boolean, default: true }
})

const emit = defineEmits(['select', 'open-create'])
</script>
