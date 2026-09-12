<template>
  <div class="mx-auto max-w-4xl">
    <div v-if="loading" class="flex min-h-[400px] items-center justify-center">
      <i class="fi fi-rr-spinner animate-spin text-3xl text-indigo-600"></i>
    </div>

    <div v-else-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
      <p class="font-semibold">{{ error }}</p>
      <button class="mt-4 font-bold underline" @click="loadActivity">Try again</button>
    </div>

    <div v-else-if="activity" class="space-y-6">
      <div class="flex items-center justify-between gap-4">
        <button class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600" @click="emit('back')">
          <i class="fi fi-rr-arrow-left"></i>
          Back to Activities
        </button>
        <div v-if="isOwner" class="flex gap-2">
          <button
              v-if="!isTerminal"
              class="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
              @click="emit('edit', activity.id)"
          >
            Edit
          </button>
          <button
              v-if="!isTerminal"
              class="rounded-xl border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
              @click="emit('delete', activity.id)"
          >
            Delete
          </button>
        </div>
      </div>

      <article class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div v-if="activity.posterUrl" class="max-h-[420px] bg-slate-100">
          <img :src="activity.posterUrl" :alt="`${activity.title} poster`" class="max-h-[420px] w-full object-contain" />
        </div>
        <div class="space-y-6 p-6 md:p-8">
          <div class="flex flex-wrap items-center gap-3">
            <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700">
              {{ activity.category || 'Activity' }}
            </span>
            <span class="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider" :class="statusClass">
              {{ statusLabel }}
            </span>
          </div>

          <div>
            <h1 class="text-2xl font-black leading-tight text-slate-900 md:text-3xl">{{ activity.title }}</h1>
            <p class="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">{{ activity.description }}</p>
          </div>

          <div class="grid gap-4 border-y border-slate-100 py-6 sm:grid-cols-2">
            <div v-for="item in detailItems" :key="item.label" class="flex gap-3">
              <i :class="['fi', item.icon, 'mt-0.5', 'text-indigo-500']"></i>
              <div class="min-w-0">
                <p class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ item.label }}</p>
                <p class="mt-1 break-words text-sm font-semibold text-slate-800">{{ item.value || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-xl bg-slate-50 p-4">
            <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Organizer</p>
            <p class="mt-1 font-bold text-slate-800">{{ activity.owner?.name || 'Student Connect student' }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import studentConnect from '@/api'

const props = defineProps({
  activityId: { type: String, required: true },
  currentUser: { type: Object, default: null }
})
const emit = defineEmits(['back', 'edit', 'delete'])
const activity = ref(null)
const loading = ref(true)
const error = ref('')

/**
 * Loads the requested activity from the shared API client.
 *
 * @returns {Promise<void>} Resolves when loading completes.
 */
async function loadActivity() {
  loading.value = true
  error.value = ''
  try {
    const response = await studentConnect.getActivity(props.activityId)
    activity.value = response?.data || null
    if (!activity.value) error.value = 'This activity could not be found.'
  } catch (requestError) {
    error.value = requestError.message || 'Unable to load this activity.'
  } finally {
    loading.value = false
  }
}

/**
 * Returns the derived lifecycle status.
 *
 * @returns {string} Activity status key.
 */
const statusKey = computed(() => {
  const explicitStatus = String(activity.value?.status || '').toLowerCase()
  if (['cancelled', 'completed'].includes(explicitStatus)) return explicitStatus
  const now = Math.floor(Date.now() / 1000)
  const registrationDeadline = Number(activity.value?.registrationDeadline)
  const eventDate = Number(activity.value?.eventDate)
  return (registrationDeadline > 0 && registrationDeadline <= now) ||
    (eventDate > 0 && eventDate <= now) ? 'expired' : 'open'
})

/**
 * Returns the visible lifecycle status.
 *
 * @returns {string} Human-readable status.
 */
const statusLabel = computed(() => ({
  open: 'Open', completed: 'Completed', cancelled: 'Cancelled', expired: 'Expired'
}[statusKey.value] || 'Open'))

/**
 * Returns status badge classes.
 *
 * @returns {string} Tailwind classes.
 */
const statusClass = computed(() => ({
  open: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-slate-100 text-slate-500',
  cancelled: 'bg-rose-100 text-rose-600',
  expired: 'bg-amber-100 text-amber-700'
}[statusKey.value]))

const isTerminal = computed(() => ['cancelled', 'completed', 'expired'].includes(statusKey.value))
const isOwner = computed(() => Boolean(
  props.currentUser?.id &&
  (activity.value?.owner?.id || activity.value?.owner?.uid) === props.currentUser.id
))
const detailItems = computed(() => [
  { icon: 'fi-rr-calendar', label: 'Event Date', value: formatDate(activity.value?.eventDate) },
  { icon: 'fi-rr-clock', label: 'Registration Deadline', value: activity.value?.registrationDeadline ? formatDate(activity.value.registrationDeadline) : 'Not specified' },
  { icon: 'fi-rr-marker', label: 'Location', value: activity.value?.location },
  { icon: 'fi-rr-phone-call', label: 'Contact', value: activity.value?.contact }
])

/**
 * Formats a Unix timestamp for detail display.
 *
 * @param {number|string} value - Unix timestamp in seconds.
 * @returns {string} Formatted date.
 */
function formatDate(value) {
  const date = new Date(Number(value) * 1000)
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat('en-MY', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(date)
}

onMounted(loadActivity)
</script>
