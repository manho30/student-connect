<!-- views/studyFormView.vue -->

<template>
  <div class="mx-auto max-w-2xl space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <button
          id="study-form-back-btn"
          class="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-xs transition-colors hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="submitting"
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
        {{ isEdit ? 'Edit Mode' : 'New Study Group' }}
      </span>
    </div>

    <!-- Main Card -->
    <div
        class="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8"
    >
      <!-- Page Header -->
      <div class="border-b border-slate-100 pb-4">
        <h1 class="text-2xl font-bold text-slate-900">
          {{
            isEdit
                ? 'Edit Study Group'
                : 'Create a New Study Group'
          }}
        </h1>

        <p class="mt-1 text-sm text-slate-500">
          {{
            isEdit
                ? 'Update your study group details, schedule, and meeting information.'
                : 'Create a study session and invite other students to join.'
          }}
        </p>
      </div>

      <!-- Loading -->
      <div
          v-if="loading"
          class="py-12 text-center"
      >
        <div
            class="mb-3 inline-block h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent"
        />

        <p class="text-sm font-semibold text-slate-600">
          Loading study group data...
        </p>
      </div>

      <!-- Error -->
      <div
          v-else-if="error"
          class="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-6 text-center"
      >
        <p class="text-sm font-semibold text-rose-700">
          {{ error }}
        </p>

        <button
            class="cursor-pointer rounded-xl bg-brand-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-700"
            @click="handleCancel"
        >
          Return to Study Groups
        </button>
      </div>

      <!-- Form -->
      <StudyGroupForm
          v-else
          :initial-data="groupData"
          :is-edit="isEdit"
          :submitting="submitting"
          @submit="handleSubmit"
          @cancel="handleCancel"
      />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  watch
} from 'vue'

import {
  useRoute,
  useRouter
} from 'vue-router'

import {
  ElMessage
} from 'element-plus'

import studentConnect from '@/api'

import {
  user
} from '@/services/auth'

import StudyGroupForm from '@/components/study/StudyGroupForm.vue'

const route = useRoute()
const router = useRouter()

const groupData = ref(null)
const loading = ref(false)
const submitting = ref(false)
const error = ref('')

/**
 * Determines whether the current page is editing
 * an existing study group.
 *
 * @returns {boolean} True when the current route is an edit route.
 */
const isEdit = computed(() => {
  return route.path.includes('/edit')
})

/**
 * Gets the study group ID from the route query.
 *
 * @returns {string} Study group ID or an empty string.
 */
const groupId = computed(() => {
  return route.query.id
      ? String(route.query.id)
      : ''
})

/**
 * Determines whether the authenticated user owns
 * the currently loaded study group.
 *
 * The exact comparison supports the common backend
 * owner structures:
 *
 * - owner.id
 * - owner.uid
 * - ownerId
 *
 * The backend remains responsible for authorization.
 *
 * @returns {boolean} True when the current user is the owner.
 */
const isOwner = computed(() => {
  const currentUser = user.value
  const group = groupData.value

  if (!currentUser || !group) {
    return false
  }

  const currentUserId =
      currentUser.uid ||
      currentUser.id

  const ownerId =
      group.owner?.uid ||
      group.owner?.id ||
      group.ownerId ||
      group.creator?.uid ||
      group.creator?.id

  if (!currentUserId || !ownerId) {
    return false
  }

  return String(currentUserId) === String(ownerId)
})

/**
 * Determines whether the study group's current state
 * permits editing.
 *
 * Backend-controlled status values are respected by
 * the frontend where available.
 *
 * @returns {boolean} True when editing is allowed.
 */
const isEditable = computed(() => {
  const status = groupData.value?.status

  /*
   * If no status is returned, ownership is still checked
   * and the backend remains authoritative.
   */
  if (!status) {
    return true
  }

  return ![
    'completed',
    'cancelled',
    'closed'
  ].includes(
      String(status).toLowerCase()
  )
})

/**
 * Loads the study group required for edit mode.
 *
 * The frontend verifies ownership before displaying
 * the editable form.
 *
 * @returns {Promise<void>}
 */
async function loadGroupForEdit() {
  /*
   * Create mode does not require existing data.
   */
  if (!isEdit.value) {
    groupData.value = null
    error.value = ''
    loading.value = false

    return
  }

  /*
   * Edit mode requires a study group ID.
   */
  if (!groupId.value) {
    groupData.value = null
    error.value =
        'No study group ID was provided.'

    return
  }

  loading.value = true
  error.value = ''

  try {
    const response =
        await studentConnect.getStudyGroup(
            groupId.value
        )

    const data =
        response?.data ?? response

    /*
     * Validate the returned resource.
     */
    if (!data || !data.id) {
      throw new Error(
          'Invalid study group data received from server.'
      )
    }

    groupData.value = data

    /*
     * Only the creator/owner may edit the group.
     *
     * This is a frontend guard.
     * The backend must independently enforce ownership.
     */
    if (!isOwner.value) {
      throw new Error(
          'You do not have permission to edit this study group.'
      )
    }

    /*
     * Prevent editing groups that are no longer active.
     */
    if (!isEditable.value) {
      throw new Error(
          'This study group can no longer be edited.'
      )
    }
  } catch (err) {
    console.error(
        'Failed to load study group:',
        err
    )

    error.value =
        err?.message ||
        'Failed to load study group details.'

    groupData.value = null

    ElMessage.error(
        error.value
    )
  } finally {
    loading.value = false
  }
}

/**
 * Creates or updates a study group.
 *
 * Only fields explicitly allowed by the backend
 * schema are submitted:
 *
 * - title
 * - subject
 * - description
 * - schedule.startTime
 * - schedule.endTime
 * - location
 * - capacity
 *
 * Backend-controlled fields are never submitted:
 *
 * - id
 * - owner
 * - members
 * - status
 * - createdAt
 * - updatedAt
 *
 * @param {Object} formData Validated study group form data.
 * @returns {Promise<void>}
 */
async function handleSubmit(formData) {
  if (submitting.value) {
    return
  }

  submitting.value = true

  try {
    /*
     * Explicitly construct the allowed payload.
     *
     * Do not spread formData because this could accidentally
     * send backend-controlled fields in the future.
     */
    const payload = {
      title:
      formData.title,

      subject:
      formData.subject,

      description:
      formData.description,

      schedule: {
        startTime:
        formData.schedule?.startTime,

        endTime:
        formData.schedule?.endTime
      },

      location:
      formData.location,

      capacity:
          Number(formData.capacity)
    }

    /*
     * Update mode.
     */
    if (
        isEdit.value &&
        groupId.value
    ) {
      /*
       * Re-check ownership before submitting.
       */
      if (!isOwner.value) {
        throw new Error(
            'Only the study group owner can edit this group.'
        )
      }

      if (!isEditable.value) {
        throw new Error(
            'This study group can no longer be edited.'
        )
      }

      const response = await studentConnect.updateStudyGroup(
          groupId.value,
          payload
      )

      if (response?.success === false) {
        throw new Error(
            response?.message ||
            'Failed to update study group.'
        )
      }

      await router.push({
        path: '/study',
        query: {
          id: groupId.value
        }
      })

      return
    }

    /*
     * Create mode.
     *
     * The backend automatically:
     *
     * - determines the authenticated owner
     * - inserts the owner into members
     * - counts the owner toward capacity
     * - manages IDs and timestamps
     */
    const response = await studentConnect.createStudyGroup(payload)

    const createdGroup = response?.data ?? response

    ElMessage.success('Study group created successfully.')

    if (createdGroup?.id) {
      await router.push({
        path: '/study',
        query: {
          id: createdGroup.id
        }
      })
    } else {
      await router.push('/study')
    }
  } catch (err) {
    console.error(
        'Failed to save study group:',
        err
    )

    ElMessage.error(
        err?.message ||
        'Operation failed. Please try again.'
    )
  } finally {
    submitting.value = false
  }
}

/**
 * Cancels the current operation.
 *
 * Edit mode returns to the study group detail page.
 * Create mode returns to the study group listing.
 *
 * @returns {Promise<void>}
 */
async function handleCancel() {
  if (submitting.value) {
    return
  }

  if (
      isEdit.value &&
      groupId.value
  ) {
    await router.push({
      path: '/study',
      query: {
        id: groupId.value
      }
    })

    return
  }

  await router.push('/study')
}

/**
 * Loads edit data when the component is mounted.
 */
onMounted(() => {
  loadGroupForEdit()
})

/**
 * Reloads data when the route changes without
 * destroying the component instance.
 */
watch(
    [
      () => route.path,
      () => route.query.id
    ],
    () => {
      loadGroupForEdit()
    }
)
</script>
