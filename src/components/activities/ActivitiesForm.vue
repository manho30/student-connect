<template>
  <form
      id="activities-form"
      class="space-y-4"
      @submit.prevent="handleSubmit"
  >
    <!-- General Error -->
    <div
        v-if="generalError"
        id="activity-form-error"
        class="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-600"
    >
      <div class="flex items-start gap-2">
        <i class="fi fi-rr-exclamation mt-0.5"></i>
        <span>{{ generalError }}</span>
      </div>
    </div>

    <!-- Title -->
    <div>
      <label
          for="activity-title"
          class="mb-1 block text-xs font-semibold text-slate-700"
      >
        Activity Title
      </label>

      <el-input
          id="activity-title"
          v-model="form.title"
          maxlength="150"
          show-word-limit
          clearable
          placeholder="e.g. Intercollege Innovation Competition 2026"
          :class="{ 'is-invalid': errors.title }"
      />

      <p
          v-if="errors.title"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.title }}
      </p>
    </div>

    <!-- Category -->
    <div>
      <label
          for="activity-category"
          class="mb-1 block text-xs font-semibold text-slate-700"
      >
        Category
      </label>

      <el-select
          id="activity-category"
          v-model="form.category"
          placeholder="Select a category"
          clearable
          class="!w-full"
      >
        <el-option
            v-for="category in categories"
            :key="category"
            :label="category"
            :value="category"
        />
      </el-select>

      <p
          v-if="errors.category"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.category }}
      </p>
    </div>

    <!-- Date / Time -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <!-- Event Date -->
      <div>
        <label
            for="activity-event-date"
            class="mb-1 block text-xs font-semibold text-slate-700"
        >
          Event Date
        </label>

        <el-date-picker
            id="activity-event-date"
            v-model="form.eventDate"
            type="date"
            placeholder="Select date"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            :clearable="true"
            :teleported="false"
            class="!w-full"
        />

        <p
            v-if="errors.eventDate"
            class="mt-1 text-xs text-rose-500"
        >
          {{ errors.eventDate }}
        </p>
      </div>

      <!-- Event Time -->
      <div>
        <label
            for="activity-event-time"
            class="mb-1 block text-xs font-semibold text-slate-700"
        >
          Event Time
        </label>

        <el-time-picker
            id="activity-event-time"
            v-model="form.eventTime"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="Select time"
            :clearable="true"
            :arrow-control="true"
            :teleported="false"
            class="!w-full"
        />
      </div>
    </div>

    <!-- Registration Deadline -->
    <div>
      <div class="mb-1 flex items-center justify-between">
        <label
            class="block text-xs font-semibold text-slate-700"
        >
          Registration Deadline
        </label>

        <span class="text-[11px] font-medium text-slate-400">
          Optional
        </span>
      </div>

      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <el-date-picker
            v-model="form.registrationDeadlineDate"
            type="date"
            placeholder="Deadline date"
            format="DD/MM/YYYY"
            value-format="YYYY-MM-DD"
            :clearable="true"
            :teleported="false"
            class="!w-full"
        />

        <el-time-picker
            v-model="form.registrationDeadlineTime"
            format="HH:mm"
            value-format="HH:mm"
            placeholder="Deadline time"
            :clearable="true"
            :arrow-control="true"
            :teleported="false"
            class="!w-full"
        />
      </div>

      <p
          v-if="errors.registrationDeadline"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.registrationDeadline }}
      </p>
    </div>

    <!-- Participant Limit -->
    <div>
      <div class="mb-1 flex items-center justify-between">
        <label
            for="activity-participants-limit"
            class="block text-xs font-semibold text-slate-700"
        >
          Participant Limit
        </label>

        <span class="text-[11px] font-medium text-slate-400">
          Optional
        </span>
      </div>

      <el-input
          id="activity-participants-limit"
          v-model="form.participantsLimit"
          type="number"
          min="1"
          step="1"
          clearable
          placeholder="e.g. 50"
      >
        <template #prefix>
          <i class="fi fi-rr-users text-slate-400"></i>
        </template>

        <template #suffix>
          <span class="text-[11px] text-slate-400">
            students
          </span>
        </template>
      </el-input>

      <p
          v-if="errors.participantsLimit"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.participantsLimit }}
      </p>

      <p
          v-else
          class="mt-1 text-[11px] leading-relaxed text-slate-400"
      >
        Maximum number of students who can join, excluding the organiser.
      </p>

      <!-- Current Participants in Edit Mode -->
      <div
          v-if="editing && currentParticipantCount !== null"
          class="mt-2 flex items-center gap-2 text-[11px] text-slate-500"
      >
        <i class="fi fi-rr-users"></i>

        <span>
          {{ currentParticipantCount }}
          {{ currentParticipantCount === 1 ? 'student' : 'students' }}
          currently joined
        </span>
      </div>
    </div>

    <!-- Location -->
    <div>
      <label
          for="activity-location"
          class="mb-1 block text-xs font-semibold text-slate-700"
      >
        Location
      </label>

      <el-input
          id="activity-location"
          v-model="form.location"
          maxlength="300"
          show-word-limit
          clearable
          placeholder="e.g. Kedah Matriculation College"
      />

      <p
          v-if="errors.location"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.location }}
      </p>
    </div>

    <!-- Contact -->
    <div>
      <label
          for="activity-contact"
          class="mb-1 block text-xs font-semibold text-slate-700"
      >
        Contact
      </label>

      <el-input
          id="activity-contact"
          v-model="form.contact"
          maxlength="300"
          show-word-limit
          clearable
          placeholder="Phone number, email, or contact person"
      />

      <p
          v-if="errors.contact"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.contact }}
      </p>
    </div>

    <!-- Description -->
    <div>
      <label
          for="activity-description"
          class="mb-1 block text-xs font-semibold text-slate-700"
      >
        Description
      </label>

      <el-input
          id="activity-description"
          v-model="form.description"
          type="textarea"
          :rows="6"
          maxlength="5000"
          show-word-limit
          resize="vertical"
          placeholder="Describe the activity, programme, competition, workshop, or event..."
      />

      <p
          v-if="errors.description"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.description }}
      </p>
    </div>

    <!-- Poster -->
    <div>
      <div class="mb-1 flex items-center justify-between">
        <label
            class="block text-xs font-semibold text-slate-700"
        >
          Activity Poster
        </label>

        <span class="text-[11px] font-medium text-slate-400">
          Optional
        </span>
      </div>

      <!-- Preview -->
      <div
          v-if="previewUrl"
          class="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
      >
        <div class="relative aspect-video">
          <img
              :src="previewUrl"
              alt="Activity poster preview"
              class="h-full w-full object-cover"
          />

          <button
              id="remove-activity-poster-btn"
              type="button"
              class="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-rose-600"
              title="Remove poster"
              @click="removePoster"
          >
            <i class="fi fi-rr-trash text-xs"></i>
          </button>
        </div>
      </div>

      <!-- Upload Area -->
      <label
          for="activity-poster"
          class="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center transition hover:border-brand-400 hover:bg-brand-50/40"
      >
        <div
            class="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand-50 text-brand-600"
        >
          <i class="fi fi-rr-picture text-lg"></i>
        </div>

        <p class="text-xs font-bold text-slate-700">
          {{
            previewUrl
                ? 'Choose another poster'
                : 'Choose an activity poster'
          }}
        </p>

        <p class="mt-1 text-[11px] text-slate-400">
          You will crop the image to 16:9 before uploading.
        </p>

        <input
            id="activity-poster"
            ref="posterInput"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            class="hidden"
            @change="selectPoster"
        />
      </label>

      <p
          v-if="errors.poster"
          class="mt-1 text-xs text-rose-500"
      >
        {{ errors.poster }}
      </p>
    </div>

    <!-- Footer -->
    <div
        class="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"
    >
      <el-button
          id="activity-form-cancel-btn"
          type="default"
          :disabled="saving || uploading"
          class="!rounded-xl"
          @click="handleCancel"
      >
        Cancel
      </el-button>

      <el-button
          id="activity-form-submit-btn"
          type="primary"
          native-type="submit"
          :loading="saving || uploading"
          class="!rounded-xl"
      >
        <i
            v-if="!saving && !uploading"
            class="fi fi-rr-check mr-1.5"
        ></i>

        {{
          uploading
              ? 'Uploading Poster...'
              : editing
                  ? 'Save Changes'
                  : 'Promote Activity'
        }}
      </el-button>
    </div>
  </form>

  <!-- Crop Dialog -->
  <el-dialog
      v-model="cropDialogVisible"
      title="Crop Activity Poster"
      width="min(92vw, 800px)"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      destroy-on-close
      @closed="handleCropDialogClosed"
  >
    <div class="space-y-4">
      <div class="overflow-hidden rounded-xl bg-slate-950">
        <cropper-canvas
            ref="cropCanvas"
            background
            class="block h-[55vh] min-h-[300px] w-full"
        >
          <cropper-image
              :src="cropSourceUrl"
              alt="Crop activity poster"
              rotatable
              scalable
              translatable
          ></cropper-image>

          <cropper-shade></cropper-shade>

          <cropper-selection
              ref="cropSelection"
              initial-coverage="0.8"
              aspect-ratio="1.7777777778"
              movable
              resizable
              zoomable
              outlined
              keyboard
          >
            <cropper-grid
                role="grid"
                covered
            ></cropper-grid>

            <cropper-crosshair
                centered
            ></cropper-crosshair>

            <cropper-handle
                action="move"
                theme-color="rgba(255, 255, 255, 0.35)"
            ></cropper-handle>

            <cropper-handle action="n-resize"></cropper-handle>
            <cropper-handle action="e-resize"></cropper-handle>
            <cropper-handle action="s-resize"></cropper-handle>
            <cropper-handle action="w-resize"></cropper-handle>

            <cropper-handle action="ne-resize"></cropper-handle>
            <cropper-handle action="nw-resize"></cropper-handle>
            <cropper-handle action="se-resize"></cropper-handle>
            <cropper-handle action="sw-resize"></cropper-handle>
          </cropper-selection>
        </cropper-canvas>
      </div>

      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-sm font-semibold text-slate-800">
            Adjust your poster
          </p>

          <p class="text-xs text-slate-500">
            Drag and zoom the image to choose the area you want to keep.
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <el-button
            :disabled="cropping"
            @click="cancelCrop"
        >
          Cancel
        </el-button>

        <el-button
            type="primary"
            :loading="cropping"
            class="!rounded-xl"
            @click="confirmCrop"
        >
          <i class="fi fi-rr-check mr-1.5"></i>
          Use This Crop
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref
} from 'vue'

import { useRoute } from 'vue-router'

import 'cropperjs'

import studentConnect from '@/api'
import { uploadActivityPoster } from '@/utils/cloudinary'

const route = useRoute()

const props = defineProps({
  activity: {
    type: Object,
    default: null
  },

  editing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'saved',
  'cancel'
])

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const categories = [
  'Competition',
  'Sports',
  'Club & Society',
  'Volunteer',
  'Workshop',
  'Seminar',
  'Cultural',
  'Other'
]

const MAX_POSTER_SIZE =
    5 * 1024 * 1024

const CROP_WIDTH = 1600
const CROP_HEIGHT = 900

/*
|--------------------------------------------------------------------------
| Form
|--------------------------------------------------------------------------
*/

const form = reactive({
  title: '',
  category: '',
  description: '',
  eventDate: '',
  eventTime: '',
  registrationDeadlineDate: '',
  registrationDeadlineTime: '',
  participantsLimit: '',
  location: '',
  contact: ''
})

const errors = reactive({
  title: '',
  category: '',
  description: '',
  eventDate: '',
  registrationDeadline: '',
  participantsLimit: '',
  location: '',
  contact: '',
  poster: ''
})

/*
|--------------------------------------------------------------------------
| State
|--------------------------------------------------------------------------
*/

const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)

const generalError = ref('')

const selectedFile = ref(null)
const previewUrl = ref('')

const removeExistingPoster =
    ref(false)

const posterInput = ref(null)

/*
|--------------------------------------------------------------------------
| Cropper.js 2.x
|--------------------------------------------------------------------------
*/

const cropDialogVisible =
    ref(false)

const cropSourceUrl =
    ref('')

const cropCanvas =
    ref(null)

const cropSelection =
    ref(null)

const cropping =
    ref(false)

let cropSourceObjectUrl = ''

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

/**
 * Returns the number of currently joined students.
 *
 * The activity owner is excluded because the API does not include
 * the owner in the participants array.
 *
 * @returns {number|null} Current participant count or null when unavailable.
 */
const currentParticipantCount = computed(() => {
  if (!props.activity) {
    return null
  }

  if (Array.isArray(props.activity.participants)) {
    return props.activity.participants.length
  }

  if (
      Number.isInteger(
          Number(
              props.activity.participantCount
          )
      ) &&
      Number(
          props.activity.participantCount
      ) >= 0
  ) {
    return Number(
        props.activity.participantCount
    )
  }

  return null
})

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function clearErrors() {
  errors.title = ''
  errors.category = ''
  errors.description = ''
  errors.eventDate = ''
  errors.registrationDeadline = ''
  errors.participantsLimit = ''
  errors.location = ''
  errors.contact = ''
  errors.poster = ''
  generalError.value = ''
}

function formatDateForInput(date) {
  const year =
      date.getFullYear()

  const month =
      String(
          date.getMonth() + 1
      ).padStart(2, '0')

  const day =
      String(
          date.getDate()
      ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatTimeForInput(date) {
  const hours =
      String(
          date.getHours()
      ).padStart(2, '0')

  const minutes =
      String(
          date.getMinutes()
      ).padStart(2, '0')

  return `${hours}:${minutes}`
}

function combineDateTime(
    date,
    time
) {
  if (!date || !time) {
    return null
  }

  const value =
      new Date(
          `${date}T${time}:00`
      )

  if (
      Number.isNaN(
          value.getTime()
      )
  ) {
    return null
  }

  return Math.floor(
      value.getTime() / 1000
  )
}

/*
|--------------------------------------------------------------------------
| Populate Form
|--------------------------------------------------------------------------
*/

async function populateForm() {
  let activity =
      props.activity

  if (
      !activity &&
      props.editing
  ) {
    const activityId =
        route.query.id

    if (!activityId) {
      generalError.value =
          'Activity ID is missing.'

      return
    }

    loading.value = true

    try {
      const response =
          await studentConnect.getActivity(
              activityId
          )

      activity =
          response?.data ||
          response

      if (
          !activity ||
          !activity.id
      ) {
        throw new Error(
            'Activity not found.'
        )
      }
    } catch (error) {
      console.error(
          'Failed to load activity:',
          error
      )

      generalError.value =
          error?.message ||
          'Unable to load the activity.'

      return
    } finally {
      loading.value = false
    }
  }

  /*
   * New activity.
   */
  if (!activity) {
    return
  }

  /*
   * Basic fields.
   */
  form.title =
      activity.title || ''

  form.category =
      activity.category || ''

  form.description =
      activity.description || ''

  form.location =
      activity.location || ''

  form.contact =
      activity.contact || ''

  /*
   * Participant limit.
   */
  const participantsLimit =
      Number(
          activity.participantsLimit
      )

  form.participantsLimit =
      Number.isInteger(participantsLimit) &&
      participantsLimit > 0
          ? String(participantsLimit)
          : ''

  /*
   * Event date/time.
   */
  if (activity.eventDate) {
    const eventDate =
        new Date(
            Number(activity.eventDate) *
            1000
        )

    if (
        !Number.isNaN(
            eventDate.getTime()
        )
    ) {
      form.eventDate =
          formatDateForInput(
              eventDate
          )

      form.eventTime =
          formatTimeForInput(
              eventDate
          )
    }
  }

  /*
   * Registration deadline.
   */
  if (
      activity.registrationDeadline
  ) {
    const deadline =
        new Date(
            Number(
                activity.registrationDeadline
            ) * 1000
        )

    if (
        !Number.isNaN(
            deadline.getTime()
        )
    ) {
      form.registrationDeadlineDate =
          formatDateForInput(
              deadline
          )

      form.registrationDeadlineTime =
          formatTimeForInput(
              deadline
          )
    }
  } else {
    form.registrationDeadlineDate =
        ''

    form.registrationDeadlineTime =
        ''
  }

  /*
   * Existing poster.
   */
  previewUrl.value =
      activity.posterUrl || ''

  selectedFile.value =
      null

  removeExistingPoster.value =
      false
}

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

function validateForm() {
  clearErrors()

  let valid = true

  if (!form.title.trim()) {
    errors.title =
        'Activity title is required.'

    valid = false
  } else if (
      form.title.trim().length > 150
  ) {
    errors.title =
        'Activity title must not exceed 150 characters.'

    valid = false
  }

  if (!form.category) {
    errors.category =
        'Please select a category.'

    valid = false
  }

  if (!form.description.trim()) {
    errors.description =
        'Description is required.'

    valid = false
  } else if (
      form.description.trim().length > 5000
  ) {
    errors.description =
        'Description must not exceed 5000 characters.'

    valid = false
  }

  if (
      !form.eventDate ||
      !form.eventTime
  ) {
    errors.eventDate =
        'Event date and time are required.'

    valid = false
  } else {
    const eventTimestamp =
        combineDateTime(
            form.eventDate,
            form.eventTime
        )

    if (
        !eventTimestamp ||
        eventTimestamp <=
        Math.floor(Date.now() / 1000)
    ) {
      errors.eventDate =
          'Event date and time must be in the future.'

      valid = false
    }
  }

  const hasDeadlineDate =
      Boolean(
          form.registrationDeadlineDate
      )

  const hasDeadlineTime =
      Boolean(
          form.registrationDeadlineTime
      )

  if (
      hasDeadlineDate !==
      hasDeadlineTime
  ) {
    errors.registrationDeadline =
        'Please provide both deadline date and time.'

    valid = false
  }

  if (
      hasDeadlineDate &&
      hasDeadlineTime &&
      form.eventDate &&
      form.eventTime
  ) {
    const deadlineTimestamp =
        combineDateTime(
            form.registrationDeadlineDate,
            form.registrationDeadlineTime
        )

    const eventTimestamp =
        combineDateTime(
            form.eventDate,
            form.eventTime
        )

    if (
        !deadlineTimestamp ||
        !eventTimestamp
    ) {
      errors.registrationDeadline =
          'Invalid registration deadline.'

      valid = false
    } else if (
        deadlineTimestamp >=
        eventTimestamp
    ) {
      errors.registrationDeadline =
          'Registration deadline must be before the event.'

      valid = false
    } else if (
        deadlineTimestamp <=
        Math.floor(Date.now() / 1000)
    ) {
      errors.registrationDeadline =
          'Registration deadline must be in the future.'

      valid = false
    }
  }

  /*
   * Participant limit.
   *
   * Optional, but when provided it must
   * be a positive integer.
   */
  if (
      form.participantsLimit !== '' &&
      form.participantsLimit !== null &&
      form.participantsLimit !== undefined
  ) {
    const value =
        Number(
            form.participantsLimit
        )

    if (
        !Number.isInteger(value) ||
        value <= 0
    ) {
      errors.participantsLimit =
          'Participant limit must be a positive whole number.'

      valid = false
    } else if (
        props.editing &&
        currentParticipantCount.value !== null &&
        value < currentParticipantCount.value
    ) {
      errors.participantsLimit =
          `Participant limit cannot be lower than the ${currentParticipantCount.value} currently joined students.`

      valid = false
    }
  }

  if (!form.location.trim()) {
    errors.location =
        'Location is required.'

    valid = false
  } else if (
      form.location.trim().length > 300
  ) {
    errors.location =
        'Location must not exceed 300 characters.'

    valid = false
  }

  if (!form.contact.trim()) {
    errors.contact =
        'Contact information is required.'

    valid = false
  } else if (
      form.contact.trim().length > 300
  ) {
    errors.contact =
        'Contact information must not exceed 300 characters.'

    valid = false
  }

  return valid
}

/*
|--------------------------------------------------------------------------
| Poster Selection
|--------------------------------------------------------------------------
*/

function selectPoster(event) {
  clearErrors()

  const file =
      event.target.files?.[0]

  if (!file) {
    return
  }

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ]

  if (
      !allowedTypes.includes(
          file.type
      )
  ) {
    errors.poster =
        'Please select a JPG, PNG, or WebP image.'

    event.target.value = ''

    return
  }

  if (
      file.size >
      MAX_POSTER_SIZE
  ) {
    errors.poster =
        'Poster size must not exceed 5 MB.'

    event.target.value = ''

    return
  }

  openCropper(file)

  event.target.value = ''
}

/*
|--------------------------------------------------------------------------
| Open Cropper
|--------------------------------------------------------------------------
*/

function openCropper(file) {
  if (cropSourceObjectUrl) {
    URL.revokeObjectURL(
        cropSourceObjectUrl
    )
  }

  cropSourceObjectUrl =
      URL.createObjectURL(file)

  cropSourceUrl.value =
      cropSourceObjectUrl

  cropDialogVisible.value =
      true

  nextTick(() => {
    setTimeout(() => {
      if (
          cropSelection.value &&
          typeof cropSelection.value.$reset ===
          'function'
      ) {
        cropSelection.value.$reset()
      }
    }, 100)
  })
}

/*
|--------------------------------------------------------------------------
| Create Cropped File
|--------------------------------------------------------------------------
*/

async function createCroppedFile() {
  const selection =
      cropSelection.value

  if (
      !selection ||
      typeof selection.$toCanvas !==
      'function'
  ) {
    throw new Error(
        'Crop editor is not ready.'
    )
  }

  const canvas =
      await selection.$toCanvas({
        width: CROP_WIDTH,
        height: CROP_HEIGHT
      })

  if (!canvas) {
    throw new Error(
        'Unable to create the cropped poster.'
    )
  }

  const blob =
      await new Promise(
          (resolve) => {
            canvas.toBlob(
                resolve,
                'image/jpeg',
                0.92
            )
          }
      )

  if (!blob) {
    throw new Error(
        'Unable to create the cropped poster.'
    )
  }

  return new File(
      [blob],
      `activity-poster-${Date.now()}.jpg`,
      {
        type: 'image/jpeg',
        lastModified: Date.now()
      }
  )
}

/*
|--------------------------------------------------------------------------
| Confirm Crop
|--------------------------------------------------------------------------
*/

async function confirmCrop() {
  if (cropping.value) {
    return
  }

  cropping.value = true
  errors.poster = ''

  try {
    const croppedFile =
        await createCroppedFile()

    if (
        croppedFile.size >
        MAX_POSTER_SIZE
    ) {
      throw new Error(
          'The cropped poster is larger than 5 MB. Please choose a simpler image.'
      )
    }

    if (
        previewUrl.value &&
        previewUrl.value.startsWith(
            'blob:'
        )
    ) {
      URL.revokeObjectURL(
          previewUrl.value
      )
    }

    selectedFile.value =
        croppedFile

    previewUrl.value =
        URL.createObjectURL(
            croppedFile
        )

    removeExistingPoster.value =
        false

    cropDialogVisible.value =
        false
  } catch (cropError) {
    console.error(
        'Crop failed:',
        cropError
    )

    errors.poster =
        cropError?.message ||
        'Unable to crop the poster.'
  } finally {
    cropping.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Cancel Crop
|--------------------------------------------------------------------------
*/

function cancelCrop() {
  cropDialogVisible.value =
      false
}

function handleCropDialogClosed() {
  if (cropSourceObjectUrl) {
    URL.revokeObjectURL(
        cropSourceObjectUrl
    )

    cropSourceObjectUrl = ''
  }

  cropSourceUrl.value = ''
}

/*
|--------------------------------------------------------------------------
| Remove Poster
|--------------------------------------------------------------------------
*/

function removePoster() {
  if (
      previewUrl.value &&
      previewUrl.value.startsWith(
          'blob:'
      )
  ) {
    URL.revokeObjectURL(
        previewUrl.value
    )
  }

  selectedFile.value =
      null

  previewUrl.value =
      ''

  removeExistingPoster.value =
      true
}

/*
|--------------------------------------------------------------------------
| Submit
|--------------------------------------------------------------------------
*/

async function handleSubmit() {
  if (
      saving.value ||
      uploading.value
  ) {
    return
  }

  if (!validateForm()) {
    return
  }

  saving.value = true
  generalError.value = ''

  try {
    const eventDate =
        combineDateTime(
            form.eventDate,
            form.eventTime
        )

    const registrationDeadline =
        form.registrationDeadlineDate &&
        form.registrationDeadlineTime
            ? combineDateTime(
                form.registrationDeadlineDate,
                form.registrationDeadlineTime
            )
            : null

    const participantsLimit =
        form.participantsLimit !== '' &&
        form.participantsLimit !== null &&
        form.participantsLimit !== undefined
            ? Number(
                form.participantsLimit
            )
            : null

    let posterUrl =
        props.activity?.posterUrl ||
        null

    let posterPublicId =
        props.activity?.posterPublicId ||
        null

    /*
     * User explicitly removed
     * the existing poster.
     */
    if (
        removeExistingPoster.value
    ) {
      posterUrl = null
      posterPublicId = null
    }

    /*
     * Upload the cropped file.
     */
    if (selectedFile.value) {
      uploading.value = true

      try {
        const uploaded =
            await uploadActivityPoster(
                selectedFile.value
            )

        posterUrl =
            uploaded.url

        posterPublicId =
            uploaded.publicId
      } finally {
        uploading.value = false
      }
    }

    /*
     * Activity API payload.
     *
     * participantsLimit is the maximum number
     * of students who may join. The organiser
     * is not included in this limit.
     */
    const payload = {
      title:
          form.title.trim(),

      category:
      form.category,

      description:
          form.description.trim(),

      eventDate,

      registrationDeadline,

      participantsLimit,

      location:
          form.location.trim(),

      contact:
          form.contact.trim(),

      posterUrl,

      posterPublicId
    }

    const response =
        props.editing
            ? await studentConnect.updateActivity(
                props.activity?.id ||
                route.query.id,
                payload
            )
            : await studentConnect.createActivity(
                payload
            )

    emit(
        'saved',
        response?.data ||
        response
    )
  } catch (error) {
    console.error(
        'Failed to save activity:',
        error
    )

    generalError.value =
        error?.message ||
        'Unable to save the activity. Please try again.'
  } finally {
    saving.value = false
    uploading.value = false
  }
}

/*
|--------------------------------------------------------------------------
| Cancel
|--------------------------------------------------------------------------
*/

function handleCancel() {
  if (
      saving.value ||
      uploading.value
  ) {
    return
  }

  emit('cancel')
}

/*
|--------------------------------------------------------------------------
| Lifecycle
|--------------------------------------------------------------------------
*/

onMounted(() => {
  populateForm()
})

onBeforeUnmount(() => {
  if (cropSourceObjectUrl) {
    URL.revokeObjectURL(
        cropSourceObjectUrl
    )

    cropSourceObjectUrl = ''
  }

  if (
      previewUrl.value &&
      previewUrl.value.startsWith(
          'blob:'
      )
  ) {
    URL.revokeObjectURL(
        previewUrl.value
    )
  }
})
</script>

<style scoped>
:deep(.el-input__wrapper),
:deep(.el-textarea__inner),
:deep(.el-select__wrapper) {
  border-radius: 0.75rem;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  min-height: 40px;
}

:deep(.el-textarea__inner) {
  padding-top: 10px;
  padding-bottom: 10px;
}

:deep(.el-button) {
  font-weight: 700;
}

:deep(cropper-canvas) {
  --theme-color: rgba(255, 255, 255, 0.85);
  --selection-border: 1px solid rgba(255, 255, 255, 0.95);
}

:deep(cropper-selection) {
  --theme-color: rgba(79, 70, 229, 0.85);
}

:deep(cropper-grid) {
  opacity: 0.7;
}
</style>
