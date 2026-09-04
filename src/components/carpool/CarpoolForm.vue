<!-- components/carpool/CarpoolForm.vue -->

<template>
  <form
      id="carpool-form"
      class="space-y-4"
      @submit.prevent="handleSubmit"
  >
    <!-- Origin & Destination -->
    <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
      <!-- Origin -->
      <div>
        <label class="mb-1 block text-xs font-semibold text-slate-700">
          <i class="fi fi-rr-marker mr-1 text-indigo-500"></i>
          From (Origin)
        </label>

        <el-input
            id="carpool-from-input"
            v-model="form.origin"
            placeholder="e.g. Butterworth KTM"
            clearable
        />

        <p
            v-if="errors.origin"
            class="mt-1 text-xs text-rose-500"
        >
          {{ errors.origin }}
        </p>
      </div>

      <!-- Destination -->
      <div>
        <label class="mb-1 block text-xs font-semibold text-slate-700">
          <i class="fi fi-rr-marker mr-1 text-indigo-500"></i>
          To (Destination)
        </label>

        <el-input
            id="carpool-to-input"
            v-model="form.destination"
            placeholder="e.g. Matriculation College"
            clearable
        />

        <p
            v-if="errors.destination"
            class="mt-1 text-xs text-rose-500"
        >
          {{ errors.destination }}
        </p>
      </div>
    </div>

    <!-- Date & Time -->
    <div>
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <!-- Date -->
        <div class="min-w-0">
          <label class="mb-1 block text-xs font-semibold text-slate-700">
            <i class="fi fi-rr-calendar mr-1 text-indigo-500"></i>
            Date
          </label>

          <el-date-picker
              id="carpool-date-input"
              v-model="form.departureDate"
              type="date"
              placeholder="Select ride date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :teleported="false"
              :clearable="false"
              :disabled-date="disablePastDates"
              class="!w-full"
          />
        </div>

        <!-- Time -->
        <div class="min-w-0">
          <label class="mb-1 block text-xs font-semibold text-slate-700">
            <i class="fi fi-rr-clock-three mr-1 text-indigo-500"></i>
            Time
          </label>

          <el-time-picker
              id="carpool-time-input"
              v-model="form.departureTime"
              placeholder="Select departure time"
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

      <!-- Departure Validation -->
      <p
          v-if="errors.departure"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.departure }}
      </p>
    </div>

    <!-- Capacity -->
    <div>
      <label class="mb-1.5 block text-xs font-semibold text-slate-700">
        <i class="fi fi-rr-users mr-1 text-indigo-500"></i>
        Vehicle Capacity
      </label>

      <div class="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <!-- 4 Pax -->
        <label
            :class="[
        'flex flex-1 cursor-pointer items-center gap-2 rounded-xl border p-3 transition-all',
        form.capacity === 4
          ? 'border-indigo-600 bg-indigo-50/50 font-semibold text-indigo-900'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      ]"
        >
          <input
              v-model="form.capacity"
              type="radio"
              name="capacity"
              :value="4"
              class="text-indigo-600 focus:ring-indigo-500"
          />

          <i class="fi fi-rr-car-alt text-lg text-indigo-600"></i>

          <div class="ml-2 flex flex-col">
            <span>4 Pax</span>

            <span class="text-[11px] text-slate-400">
          Sedan / SUV car
        </span>
          </div>
        </label>

        <!-- 6 Pax -->
        <label
            :class="[
        'flex flex-1 cursor-pointer items-center gap-2 rounded-xl border p-3 transition-all',
        form.capacity === 6
          ? 'border-indigo-600 bg-indigo-50/50 font-semibold text-indigo-900'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      ]"
        >
          <input
              v-model="form.capacity"
              type="radio"
              name="capacity"
              :value="6"
              class="text-indigo-600 focus:ring-indigo-500"
          />

          <i class="fi fi-rr-car-alt text-lg text-indigo-600"></i>

          <div class="ml-2 flex flex-col">
            <span>6 Pax</span>

            <span class="text-[11px] text-slate-400">
          MPV car
        </span>
          </div>
        </label>
      </div>

      <p
          v-if="errors.capacity"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.capacity }}
      </p>
    </div>


    <!-- Cost -->
    <div>
      <label class="mb-1 block text-xs font-semibold text-slate-700">
        <i class="fi fi-rr-dollar mr-1 text-emerald-600"></i>
        Cost Per Passenger (RM)
        <span class="text-rose-500">*</span>
      </label>

      <el-input
          id="carpool-cost-input"
          v-model="form.cost"
          type="number"
          min="0"
          step="0.01"
          placeholder="Enter amount in RM (e.g. 5, or 0 if free)"
      >
        <template #prefix>
          RM
        </template>
      </el-input>

      <div class="mt-1 flex items-center justify-between">
        <p
            v-if="errors.cost"
            class="text-xs text-rose-500"
        >
          {{ errors.cost }}
        </p>

        <p
            v-else
            class="text-[11px] text-slate-400"
        >
          Specify cost per student. Enter 0 for a free ride.
        </p>
      </div>
    </div>

    <!-- Notes -->
    <div>
      <label class="mb-1 block text-xs font-semibold text-slate-700">
        <i class="fi fi-rr-edit mr-1 text-indigo-500"></i>
        Notes / Meeting Point (Optional)
      </label>

      <el-input
          id="carpool-notes-input"
          v-model="form.notes"
          type="textarea"
          :rows="2"
          placeholder="e.g. Meeting at main entrance near student convenience store"
      />
    </div>

    <!-- Actions -->
    <div
        class="flex items-center justify-end gap-3 border-t border-slate-100 pt-3"
    >
      <el-button
          id="carpool-cancel-btn"
          type="button"
          :disabled="props.submitting"
          @click="handleCancel"
      >
        Cancel
      </el-button>

      <el-button
          id="carpool-submit-btn"
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

        {{ props.isEdit ? 'Save Changes' : 'Create Carpool' }}
      </el-button>
    </div>
  </form>
</template>

<script setup>
import {
  reactive,
  watch
} from 'vue'

import {
  formatDateTime,
  inverseFormatDateTime
} from '@/helper/dateTimeConvert'

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
 * @returns {string} Today's date in YYYY-MM-DD format.
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

const today = getTodayDate()

const timeNow = new Date()
    .toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    .slice(0, 5)

const DEFAULT_FORM = {
  origin: '',
  destination: '',
  departureDate: today,
  departureTime: timeNow,
  capacity: 4,
  cost: '',
  notes: ''
}

const form = reactive({
  origin: DEFAULT_FORM.origin,
  destination: DEFAULT_FORM.destination,
  departureDate: DEFAULT_FORM.departureDate,
  departureTime: DEFAULT_FORM.departureTime,
  capacity: DEFAULT_FORM.capacity,
  cost: DEFAULT_FORM.cost,
  notes: DEFAULT_FORM.notes
})

const errors = reactive({
  origin: '',
  destination: '',
  departure: '',
  capacity: '',
  cost: ''
})

/**
 * Clears all current validation errors.
 *
 * @returns {void} Removes all validation error messages.
 */
function clearErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

/**
 * Resets the form to its default values.
 *
 * @returns {void} Restores all form fields to their defaults.
 */
function resetForm() {
  form.origin =
      DEFAULT_FORM.origin

  form.destination =
      DEFAULT_FORM.destination

  form.departureDate =
      getTodayDate()

  form.departureTime =
      DEFAULT_FORM.departureTime

  form.capacity =
      DEFAULT_FORM.capacity

  form.cost =
      DEFAULT_FORM.cost

  form.notes =
      DEFAULT_FORM.notes
}

/**
 * Disables calendar dates before today.
 *
 * Today's date remains selectable because a future time
 * later today is a valid departure.
 *
 * @param {Date} date - Calendar date being evaluated.
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
 * Populates the form using the existing carpool resource.
 *
 * The backend stores departure as a Unix timestamp in seconds.
 * The shared date helper converts it into separate local date
 * and time values for the form controls.
 *
 * @param {Object|null} data - Existing carpool resource.
 * @returns {void} Updates the reactive form.
 */
function populateForm(data) {
  clearErrors()

  if (!data) {
    resetForm()
    return
  }

  form.origin =
      data.origin || ''

  form.destination =
      data.destination || ''

  const departure =
      formatDateTime(data.departure)

  form.departureDate =
      departure?.date ||
      today

  form.departureTime =
      departure?.time ||
      '20:00'

  form.capacity =
      [4, 6].includes(
          Number(data.capacity)
      )
          ? Number(data.capacity)
          : 4

  form.cost =
      data.cost !== undefined &&
      data.cost !== null
          ? data.cost
          : ''

  form.notes =
      data.notes || ''
}

/**
 * Validates all user-editable carpool fields.
 *
 * The departure date and time must represent a valid
 * future point in time.
 *
 * @returns {boolean} True when all values are valid.
 */
function validateForm() {
  clearErrors()

  if (!form.origin.trim()) {
    errors.origin =
        'Please enter origin location'
  }

  if (!form.destination.trim()) {
    errors.destination =
        'Please enter destination'
  }

  if (!form.departureDate) {
    errors.departure =
        'Please select a departure date'
  }

  if (!form.departureTime) {
    errors.departure =
        'Please select a departure time'
  }

  if (
      form.departureDate &&
      form.departureTime
  ) {
    const departure =
        inverseFormatDateTime(
            form.departureDate,
            form.departureTime
        )

    if (Number.isNaN(departure)) {
      errors.departure =
          'Please select a valid departure time'
    } else if (
        departure <=
        Math.floor(Date.now() / 1000)
    ) {
      errors.departure =
          'The departure must be in the future'
    }
  }

  if (![4, 6].includes(
      Number(form.capacity)
  )) {
    errors.capacity =
        'Capacity must be 4 or 6 passengers'
  }

  if (
      form.cost === '' ||
      form.cost === null ||
      form.cost === undefined
  ) {
    errors.cost =
        'Please enter price per person (enter 0 if free)'
  } else {
    const numericCost =
        Number(form.cost)

    if (
        Number.isNaN(numericCost) ||
        numericCost < 0
    ) {
      errors.cost =
          'The cost must be a non-negative number'
    }
  }

  return !Object.values(errors)
      .some(Boolean)
}

/**
 * Validates the form and emits the latest carpool payload.
 *
 * The departure date and time are converted into a single
 * Unix timestamp in seconds.
 *
 * Backend-managed fields such as id, owner, participants,
 * status, createdAt and updatedAt are never submitted.
 *
 * @returns {void} Emits the normalized carpool payload.
 */
function handleSubmit() {
  if (props.submitting) {
    return
  }

  if (!validateForm()) {
    return
  }

  const departure =
      inverseFormatDateTime(
          form.departureDate,
          form.departureTime
      )

  emit('submit', {
    origin:
        form.origin.trim(),

    destination:
        form.destination.trim(),

    departure,

    capacity:
        Number(form.capacity),

    cost:
        Number(form.cost),

    notes:
        form.notes.trim()
  })
}

/**
 * Emits the cancel event unless submission is in progress.
 *
 * @returns {void} Emits the cancel event.
 */
function handleCancel() {
  if (props.submitting) {
    return
  }

  emit('cancel')
}

/**
 * Updates the form whenever the parent provides
 * new initial carpool data.
 *
 * @param {Object|null} newData - New initial form data.
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
