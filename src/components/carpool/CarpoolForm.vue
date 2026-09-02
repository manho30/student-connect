<template>
  <form id="carpool-form" @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Origin & Destination -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          <i class="fi fi-rr-marker text-indigo-500 mr-1"></i> From (Origin)
        </label>
        <el-input
          id="carpool-from-input"
          v-model="form.from"
          placeholder="e.g. Butterworth KTM"
          clearable
        />
        <p v-if="errors.from" class="text-xs text-rose-500 mt-1">{{ errors.from }}</p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          <i class="fi fi-rr-marker text-indigo-500 mr-1"></i> To (Destination)
        </label>
        <el-input
          id="carpool-to-input"
          v-model="form.to"
          placeholder="e.g. Matriculation College"
          clearable
        />
        <p v-if="errors.to" class="text-xs text-rose-500 mt-1">{{ errors.to }}</p>
      </div>
    </div>

    <!-- Date & Time (Calendar Date Picker & Time Picker) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-xs font-semibold text-slate-700 mb-1">
          <i class="fi fi-rr-calendar text-indigo-500 mr-1"></i> Date
        </label>
        <el-date-picker
          id="carpool-date-input"
          v-model="form.date"
          type="date"
          placeholder="Select ride date"
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
          id="carpool-time-input"
          v-model="form.time"
          placeholder="Select departure time"
          format="hh:mm A"
          value-format="hh:mm A"
          class="!w-full"
        />
        <p v-if="errors.time" class="text-xs text-rose-500 mt-1">{{ errors.time }}</p>
      </div>
    </div>

    <!-- Capacity (4 Pax or 6 Pax) -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1.5">
        <i class="fi fi-rr-users text-indigo-500 mr-1"></i> Vehicle Capacity
      </label>
      <div class="flex gap-4">
        <label
          :class="[
            'flex items-center gap-2 p-3 rounded-xl border cursor-pointer flex-1 transition-all',
            form.capacity === 4
              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          ]"
        >
          <input
            type="radio"
            name="capacity"
            :value="4"
            v-model="form.capacity"
            class="text-indigo-600 focus:ring-indigo-500"
          />
          <i class="fi fi-rr-car-alt text-lg text-indigo-600"></i>
          <span>4 Pax (Standard Car)</span>
        </label>

        <label
          :class="[
            'flex items-center gap-2 p-3 rounded-xl border cursor-pointer flex-1 transition-all',
            form.capacity === 6
              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          ]"
        >
          <input
            type="radio"
            name="capacity"
            :value="6"
            v-model="form.capacity"
            class="text-indigo-600 focus:ring-indigo-500"
          />
          <i class="fi fi-rr-van text-lg text-indigo-600"></i>
          <span>6 Pax (MPV / Shared)</span>
        </label>
      </div>
    </div>

    <!-- Estimated Cost -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">
        <i class="fi fi-rr-dollar text-emerald-600 mr-1"></i> Cost Per Passenger (RM) <span class="text-rose-500">*</span>
      </label>
      <el-input
        id="carpool-cost-input"
        v-model="form.cost"
        type="number"
        min="0"
        placeholder="Enter amount in RM (e.g. 5, or 0 if free)"
      >
        <template #prefix>RM</template>
      </el-input>
      <div class="flex justify-between items-center mt-1">
        <p v-if="errors.cost" class="text-xs text-rose-500">{{ errors.cost }}</p>
        <p v-else class="text-[11px] text-slate-400">Specify cost per student (enter 0 for a free ride).</p>
      </div>
    </div>

    <!-- Notes -->
    <div>
      <label class="block text-xs font-semibold text-slate-700 mb-1">
        <i class="fi fi-rr-edit text-indigo-500 mr-1"></i> Notes / Meeting Point (Optional)
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
    <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
      <el-button id="carpool-cancel-btn" @click="$emit('cancel')">Cancel</el-button>
      <el-button
        id="carpool-submit-btn"
        type="primary"
        native-type="submit"
        :loading="submitting"
        class="!px-5 !rounded-xl"
      >
        <i :class="isEdit ? 'fi fi-rr-check' : 'fi fi-rr-plus'" class="mr-1.5"></i>
        {{ isEdit ? 'Save Changes' : 'Create Carpool' }}
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

// Default to today's date formatted YYYY-MM-DD
const today = new Date().toISOString().split('T')[0]

const form = reactive({
  from: '',
  to: '',
  date: today,
  time: '08:00 PM',
  capacity: 4,
  cost: '',
  notes: ''
})

const errors = reactive({
  from: '',
  to: '',
  date: '',
  time: '',
  cost: ''
})

function populateForm(data) {
  if (data) {
    form.from = data.from || ''
    form.to = data.to || ''
    form.date = data.date || today
    form.time = data.time || '08:00 PM'
    form.capacity = Number(data.capacity) || 4
    form.cost = data.cost !== undefined && data.cost !== null ? data.cost : ''
    form.notes = data.notes || ''
  } else {
    form.from = ''
    form.to = ''
    form.date = today
    form.time = '08:00 PM'
    form.capacity = 4
    form.cost = ''
    form.notes = ''
  }
}

watch(
  () => props.initialData,
  (newVal) => {
    populateForm(newVal)
  },
  { immediate: true }
)

function handleSubmit() {
  errors.from = ''
  errors.to = ''
  errors.date = ''
  errors.time = ''
  errors.cost = ''

  if (!form.from.trim()) {
    errors.from = 'Please enter origin location'
    return
  }
  if (!form.to.trim()) {
    errors.to = 'Please enter destination'
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

  // Strict price validation: prevent silent auto-free bug
  if (form.cost === '' || form.cost === null || form.cost === undefined) {
    errors.cost = 'Please enter price per person (enter 0 if this ride is free)'
    return
  }
  const numericCost = Number(form.cost)
  if (isNaN(numericCost) || numericCost < 0) {
    errors.cost = 'Please enter a valid non-negative amount'
    return
  }

  submitting.value = true
  emit('submit', {
    ...form,
    cost: numericCost
  })
  submitting.value = false
}
</script>
