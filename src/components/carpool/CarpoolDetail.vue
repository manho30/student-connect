<!-- components/carpool/CarpoolDetail.vue -->
<!-- Route: /carpool?id=<id> -->

<template>
  <div
      id="carpool-detail-container"
      class="max-w-4xl mx-auto space-y-6"
  >
    <!-- Back & Navigation Bar -->
    <div class="flex items-center justify-between">
      <button
          id="back-to-carpools-btn"
          class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
          type="button"
          @click="navigateTo('/carpool')"
      >
        <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
          />
        </svg>

        <span>Back to Carpools</span>
      </button>

      <div v-if="carpool && isOwner" class="flex items-center gap-2">
        <button
            id="edit-carpool-detail-btn"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer border border-indigo-200"
            type="button"
            @click="navigateToEdit"
        >
          <i class="fi fi-rr-edit text-xs"></i>
          <span>Edit Ride</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" id="carpool-detail-loading"
         class="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
      <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
      <p class="text-sm font-semibold text-slate-600">
        Loading carpool details...
      </p>
    </div>

    <!-- Error State -->
    <div
        v-else-if="error || !carpool"
        id="carpool-detail-error"
        class="bg-white rounded-2xl border border-rose-200 p-10 text-center shadow-xs space-y-4"
    >
      <div
          class="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto"
      >
        <i class="fi fi-rr-exclamation text-2xl"></i>
      </div>

      <div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">
          Carpool Not Found
        </h3>

        <p class="text-xs text-slate-500 max-w-md mx-auto">
          {{
            error ||
            'The requested carpool could not be retrieved.'
          }}
        </p>
      </div>

      <button
          id="view-all-carpools-btn"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
          type="button"
          @click="navigateTo('/carpool')"
      >
        View All Carpools
      </button>
    </div>

    <!-- Main Detail Card -->
    <div v-else id="carpool-detail-card" class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <!-- Hero Header -->
      <div class="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-6 sm:p-8">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div class="flex items-center gap-2 flex-wrap">
            <span
                :class="[
                'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
                isFull
                  ? 'bg-slate-700 text-slate-300'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              ]"
            >
              {{ isFull ? 'Fully Booked' : 'Available Seats' }}
            </span>

            <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-indigo-200 border border-white/10">
              {{ carpool.capacity }} Pax
            </span>

            <span v-if="isOwner"
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Your Ride
            </span>
          </div>

          <div class="text-2xl font-bold text-white flex items-baseline gap-1">
            <span>
              {{
                Number(carpool.cost) > 0
                    ? `RM${Number(carpool.cost).toFixed(2)}`
                    : 'Free'
              }}
            </span>

            <span class="text-xs font-normal text-slate-300">
              / passenger
            </span>
          </div>
        </div>

        <!-- Route Visual -->
        <div class="space-y-4 pt-2">
          <div class="flex items-start gap-4">
            <div class="flex flex-col items-center mt-1">
              <div class="w-3.5 h-3.5 rounded-full bg-slate-300 border-2 border-indigo-900 shrink-0"></div>

              <div class="w-0.5 h-10 bg-indigo-400/40"></div>

              <div class="w-3.5 h-3.5 rounded-full bg-indigo-400 border-2 border-indigo-900 shrink-0"></div>
            </div>

            <div class="space-y-4 flex-1">
              <div>
                <span class="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">
                  Departure Point
                </span>

                <p class="text-lg font-bold text-white">{{ carpool.origin || '—' }}</p>
              </div>

              <div>
                <span class="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">
                  Destination
                </span>

                <p class="text-lg font-bold text-white">{{ carpool.destination || '—' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Grid & Information -->
      <div class="p-6 sm:p-8 space-y-6">
        <!-- Key Metadata Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <!-- Date -->
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Date
            </div>

            <div class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <i class="fi fi-rr-calendar text-indigo-500"></i>

              <span>
                {{ formatDateTime(carpool.departure).date || '—' }}
              </span>
            </div>
          </div>

          <!-- Departure Time -->
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Departure Time
            </div>

            <div class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <i class="fi fi-rr-clock-three text-indigo-500"></i>

              <span>
                {{ formatDateTime(carpool.departure).time || '—' }}
              </span>
            </div>
          </div>

          <!-- Seats Filled -->
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Seats Filled
            </div>

            <div class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <i class="fi fi-rr-users text-indigo-500"></i>
              <span>
                {{ participantCount }} / {{ carpool.capacity }}
              </span>
            </div>
          </div>

          <!-- Available Slots -->
          <div class="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              Available Slots
            </div>

            <div
                class="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1.5"
            >
              <i
                  class="fi fi-rr-chair text-emerald-500"
              ></i>

              <span>
                {{ availableSeats }} Seats Open
              </span>
            </div>
          </div>
        </div>

        <!-- Meeting Notes & Instructions -->
        <div
            v-if="carpool.notes"
            class="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4"
        >
          <h4
              class="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5"
          >
            <i class="fi fi-rr-info text-amber-600"></i>

            <span>Pickup & Ride Notes</span>
          </h4>

          <p
              class="text-xs text-amber-950 leading-relaxed"
          >
            {{ carpool.notes }}
          </p>
        </div>

        <!-- Participants -->

        <div class="space-y-3 pt-2 border-t border-slate-100">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Students on this trip
            </h4>
            <span class="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
              {{ participantCount }}
            </span>
          </div>
          <div v-if="participants.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div
                v-for="participant in participants"
                :key="participant.id"
                class="flex items-center gap-3 p-3  bg-slate-50 border border-slate-100 transition-all duration-200 hover:shadow-sm"
            >
              <!-- Avatar -->
              <div
                  class="w-9 h-9 shrink-0 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs"
              >
                {{ getParticipantInitial(participant) }}
              </div>

              <!-- Name -->
              <div class="min-w-0 flex-1">
                <p class="text-xs font-semibold text-slate-700 truncate">
                  {{ participant.name || 'Student' }}
                </p>

                <p
                    v-if="participant.id === carpool.owner?.id"
                    class="text-[10px] text-slate-400 mt-0.5"
                >
                  Trip host
                </p>

                <p
                    v-else-if="participant.id === currentUser?.id"
                    class="text-[10px] text-slate-400 mt-0.5"
                >
                  You
                </p>

                <p v-else class="text-[10px] text-slate-400 mt-0.5">
                  Participant
                </p>
              </div>

              <!-- Role badge -->
              <span
                  v-if="participant.id === carpool.owner?.id"
                  class="shrink-0 px-2 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-[9px] font-bold uppercase tracking-wide"
              >
                Host
            </span>

              <span
                  v-else-if="participant.id === currentUser?.id"
                  class="shrink-0 px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wide"
              >
                You
            </span>
            </div>
          </div>

          <!-- Empty state -->

          <div
              v-else
              class="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200"
          >
            <div
                class="w-9 h-9 shrink-0 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <i class="fi fi-rr-users text-slate-400 text-xs"></i>
            </div>

            <p class="text-xs text-slate-400">
              No students have joined this carpool yet.
            </p>
          </div>
        </div>


        <!-- Bottom Actions -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-xs text-slate-500">
            Trip hosted by
            <strong class="text-slate-800">
              {{ carpool.owner?.name || 'Student' }}
              <strong v-if="carpool.owner?.id === currentUser.id" class="text-xs text-shadow-slate-500 font-normal">(You)</strong>
            </strong>
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <!-- Owner Actions -->
            <template v-if="isOwner">
              <button
                  id="owner-edit-carpool-btn"
                  class="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition-colors border border-indigo-200 cursor-pointer"
                  type="button"
                  @click="navigateToEdit"
              >
                Edit Details
              </button>

              <button
                  id="owner-leave-carpool-btn"
                  class="flex-1 sm:flex-none px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs transition-colors border border-rose-200 cursor-pointer"
                  type="button"
                  @click="handleDelete"
              >
                Cancel Carpool
              </button>
            </template>

            <!-- Joined Participant Action -->
            <template v-else-if="isJoined">
              <button
                  id="passenger-leave-carpool-btn"
                  class="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  type="button"
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
                  type="button"
                  @click="handleJoin"
              >
                Join This Carpool
              </button>
            </template>

            <!-- Fully Booked -->
            <template v-else>
              <button
                  id="fully-booked-carpool-btn"
                  class="w-full sm:w-auto px-6 py-2.5 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
                  disabled
                  type="button"
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
import {computed, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {ElMessage, ElMessageBox} from 'element-plus'
import studentConnect from '@/api'

import { formatDateTime } from '@/helper/dateTimeConvert'

const props = defineProps({
  carpoolId: {
    type: String,
    required: true
  },

  currentUser: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const carpool = ref(null)
const loading = ref(true)
const error = ref('')

/**
 * Returns the current list of participants in the carpool.
 *
 * @returns {Array<Object>} Participant objects from the carpool resource.
 */
const participants = computed(() => {
  if (!carpool.value) {
    return []
  }

  return Array.isArray(carpool.value.participants)
      ? carpool.value.participants
      : []
})

/**
 * Calculates the number of students currently participating.
 *
 * @returns {number} Number of participants.
 */
const participantCount = computed(() => {
  return participants.value.length
})

/**
 * Calculates the number of seats still available.
 *
 * @returns {number} Number of available seats.
 */
const availableSeats = computed(() => {
  if (!carpool.value) {
    return 0
  }

  const capacity = Number(carpool.value.capacity || 0)

  return Math.max(
      0,
      capacity - participantCount.value
  )
})

/**
 * Determines whether the carpool has reached its capacity.
 *
 * @returns {boolean} True when no additional students can join.
 */
const isFull = computed(() => {
  if (!carpool.value) {
    return false
  }

  const capacity = Number(
      carpool.value.capacity || 0
  )

  return participantCount.value >= capacity
})

/**
 * Determines whether the current student owns the carpool.
 *
 * @returns {boolean} True when the current user's ID matches owner.id.
 */
const isOwner = computed(() => {
  if (!carpool.value || !props.currentUser?.id) {
    return false
  }

  return carpool.value.owner?.id === props.currentUser.id
})

/**
 * Determines whether the current student has joined the carpool.
 *
 * @returns {boolean} True when the current user's ID exists in participants.
 */
const isJoined = computed(() => {
  if (!props.currentUser?.id) {
    return false
  }

  return participants.value.some(
      (participant) =>
          participant?.id === props.currentUser.id
  )
})

/**
 * Gets the first letter used for a participant avatar.
 *
 * @param {Object} participant - Participant object containing a name.
 * @returns {string} Uppercase first character of the participant's name.
 */
function getParticipantInitial(participant) {
  const name = String(
      participant?.name || 'Student'
  ).trim()

  return name.charAt(0).toUpperCase()
}

/**
 * Fetches a specific carpool resource from the Student Connect API.
 *
 * The backend-generated ID is passed through unchanged.
 *
 * @param {string} id - Backend-generated carpool resource identifier.
 * @returns {Promise<void>} Resolves when the carpool has been loaded.
 * @throws {Error} When the API request fails or returns an unsuccessful response.
 */
async function fetchCarpoolDetails(id) {
  if (!id) {
    error.value = 'No carpool ID provided.'
    carpool.value = null
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await studentConnect.getCarPool(id)

    if (!response?.success) {
      throw new Error(
          response?.message ||
          'Failed to load carpool details'
      )
    }

    carpool.value = response.data || null

    if (!carpool.value) {
      throw new Error(
          response?.message ||
          'The requested carpool could not be retrieved.'
      )
    }
  } catch (err) {
    carpool.value = null

    error.value =
        err?.message ||
        'Failed to load carpool details'

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
    {
      immediate: true
    }
)

/**
 * Navigates to an internal Student Connect route.
 *
 * @param {string} path - Target application route.
 * @returns {void} Performs router navigation.
 */
function navigateTo(path) {
  router.push(path)
}

/**
 * Navigates to the edit page for the current carpool.
 *
 * The carpool ID comes directly from the backend resource.
 *
 * @returns {void} Performs router navigation when the carpool ID exists.
 */
function navigateToEdit() {
  if (!carpool.value?.id) {
    ElMessage.error('Carpool ID is missing')
    return
  }

  router.push({
    path: '/carpool/edit',
    query: {
      id: String(carpool.value.id)
    }
  })
}

/**
 * Joins the current carpool through the Student Connect API.
 *
 * The backend remains responsible for capacity validation and
 * participant membership updates.
 *
 * @returns {Promise<void>} Resolves after the join operation completes.
 * @throws {Error} When the join request fails or returns an unsuccessful response.
 */
async function handleJoin() {
  if (!carpool.value?.id) {
    ElMessage.error('Carpool ID is missing')
    return
  }

  try {
    const response = await studentConnect.joinCarPool(carpool.value.id)

    if (!response?.success) {
      throw new Error(
          response?.message ||
          'Could not join carpool'
      )
    }

    if (response.data) {
      carpool.value = response.data
    } else {
      await fetchCarpoolDetails(
          carpool.value.id
      )
    }

    ElMessage.success(
        response.message ||
        'You joined this carpool!'
    )
  } catch (err) {
    ElMessage.error(
        err?.message ||
        'Could not join carpool'
    )
  }
}

/**
 * Deletes the current carpool through the Student Connect API.
 *
 * The backend remains responsible for participant membership updates and
 * carpool deletion.
 *
 * @returns {Promise<void>} Resolves after the delete operation completes.
 * @throws {Error} When the delete request fails or returns an unsuccessful response.
 */
async function handleDelete() {

  // pop up a confirmation dialog before proceeding with deletion
  const confirmed = await ElMessageBox.confirm(
      'Are you sure you want to cancel this carpool? This action cannot be undone.',
      'Confirm Cancellation',
      {
        confirmButtonText: 'Yes, Cancel',
        cancelButtonText: 'No, Keep',
        type: 'warning',
      }
  ).catch(() => false) // Catch the cancel action and return false
  if (!confirmed) {
    return
  }
  if (!carpool.value?.id) {
    ElMessage.error('Carpool ID is missing')
    return
  }

  try {
    const response = await studentConnect.deleteCarPool(carpool.value.id)

    if (!response?.success) {
      throw new Error(
          response?.message ||
          'Could not delete carpool'
      )
    }

    ElMessage.success(
        response.message ||
        'Carpool deleted successfully.'
    )

    // Navigate back to the carpool list after deletion
    navigateTo('/carpool')
  } catch (err) {
    ElMessage.error(
        err?.message ||
        'Could not delete carpool'
    )
  }
}
/**
 * Leaves the current carpool through the Student Connect API.
 *
 * The backend remains responsible for participant membership updates.
 *
 * @returns {Promise<void>} Resolves after the leave operation completes.
 * @throws {Error} When the leave request fails or returns an unsuccessful response.
 */
async function handleLeave() {
  if (!carpool.value?.id) {
    ElMessage.error('Carpool ID is missing')
    return
  }

  try {
    const response = await studentConnect.leaveCarPool(carpool.value.id)

    if (!response?.success) {
      throw new Error(
          response?.message ||
          'Could not leave carpool'
      )
    }

    if (response.data) {
      carpool.value = response.data
    } else {
      await fetchCarpoolDetails(
          carpool.value.id
      )
    }

    ElMessage.success(
        response.message ||
        'You left the carpool.'
    )
  } catch (err) {
    ElMessage.error(
        err?.message ||
        'Could not leave carpool'
    )
  }
}
</script>
