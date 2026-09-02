<template>
  <div
    :id="'carpool-card-' + carpool.id"
    :class="[
      'bg-white rounded-2xl p-6 border shadow-xs flex flex-col justify-between transition-all duration-200 relative',
      isFull
        ? 'border-slate-200 opacity-85'
        : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
    ]"
  >
    <div class="space-y-4">
      <!-- Status Badge & Cost & Creator Edit -->
      <div class="flex justify-between items-center gap-2">
        <div class="flex items-center gap-2">
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
              isFull
                ? 'bg-slate-100 text-slate-500'
                : 'bg-emerald-100 text-emerald-700'
            ]"
          >
            {{ isFull ? 'Fully Booked' : 'Available' }}
          </span>

          <span
            v-if="isCreator"
            class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200"
          >
            Your Ride
          </span>
        </div>

        <div class="flex items-center gap-2">
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
              isFull ? 'text-slate-400' : 'text-indigo-600'
            ]"
          >
            {{ carpool.cost !== undefined && Number(carpool.cost) > 0 ? `RM${Number(carpool.cost)}.00` : 'Free' }}
          </span>
        </div>
      </div>

      <!-- Route Visual Line -->
      <div class="space-y-2">
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-slate-300 shrink-0"></div>
          <div class="font-semibold text-slate-800 text-sm truncate">{{ carpool.from }}</div>
        </div>
        <div class="h-6 border-l-2 border-dashed border-slate-200 ml-[3px]"></div>
        <div class="flex items-center gap-3">
          <div class="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></div>
          <div class="font-semibold text-slate-800 text-sm truncate">{{ carpool.to }}</div>
        </div>
      </div>

      <!-- Meta Grid -->
      <div class="grid grid-cols-2 gap-2 pt-2">
        <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80">
          <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Date & Time</div>
          <div class="text-xs font-semibold text-slate-800 truncate mt-0.5">{{ carpool.date }} · {{ carpool.time }}</div>
        </div>
        <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100/80">
          <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Joined</div>
          <div class="text-xs font-semibold text-slate-800 mt-0.5">{{ carpool.joined }} / {{ carpool.capacity }} Seats</div>
        </div>
      </div>

      <!-- Driver & Notes -->
      <div class="space-y-1.5">
        <div class="text-[11px] text-slate-400 flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <i class="fi fi-rr-user text-xs"></i>
            <span>Hosted by <strong class="text-slate-600 font-semibold">{{ carpool.creator || 'Student' }}</strong></span>
          </div>
          <div v-if="carpool.joinedStudents && carpool.joinedStudents.length > 0" class="text-[10px] text-indigo-600 font-medium">
            {{ carpool.joinedStudents.length }} student{{ carpool.joinedStudents.length === 1 ? '' : 's' }} on board
          </div>
        </div>
        <p v-if="carpool.notes" class="text-xs text-slate-500 bg-slate-50/60 p-2.5 rounded-lg border border-slate-100">
          <i class="fi fi-rr-info text-slate-400 mr-1"></i>
          {{ carpool.notes }}
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-6 space-y-2">
      <!-- Host Broadcast Action: Notify all members if ready -->
      <button
        v-if="isCreator"
        :id="'notify-members-btn-' + carpool.id"
        type="button"
        class="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        title="Send a broadcast notification to all joined students"
        @click="$emit('notify-ready', carpool)"
      >
        <i class="fi fi-rr-bell text-xs"></i>
        <span>Notify All Members (Ready / Departing)</span>
      </button>

      <!-- If current user is the creator -->
      <div v-if="isCreator" class="grid grid-cols-2 gap-2">
        <button
          :id="'edit-creator-btn-' + carpool.id"
          class="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-200"
          @click="$emit('edit', carpool)"
        >
          <i class="fi fi-rr-edit text-xs"></i>
          <span>Edit Ride</span>
        </button>
        <button
          :id="'leave-carpool-' + carpool.id"
          class="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          @click="$emit('leave', carpool.id)"
        >
          <span>Cancel My Spot</span>
        </button>
      </div>

      <!-- If current user is a joined passenger -->
      <button
        v-else-if="isJoined"
        :id="'leave-carpool-' + carpool.id"
        class="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        @click="$emit('leave', carpool.id)"
      >
        <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Joined (Leave)</span>
      </button>

      <!-- If not joined and seats available -->
      <button
        v-else-if="!isFull"
        :id="'join-carpool-' + carpool.id"
        class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer"
        @click="$emit('join', carpool.id)"
      >
        Join Ride
      </button>

      <!-- If fully booked -->
      <button
        v-else
        disabled
        :id="'join-carpool-' + carpool.id"
        class="w-full py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
      >
        No Seats Left
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  carpool: {
    type: Object,
    required: true
  },
  currentUser: {
    type: String,
    default: 'Manho'
  }
})

defineEmits(['join', 'leave', 'edit', 'notify-ready'])

const isCreator = computed(() => {
  if (!props.currentUser) return false
  return (
    props.carpool.creator === props.currentUser ||
    props.carpool.creatorName === props.currentUser ||
    props.carpool.creatorId === props.currentUser
  )
})

const isFull = computed(() => {
  return Number(props.carpool.joined) >= Number(props.carpool.capacity)
})

const isJoined = computed(() => {
  if (Array.isArray(props.carpool.joinedStudents)) {
    return props.carpool.joinedStudents.includes(props.currentUser)
  }
  return false
})
</script>
