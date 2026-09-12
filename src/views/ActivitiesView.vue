<template>
  <ActivitiesDetail
      v-if="activityId"
      :activity-id="activityId"
      :current-user="currentUser"
      @back="clearSelection"
      @edit="navigateToEdit"
      @delete="deleteSelectedActivity"
  />

  <div v-else class="space-y-8">
    <header class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Activities</h1>
        <p class="text-sm text-slate-500 sm:text-base">Discover co-curricular events, competitions, and opportunities.</p>
      </div>
      <button class="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700" @click="navigateToCreate">
        <i class="fi fi-rr-plus"></i>
        Promote Activity
      </button>
    </header>

    <div v-if="loading" class="flex justify-center py-16 text-sm font-semibold text-slate-500">Loading activities...</div>
    <div v-else-if="loadError" class="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
      <p class="text-sm font-semibold text-rose-700">{{ loadError }}</p>
      <button class="mt-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white" @click="loadActivities">Try Again</button>
    </div>
    <div v-else class="space-y-10">
      <section>
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Currently Active</h2>
            <p class="text-xs text-slate-500">Open opportunities for students to discover.</p>
          </div>
          <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{{ activeActivities.length }}</span>
        </div>
        <ActivitiesList :activities="activeActivities" :current-user="currentUser" @select="selectActivity" @open-create="navigateToCreate" />
      </section>

      <section>
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Archive</h2>
            <p class="text-xs text-slate-500">Inactive activities from the last 3 days.</p>
          </div>
          <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{{ archivedActivities.length }}</span>
        </div>
        <ActivitiesList
            v-if="archivedActivities.length"
            :activities="archivedActivities"
            :current-user="currentUser"
            :show-create-prompt="false"
            @select="selectActivity"
        />
        <p v-else class="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">No inactive activities from the last 3 days.</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import studentConnect from '@/api'
import { user } from '@/services/auth'
import ActivitiesList from '@/components/activities/ActivitiesList.vue'
import ActivitiesDetail from '@/components/activities/ActivitiesDetail.vue'

const route = useRoute()
const router = useRouter()
const activities = ref([])
const loading = ref(false)
const loadError = ref('')
const now = ref(Math.floor(Date.now() / 1000))
let timeInterval = null

const currentUser = computed(() => ({
  id: String(user.value?.uid || ''),
  name: user.value?.displayName || user.value?.email || 'Student'
}))

const activityId = computed(() => route.query.id ? String(route.query.id) : '')
const activeActivities = computed(() => activities.value.filter((activity) => getStatus(activity) === 'open'))
const archivedActivities = computed(() => activities.value
  .filter((activity) => getStatus(activity) !== 'open' && now.value - getTimestamp(activity.updatedAt || activity.createdAt) <= 72 * 60 * 60)
  .sort((left, right) => getTimestamp(right.updatedAt || right.createdAt) - getTimestamp(left.updatedAt || left.createdAt)))

/**
 * Converts common API timestamp formats into Unix seconds.
 *
 * @param {*} value - Timestamp value from the API.
 * @returns {number} Unix timestamp or zero.
 */
function getTimestamp(value) {
  if (typeof value === 'number') return value > 100000000000 ? Math.floor(value / 1000) : value
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const numericValue = Number(value)
    return numericValue > 100000000000 ? Math.floor(numericValue / 1000) : numericValue
  }
  const parsed = Date.parse(value || '')
  return Number.isNaN(parsed) ? 0 : Math.floor(parsed / 1000)
}

/**
 * Derives the activity lifecycle status without overriding terminal statuses.
 *
 * @param {Object} activity - Activity record.
 * @returns {string} Status key.
 */
function getStatus(activity) {
  const explicit = String(activity?.status || '').toLowerCase()
  if (['cancelled', 'completed'].includes(explicit)) return explicit
  const registrationDeadline = getTimestamp(activity?.registrationDeadline)
  const eventDate = getTimestamp(activity?.eventDate)
  return (registrationDeadline > 0 && registrationDeadline <= now.value) ||
    (eventDate > 0 && eventDate <= now.value) ? 'expired' : 'open'
}

/**
 * Loads all activities from the shared API client.
 *
 * @returns {Promise<void>} Resolves after the request completes.
 */
async function loadActivities() {
  loading.value = true
  loadError.value = ''
  try {
    const response = await studentConnect.getAllActivities()
    const data = response?.data
    activities.value = Array.isArray(data) ? data : Array.isArray(data?.activities) ? data.activities : []
  } catch (error) {
    loadError.value = error.message || 'Unable to load activities.'
  } finally {
    loading.value = false
  }
}

/**
 * Opens the activity creation route.
 *
 * @returns {Promise<void>} Resolves after navigation.
 */
function navigateToCreate() {
  return router.push('/activities/new')
}

/**
 * Opens one activity detail route.
 *
 * @param {string} id - Activity identifier.
 * @returns {Promise<void>} Resolves after navigation.
 */
function selectActivity(id) {
  return router.push({ path: '/activities', query: { id } })
}

/**
 * Clears the selected detail resource.
 *
 * @returns {Promise<void>} Resolves after navigation.
 */
function clearSelection() {
  return router.push('/activities')
}

/**
 * Opens the edit route for an owned activity.
 *
 * @param {string} id - Activity identifier.
 * @returns {Promise<void>} Resolves after navigation.
 */
function navigateToEdit(id) {
  return router.push({ path: '/activities/edit', query: { id } })
}

/**
 * Confirms and deletes an activity through the API.
 *
 * @param {string} id - Activity identifier.
 * @returns {Promise<void>} Resolves after deletion.
 */
async function deleteSelectedActivity(id) {
  try {
    await ElMessageBox.confirm('Delete this activity announcement?', 'Delete Activity', {
      type: 'warning',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    })
    await studentConnect.deleteActivity(id)
    ElMessage.success('Activity deleted.')
    await loadActivities()
    await clearSelection()
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(error.message || 'Unable to delete activity.')
  }
}

onMounted(() => {
  loadActivities()
  timeInterval = window.setInterval(() => { now.value = Math.floor(Date.now() / 1000) }, 60000)
})

onUnmounted(() => {
  if (timeInterval) window.clearInterval(timeInterval)
})
</script>
