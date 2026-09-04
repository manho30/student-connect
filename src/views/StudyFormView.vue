<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header with Back navigation -->
    <div class="flex items-center justify-between">
      <button
        id="study-form-back-btn"
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
        @click="handleCancel"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        <span>Back</span>
      </button>

      <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {{ isEdit ? 'Edit Mode' : 'New Study Pod' }}
      </span>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
      <div class="border-b border-slate-100 pb-4">
        <h1 class="text-2xl font-bold text-slate-900">
          {{ isEdit ? 'Edit Study Group' : 'Create a New Study Group' }}
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          {{ isEdit ? 'Update your study pod details, meeting time, and agenda.' : 'Gather peers for exams, project discussions, and collaborative study sessions.' }}
        </p>
      </div>

      <!-- Loading State for Edit -->
      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
        <p class="text-sm font-semibold text-slate-600">Loading study group data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-6 text-center bg-rose-50 border border-rose-200 rounded-xl space-y-3">
        <p class="text-sm text-rose-700 font-semibold">{{ error }}</p>
        <button
          class="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
          @click="handleCancel"
        >
          Return to Study Groups
        </button>
      </div>

      <!-- Form Component -->
      <StudyGroupForm
        v-else
        :initial-data="groupData"
        :is-edit="isEdit"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import studentConnect from '@/api'
import StudyGroupForm from '../components/study/StudyGroupForm.vue'

const route = useRoute()
const router = useRouter()

const groupData = ref(null)
const loading = ref(false)
const error = ref('')

const isEdit = computed(() => {
  return route.path.includes('/edit') || (Boolean(route.query.id) && route.path.includes('/study/edit'))
})

const groupId = computed(() => {
  return route.query.id ? String(route.query.id) : ''
})

/**
 * Loads the existing study group details if in edit mode.
 *
 * @returns {Promise<void>}
 */
async function loadGroupForEdit() {
  if (!isEdit.value || !groupId.value) {
    groupData.value = null
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await studentConnect.getStudyGroup(groupId.value)
    groupData.value = res.data || res
  } catch (err) {
    error.value = err.message || 'Failed to load study group details for editing'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadGroupForEdit()
})

watch(
  () => route.query.id,
  () => {
    loadGroupForEdit()
  }
)

/**
 * Handles form submission for creating or updating a study group.
 *
 * @param {Object} formData - Validated study group form payload.
 * @returns {Promise<void>}
 */
async function handleSubmit(formData) {
  try {
    if (isEdit.value && groupId.value) {
      await studentConnect.updateStudyGroup(groupId.value, formData)
      ElMessage.success('Study group updated successfully!')
      router.push(`/study?id=${groupId.value}`)
    } else {
      const res = await studentConnect.createStudyGroup({
        ...formData
      })
      const createdItem = res.data || res
      ElMessage.success('Study group created! Your pod is now live.')
      if (createdItem && createdItem.id) {
        router.push(`/study?id=${createdItem.id}`)
      } else {
        router.push('/study')
      }
    }
  } catch (err) {
    ElMessage.error(err.message || 'Operation failed. Please try again.')
  }
}

/**
 * Cancels editing/creation and returns to detail or listing.
 *
 * @returns {void}
 */
function handleCancel() {
  if (isEdit.value && groupId.value) {
    router.push(`/study?id=${groupId.value}`)
  } else {
    router.push('/study')
  }
}
</script>
