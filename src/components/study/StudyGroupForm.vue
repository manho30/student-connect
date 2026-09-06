<template>
  <form
      id="study-group-form"
      class="space-y-5"
      @submit.prevent="handleSubmit"
  >
    <!-- Title -->
    <div>
      <label
          class="mb-1.5 block text-xs font-semibold text-slate-700"
      >
        <i class="fi fi-rr-heading mr-1 text-indigo-500"></i>
        Study Title
      </label>

      <el-input
          id="study-title-input"
          v-model="form.title"
          placeholder="e.g. Biology Revision"
          clearable
      />

      <p
          v-if="errors.title"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.title }}
      </p>
    </div>

    <!-- Subject -->
    <div>
      <label
          class="mb-1.5 block text-xs font-semibold text-slate-700"
      >
        <i class="fi fi-rr-book-alt mr-1 text-indigo-500"></i>
        Subject
      </label>

      <el-input
          id="study-subject-input"
          v-model="form.subject"
          placeholder="e.g. Biology"
          clearable
      />

      <p
          v-if="errors.subject"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.subject }}
      </p>
    </div>

    <!-- Description -->
    <div>
      <label
          class="mb-1.5 block text-xs font-semibold text-slate-700"
      >
        <i class="fi fi-rr-info mr-1 text-indigo-500"></i>
        Description
      </label>

      <el-input
          id="study-description-input"
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="What will you study or revise?"
      />

      <p
          v-if="errors.description"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.description }}
      </p>
    </div>

    <!-- Schedule -->
    <div>
      <div class="mb-2 flex items-center justify-between">
    <span class="text-xs font-semibold text-slate-700">
      <i class="fi fi-rr-calendar mr-1 text-indigo-500"></i>
      Session Schedule
    </span>

        <span class="text-[10px] text-slate-400">
      Start and end time
    </span>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <!-- Start -->
        <div class="min-w-0">
          <label
              class="mb-1.5 block text-[11px] font-medium text-slate-500"
          >
            Starts
          </label>

          <el-date-picker
              id="study-start-time-input"
              v-model="form.schedule.startTime"
              type="datetime"
              placeholder="Select start date and time"
              format="YYYY-MM-DD hh:mm A"
              value-format="YYYY-MM-DDTHH:mm:ss"
              :teleported="false"
              :clearable="false"
              :disabled-date="disablePastDates"
              class="!w-full"
          />

          <p
              v-if="errors.startTime"
              class="mt-1 text-xs text-rose-500"
          >
            {{ errors.startTime }}
          </p>
        </div>

        <!-- End -->
        <div class="min-w-0">
          <label
              class="mb-1.5 block text-[11px] font-medium text-slate-500"
          >
            Ends
          </label>

          <el-date-picker
              id="study-end-time-input"
              v-model="form.schedule.endTime"
              type="datetime"
              placeholder="Select end date and time"
              format="YYYY-MM-DD hh:mm A"
              value-format="YYYY-MM-DDTHH:mm:ss"
              :teleported="false"
              :clearable="false"
              :disabled-date="disablePastDates"
              class="!w-full"
          />

          <p
              v-if="errors.endTime"
              class="mt-1 text-xs text-rose-500"
          >
            {{ errors.endTime }}
          </p>
        </div>
      </div>
    </div>

    <!-- Location -->
    <div>
      <label
          class="mb-1.5 block text-xs font-semibold text-slate-700"
      >
        <i class="fi fi-rr-marker mr-1 text-indigo-500"></i>
        Location
      </label>

      <el-input
          id="study-location-input"
          v-model="form.location"
          placeholder="e.g. Campus Library"
          clearable
      />

      <p
          v-if="errors.location"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.location }}
      </p>
    </div>

    <!-- Capacity -->
    <div>
      <label
          class="mb-1.5 block text-xs font-semibold text-slate-700"
      >
        <i class="fi fi-rr-users mr-1 text-indigo-500"></i>
        Study Capacity
      </label>

      <el-input
          id="study-capacity-input"
          v-model.number="form.capacity"
          type="number"
          min="1"
          step="1"
          placeholder="e.g. 6"
      />

      <p
          v-if="errors.capacity"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.capacity }}
      </p>
    </div>

    <!-- Actions -->
    <div
        class="flex items-center justify-end gap-3 border-t border-slate-100 pt-4"
    >
      <el-button
          id="study-cancel-btn"
          type="button"
          :disabled="submitting"
          @click="handleCancel"
      >
        Cancel
      </el-button>

      <el-button
          id="study-submit-btn"
          type="primary"
          native-type="submit"
          :loading="submitting"
          class="!rounded-xl !px-5"
      >
        <i
            :class="
        isEdit
          ? 'fi fi-rr-check'
          : 'fi fi-rr-plus'
      "
            class="mr-1.5"
        ></i>

        {{ isEdit ? 'Save Changes' : 'Create Study' }}
      </el-button>
    </div>

  </form>
</template>

<script setup>
import {
  reactive,
  ref,
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
  }
})

const emit = defineEmits([
  'submit',
  'cancel'
])

const submitting = ref(false)

/**
 * Returns the current local date and time as a form-compatible value.
 *
 * @returns {string} Local date-time in YYYY-MM-DDTHH:mm:ss format.
 */
function getCurrentDateTime() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

/**
 * Adds a duration to a form-compatible local date-time.
 *
 * @param {string} value - Local date-time value.
 * @param {number} minutes - Number of minutes to add.
 * @returns {string} Updated local date-time.
 */
function addMinutes(value, minutes) {
  const date = new Date(value)

  date.setMinutes(
      date.getMinutes() + minutes
  )

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const mins = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${mins}:${seconds}`
}

const DEFAULT_FORM = {
  title: '',
  subject: '',
  description: '',
  schedule: {
    startTime: getCurrentDateTime(),
    endTime: addMinutes(
        getCurrentDateTime(),
        60
    )
  },
  location: 'Campus Library',
  capacity: 8
}

const form = reactive({
  title: DEFAULT_FORM.title,
  subject: DEFAULT_FORM.subject,
  description: DEFAULT_FORM.description,

  schedule: {
    startTime: DEFAULT_FORM.schedule.startTime,
    endTime: DEFAULT_FORM.schedule.endTime
  },

  location: DEFAULT_FORM.location,
  capacity: DEFAULT_FORM.capacity
})

const errors = reactive({
  title: '',
  subject: '',
  description: '',
  startTime: '',
  endTime: '',
  location: '',
  capacity: ''
})

/**
 * Converts a local date-time form value into Unix seconds.
 *
 * @param {string|Date|number} value - Local date-time value.
 * @returns {number} Unix timestamp in seconds.
 */
function toUnixSeconds(value) {
  const date = value instanceof Date
      ? value
      : new Date(value)

  const timestamp = date.getTime()

  if (Number.isNaN(timestamp)) {
    return NaN
  }

  return Math.floor(
      timestamp / 1000
  )
}

/**
 * Converts a Unix timestamp in seconds into a local form value.
 *
 * @param {number|string} timestamp - Unix timestamp in seconds.
 * @returns {string} Local date-time in YYYY-MM-DDTHH:mm:ss format.
 */
function fromUnixSeconds(timestamp) {
  const numericTimestamp =
      Number(timestamp)

  if (
      !Number.isFinite(numericTimestamp) ||
      numericTimestamp <= 0
  ) {
    return ''
  }

  const date = new Date(
      numericTimestamp * 1000
  )

  const year = date.getFullYear()
  const month = String(
      date.getMonth() + 1
  ).padStart(2, '0')
  const day = String(
      date.getDate()
  ).padStart(2, '0')
  const hours = String(
      date.getHours()
  ).padStart(2, '0')
  const minutes = String(
      date.getMinutes()
  ).padStart(2, '0')
  const seconds = String(
      date.getSeconds()
  ).padStart(2, '0')

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

/**
 * Clears all current validation errors.
 *
 * @returns {void} Removes all validation messages.
 */
function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

/**
 * Resets the form to its default values.
 *
 * @returns {void} Restores the default form values.
 */
function resetForm() {
  const now = getCurrentDateTime()

  form.title = DEFAULT_FORM.title
  form.subject = DEFAULT_FORM.subject
  form.description = DEFAULT_FORM.description

  form.schedule.startTime = now
  form.schedule.endTime = addMinutes(
      now,
      60
  )

  form.location = DEFAULT_FORM.location
  form.capacity = DEFAULT_FORM.capacity

  clearErrors()
}

/**
 * Disables calendar dates before today.
 *
 * Today's date remains selectable so a future time later
 * today can still be selected.
 *
 * @param {Date} date - Calendar date being evaluated.
 * @returns {boolean} True when the date should be disabled.
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
 * Populates the form with an existing study resource.
 *
 * Backend schedule timestamps are Unix seconds and are
 * converted into local date-time values for the controls.
 *
 * @param {Object|null} data - Existing study resource.
 * @returns {void} Updates the reactive form.
 */
function populateForm(data) {
  clearErrors()

  if (!data) {
    resetForm()
    return
  }

  form.title =
      data.title || ''

  form.subject =
      data.subject || ''

  form.description =
      data.description || ''

  form.location =
      data.location || ''

  form.capacity =
      Number(data.capacity) || 1

  form.schedule.startTime =
      fromUnixSeconds(
          data.schedule?.startTime
      )

  form.schedule.endTime =
      fromUnixSeconds(
          data.schedule?.endTime
      )
}

/**
 * Validates the study form fields.
 *
 * Start time must be in the future and end time must be
 * later than start time. All validation errors are displayed
 * inline beside their respective fields.
 *
 * @returns {boolean} True when all form values are valid.
 */
function validateForm() {
  clearErrors()

  if (
      !form.title ||
      form.title.trim().length < 2
  ) {
    errors.title =
        'Title must be at least 2 characters'
  }

  if (
      !form.subject ||
      form.subject.trim().length < 2
  ) {
    errors.subject =
        'Subject must be at least 2 characters'
  }

  if (
      !form.description ||
      form.description.trim().length < 2
  ) {
    errors.description =
        'Description must be at least 2 characters'
  }

  if (!form.schedule.startTime) {
    errors.startTime =
        'Please select a start date and time'
  }

  if (!form.schedule.endTime) {
    errors.endTime =
        'Please select an end date and time'
  }

  let startTime = NaN
  let endTime = NaN

  if (
      form.schedule.startTime &&
      form.schedule.endTime
  ) {
    startTime =
        toUnixSeconds(
            form.schedule.startTime
        )

    endTime =
        toUnixSeconds(
            form.schedule.endTime
        )

    if (Number.isNaN(startTime)) {
      errors.startTime =
          'Please select a valid start time'
    }

    if (Number.isNaN(endTime)) {
      errors.endTime =
          'Please select a valid end time'
    }

    if (
        !Number.isNaN(startTime) &&
        startTime <=
        Math.floor(Date.now() / 1000)
    ) {
      errors.startTime =
          'Start time must be in the future'
    }

    if (
        !Number.isNaN(startTime) &&
        !Number.isNaN(endTime) &&
        endTime <= startTime
    ) {
      errors.endTime =
          'End time must be later than start time'
    }
  }

  if (
      !form.location ||
      form.location.trim().length < 2
  ) {
    errors.location =
        'Location must be at least 2 characters'
  }

  const capacity =
      Number(form.capacity)

  if (
      !Number.isInteger(capacity) ||
      capacity <= 0
  ) {
    errors.capacity =
        'Capacity must be a positive whole number'
  }

  return !Object.values(errors)
      .some(Boolean)
}

/**
 * Builds the backend-compatible study payload.
 *
 * Schedule values are converted from local form values
 * into Unix timestamps in seconds.
 *
 * @returns {Object} Normalized study payload.
 */
function buildPayload() {
  return {
    title:
        form.title.trim(),

    subject:
        form.subject.trim(),

    description:
        form.description.trim(),

    schedule: {
      startTime:
          toUnixSeconds(
              form.schedule.startTime
          ),

      endTime:
          toUnixSeconds(
              form.schedule.endTime
          )
    },

    location:
        form.location.trim(),

    capacity:
        Number(form.capacity)
  }
}

/**
 * Validates the form and emits the normalized study payload.
 *
 * @returns {void} Emits the submit event when validation succeeds.
 */
function handleSubmit() {
  if (submitting.value) {
    return
  }

  if (!validateForm()) {
    return
  }

  emit(
      'submit',
      buildPayload()
  )
}

/**
 * Emits the cancel event when submission is not in progress.
 *
 * @returns {void} Emits the cancel event.
 */
function handleCancel() {
  if (submitting.value) {
    return
  }

  emit('cancel')
}

/**
 * Updates the form whenever initial study data changes.
 *
 * @param {Object|null} newData - New study data.
 * @returns {void} Populates the form with the supplied data.
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
