<template>
  <div id="carpool-detail-container" class="max-w-4xl mx-auto space-y-6">
    <!-- Back & Navigation Bar -->
    <div class="flex items-center justify-between">
      <button
        id="back-to-carpools-btn"
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
        @click="navigateTo('/carpool')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        <span>Back to Carpools</span>
      </button>

      <div v-if="carpool && isOwner" class="flex items-center gap-2">
        <button
          id="edit-carpool-detail-btn"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer border border-indigo-200"
          @click="navigateTo(`/carpool/edit?id=${carpool.id}`)"
        >
          <i class="fi fi-rr-edit text-xs"></i>
          <span>Edit Ride</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      id="carpool-detail-loading"
      class="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs"
    >
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
      <p class="text-sm font-semibold text-slate-600">Loading carpool details...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error || !carpool"
      id="carpool-detail-error"
      class="bg-white rounded-2xl border border-rose-200 p-10 text-center shadow-xs space-y-4"
    >
      <div class="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
        <i class="fi fi-rr-exclamation text-2xl"></i>
      </div>
      <div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">Carpool Not Found</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto">{{ error || 'The requested carpool could not be retrieved.' }}</p>
      </div>
      <button
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
        @click="navigateTo('/carpool')"
      >
        View All Carpools
      </button>
    </div>

    <!-- Main Detail Card -->
    <div
      v-else
      id="carpool-detail-card"
      class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
    >
      <!-- Hero Header -->
      <div class="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 sm:p-8">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-2">
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                isFull ? 'bg-slate-700 text-slate-300' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              ]"
            >
              {{ isFull ? 'Fully Booked' : 'Available Seats' }}
            </span>
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/10">
              {{ carpool.capacity }} Pax Vehicle
            </span>
            <span
              v-if="isOwner"
              class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30"
            >
              Your Ride (Host)
            </span>
          </div>

          <div class="text-2xl font-bold text-white flex items-baseline gap-1">
            <span>{{ Number(carpool.cost) > 0 ? `RM${Number(carpool.cost)}.00` : 'Free' }}</span>
            <span class="text-xs font-normal text-slate-300">/ passenger</span>
          </div>
        </div>

        <!-- Route Visual -->
        <div class="space-y-4 pt-2">
          <div class="flex items-start gap-4">
            <div class="flex flex-col items-center mt-1">
              <div class="w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-indigo-900 shrink-0"></div>
              <div class="w-0.5 h-10 bg-indigo-400/40 border-dashed"></div>
              <div class="w-3.5 h-3.5 rounded-full bg-indigo-400 border-2 border-indigo-900 shrink-0"></div>
            </div>
            <div class="space-y-4 flex-1">
              <div>
                <span class="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">Departure Point</span>
                <p class="text-lg font-bold text-white">{{ carpool.from }}</p>
              </div>
              <div>
                <span class="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">Destination</span>
                <p class="text-lg font-bold text-white">{{ carpool.to }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Grid & Information -->
      <div class="p-6 sm:p-8 space-y-6">
        <!-- Key Metadata Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Date</div>
            <div class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <i class="fi fi-rr-calendar text-indigo-500"></i>
              <span>{{ carpool.date }}</span>
            </div>
          </div>

          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Departure Time</div>
            <div class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <i class="fi fi-rr-clock-three text-indigo-500"></i>
              <span>{{ carpool.time }}</span>
            </div>
          </div>

          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Seats Filled</div>
            <div class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <i class="fi fi-rr-users text-indigo-500"></i>
              <span>{{ carpool.joined }} / {{ carpool.capacity }}</span>
            </div>
          </div>

          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Available Slots</div>
            <div class="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
              <i class="fi fi-rr-chair text-emerald-500"></i>
              <span>{{ availableSeats }} Seats Open</span>
            </div>
          </div>
        </div>

        <!-- Meeting Notes & Instructions -->
        <div v-if="carpool.notes" class="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4">
          <h4 class="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <i class="fi fi-rr-info text-amber-600"></i>
            <span>Pickup & Ride Notes</span>
          </h4>
          <p class="text-xs text-amber-950 leading-relaxed">{{ carpool.notes }}</p>
        </div>

        <!-- Participants & Driver Info -->
        <div class="space-y-3 pt-2 border-t border-slate-100">
          <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Passengers on this trip ({{ (carpool.joinedStudents || []).length }})
          </h4>
          <div class="flex flex-wrap gap-2">
            <div
              v-for="(student, idx) in carpool.joinedStudents || [carpool.creator]"
              :key="idx"
              class="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700"
            >
              <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                {{ student.charAt(0).toUpperCase() }}
              </div>
              <span>{{ student }}</span>
              <span
                v-if="student === carpool.creator || student === carpool.creatorName"
                class="text-[9px] uppercase tracking-wider font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-md border border-indigo-200"
              >
                Host
              </span>
              <span
                v-else-if="student === currentUser"
                class="text-[9px] uppercase tracking-wider font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md border border-emerald-200"
              >
                You
              </span>
            </div>
          </div>
        </div>

        <!-- Bottom Actions -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-xs text-slate-500">
            Trip hosted by <strong class="text-slate-800">{{ carpool.creator || 'Student' }}</strong>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <!-- Owner Actions -->
            <template v-if="isOwner">
              <button
                id="owner-edit-carpool-btn"
                class="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition-colors border border-indigo-200 cursor-pointer"
                @click="navigateTo(`/carpool/edit?id=${carpool.id}`)"
              >
                Edit Details
              </button>
              <button
                id="owner-leave-carpool-btn"
                class="flex-1 sm:flex-none px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs transition-colors border border-rose-200 cursor-pointer"
                @click="handleLeave"
              >
                Cancel My Spot
              </button>
            </template>

            <!-- Joined Passenger Action -->
            <template v-else-if="isJoined">
              <button
                id="passenger-leave-carpool-btn"
                class="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                @click="handleLeave"
              >
                <i class="fi fi-rr-sign-out-alt"></i>
                <span>Leave Carpool</span>
              </button>
            </template>

            <!-- Available to Join -->
            <template v-else-if="!isFull">
              <button
                id="join-carpool-detail-btn"
                class="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer"
                @click="handleJoin"
              >
                Join This Carpool
              </button>
            </template>

            <!-- Fully Booked -->
            <template v-else>
              <button
                disabled
                class="w-full sm:w-auto px-6 py-2.5 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
              >
                No Seats Left
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import studentConnect from '@/api'

const props = defineProps({
  carpoolId: {
    type: String,
    required: true
  },
  currentUser: {
    type: String,
    default: 'Manho'
  }
})

const router = useRouter()

const carpool = ref(null)
const loading = ref(true)
const error = ref('')

/**
 * Calculates remaining available seats in this vehicle.
 *
 * @type {import('vue').ComputedRef<number>}
 */
const availableSeats = computed(() => {
  if (!carpool.value) return 0
  return Math.max(0, Number(carpool.value.capacity) - Number(carpool.value.joined))
})

/**
 * Checks if the vehicle has reached its maximum passenger capacity.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isFull = computed(() => {
  if (!carpool.value) return false
  return Number(carpool.value.joined) >= Number(carpool.value.capacity)
})

/**
 * Checks if the current student is the creator or host of this ride.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isOwner = computed(() => {
  if (!carpool.value || !props.currentUser) return false
  return (
    carpool.value.creator === props.currentUser ||
    carpool.value.creatorName === props.currentUser ||
    carpool.value.creatorId === props.currentUser
  )
})

/**
 * Checks if the current student has joined this carpool.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isJoined = computed(() => {
  if (!carpool.value || !Array.isArray(carpool.value.joinedStudents)) return false
  return carpool.value.joinedStudents.includes(props.currentUser)
})

/**
 * Fetches the specific carpool details by ID through the studentConnect API.
 *
 * @param {string} id - Unique carpool identifier.
 * @returns {Promise<void>}
 */
async function fetchCarpoolDetails(id) {
  if (!id) {
    error.value = 'No carpool ID provided.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await studentConnect.getCarPool(id)
    carpool.value = res.data || res
  } catch (err) {
    error.value = err.message || 'Failed to load carpool details'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.carpoolId,
  (newId) => {
    fetchCarpoolDetails(newId)
  },
  { immediate: true }
)

/**
 * Navigates to a specified internal route.
 *
 * @param {string} path - Target path.
 * @returns {void}
 */
function navigateTo(path) {
  router.push(path)
}

/**
 * Joins the current carpool through the studentConnect API layer.
 *
 * @returns {Promise<void>}
 */
async function handleJoin() {
  if (!carpool.value) return
  try {
    const currentName = props.currentUser || 'Student'
    const currentId = localStorage.getItem('student_user_id') || 'student-001'

    const res = await studentConnect.joinCarPool(carpool.value.id, {
      userName: currentName,
      userId: currentId
    })
    carpool.value = res.data || res
    ElMessage.success('You joined this carpool!')
  } catch (err) {
    ElMessage.error(err.message || 'Could not join carpool')
  }
}

/**
 * Leaves the current carpool through the studentConnect API layer.
 *
 * @returns {Promise<void>}
 */
async function handleLeave() {
  if (!carpool.value) return
  try {
    const currentName = props.currentUser || 'Student'
    const currentId = localStorage.getItem('student_user_id') || 'student-001'

    const res = await studentConnect.leaveCarPool(carpool.value.id, {
      userName: currentName,
      userId: currentId
    })
    carpool.value = res.data || res
    ElMessage.info('You left this carpool.')
  } catch (err) {
    ElMessage.error(err.message || 'Could not leave carpool')
  }
}
</script>
