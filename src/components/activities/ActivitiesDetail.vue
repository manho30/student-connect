<!-- components/activities/ActivitiesDetail.vue -->

<template>
  <div class="mx-auto max-w-4xl">
    <!-- Loading -->
    <div
        v-if="loading"
        class="flex min-h-[400px] items-center justify-center"
    >
      <i class="fi fi-rr-spinner animate-spin text-3xl text-brand-600"></i>
    </div>

    <!-- Error -->
    <div
        v-else-if="error"
        class="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700"
    >
      <p class="font-semibold">
        {{ error }}
      </p>

      <button
          type="button"
          class="mt-4 font-bold underline"
          @click="loadActivity"
      >
        Try again
      </button>
    </div>

    <!-- Activity -->
    <div
        v-else-if="activity"
        class="space-y-6"
    >
      <!-- Top Navigation -->
      <div class="flex items-center justify-between gap-4">
        <button
            type="button"
            class="flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-brand-600"
            @click="emit('back')"
        >
          <i class="fi fi-rr-arrow-left"></i>
          Back to Activities
        </button>

        <div class="flex items-center gap-2">
          <!-- Share -->
          <button
              id="share-activity-btn"
              type="button"
              class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs transition-all hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
              @click="shareActivity"
          >
            <i class="fi fi-rr-share"></i>

            <span class="hidden sm:inline">
              Share
            </span>
          </button>

          <!-- Owner Actions -->
          <template v-if="isOwner">
            <button
                v-if="!isTerminal"
                type="button"
                class="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition-colors hover:border-brand-300 hover:text-brand-700"
                @click="emit('edit', activity.id)"
            >
              Edit
            </button>

            <button
                v-if="!isTerminal"
                type="button"
                class="rounded-xl border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50"
                @click="emit('delete', activity.id)"
            >
              Delete
            </button>
          </template>
        </div>
      </div>

      <!-- Activity Card -->
      <article
          class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
      >
        <!-- Poster -->
        <div
            v-if="activity.posterUrl"
            class="relative overflow-hidden bg-slate-100"
        >
          <img
              :src="activity.posterUrl"
              :alt="posterAlt"
              class="mx-auto block max-h-[520px] w-full object-contain"
              loading="eager"
              fetchpriority="high"
              decoding="async"
          />

          <!-- Poster Overlay -->
          <div
              class="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent"
          ></div>
        </div>

        <!-- Content -->
        <div class="space-y-6 p-6 md:p-8">

          <!-- Badges -->
          <div class="flex flex-wrap items-center gap-3">
            <span
                class="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700"
            >
              {{ activity.category || 'Activity' }}
            </span>

            <span
                :class="[
                  'rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider',
                  statusClass
                ]"
            >
              {{ statusLabel }}
            </span>
          </div>

          <!-- Title -->
          <div>
            <h1
                class="text-2xl font-black leading-tight text-slate-900 md:text-3xl"
            >
              {{ activity.title }}
            </h1>

            <p
                v-if="activity.description"
                class="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600"
            >
              {{ activity.description }}
            </p>
          </div>

          <!-- Details -->
          <div
              class="grid gap-4 border-y border-slate-100 py-6 sm:grid-cols-2"
          >
            <div
                v-for="item in detailItems"
                :key="item.label"
                class="flex gap-3"
            >
              <div
                  class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600"
              >
                <i :class="['fi', item.icon, 'text-sm']"></i>
              </div>

              <div class="min-w-0">
                <p
                    class="text-xs font-bold uppercase tracking-wider text-slate-400"
                >
                  {{ item.label }}
                </p>

                <p
                    class="mt-1 break-words text-sm font-semibold text-slate-800"
                >
                  {{ item.value || 'N/A' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Organizer -->
          <div
              class="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
          >
            <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-600 shadow-xs"
            >
              <i class="fi fi-rr-user text-sm"></i>
            </div>

            <div class="min-w-0">
              <p
                  class="text-xs font-bold uppercase tracking-wider text-slate-400"
              >
                Organizer
              </p>

              <p class="mt-1 truncate font-bold text-slate-800">
                {{ organizerName }}
              </p>
            </div>
          </div>

          <!-- Share CTA -->
          <div
              class="flex flex-col gap-3 rounded-xl border border-brand-100 bg-brand-50/60 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p class="text-sm font-bold text-slate-900">
                Know someone interested?
              </p>

              <p class="mt-0.5 text-xs text-slate-500">
                Share this activity with other students.
              </p>
            </div>

            <button
                type="button"
                class="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-brand-700 hover:shadow-sm"
                @click="shareActivity"
            >
              <i class="fi fi-rr-share"></i>
              Share Activity
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'

import { ElMessage } from 'element-plus'

import studentConnect from '@/api'

const props = defineProps({
  activityId: {
    type: String,
    required: true
  },

  currentUser: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'back',
  'edit',
  'delete'
])

const activity = ref(null)
const loading = ref(true)
const error = ref('')

/**
 * Returns the current activity URL.
 *
 * @returns {string} Shareable activity URL.
 */
const activityUrl = computed(() => {
  if (!activity.value?.id) {
    return window.location.href
  }

  return `${window.location.origin}/activities?id=${encodeURIComponent(activity.value.id)}`
})

/**
 * Returns the activity organizer name.
 *
 * @returns {string} Organizer display name.
 */
const organizerName = computed(() => {
  return (
      activity.value?.owner?.name ||
      activity.value?.owner?.displayName ||
      activity.value?.owner?.email ||
      'Student Connect student'
  )
})

/**
 * Returns the participant limit.
 *
 * The Activities API does not track registrations,
 * so this is only an informational maximum.
 *
 * @returns {number} Positive participant limit or zero.
 */
const participantsLimit = computed(() => {
  const value =
      Number(
          activity.value?.participantsLimit
      )

  return Number.isInteger(value) && value > 0
      ? value
      : 0
})

/**
 * Determines whether the activity has a participant limit.
 *
 * @returns {boolean} True when a valid limit exists.
 */
const hasParticipantsLimit = computed(() => {
  return participantsLimit.value > 0
})

/**
 * Returns a safe poster alt text.
 *
 * @returns {string} Poster alternative text.
 */
const posterAlt = computed(() => {
  return activity.value?.title
      ? `${activity.value.title} poster`
      : 'Student Connect activity poster'
})

/**
 * Loads the requested activity from the shared API client.
 *
 * @returns {Promise<void>} Resolves when loading completes.
 */
async function loadActivity() {
  loading.value = true
  error.value = ''

  try {
    const response =
        await studentConnect.getActivity(
            props.activityId
        )

    if (response?.success === false) {
      throw new Error(
          response.message ||
          'Unable to load this activity.'
      )
    }

    activity.value =
        response?.data ||
        null

    if (!activity.value) {
      error.value =
          'This activity could not be found.'

      return
    }

    updatePageMetadata()
  } catch (requestError) {
    error.value =
        requestError.message ||
        'Unable to load this activity.'
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
  const explicitStatus =
      String(
          activity.value?.status || ''
      ).toLowerCase()

  if (
      ['cancelled', 'completed'].includes(
          explicitStatus
      )
  ) {
    return explicitStatus
  }

  if (explicitStatus === 'expired') {
    return 'expired'
  }

  const now =
      Math.floor(Date.now() / 1000)

  const registrationDeadline =
      Number(
          activity.value?.registrationDeadline
      )

  const eventDate =
      Number(
          activity.value?.eventDate
      )

  return (
      (
          registrationDeadline > 0 &&
          registrationDeadline <= now
      ) ||
      (
          eventDate > 0 &&
          eventDate <= now
      )
  )
      ? 'expired'
      : 'open'
})

/**
 * Returns the visible lifecycle status.
 *
 * @returns {string} Human-readable status.
 */
const statusLabel = computed(() => ({
  open: 'Open',
  completed: 'Completed',
  cancelled: 'Cancelled',
  expired: 'Expired'
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

/**
 * Determines whether the activity is terminal.
 *
 * @returns {boolean} True for completed, cancelled, or expired.
 */
const isTerminal = computed(() => {
  return [
    'cancelled',
    'completed',
    'expired'
  ].includes(statusKey.value)
})

/**
 * Determines whether the current user owns the activity.
 *
 * @returns {boolean} True when the current user is the owner.
 */
const isOwner = computed(() => {
  const currentUserId =
      props.currentUser?.id ||
      props.currentUser?.uid ||
      ''

  const ownerId =
      activity.value?.owner?.id ||
      activity.value?.owner?.uid ||
      activity.value?.owner?.userId ||
      ''

  return Boolean(
      currentUserId &&
      ownerId &&
      String(currentUserId) ===
      String(ownerId)
  )
})

/**
 * Returns activity detail metadata.
 *
 * @returns {Array<Object>} Activity detail items.
 */
const detailItems = computed(() => {
  const items = [
    {
      icon: 'fi-rr-calendar',
      label: 'Event Date',
      value: formatDate(
          activity.value?.eventDate
      )
    },
    {
      icon: 'fi-rr-clock',
      label: 'Registration Deadline',
      value:
          activity.value?.registrationDeadline
              ? formatDate(
                  activity.value.registrationDeadline
              )
              : 'Not specified'
    }
  ]

  /*
   * Participant limit is informational only.
   * Do not show it when the API does not provide
   * a valid positive integer.
   */
  if (hasParticipantsLimit.value) {
    items.push({
      icon: 'fi-rr-users',
      label: 'Participant Limit',
      value: `Up to ${participantsLimit.value} participants`
    })
  }

  items.push(
      {
        icon: 'fi-rr-marker',
        label: 'Location',
        value: activity.value?.location
      },
      {
        icon: 'fi-rr-phone-call',
        label: 'Contact',
        value: activity.value?.contact
      }
  )

  return items
})

/**
 * Formats a Unix timestamp for detail display.
 *
 * @param {number|string} value - Unix timestamp in seconds.
 * @returns {string} Formatted date.
 */
function formatDate(value) {
  const timestamp = Number(value)

  if (
      !Number.isFinite(timestamp) ||
      timestamp <= 0
  ) {
    return 'Date unavailable'
  }

  const date =
      new Date(timestamp * 1000)

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable'
  }

  return new Intl.DateTimeFormat(
      'en-MY',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
  ).format(date)
}

/**
 * Sets browser and social metadata for the current activity.
 *
 * @returns {void}
 */
function updatePageMetadata() {
  if (!activity.value) {
    return
  }

  const title =
      activity.value.title ||
      'Activity | Student Connect'

  const description =
      activity.value.description ||
      'Discover this activity on Student Connect.'

  const image =
      activity.value.posterUrl ||
      `${window.location.origin}/og-image.png`

  const url =
      activityUrl.value

  document.title =
      `${title} | Student Connect`

  setMeta(
      'description',
      description
  )

  setMeta(
      'og:title',
      title,
      'property'
  )

  setMeta(
      'og:description',
      description,
      'property'
  )

  setMeta(
      'og:image',
      image,
      'property'
  )

  setMeta(
      'og:url',
      url,
      'property'
  )

  setMeta(
      'og:type',
      'website',
      'property'
  )

  setMeta(
      'og:site_name',
      'Student Connect',
      'property'
  )

  setMeta(
      'twitter:card',
      'summary_large_image'
  )

  setMeta(
      'twitter:title',
      title
  )

  setMeta(
      'twitter:description',
      description
  )

  setMeta(
      'twitter:image',
      image
  )

  updateStructuredData({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: title,
    description,
    image: [image],
    startDate: toIsoDate(
        activity.value.eventDate
    ),
    maximumAttendeeCapacity:
        hasParticipantsLimit.value
            ? participantsLimit.value
            : undefined,
    location: activity.value.location
        ? {
          '@type': 'Place',
          name: activity.value.location
        }
        : undefined,
    organizer: {
      '@type': 'Person',
      name: organizerName.value
    },
    url
  })
}

/**
 * Creates or updates a meta tag.
 *
 * @param {string} name - Metadata name.
 * @param {string} content - Metadata value.
 * @param {string} attribute - Attribute used to identify the tag.
 * @returns {void}
 */
function setMeta(
    name,
    content,
    attribute = 'name'
) {
  let element =
      document.head.querySelector(
          `meta[${attribute}="${name}"]`
      )

  if (!element) {
    element =
        document.createElement('meta')

    element.setAttribute(
        attribute,
        name
    )

    document.head.appendChild(element)
  }

  element.setAttribute(
      'content',
      content || ''
  )
}

/**
 * Converts a Unix timestamp into an ISO date.
 *
 * @param {number|string} value - Unix timestamp.
 * @returns {string|undefined} ISO date.
 */
function toIsoDate(value) {
  const timestamp = Number(value)

  if (
      !Number.isFinite(timestamp) ||
      timestamp <= 0
  ) {
    return undefined
  }

  return new Date(
      timestamp * 1000
  ).toISOString()
}

/**
 * Creates or updates the activity structured-data script.
 *
 * @param {Object} data - Schema.org Event data.
 * @returns {void}
 */
function updateStructuredData(data) {
  let script =
      document.getElementById(
          'activity-structured-data'
      )

  if (!script) {
    script =
        document.createElement('script')

    script.id =
        'activity-structured-data'

    script.type =
        'application/ld+json'

    document.head.appendChild(script)
  }

  script.textContent =
      JSON.stringify(data)
}

/**
 * Shares the current activity using the native Web Share API
 * when available, otherwise copies the activity URL.
 *
 * @returns {Promise<void>} Resolves after sharing or copying.
 */
async function shareActivity() {
  const title =
      activity.value?.title ||
      'Student Connect Activity'

  const text =
      activity.value?.description
          ? `${title}\n\n${activity.value.description}`
          : title

  try {
    if (
        navigator.share &&
        typeof navigator.share === 'function'
    ) {
      await navigator.share({
        title,
        text,
        url: activityUrl.value
      })

      return
    }

    await navigator.clipboard.writeText(
        activityUrl.value
    )

    ElMessage.success(
        'Activity link copied.'
    )
  } catch (shareError) {
    if (
        shareError?.name ===
        'AbortError'
    ) {
      return
    }

    try {
      await navigator.clipboard.writeText(
          activityUrl.value
      )

      ElMessage.success(
          'Activity link copied.'
      )
    } catch {
      ElMessage.error(
          'Unable to share this activity.'
      )
    }
  }
}

watch(
    () => activity.value,
    () => {
      updatePageMetadata()
    }
)

onMounted(loadActivity)

onUnmounted(() => {
  document.title = 'Student Connect'

  const structuredData =
      document.getElementById(
          'activity-structured-data'
      )

  if (structuredData) {
    structuredData.remove()
  }
})
</script>
