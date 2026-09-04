<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans pb-20 md:pb-0">    <!-- Page Header -->
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <button
            id="back-to-errands-btn"
            type="button"
            class="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer mb-3"
            @click="goBack"
        >
          <i class="fi fi-rr-arrow-left"></i>
          <span>Back to Errands</span>
        </button>

        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {{ isEdit ? 'Edit Errand' : 'Create Errand' }}
        </h1>

        <p class="mt-1 text-sm text-slate-500">
          {{
            isEdit
                ? 'Update the details of your errand.'
                : 'Ask another student for help with a task.'
          }}
        </p>
      </div>
    </header>

    <!-- Loading -->
    <div
        v-if="loading"
        class="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 flex flex-col items-center justify-center"
    >
      <i class="fi fi-rr-spinner-alt animate-spin text-2xl text-indigo-600 mb-3"></i>
      <p class="text-sm font-semibold text-slate-600">
        Loading errand...
      </p>
    </div>

    <!-- Error -->
    <div
        v-else-if="error"
        class="bg-white border border-rose-200 rounded-2xl shadow-sm p-8"
    >
      <div class="flex items-start gap-4">
        <div
            class="w-10 h-10 shrink-0 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"
        >
          <i class="fi fi-rr-exclamation"></i>
        </div>

        <div class="flex-1">
          <h2 class="text-sm font-bold text-slate-900">
            Unable to load errand
          </h2>

          <p class="mt-1 text-sm text-slate-500">
            {{ error }}
          </p>

          <button
              id="error-back-btn"
              type="button"
              class="mt-5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              @click="goBack"
          >
            Back to Errands
          </button>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div
        v-else
        class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
    >
      <!-- Form Header -->
      <div class="px-5 sm:px-8 py-5 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div
              class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"
          >
            <i
                :class="
                isEdit
                  ? 'fi fi-rr-edit'
                  : 'fi fi-rr-plus'
              "
            ></i>
          </div>

          <div>
            <h2 class="text-sm font-bold text-slate-900">
              {{ isEdit ? 'Errand Details' : 'New Errand' }}
            </h2>

            <p class="text-xs text-slate-500 mt-0.5">
              {{
                isEdit
                    ? 'Make changes to your open errand.'
                    : 'Provide enough information for another student to help.'
              }}
            </p>
          </div>
        </div>
      </div>

      <!-- Form Body -->
      <div class="px-5 sm:px-8 py-6">
        <ErrandForm
            :initial-data="errandData"
            :is-edit="isEdit"
            :submitting="submitting"
            @submit="handleSubmit"
            @cancel="goBack"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import ErrandForm from '@/components/errands/ErrandForm.vue'
import studentConnect from '@/api'
import { user } from '@/services/auth'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const error = ref('')

const errandData = ref({
  title: '',
  description: '',
  location: '',
  deadline: null
})

/**
 * Determines whether the current route is an errand edit page.
 *
 * @returns {boolean} True when the current route represents an edit operation.
 */
const isEdit = computed(() => {
  return route.path === '/errands/edit'
})

/**
 * Returns the errand ID supplied through the route query.
 *
 * @returns {string} The errand ID, or an empty string when unavailable.
 */
const errandId = computed(() => {
  return route.query.id
      ? String(route.query.id)
      : ''
})

/**
 * Determines whether the authenticated Firebase user owns the current errand.
 *
 * Firebase Authentication exposes the authenticated user's unique identifier
 * through `user.value.uid`. The backend requester ID must contain the same UID.
 *
 * @returns {boolean} True when the authenticated user is the requester.
 */
const isRequester = computed(() => {
  const currentUserId = user.value?.uid
  const requesterId = errandData.value?.requester?.id

  if (!currentUserId || !requesterId) {
    return false
  }

  return String(currentUserId) === String(requesterId)
})

/**
 * Determines whether the loaded errand can currently be edited.
 *
 * Only the requester may edit an errand, and only while its status is open.
 *
 * @returns {boolean} True when the current user is allowed to edit.
 */
const canEdit = computed(() => {
  return Boolean(
      isEdit.value &&
      isRequester.value &&
      errandData.value?.status === 'open'
  )
})

/**
 * Loads the existing errand for the edit page.
 *
 * The authenticated Firebase user must be available and must match
 * the requester recorded on the errand. Only open errands are editable.
 *
 * @returns {Promise<void>} Resolves after the errand has been loaded.
 * @throws {Error} When the errand cannot be loaded or editing is unauthorized.
 */
async function loadErrandForEdit() {
  if (!errandId.value) {
    throw new Error('Errand ID is missing.')
  }

  /*
   * Firebase Authentication can still be initializing when the component
   * mounts. Wait until the auth service has populated user.value.
   */
  if (!user.value?.uid) {
    throw new Error('You must be logged in to edit an errand.')
  }

  const response = await studentConnect.getErrand(
      errandId.value
  )

  if (!response?.success || !response?.data) {
    throw new Error(
        response?.message ||
        'Could not load errand.'
    )
  }

  const data = response.data

  errandData.value = data

  const requesterId = data.requester?.id

  if (!requesterId) {
    throw new Error(
        'This errand does not have a valid requester.'
    )
  }

  if (
      String(user.value.uid) !==
      String(requesterId)
  ) {
    throw new Error(
        'You do not have permission to edit this errand.'
    )
  }

  if (data.status !== 'open') {
    throw new Error(
        'This errand can no longer be edited because it is not open.'
    )
  }
}

/**
 * Loads the page data according to the current route.
 *
 * Create mode starts with an empty form. Edit mode loads and authorizes
 * the existing errand before displaying the form.
 *
 * @returns {Promise<void>} Resolves when page initialization is complete.
 */
async function initializePage() {
  loading.value = true
  error.value = ''

  try {
    /*
     * For edit pages, wait for Firebase Authentication to finish
     * resolving the current user before checking ownership.
     */
    if (isEdit.value) {
      await waitForAuthenticatedUser()
      await loadErrandForEdit()
    }
  } catch (err) {
    error.value =
        err?.message ||
        'Could not load the page.'
  } finally {
    loading.value = false
  }
}

/**
 * Waits for Firebase Authentication to provide the current user.
 *
 * The auth service exposes the user as a Vue ref. This prevents an
 * ownership check from running before Firebase Authentication finishes
 * restoring the existing session.
 *
 * @returns {Promise<void>} Resolves when a user is available.
 * @throws {Error} When no authenticated user becomes available.
 */
async function waitForAuthenticatedUser() {
  if (user.value?.uid) {
    return
  }

  /*
   * Give the auth service a short period to restore the Firebase session.
   * This avoids incorrectly treating a valid owner as unauthenticated
   * during the initial component mount.
   */
  await new Promise((resolve) => {
    const startedAt = Date.now()

    const check = () => {
      if (user.value?.uid) {
        resolve()
        return
      }

      if (Date.now() - startedAt >= 5000) {
        resolve()
        return
      }

      window.setTimeout(check, 50)
    }

    check()
  })

  if (!user.value?.uid) {
    throw new Error(
        'You must be logged in to edit an errand.'
    )
  }
}

/**
 * Submits the errand form to the backend.
 *
 * In create mode, a new errand is created. In edit mode, only the
 * authenticated requester may update an open errand.
 *
 * @param {Object} formData - Editable errand fields emitted by ErrandForm.
 * @returns {Promise<void>} Resolves after navigation to the saved errand.
 */
async function handleSubmit(formData) {
  if (submitting.value) {
    return
  }

  submitting.value = true

  try {
    if (!user.value?.uid) {
      throw new Error(
          'You must be logged in to perform this action.'
      )
    }

    let response

    if (isEdit.value) {
      if (!errandId.value) {
        throw new Error('Errand ID is missing.')
      }

      if (!isRequester.value) {
        throw new Error(
            'You do not have permission to edit this errand.'
        )
      }

      if (errandData.value?.status !== 'open') {
        throw new Error(
            'This errand can no longer be edited.'
        )
      }

      response = await studentConnect.updateErrand(
          errandId.value,
          {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            deadline: formData.deadline
          }
      )
    } else {
      response = await studentConnect.createErrand({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        deadline: formData.deadline
      })
    }

    if (!response?.success) {
      throw new Error(
          response?.message ||
          (
              isEdit.value
                  ? 'Could not update errand.'
                  : 'Could not create errand.'
          )
      )
    }

    const savedErrand =
        response.data ||
        response.errand ||
        response

    const savedId =
        savedErrand?.id ||
        errandId.value

    ElMessage.success(
        isEdit.value
            ? 'Errand updated successfully.'
            : 'Errand created successfully.'
    )

    if (savedId) {
      await router.push({
        path: '/errands',
        query: {
          id: savedId
        }
      })

      return
    }

    await router.push('/errands')
  } catch (err) {
    ElMessage.error(
        err?.message ||
        (
            isEdit.value
                ? 'Could not update errand.'
                : 'Could not create errand.'
        )
    )
  } finally {
    submitting.value = false
  }
}

/**
 * Navigates back to the errand list.
 *
 * @returns {Promise<void>} Resolves after navigation completes.
 */
async function goBack() {
  await router.push('/errands')
}

onMounted(() => {
  initializePage()
})
</script>
