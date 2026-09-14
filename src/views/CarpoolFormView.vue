<!-- Carpool Form View Page -->
<template>
  <div class="max-w-2xl mx-auto space-y-6">
    <!-- Header with Back navigation -->
    <div class="flex items-center justify-between">
      <button
          id="carpool-form-back-btn"
          :disabled="submitting"
          class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
          @click="handleCancel"
      >
        <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>

        <span>Back</span>
      </button>

      <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {{ isEdit ? 'Edit Mode' : 'New Ride' }}
      </span>
    </div>

    <!-- Main Card -->
    <div
        class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6"
    >
      <!-- Header -->
      <div class="border-b border-slate-100 pb-4">
        <h1 class="text-2xl font-bold text-slate-900">
          {{ isEdit ? 'Edit Carpool Ride' : 'Create a New Carpool Ride' }}
        </h1>

        <p class="text-sm text-slate-500 mt-1">
          {{
            isEdit
                ? 'Update your trip details and instructions for joining students.'
                : 'Set up departure points, date, time, and vehicle capacity for fellow peers.'
          }}
        </p>
      </div>

      <!-- Loading State for Edit -->
      <div v-if="loading" class="py-12 text-center">
        <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-600 border-t-transparent mb-3"
        ></div>

        <p class="text-sm font-semibold text-slate-600">
          Loading ride data...
        </p>
      </div>

      <!-- Error State -->
      <div
          v-else-if="error"
          class="p-6 text-center bg-rose-50 border border-rose-200 rounded-xl space-y-3"
      >
        <p class="text-sm text-rose-700 font-semibold">
          {{ error }}
        </p>

        <button
            class="bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
            @click="handleCancel"
        >
          Return to Carpool List
        </button>
      </div>

      <!-- Form Component -->
      <CarpoolForm
          v-else
          :initial-data="carpoolData"
          :is-edit="isEdit"
          :submitting="submitting"
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
import CarpoolForm from '../components/carpool/CarpoolForm.vue'

const route = useRoute()
const router = useRouter()

const carpoolData = ref(null)
const loading = ref(false)
const submitting = ref(false)
const error = ref('')

const isEdit = computed(() => {
  return route.path === '/carpool/edit'
})

const carpoolId = computed(() => {
  return route.query.id ? String(route.query.id) : ''
})

/**
 * Loads the existing carpool data required by the edit form.
 *
 * @returns {Promise<void>} Resolves after the carpool data has been loaded.
 * @throws {Error} Displays an error message when the API request fails.
 */
async function loadCarpoolForEdit() {
  if (!isEdit.value) {
    carpoolData.value = null
    return
  }

  if (!carpoolId.value) {
    error.value = 'Carpool ID is missing.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await studentConnect.getCarPool(carpoolId.value)

    if (!response?.success) {
      throw new Error(
          response?.message || 'Failed to load carpool details'
      )
    }

    carpoolData.value = response.data
  } catch (err) {
    carpoolData.value = null
    error.value =
        err?.message || 'Failed to load carpool details for editing'

    ElMessage.error(error.value)
  } finally {
    loading.value = false
  }
}

/**
 * Handles route changes and reloads the edit data when necessary.
 *
 * @returns {void} Starts the required asynchronous edit-data loading.
 */
function handleRouteChange() {
  loadCarpoolForEdit()
}

onMounted(() => {
  loadCarpoolForEdit()
})

watch(
    () => [route.path, route.query.id],
    handleRouteChange
)

/**
 * Creates a new carpool or updates an existing carpool through the API.
 *
 * @param {Object} formData - Validated carpool form data.
 * @returns {Promise<void>} Resolves after the operation and navigation complete.
 * @throws {Error} Displays an error message when the API operation fails.
 */
async function handleSubmit(formData) {
  if (submitting.value) {
    return
  }

  submitting.value = true

  try {
    if (isEdit.value) {
      if (!carpoolId.value) {
        throw new Error('Carpool ID is missing')
      }

      const response = await studentConnect.updateCarPool(
          carpoolId.value,
          formData
      )

      if (!response?.success) {
        throw new Error(
            response?.message || 'Failed to update carpool'
        )
      }

      ElMessage.success(
          response.message || 'Carpool ride updated successfully!'
      )
      // wait for a short delay to ensure the message is visible before navigation
      await new Promise(resolve => setTimeout(resolve, 500))
      await router.push({
        path: '/carpool',
        query: {
          id: carpoolId.value
        }
      })

      return
    }

    const response = await studentConnect.createCarPool(formData)

    if (!response?.success) {
      throw new Error(
          response?.message || 'Failed to create carpool'
      )
    }

    const createdId = response.data?.id

    if (!createdId) {
      throw new Error(
          'Carpool was created, but the backend did not return its ID.'
      )
    }

    ElMessage.success(
        response.message || 'Carpool ride created successfully!'
    )

    // wait for a short delay to ensure the message is visible before navigation
    await new Promise(resolve => setTimeout(resolve, 500))
    await router.push({
      path: '/carpool',
      query: {
        id: String(createdId)
      }
    })
  } catch (err) {
    ElMessage.error(
        err?.message || 'Operation failed. Please try again.'
    )
  } finally {
    submitting.value = false
  }
}

/**
 * Cancels the current form operation and returns to the appropriate carpool page.
 *
 * @returns {void} Performs router navigation.
 */
function handleCancel() {
  if (submitting.value) {
    return
  }

  if (isEdit.value && carpoolId.value) {
    router.push({
      path: '/carpool',
      query: {
        id: carpoolId.value
      }
    })

    return
  }

  router.push('/carpool')
}
</script>
