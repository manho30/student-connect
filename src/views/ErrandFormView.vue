<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header with Back navigation -->
    <div class="flex items-center justify-between">
      <button
        id="errand-form-back-btn"
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
        @click="handleCancel"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        <span>Back</span>
      </button>

      <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {{ isEdit ? 'Edit Mode' : 'New Errand' }}
      </span>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
      <div class="border-b border-slate-100 pb-4">
        <h1 class="text-2xl font-bold text-slate-900">
          {{ isEdit ? 'Edit Student Errand' : 'Post a Student Errand Request' }}
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          {{ isEdit ? 'Update your errand details and instructions.' : 'Describe what you need help with so a fellow peer student nearby can assist.' }}
        </p>
      </div>

      <!-- Loading State for Edit -->
      <div v-if="loading" class="py-12 text-center">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mb-3"></div>
        <p class="text-sm font-semibold text-slate-600">Loading errand data...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-6 text-center bg-rose-50 border border-rose-200 rounded-xl space-y-3">
        <p class="text-sm text-rose-700 font-semibold">{{ error }}</p>
        <button
          class="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
          @click="handleCancel"
        >
          Return to Errands List
        </button>
      </div>

      <!-- Form Component -->
      <ErrandForm
        v-else
        :initial-data="errandData"
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
import ErrandForm from '../components/errands/ErrandForm.vue'

const route = useRoute()
const router = useRouter()

const errandData = ref(null)
const loading = ref(false)
const error = ref('')

const isEdit = computed(() => {
  return route.path.includes('/edit') || (Boolean(route.query.id) && route.path.includes('/errands/edit'))
})

const errandId = computed(() => {
  return route.query.id ? String(route.query.id) : ''
})

/**
 * Loads the existing errand details if in edit mode.
 *
 * @returns {Promise<void>}
 */
async function loadErrandForEdit() {
  if (!isEdit.value || !errandId.value) {
    errandData.value = null
    return
  }

  loading.value = true
  error.value = ''
  try {
    const res = await studentConnect.getErrand(errandId.value)
    errandData.value = res.data || res
  } catch (err) {
    error.value = err.message || 'Failed to load errand details for editing'
    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadErrandForEdit()
})

watch(
  () => route.query.id,
  () => {
    loadErrandForEdit()
  }
)

/**
 * Handles form submission for creating or updating an errand.
 *
 * @param {Object} formData - Validated errand form payload.
 * @returns {Promise<void>}
 */
async function handleSubmit(formData) {
  try {
    const currentName = localStorage.getItem('student_user_name') || 'Manho'
    const currentId = localStorage.getItem('student_user_id') || 'student-001'

    if (isEdit.value && errandId.value) {
      await studentConnect.updateErrand(errandId.value, formData)
      ElMessage.success('Errand updated successfully!')
      router.push(`/errands?id=${errandId.value}`)
    } else {
      const res = await studentConnect.createErrand({
        ...formData,
        creatorName: currentName,
        creatorId: currentId
      })
      const createdItem = res.data || res
      ElMessage.success('Errand posted! Nearby students can now see your request.')
      if (createdItem && createdItem.id) {
        router.push(`/errands?id=${createdItem.id}`)
      } else {
        router.push('/errands')
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
  if (isEdit.value && errandId.value) {
    router.push(`/errands?id=${errandId.value}`)
  } else {
    router.push('/errands')
  }
}
</script>
