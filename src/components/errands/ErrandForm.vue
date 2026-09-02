<template>
  <form id="errand-form" @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Title -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">
        <i class="fi fi-rr-edit text-indigo-500 mr-1"></i> Errand Title
      </label>
      <el-input
        id="errand-title-input"
        v-model="form.title"
        placeholder="e.g. Pick up Shopee parcel / Print lab report"
        clearable
      />
      <p v-if="errors.title" class="text-xs text-rose-500 mt-1">{{ errors.title }}</p>
    </div>

    <!-- Category -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">
        <i class="fi fi-rr-apps text-indigo-500 mr-1"></i> Category
      </label>
      <el-select
        id="errand-category-select"
        v-model="form.category"
        placeholder="Select category"
        class="w-full"
      >
        <el-option label="Food & Drinks" value="Food" />
        <el-option label="Parcel Collection" value="Parcel" />
        <el-option label="Printing & Photocopy" value="Printing" />
        <el-option label="Stationery & Supplies" value="Stationery" />
        <el-option label="Other Errand" value="Other" />
      </el-select>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">
        <i class="fi fi-rr-document text-indigo-500 mr-1"></i> Description / Instructions
      </label>
      <el-input
        id="errand-desc-input"
        v-model="form.description"
        type="textarea"
        :rows="3"
        placeholder="Explain what needs to be done, specific items, order numbers, etc."
      />
      <p v-if="errors.description" class="text-xs text-rose-500 mt-1">{{ errors.description }}</p>
    </div>

    <!-- Location & Deadline Date/Time -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          <i class="fi fi-rr-marker text-rose-500 mr-1"></i> Location / Pick-up Spot
        </label>
        <el-input
          id="errand-location-input"
          v-model="form.location"
          placeholder="e.g. Butterworth KTM Hub / Campus Gate A"
          clearable
        />
        <p v-if="errors.location" class="text-xs text-rose-500 mt-1">{{ errors.location }}</p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          <i class="fi fi-rr-clock-three text-indigo-500 mr-1"></i> Needed By (Deadline)
        </label>
        <el-date-picker
          id="errand-deadline-input"
          v-model="form.deadline"
          type="datetime"
          placeholder="Select deadline date & time"
          format="YYYY-MM-DD hh:mm A"
          value-format="YYYY-MM-DD hh:mm A"
          class="!w-full"
        />
        <p v-if="errors.deadline" class="text-xs text-rose-500 mt-1">{{ errors.deadline }}</p>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
      <el-button id="errand-cancel-btn" @click="$emit('cancel')">Cancel</el-button>
      <el-button
        id="errand-submit-btn"
        type="primary"
        native-type="submit"
        :loading="submitting"
        class="!px-5 !rounded-xl"
      >
        <i :class="isEdit ? 'fi fi-rr-check' : 'fi fi-rr-plus'" class="mr-1.5"></i>
        {{ isEdit ? 'Save Changes' : 'Post Errand' }}
      </el-button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'

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

const emit = defineEmits(['submit', 'cancel'])

const submitting = ref(false)

const today = new Date().toISOString().split('T')[0]

const form = reactive({
  title: '',
  description: '',
  location: '',
  deadline: `${today} 06:00 PM`,
  category: 'Parcel'
})

const errors = reactive({
  title: '',
  description: '',
  location: '',
  deadline: ''
})

/**
 * Pre-populates the form with existing errand values if editing.
 *
 * @param {Object|null} data - Errand data object.
 * @returns {void}
 */
function populateForm(data) {
  if (data) {
    form.title = data.title || ''
    form.description = data.description || ''
    form.location = data.location || ''
    form.deadline = data.deadline || `${today} 06:00 PM`
    form.category = data.category || 'Parcel'
  } else {
    form.title = ''
    form.description = ''
    form.location = ''
    form.deadline = `${today} 06:00 PM`
    form.category = 'Parcel'
  }
}

watch(
  () => props.initialData,
  (val) => {
    populateForm(val)
  },
  { immediate: true }
)

/**
 * Validates the errand form fields and emits the submit event.
 *
 * @returns {void}
 */
function handleSubmit() {
  errors.title = ''
  errors.description = ''
  errors.location = ''
  errors.deadline = ''

  if (!form.title.trim()) {
    errors.title = 'Please enter an errand title'
    return
  }
  if (!form.description.trim()) {
    errors.description = 'Please provide details or instructions'
    return
  }
  if (!form.location.trim()) {
    errors.location = 'Please specify the location'
    return
  }
  if (!form.deadline) {
    errors.deadline = 'Please select a deadline'
    return
  }

  submitting.value = true
  emit('submit', { ...form })
  submitting.value = false
}
</script>

