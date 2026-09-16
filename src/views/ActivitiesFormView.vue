<!-- Activities Form View Page -->
<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <!-- Header with Back navigation -->
    <div class="flex items-center justify-between">
      <button
          id="activities-form-back-btn"
          :disabled="submitting"
          class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-xs transition-colors hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          @click="handleCancel"
      >
        <svg
            class="h-4 w-4"
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

      <span
          class="text-xs font-bold uppercase tracking-wider text-slate-400"
      >
        {{ isEdit ? 'Edit Mode' : 'New Activity' }}
      </span>
    </div>

    <!-- Main Card -->
    <div
        class="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
    >
      <!-- Header -->
      <div class="border-b border-slate-100 pb-4">
        <h1 class="text-2xl font-bold text-slate-900">
          {{ isEdit ? 'Edit Activity' : 'Promote a New Activity' }}
        </h1>

        <p class="mt-1 text-sm text-slate-500">
          {{
            isEdit
                ? 'Update your activity details and information for students.'
                : 'Share a co-curricular event, competition, workshop, or opportunity with fellow students.'
          }}
        </p>
      </div>

      <!-- Loading State -->
      <div
          v-if="loading"
          class="py-12 text-center"
      >
        <div
            class="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"
        ></div>

        <p class="text-sm font-semibold text-slate-600">
          Loading activity data...
        </p>
      </div>

      <!-- Error State -->
      <div
          v-else-if="error"
          class="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-6 text-center"
      >
        <p class="text-sm font-semibold text-rose-700">
          {{ error }}
        </p>

        <button
            type="button"
            class="cursor-pointer rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white hover:bg-brand-700"
            @click="handleCancel"
        >
          Return to Activity
        </button>
      </div>

      <!-- Form Component -->
      <ActivitiesForm
          v-else
          :activity="activity"
          :editing="isEdit"
          @saved="handleSaved"
          @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  watch
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import { ElMessage } from 'element-plus'

import studentConnect from '@/api'

import ActivitiesForm from '@/components/activities/ActivitiesForm.vue'

const route = useRoute()
const router = useRouter()

const activity = ref(null)

const loading = ref(false)

const submitting = ref(false)

const error = ref('')

const isEdit = computed(() => {
  return route.path === '/activities/edit'
})

const activityId = computed(() => {
  return route.query.id
      ? String(route.query.id)
      : ''
})

/**
 * Determines the effective activity status.
 *
 * The backend may return an explicit terminal status. Otherwise,
 * an activity becomes expired when its registration deadline has
 * passed, or when its event date has passed if no deadline exists.
 *
 * @param {Object} value - Activity object.
 * @returns {string} Effective activity status.
 */
function getActivityStatus(value) {
  if (!value) {
    return 'open'
  }

  const explicitStatus =
      String(value.status || '').toLowerCase()

  if (
      ['cancelled', 'completed', 'expired'].includes(
          explicitStatus
      )
  ) {
    return explicitStatus
  }

  const now =
      Math.floor(Date.now() / 1000)

  const registrationDeadline =
      Number(value.registrationDeadline)

  const eventDate =
      Number(value.eventDate)

  if (
      registrationDeadline > 0 &&
      registrationDeadline <= now
  ) {
    return 'expired'
  }

  if (
      !registrationDeadline &&
      eventDate > 0 &&
      eventDate <= now
  ) {
    return 'expired'
  }

  return 'open'
}

/**
 * Loads the existing activity data required by the edit form.
 *
 * @returns {Promise<void>} Resolves after the activity data has been loaded.
 */
async function loadActivityForEdit() {
  if (!isEdit.value) {
    activity.value = null
    error.value = ''
    return
  }

  if (!activityId.value) {
    activity.value = null
    error.value = 'Activity ID is missing.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response =
        await studentConnect.getActivity(
            activityId.value
        )

    if (!response?.success) {
      throw new Error(
          response?.message ||
          'Failed to load activity.'
      )
    }

    if (!response.data) {
      throw new Error(
          'Activity could not be found.'
      )
    }

    const loadedActivity =
        response.data

    const status =
        getActivityStatus(
            loadedActivity
        )

    if (
        ['completed', 'cancelled', 'expired'].includes(
            status
        )
    ) {
      activity.value = null

      error.value =
          status === 'cancelled'
              ? 'This activity has been cancelled and can no longer be edited.'
              : status === 'completed'
                  ? 'This activity has already been completed and can no longer be edited.'
                  : 'This activity has expired and can no longer be edited.'

      return
    }

    activity.value =
        loadedActivity
  } catch (err) {
    activity.value = null

    error.value =
        err?.message ||
        'Failed to load activity for editing.'

    ElMessage.error(
        error.value
    )
  } finally {
    loading.value = false
  }
}

/**
 * Handles route changes and reloads activity data when required.
 *
 * @returns {void} Starts the required asynchronous loading operation.
 */
function handleRouteChange() {
  loadActivityForEdit()
}

onMounted(() => {
  loadActivityForEdit()
})

watch(
    () => [
      route.path,
      route.query.id
    ],
    handleRouteChange
)

/**
 * Handles a successful create or update operation.
 *
 * @param {Object} savedActivity - Activity returned by the API.
 * @returns {Promise<void>} Resolves after navigation.
 */
async function handleSaved(savedActivity) {
  if (submitting.value) {
    return
  }

  submitting.value = true

  try {
    const savedId =
        savedActivity?.id ||
        activityId.value

    ElMessage.success(
        isEdit.value
            ? 'Activity updated successfully!'
            : 'Activity published successfully!'
    )

    await new Promise(
        resolve =>
            setTimeout(resolve, 500)
    )

    if (!savedId) {
      await router.push(
          '/activities'
      )

      return
    }

    await router.push({
      path: '/activities',
      query: {
        id: String(savedId)
      }
    })
  } catch (err) {
    ElMessage.error(
        err?.message ||
        'Unable to open the activity.'
    )
  } finally {
    submitting.value = false
  }
}

/**
 * Cancels the current form operation and returns to the appropriate activity page.
 *
 * @returns {void} Performs router navigation.
 */
function handleCancel() {
  if (submitting.value) {
    return
  }

  if (
      isEdit.value &&
      activityId.value
  ) {
    router.push({
      path: '/activities',
      query: {
        id: activityId.value
      }
    })

    return
  }

  router.push(
      '/activities'
  )
}
</script>
