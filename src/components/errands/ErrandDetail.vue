<template>
  <div id="errand-detail-container" class="max-w-4xl mx-auto space-y-6">
    <!-- Back & Navigation Bar -->
    <div class="flex items-center justify-between">
      <button
        id="back-to-errands-btn"
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
        @click="navigateTo('/errands')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        <span>Back to Errands</span>
      </button>

      <div v-if="errand && isCreator && errand.status !== 'completed'" class="flex items-center gap-2">
        <button
          id="edit-errand-detail-btn"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer border border-indigo-200"
          @click="navigateTo(`/errands/edit?id=${errand.id}`)"
        >
          <i class="fi fi-rr-edit text-xs"></i>
          <span>Edit Errand</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      id="errand-detail-loading"
      class="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs"
    >
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
      <p class="text-sm font-semibold text-slate-600">Loading errand details...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error || !errand"
      id="errand-detail-error"
      class="bg-white rounded-2xl border border-rose-200 p-10 text-center shadow-xs space-y-4"
    >
      <div class="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
        <i class="fi fi-rr-exclamation text-2xl"></i>
      </div>
      <div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">Errand Not Found</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto">{{ error || 'The requested student errand could not be retrieved.' }}</p>
      </div>
      <button
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
        @click="navigateTo('/errands')"
      >
        View All Errands
      </button>
    </div>

    <!-- Main Detail Card -->
    <div
      v-else
      id="errand-detail-card"
      class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
    >
      <!-- Hero Header -->
      <div class="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 sm:p-8">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span class="bg-white/10 text-indigo-200 border border-white/10 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <i :class="getCategoryIcon(errand.category)"></i>
            <span>{{ errand.category || 'Other' }}</span>
          </span>

          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
              errand.status === 'completed'
                ? 'bg-slate-700 text-slate-300'
                : errand.status === 'accepted'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
            ]"
          >
            {{ errand.status === 'completed' ? 'Completed' : errand.status === 'accepted' ? 'In Progress / Accepted' : 'Available for Help' }}
          </span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
          {{ errand.title }}
        </h1>
      </div>

      <!-- Detail Body -->
      <div class="p-6 sm:p-8 space-y-6">
        <!-- Metadata Info Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Location / Venue</div>
            <div class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <i class="fi fi-rr-marker text-rose-500"></i>
              <span>{{ errand.location }}</span>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Needed By Deadline</div>
            <div class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <i class="fi fi-rr-clock-three text-indigo-500"></i>
              <span>{{ errand.deadline }}</span>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Requested By</div>
            <div class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <i class="fi fi-rr-user text-indigo-500"></i>
              <span>{{ errand.creator || 'Student' }}</span>
            </div>
          </div>
        </div>

        <!-- Description / Instructions -->
        <div class="space-y-2">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Errand Description & Instructions</h3>
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {{ errand.description }}
          </div>
        </div>

        <!-- Errand Helper Status Box -->
        <div v-if="errand.status === 'accepted'" class="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
            <i class="fi fi-rr-user-check"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-blue-900">
              {{ isAcceptedByMe ? 'You accepted this errand!' : `Accepted by ${errand.acceptedBy}` }}
            </div>
            <div class="text-xs text-blue-700 mt-0.5">
              {{ isAcceptedByMe ? 'Please assist your peer and mark this completed once finished.' : 'A peer student is currently fulfilling this request.' }}
            </div>
          </div>
        </div>

        <div v-else-if="errand.status === 'completed'" class="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
            <i class="fi fi-rr-check"></i>
          </div>
          <div>
            <div class="text-xs font-bold text-emerald-900">Errand Completed</div>
            <div class="text-xs text-emerald-700 mt-0.5">This task has been fulfilled successfully. Thank you for supporting peer students!</div>
          </div>
        </div>

        <!-- Bottom Action Buttons -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-xs text-slate-500">
            Student Connect Errand #{{ errand.id }}
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <!-- Edit button for creator -->
            <button
              v-if="isCreator && errand.status !== 'completed'"
              id="edit-errand-btn"
              class="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition-colors border border-indigo-200 cursor-pointer"
              @click="navigateTo(`/errands/edit?id=${errand.id}`)"
            >
              Edit Errand
            </button>

            <!-- Available to accept -->
            <button
              v-if="errand.status === 'available'"
              id="accept-errand-detail-btn"
              class="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              @click="handleAccept"
            >
              <i class="fi fi-rr-hand-holding-heart"></i>
              <span>Accept & Fulfill Errand</span>
            </button>

            <!-- Accepted by me: complete button -->
            <button
              v-else-if="errand.status === 'accepted' && isAcceptedByMe"
              id="complete-errand-detail-btn"
              class="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              @click="handleComplete"
            >
              <i class="fi fi-rr-check"></i>
              <span>Mark as Completed</span>
            </button>
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
  errandId: {
    type: String,
    required: true
  },
  currentUser: {
    type: String,
    default: 'Manho'
  }
})

const router = useRouter()

const errand = ref(null)
const loading = ref(true)
const error = ref('')

/**
 * Checks if the current student is the creator/requester of this errand.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isCreator = computed(() => {
  if (!errand.value || !props.currentUser) return false
  return (
    errand.value.creator === props.currentUser ||
    errand.value.creatorName === props.currentUser ||
    errand.value.creatorId === props.currentUser
  )
})

/**
 * Checks if the current student is the one who accepted this errand.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isAcceptedByMe = computed(() => {
  if (!errand.value) return false
  return errand.value.acceptedBy === props.currentUser
})

/**
 * Loads the errand details by ID.
 *
 * @param {string} id - Unique errand identifier.
 * @returns {Promise<void>}
 */
async function fetchErrandDetails(id) {
  if (!id) {
    error.value = 'No errand ID provided.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await studentConnect.getErrand(id)
    errand.value = res.data || res
  } catch (err) {
    error.value = err.message || 'Failed to load errand details'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.errandId,
  (newId) => {
    fetchErrandDetails(newId)
  },
  { immediate: true }
)

/**
 * Navigates to a target route path.
 *
 * @param {string} path - Target path.
 * @returns {void}
 */
function navigateTo(path) {
  router.push(path)
}

/**
 * Accepts the errand for completion.
 *
 * @returns {Promise<void>}
 */
async function handleAccept() {
  if (!errand.value) return
  try {
    const currentName = props.currentUser || 'Student'
    const currentId = localStorage.getItem('student_user_id') || 'student-001'

    const res = await studentConnect.acceptErrand(errand.value.id, {
      userName: currentName,
      userId: currentId
    })
    errand.value = res.data || res
    ElMessage.success('You accepted this errand! Thank you for helping a peer.')
  } catch (err) {
    ElMessage.error(err.message || 'Could not accept errand')
  }
}

/**
 * Marks the errand as completed.
 *
 * @returns {Promise<void>}
 */
async function handleComplete() {
  if (!errand.value) return
  try {
    const res = await studentConnect.completeErrand(errand.value.id)
    errand.value = res.data || res
    ElMessage.success('Errand marked as completed! Great job.')
  } catch (err) {
    ElMessage.error(err.message || 'Could not complete errand')
  }
}

/**
 * Returns the matching Flaticon icon class for an errand category.
 *
 * @param {string} category - Category name.
 * @returns {string} Icon class.
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
