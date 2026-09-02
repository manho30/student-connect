<template>
  <div id="study-group-detail-container" class="max-w-4xl mx-auto space-y-6">
    <!-- Back & Navigation Bar -->
    <div class="flex items-center justify-between">
      <button
        id="back-to-study-btn"
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
        @click="navigateTo('/study')"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        <span>Back to Study Groups</span>
      </button>

      <div v-if="group && isCreator" class="flex items-center gap-2">
        <button
          id="edit-study-detail-btn"
          class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors cursor-pointer border border-indigo-200"
          @click="navigateTo(`/study/edit?id=${group.id}`)"
        >
          <i class="fi fi-rr-edit text-xs"></i>
          <span>Edit Group</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="loading"
      id="study-detail-loading"
      class="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs"
    >
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
      <p class="text-sm font-semibold text-slate-600">Loading study pod details...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error || !group"
      id="study-detail-error"
      class="bg-white rounded-2xl border border-rose-200 p-10 text-center shadow-xs space-y-4"
    >
      <div class="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
        <i class="fi fi-rr-exclamation text-2xl"></i>
      </div>
      <div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">Study Group Not Found</h3>
        <p class="text-xs text-slate-500 max-w-md mx-auto">{{ error || 'The requested study group session could not be found.' }}</p>
      </div>
      <button
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
        @click="navigateTo('/study')"
      >
        View All Study Groups
      </button>
    </div>

    <!-- Main Detail Card -->
    <div
      v-else
      id="study-group-detail-card"
      class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
    >
      <!-- Hero Header -->
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span class="bg-white/10 text-indigo-200 border border-white/10 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <i class="fi fi-rr-book-alt"></i>
            <span>{{ group.subject }}</span>
          </span>

          <span
            :class="[
              'px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
              isFull
                ? 'bg-slate-700 text-slate-300'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
            ]"
          >
            {{ isFull ? 'Group Full' : `${group.members}/${group.maxMembers} Members Joined` }}
          </span>
        </div>

        <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
          {{ group.name }}
        </h1>
      </div>

      <!-- Detail Body -->
      <div class="p-6 sm:p-8 space-y-6">
        <!-- Metadata Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Session Schedule</div>
            <div class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <i class="fi fi-rr-calendar text-indigo-500"></i>
              <span>{{ group.date }} · {{ group.time }}</span>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Location / Venue</div>
            <div class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <i class="fi fi-rr-marker text-rose-500"></i>
              <span>{{ group.location }}</span>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div class="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Session Host</div>
            <div class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <i class="fi fi-rr-user text-indigo-500"></i>
              <span>{{ group.creator || 'Student' }}</span>
            </div>
          </div>
        </div>

        <!-- Description / Topics to Cover -->
        <div class="space-y-2">
          <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Agenda & Discussion Topics</h3>
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
            {{ group.description }}
          </div>
        </div>

        <!-- Members Pod List -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Study Pod Members ({{ group.members || 0 }} / {{ group.maxMembers || 8 }})
            </h3>
            <span v-if="isJoined" class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              You are in this pod
            </span>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div v-if="group.memberList && group.memberList.length > 0" class="flex flex-wrap gap-2">
              <div
                v-for="member in group.memberList"
                :key="member"
                class="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs"
              >
                <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                  {{ member.charAt(0).toUpperCase() }}
                </div>
                <span>{{ member }}</span>
                <span v-if="member === group.creator" class="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-medium">
                  Host
                </span>
                <span v-else-if="member === currentUser" class="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold">
                  You
                </span>
              </div>
            </div>
            <div v-else class="text-xs text-slate-500 italic">
              No members have joined this study pod yet.
            </div>
          </div>
        </div>

        <!-- Bottom Action Bar -->
        <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-xs text-slate-500">
            Study Group #{{ group.id }}
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <!-- Edit button for host -->
            <button
              v-if="isCreator"
              id="edit-study-btn"
              class="flex-1 sm:flex-none px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-xs transition-colors border border-indigo-200 cursor-pointer"
              @click="navigateTo(`/study/edit?id=${group.id}`)"
            >
              Edit Study Group
            </button>

            <!-- Leave button if joined -->
            <button
              v-if="isJoined"
              id="leave-study-detail-btn"
              class="w-full sm:w-auto px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              @click="handleLeave"
            >
              <i class="fi fi-rr-cross-small"></i>
              <span>Leave Study Pod</span>
            </button>

            <!-- Join button if not joined and not full -->
            <button
              v-else-if="!isFull"
              id="join-study-detail-btn"
              class="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              @click="handleJoin"
            >
              <i class="fi fi-rr-users"></i>
              <span>Join Study Pod</span>
            </button>

            <!-- Full state -->
            <button
              v-else
              disabled
              class="w-full sm:w-auto px-8 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed"
            >
              Study Pod is Full
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
  groupId: {
    type: String,
    required: true
  },
  currentUser: {
    type: String,
    default: 'Manho'
  }
})

const router = useRouter()

const group = ref(null)
const loading = ref(true)
const error = ref('')

/**
 * Checks if the current student is the creator/host of this study group.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isCreator = computed(() => {
  if (!group.value || !props.currentUser) return false
  return (
    group.value.creator === props.currentUser ||
    group.value.creatorName === props.currentUser ||
    group.value.creatorId === props.currentUser
  )
})

/**
 * Checks if the study group has reached full capacity.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isFull = computed(() => {
  if (!group.value) return false
  return Number(group.value.members) >= Number(group.value.maxMembers)
})

/**
 * Checks if the current student has joined this study group.
 *
 * @type {import('vue').ComputedRef<boolean>}
 */
const isJoined = computed(() => {
  if (!group.value || !Array.isArray(group.value.memberList)) return false
  return group.value.memberList.includes(props.currentUser)
})

/**
 * Loads the study group details by ID.
 *
 * @param {string} id - Unique study group identifier.
 * @returns {Promise<void>}
 */
async function fetchGroupDetails(id) {
  if (!id) {
    error.value = 'No study group ID provided.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await studentConnect.getStudyGroup(id)
    group.value = res.data || res
  } catch (err) {
    error.value = err.message || 'Failed to load study group details'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

watch(
  () => props.groupId,
  (newId) => {
    fetchGroupDetails(newId)
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
 * Joins the study group pod.
 *
 * @returns {Promise<void>}
 */
async function handleJoin() {
  if (!group.value) return
  try {
    const currentName = props.currentUser || 'Student'
    const currentId = localStorage.getItem('student_user_id') || 'student-001'

    const res = await studentConnect.joinStudyGroup(group.value.id, {
      userName: currentName,
      userId: currentId
    })
    group.value = res.data || res
    ElMessage.success('You joined the study group! Happy studying.')
  } catch (err) {
    ElMessage.error(err.message || 'Could not join study group')
  }
}

/**
 * Leaves the study group pod.
 *
 * @returns {Promise<void>}
 */
async function handleLeave() {
  if (!group.value) return
  try {
    const currentName = props.currentUser || 'Student'
    const currentId = localStorage.getItem('student_user_id') || 'student-001'

    const res = await studentConnect.leaveStudyGroup(group.value.id, {
      userName: currentName,
      userId: currentId
    })
    group.value = res.data || res
    ElMessage.info('You left the study group.')
  } catch (err) {
    ElMessage.error(err.message || 'Could not leave study group')
  }
}
</script>
