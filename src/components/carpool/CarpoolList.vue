<!-- components/carpool/CarpoolList.vue -->
<template>
  <div id="carpool-list-container">
    <!-- List of Carpools with 3-column grid -->
    <div
        v-if="carpools.length > 0"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <CarpoolCard
          id="carpool-card"
          v-for="carpool in carpools"
          :key="carpool.id"
          :carpool="carpool"
          :current-user="currentUser"
          @join="handleJoin"
          @leave="handleLeave"
          @edit="handleEdit"
          @select="handleSelect"
      />

      <!-- Prompt card to create a new ride -->
      <div
          v-if="showCreatePrompt"
          class="bg-white rounded-2xl p-6 border-2 border-dashed border-slate-200 shadow-xs flex flex-col justify-between bg-slate-50/50 group hover:border-brand-300 transition-all min-h-[220px]"
      >
        <div
            class="flex-1 flex flex-col items-center justify-center text-center space-y-4"
        >
          <div
              class="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xs border border-slate-100 group-hover:scale-110 transition-transform"
          >
            <svg
                class="w-7 h-7 text-brand-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
              <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
              />
            </svg>
          </div>

          <div class="space-y-1">
            <h3 class="font-bold text-slate-800 text-base">
              Heading somewhere else?
            </h3>

            <p
                class="text-xs text-slate-500 max-w-[200px] leading-relaxed"
            >
              Create your own carpool and let others join you.
            </p>
          </div>

          <button
              id="prompt-create-carpool-btn"
              type="button"
              class="text-brand-600 font-bold text-sm hover:underline underline-offset-4 cursor-pointer"
              @click="handleOpenCreate"
          >
            Start a new group
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
        v-else
        id="carpool-empty-state"
        class="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center my-6 shadow-xs"
    >
      <div
          class="w-16 h-16 mx-auto mb-4 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center"
      >
        <svg
            class="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      </div>

      <h3 class="text-lg font-bold text-slate-800 mb-1">
        No carpools found
      </h3>

      <p
          class="text-sm text-slate-500 max-w-md mx-auto mb-6"
      >
        No rides match your search right now. Create the first
        carpool to connect with fellow students!
      </p>

      <button
          id="empty-create-carpool-btn"
          type="button"
          class="bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
          @click="handleOpenCreate"
      >
        Create First Carpool
      </button>
    </div>
  </div>
</template>

<script setup>
import CarpoolCard from './CarpoolCard.vue'

defineProps({
  /**
   * Collection of carpool resources returned by the API.
   *
   * Each carpool is expected to use the latest Student Connect
   * resource structure, including a backend-generated id.
   */
  carpools: {
    type: Array,
    default: () => []
  },

  /**
   * Currently signed-in demo/authenticated student.
   *
   * The ID is compared against the owner ID and participant IDs
   * by CarpoolCard.
   */
  currentUser: {
    type: Object,
    required: true
  },

  showCreatePrompt: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'join',
  'leave',
  'open-create',
  'edit',
  'select'
])

/**
 * Forwards a request to join a carpool to the parent view.
 *
 * The component does not modify the carpool or generate an ID.
 * The parent is responsible for calling the API and refreshing
 * the resource after the operation succeeds.
 *
 * @param {string} id - Backend-generated carpool resource identifier.
 * @returns {void} Emits the join event.
 */
function handleJoin(id) {
  emit('join', id)
}

/**
 * Forwards a request to leave a carpool to the parent view.
 *
 * The component does not modify local carpool membership.
 * The parent is responsible for calling the API and refreshing
 * the resource after the operation succeeds.
 *
 * @param {string} id - Backend-generated carpool resource identifier.
 * @returns {void} Emits the leave event.
 */
function handleLeave(id) {
  emit('leave', id)
}

/**
 * Forwards a request to edit a carpool to the parent view.
 *
 * The complete carpool resource is forwarded so the parent can
 * navigate to the edit page using its backend-generated ID.
 *
 * @param {Object} carpool - Carpool resource selected for editing.
 * @returns {void} Emits the edit event.
 */
function handleEdit(carpool) {
  emit('edit', carpool)
}

/**
 * Forwards a request to open a carpool detail page.
 *
 * The parent handles navigation to /carpool?id=<id>.
 *
 * @param {string} id - Backend-generated carpool resource identifier.
 * @returns {void} Emits the select event.
 */
function handleSelect(id) {
  emit('select', id)
}

/**
 * Requests navigation to the carpool creation page.
 *
 * The parent handles navigation to /carpool/new.
 *
 * @returns {void} Emits the open-create event.
 */
function handleOpenCreate() {
  emit('open-create')
}
</script>
