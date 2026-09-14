<!-- components/errands/ErrandForm.vue -->
<template>
  <form
      id="errand-form"
      class="space-y-4"
      @submit.prevent="handleSubmit"
  >
    <!-- Title -->
    <div>
      <label class="mb-1 block text-xs font-semibold text-slate-700">
        <i class="fi fi-rr-edit mr-1 text-brand-500"></i>
        Errand Title
      </label>

      <el-input
          id="errand-title-input"
          v-model="form.title"
          placeholder="e.g. Pick up parcel"
          clearable
      />

      <p
          v-if="errors.title"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.title }}
      </p>
    </div>

    <!-- Description -->
    <div>
      <label class="mb-1 block text-xs font-semibold text-slate-700">
        <i class="fi fi-rr-document mr-1 text-brand-500"></i>
        Description / Instructions
      </label>

      <el-input
          id="errand-description-input"
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="Pls contact my Whatsapp at 012-3456789 before proceeding."
      />

      <p
          v-if="errors.description"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.description }}
      </p>
    </div>

    <!-- Location -->
    <div>
      <label class="mb-1 block text-xs font-semibold text-slate-700">
        <i class="fi fi-rr-marker mr-1 text-rose-500"></i>
        Location
      </label>

      <el-input
          id="errand-location-input"
          v-model="form.location"
          placeholder="e.g. Pos Mini"
          clearable
      />

      <p
          v-if="errors.location"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.location }}
      </p>
    </div>

    <!-- Deadline -->
    <div class="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      <div class="mb-3">
        <label class="block text-xs font-semibold text-slate-700">
          <i class="fi fi-rr-clock-three mr-1 text-brand-500"></i>
          Needed By
        </label>

        <p class="mt-0.5 text-[11px] text-slate-400">
          Select the latest time the errand should be completed.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <!-- Date -->
        <div>
          <label class="mb-1 block text-[11px] font-medium text-slate-500">
            Date
          </label>

          <el-date-picker
              id="errand-deadline-date-input"
              v-model="form.deadlineDate"
              type="date"
              placeholder="Select date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :teleported="false"
              :clearable="false"
              :disabled-date="disablePastDates"
              class="!w-full"
          />
        </div>

        <!-- Time -->
        <div>
          <label class="mb-1 block text-[11px] font-medium text-slate-500">
            Time
          </label>

          <el-time-picker
              id="errand-deadline-time-input"
              v-model="form.deadlineTime"
              placeholder="Select time"
              format="HH:mm"
              value-format="HH:mm"
              step="00:15:00"
              :teleported="false"
              :clearable="false"
              :arrow-control="true"
              class="!w-full"
          />
        </div>
      </div>

      <p
          v-if="errors.deadline"
          class="mt-2 text-xs text-rose-500"
      >
        {{ errors.deadline }}
      </p>
    </div>

    <!-- Important Information -->
    <div
        v-if="!props.isEdit"
        class="flex gap-2 rounded-xl border border-brand-100 bg-brand-50/50 p-3"
    >
      <i class="fi fi-rr-info text-sm text-brand-600"></i>

      <p class="text-[11px] leading-relaxed text-brand-700">
        Once posted, other students can accept this errand.
        The student who posts the errand cannot accept or complete
        their own request.
      </p>
    </div>

    <!-- Edit Information -->
    <div
        v-if="props.isEdit"
        class="flex gap-2 rounded-xl border border-amber-100 bg-amber-50/50 p-3"
    >
      <i class="fi fi-rr-info text-sm text-amber-600"></i>

      <p class="text-[11px] leading-relaxed text-amber-700">
        Only the requester can edit an open errand.
        Once another student accepts it, the errand becomes locked.
      </p>
    </div>

    <!-- Actions -->
    <div
        class="flex items-center justify-end gap-3 border-t border-slate-100 pt-3"
    >
      <el-button
          id="errand-cancel-btn"
          type="button"
          :disabled="props.submitting"
          @click="handleCancel"
      >
        Cancel
      </el-button>

      <el-button
          id="errand-submit-btn"
          type="primary"
          native-type="submit"
          :loading="props.submitting"
          class="!rounded-xl !px-5"
      >
        <i
            :class="
            props.isEdit
              ? 'fi fi-rr-check'
              : 'fi fi-rr-plus'
          "
            class="mr-1.5"
        ></i>

        {{ props.isEdit ? 'Save Changes' : 'Post Errand' }}
      </el-button>
    </div>
  </form>
</template>

<script setup>
import {
  reactive,
  watch
} from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },

  isEdit: {
    type: Boolean,
    default: false
  },

  submitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'submit',
  'cancel'
])

/**
 * Returns today's date using the local timezone.
 *
 * @returns {string} Date in YYYY-MM-DD format.
 */
function getTodayDate() {
  const now = new Date()

  const year = now.getFullYear()

  const month = String(
      now.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
      now.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const DEFAULT_FORM = {
  title: '',
  description: '',
  location: '',
  deadlineDate: getTodayDate(),
  deadlineTime: '18:00'
}

const form = reactive({
  title: DEFAULT_FORM.title,
  description: DEFAULT_FORM.description,
  location: DEFAULT_FORM.location,
  deadlineDate: DEFAULT_FORM.deadlineDate,
  deadlineTime: DEFAULT_FORM.deadlineTime
})

const errors = reactive({
  title: '',
  description: '',
  location: '',
  deadline: ''
})

/**
 * Clears all validation errors.
 *
 * @returns {void}
 */
function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

/**
 * Resets the form to its default values.
 *
 * @returns {void}
 */
function resetForm() {
  form.title = DEFAULT_FORM.title
  form.description = DEFAULT_FORM.description
  form.location = DEFAULT_FORM.location
  form.deadlineDate = getTodayDate()
  form.deadlineTime = DEFAULT_FORM.deadlineTime
}

/**
 * Disables calendar dates before today.
 *
 * @param {Date} date Calendar date being evaluated.
 * @returns {boolean} True when the date cannot be selected.
 */
function disablePastDates(date) {
  const today = new Date()

  today.setHours(
      0,
      0,
      0,
      0
  )

  return date < today
}

/**
 * Converts a Unix timestamp into separate local date
 * and time values.
 *
 * The timestamp is stored in seconds.
 *
 * @param {number} unixTimestamp Unix timestamp in seconds.
 * @returns {{date: string, time: string}|null} Local date/time values.
 */
function unixToDateTime(unixTimestamp) {
  const timestamp = Number(unixTimestamp)

  if (
      !timestamp ||
      Number.isNaN(timestamp)
  ) {
    return null
  }

  const date = new Date(
      timestamp * 1000
  )

  if (Number.isNaN(date.getTime())) {
    return null
  }

  const year = date.getFullYear()

  const month = String(
      date.getMonth() + 1
  ).padStart(2, '0')

  const day = String(
      date.getDate()
  ).padStart(2, '0')

  const hour = String(
      date.getHours()
  ).padStart(2, '0')

  const minute = String(
      date.getMinutes()
  ).padStart(2, '0')

  return {
    date: `${year}-${month}-${day}`,
    time: `${hour}:${minute}`
  }
}

/**
 * Converts separate local date and time values
 * into a Unix timestamp.
 *
 * The resulting timestamp represents the selected
 * local date/time and is stored in seconds.
 *
 * @param {string} dateString Date in YYYY-MM-DD format.
 * @param {string} timeString Time in HH:mm format.
 * @returns {number} Unix timestamp in seconds.
 */
function dateTimeToUnix(
    dateString,
    timeString
) {
  if (
      !dateString ||
      !timeString
  ) {
    return Number.NaN
  }

  const [
    year,
    month,
    day
  ] = dateString
      .split('-')
      .map(Number)

  const [
    hour,
    minute
  ] = timeString
      .split(':')
      .map(Number)

  const date = new Date(
      year,
      month - 1,
      day,
      hour,
      minute,
      0,
      0
  )

  if (Number.isNaN(date.getTime())) {
    return Number.NaN
  }

  return Math.floor(
      date.getTime() / 1000
  )
}

/**
 * Populates the form using existing errand data.
 *
 * Backend-managed lifecycle fields are intentionally ignored:
 *
 * - id
 * - requester
 * - helper
 * - status
 * - timeline
 * - createdAt
 * - updatedAt
 *
 * @param {Object|null} data Existing errand data.
 * @returns {void}
 */
function populateForm(data) {
  clearErrors()

  if (!data) {
    resetForm()
    return
  }

  form.title =
      data.title || ''

  form.description =
      data.description || ''

  form.location =
      data.location || ''

  const deadline =
      unixToDateTime(data.deadline)

  form.deadlineDate =
      deadline?.date ||
      getTodayDate()

  form.deadlineTime =
      deadline?.time ||
      DEFAULT_FORM.deadlineTime
}

/**
 * Validates the errand form.
 *
 * The deadline must represent a valid future time.
 *
 * @returns {boolean} True when all fields are valid.
 */
function validateForm() {
  clearErrors()

  if (!form.title.trim()) {
    errors.title =
        'Please enter an errand title'
  }

  if (!form.description.trim()) {
    errors.description =
        'Please provide instructions'
  }

  if (!form.location.trim()) {
    errors.location =
        'Please specify the location'
  }

  if (!form.deadlineDate) {
    errors.deadline =
        'Please select a deadline date'
  }

  if (!form.deadlineTime) {
    errors.deadline =
        'Please select a deadline time'
  }

  if (
      form.deadlineDate &&
      form.deadlineTime
  ) {
    const deadline =
        dateTimeToUnix(
            form.deadlineDate,
            form.deadlineTime
        )

    if (Number.isNaN(deadline)) {
      errors.deadline =
          'Please select a valid deadline'
    } else if (
        deadline <=
        Math.floor(Date.now() / 1000)
    ) {
      errors.deadline =
          'The deadline must be in the future'
    }
  }

  return !Object.values(errors)
      .some(Boolean)
}

/**
 * Validates the form and emits only the fields
 * that the backend allows the requester to edit.
 *
 * Backend-managed fields are never submitted:
 *
 * - id
 * - requester
 * - helper
 * - status
 * - timeline
 * - createdAt
 * - updatedAt
 *
 * @returns {void}
 */
function handleSubmit() {
  if (props.submitting) {
    return
  }

  if (!validateForm()) {
    return
  }

  const deadline =
      dateTimeToUnix(
          form.deadlineDate,
          form.deadlineTime
      )

  emit('submit', {
    title: form.title.trim(),

    description:
        form.description.trim(),

    location:
        form.location.trim(),

    deadline
  })
}

/**
 * Emits the cancel event when the form is not submitting.
 *
 * @returns {void}
 */
function handleCancel() {
  if (props.submitting) {
    return
  }

  emit('cancel')
}

/**
 * Updates the form whenever the parent provides
 * new initial errand data.
 *
 * @param {Object|null} newData New initial form data.
 * @returns {void}
 */
function handleInitialDataChange(newData) {
  populateForm(newData)
}

watch(
    () => props.initialData,
    handleInitialDataChange,
    {
      immediate: true
    }
)
</script>
