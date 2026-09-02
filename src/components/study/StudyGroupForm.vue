<template>
  <form id="study-group-form" @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Group Name -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">
        <i class="fi fi-rr-edit text-indigo-500 mr-1"></i> Study Group Name
      </label>
      <el-input
        id="study-name-input"
        v-model="form.name"
        placeholder="e.g. Biology Revision & Past Papers"
        clearable
      />
      <p v-if="errors.name" class="text-xs text-rose-500 mt-1">{{ errors.name }}</p>
    </div>

    <!-- Subject & Maximum Members -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          <i class="fi fi-rr-book-alt text-emerald-600 mr-1"></i> Subject
        </label>
        <el-input
          id="study-subject-input"
          v-model="form.subject"
          placeholder="e.g. Cell Biology / Calculus / Physics"
          clearable
        />
        <p v-if="errors.subject" class="text-xs text-rose-500 mt-1">{{ errors.subject }}</p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          <i class="fi fi-rr-users text-indigo-500 mr-1"></i> Maximum Members
        </label>
        <el-select
          id="study-max-members-select"
          v-model="form.maxMembers"
          placeholder="Select capacity"
          class="w-full"
        >
          <el-option label="4 Members (Intimate)" :value="4" />
          <el-option label="6 Members (Small Team)" :value="6" />
          <el-option label="8 Members (Standard)" :value="8" />
          <el-option label="10 Members (Medium)" :value="10" />
          <el-option label="12 Members (Large Revision)" :value="12" />
        </el-select>
      </div>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">
        <i class="fi fi-rr-document text-indigo-500 mr-1"></i> Description / Topics to Cover
      </label>
      <el-input
        id="study-desc-input"
        v-model="form.description"
        type="textarea"
        :rows="3"
        placeholder="e.g. Working through chapter 5 questions, reviewing lecture notes together."
      />
      <p v-if="errors.description" class="text-xs text-rose-500 mt-1">{{ errors.description }}</p>
    </div>

    <!-- Date & Time Picker -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          <i class="fi fi-rr-calendar text-indigo-500 mr-1"></i> Date
        </label>
        <el-date-picker
          id="study-date-input"
          v-model="form.date"
          type="date"
          placeholder="Select session date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          class="!w-full"
        />
        <p v-if="errors.date" class="text-xs text-rose-500 mt-1">{{ errors.date }}</p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          <i class="fi fi-rr-clock-three text-indigo-500 mr-1"></i> Time
        </label>
        <el-time-picker
          id="study-time-input"
          v-model="form.time"
          placeholder="Select session time"
          format="hh:mm A"
          value-format="hh:mm A"
          class="!w-full"
        />
        <p v-if="errors.time" class="text-xs text-rose-500 mt-1">{{ errors.time }}</p>
      </div>
    </div>

    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">
        <i class="fi fi-rr-marker text-rose-500 mr-1"></i> Location / Meeting Room
      </label>
      <el-input
        id="study-location-input"
        v-model="form.location"
        placeholder="e.g. Campus Library Level 2 (Discussion Pod 3)"
        clearable
      />
      <p v-if="errors.location" class="text-xs text-rose-500 mt-1">{{ errors.location }}</p>
    </div>

    <!-- Actions -->
    <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
      <el-button id="study-cancel-btn" @click="$emit('cancel')">Cancel</el-button>
      <el-button
        id="study-submit-btn"
        type="primary"
        native-type="submit"
        :loading="submitting"
        class="!px-5 !rounded-xl"
      >
        <i class="fi fi-rr-plus mr-1.5"></i>
        Create Study Group
      </el-button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['submit', 'cancel'])

const submitting = ref(false)

const today = new Date().toISOString().split('T')[0]

const form = reactive({
  name: '',
  subject: '',
  description: '',
  date: today,
  time: '02:00 PM',
  location: 'Campus Library',
  maxMembers: 8
})

const errors = reactive({
  name: '',
  subject: '',
  description: '',
  location: '',
  date: '',
  time: ''
})

function handleSubmit() {
  errors.name = ''
  errors.subject = ''
  errors.description = ''
  errors.location = ''
  errors.date = ''
  errors.time = ''

  if (!form.name.trim()) {
    errors.name = 'Please enter a group name'
    return
  }
  if (!form.subject.trim()) {
    errors.subject = 'Please enter a subject'
    return
  }
  if (!form.description.trim()) {
    errors.description = 'Please provide a short description'
    return
  }
  if (!form.date) {
    errors.date = 'Please pick a date'
    return
  }
  if (!form.time) {
    errors.time = 'Please pick a time'
    return
  }
  if (!form.location.trim()) {
    errors.location = 'Please specify the meeting location'
    return
  }

  submitting.value = true
  emit('submit', { ...form })
  submitting.value = false
}
</script>
