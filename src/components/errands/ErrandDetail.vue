
<!-- components/errands/ErrandDetail.vue -->

<template>
  <div id="errand-detail-container" class="max-w-4xl mx-auto space-y-6">
    <!-- Back & Navigation Bar -->
    <div class="flex items-center justify-between gap-3">
      <button
          id="back-to-errands-btn"
          class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
          type="button"
          @click="navigateTo('/errands')"
      >
        <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>

        <span>Back to Errands</span>
      </button>

      <!-- Header Actions -->
      <div class="flex items-center gap-2">
        <!-- Share Action -->
        <button
            v-if="errand"
            id="share-errand-btn"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-white text-slate-700 hover:bg-slate-50 hover:text-brand-700 transition-colors cursor-pointer border border-slate-200 shadow-xs"
            type="button"
            @click="shareErrand"
        >
          <i class="fi fi-rr-share text-xs"></i>
          <span>Share</span>
        </button>

        <!-- Creator Edit Action -->
        <button
            v-if="canEdit"
            id="edit-errand-detail-btn"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors cursor-pointer border border-brand-200"
            type="button"
            @click="navigateTo(`/errands/edit?id=${errand.id}`)"
        >
          <i class="fi fi-rr-edit text-xs"></i>
          <span>Edit Errand</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div
        v-if="loading"
        id="errand-detail-loading"
        class="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs"
    >
      <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-600 border-t-transparent mb-3"
      ></div>

      <p class="text-sm font-semibold text-slate-600">
        Loading errand details...
      </p>
    </div>

    <!-- Error State -->
    <div
        v-else-if="error || !errand"
        id="errand-detail-error"
        class="bg-white rounded-2xl border border-rose-200 p-10 text-center shadow-xs space-y-4"
    >
      <div
          class="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto"
      >
        <i class="fi fi-rr-exclamation text-2xl"></i>
      </div>

      <div>
        <h3 class="text-lg font-bold text-slate-900 mb-1">
          Errand Not Found
        </h3>

        <p class="text-xs text-slate-500 max-w-md mx-auto">
          {{ error || 'The requested student errand could not be retrieved.' }}
        </p>
      </div>

      <button
          id="view-all-errands-btn"
          class="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
          type="button"
          @click="navigateTo('/errands')"
      >
        View All Errands
      </button>
    </div>

    <!-- Main Detail Card -->
    <div
        v-else
        id="errand-detail-card"
        class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
    >
      <!-- Hero Header -->
      <div
          class="bg-gradient-to-r from-slate-900 to-brand-950 text-white p-6 sm:p-8"
      >
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span
              class="bg-white/10 text-brand-200 border border-white/10 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <i class="fi fi-rr-shopping-bag"></i>
            <span>Student Errand</span>
          </span>

          <span
              :class="[
              'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
              statusBadgeClass
            ]"
          >
            {{ statusLabel }}
          </span>
        </div>

        <h1
            class="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug"
        >
          {{ errand.title }}
        </h1>
      </div>

      <!-- Detail Body -->
      <div class="p-6 sm:p-8 space-y-6">
        <!-- Metadata Info Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div
                class="text-[10px] text-slate-400 uppercase font-bold tracking-wider"
            >
              Location / Venue
            </div>

            <div
                class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5"
            >
              <i class="fi fi-rr-marker text-rose-500"></i>
              <span>{{ errand.location }}</span>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div
                class="text-[10px] text-slate-400 uppercase font-bold tracking-wider"
            >
              Needed By Deadline
            </div>

            <div
                class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5"
            >
              <i class="fi fi-rr-clock-three text-brand-500"></i>
              <span>{{ formatDeadline(errand.deadline) }}</span>
            </div>
          </div>

          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div
                class="text-[10px] text-slate-400 uppercase font-bold tracking-wider"
            >
              Requested By
            </div>

            <div
                class="text-sm font-bold text-slate-800 mt-1 flex items-center gap-1.5"
            >
              <i class="fi fi-rr-user text-brand-500"></i>
              <span>{{ errand.requester?.name || 'Student' }}</span>
            </div>
          </div>
        </div>

        <!-- Description / Instructions -->
        <div class="space-y-2">
          <h3
              class="text-xs font-bold text-slate-400 uppercase tracking-wider"
          >
            Errand Description & Instructions
          </h3>

          <div
              class="bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-line"
          >
            {{ errand.description }}
          </div>
        </div>

        <!-- Requester Status -->
        <div
            v-if="currentStatus === 'open' && isCreator"
            class="bg-brand-50/70 border border-brand-200/80 rounded-xl p-4 flex items-center gap-3"
        >
          <div
              class="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0"
          >
            <i class="fi fi-rr-user"></i>
          </div>

          <div>
            <div class="text-xs font-bold text-brand-900">
              This is your errand
            </div>

            <div class="text-xs text-brand-700 mt-0.5">
              Other students can accept this request. You cannot accept or
              complete your own errand.
            </div>
          </div>
        </div>

        <!-- Accepted Status -->
        <div
            v-else-if="currentStatus === 'accepted'"
            class="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex items-center gap-3"
        >
          <div
              class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0"
          >
            <i class="fi fi-rr-user-check"></i>
          </div>

          <div>
            <div class="text-xs font-bold text-blue-900">
              {{
                isAcceptedByMe
                    ? 'You accepted this errand!'
                    : `Accepted by ${errand.helper?.name || 'a peer'}`
              }}
            </div>

            <div class="text-xs text-blue-700 mt-0.5">
              {{
                isAcceptedByMe
                    ? 'Please assist your peer and mark this completed once finished.'
                    : 'A peer student is currently fulfilling this request.'
              }}
            </div>
          </div>
        </div>

        <!-- Completed Status -->
        <div
            v-else-if="currentStatus === 'completed'"
            class="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-4 flex items-center gap-3"
        >
          <div
              class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0"
          >
            <i class="fi fi-rr-check"></i>
          </div>

          <div>
            <div class="text-xs font-bold text-emerald-900">
              Errand Completed
            </div>

            <div class="text-xs text-emerald-700 mt-0.5">
              This task has been fulfilled successfully. Thank you for
              supporting peer students!
            </div>
          </div>
        </div>

        <!-- Cancelled Status -->
        <div
            v-else-if="currentStatus === 'cancelled'"
            class="bg-rose-50/70 border border-rose-200/80 rounded-xl p-4 flex items-center gap-3"
        >
          <div
              class="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shrink-0"
          >
            <i class="fi fi-rr-cross-circle"></i>
          </div>

          <div>
            <div class="text-xs font-bold text-rose-900">
              Errand Cancelled
            </div>

            <div class="text-xs text-rose-700 mt-0.5">
              This errand is no longer available for fulfillment.
            </div>
          </div>
        </div>

        <!-- Expired Status -->
        <div
            v-else-if="currentStatus === 'expired'"
            class="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-center gap-3"
        >
          <div
              class="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm shrink-0"
          >
            <i class="fi fi-rr-clock"></i>
          </div>

          <div>
            <div class="text-xs font-bold text-amber-900">
              Errand Expired
            </div>

            <div class="text-xs text-amber-700 mt-0.5">
              The deadline for this errand has passed.
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div
            v-if="errand.timeline?.length"
            id="errand-timeline"
            class="space-y-3"
        >
          <div class="flex items-center justify-between">
            <h3
                class="text-xs font-bold text-slate-400 uppercase tracking-wider"
            >
              Activity Timeline
            </h3>

            <span class="text-[10px] font-semibold text-slate-400">
              {{ timelineEvents.length }}
              event{{ timelineEvents.length > 1 ? 's' : '' }}
            </span>
          </div>

          <div
              class="bg-white rounded-2xl border border-slate-200 overflow-hidden"
          >
            <div class="relative px-5 sm:px-6 py-6">
              <div
                  class="absolute left-[39px] sm:left-[43px] top-10 bottom-10 w-px bg-slate-200"
                  aria-hidden="true"
              ></div>

              <div class="relative space-y-7">
                <div
                    v-for="(event, index) in timelineEvents"
                    :key="`${event.type}-${event.timestamp}-${index}`"
                    class="relative flex gap-4 sm:gap-5"
                >
                  <!-- Timeline Node -->
                  <div
                      class="relative z-10 w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-full border-4 border-white flex items-center justify-center shadow-sm"
                      :class="timelineIconClass(event.type)"
                  >
                    <!-- Created -->
                    <svg
                        v-if="event.type === 'created'"
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h6l5 5v11a2 2 0 01-2 2z"
                      />
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M13 3v5h5"
                      />
                    </svg>

                    <!-- Accepted -->
                    <svg
                        v-else-if="event.type === 'accepted'"
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                      />
                      <circle
                          cx="9"
                          cy="7"
                          r="4"
                          stroke-width="2"
                      />
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M16 11l2 2 4-4"
                      />
                    </svg>

                    <!-- Acceptance Cancelled -->
                    <svg
                        v-else-if="event.type === 'acceptance_cancelled'"
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 12a8 8 0 0113.66-5.66L20 8"
                      />
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 4v4h-4"
                      />
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M20 12a8 8 0 01-13.66 5.66L4 16"
                      />
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 20v-4h4"
                      />
                    </svg>

                    <!-- Completed -->
                    <svg
                        v-else-if="event.type === 'completed'"
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M5 13l4 4L19 7"
                      />
                    </svg>

                    <!-- Cancelled -->
                    <svg
                        v-else-if="event.type === 'cancelled'"
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                      <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke-width="2"
                      />
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 9l6 6m0-6l-6 6"
                      />
                    </svg>

                    <!-- Unknown Event -->
                    <svg
                        v-else
                        class="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                      <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke-width="2"
                      />
                      <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 8v4m0 4h.01"
                      />
                    </svg>
                  </div>

                  <!-- Event Content -->
                  <div class="min-w-0 flex-1 -mt-0.5">
                    <div
                        class="border border-slate-100 bg-slate-50/70 px-4 py-3 transition-colors hover:bg-slate-50"
                    >
                      <div
                          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5"
                      >
                        <div class="text-sm font-bold text-slate-800">
                          {{ timelineTitle(event) }}
                        </div>

                        <time
                            class="text-[10px] sm:text-[11px] font-medium text-slate-400 whitespace-nowrap"
                            :datetime="
                            new Date(
                              Number(event.timestamp) * 1000
                            ).toISOString()
                          "
                        >
                          {{ formatTimelineTimestamp(event.timestamp) }}
                        </time>
                      </div>

                      <div class="flex items-center gap-2 mt-2">
                        <div
                            class="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0"
                        >
                          <svg
                              class="w-3.5 h-3.5 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                          >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M20 21a8 8 0 00-16 0"
                            />
                            <circle
                                cx="12"
                                cy="7"
                                r="4"
                                stroke-width="2"
                            />
                          </svg>
                        </div>

                        <div class="flex flex-col">
                          <span class="text-xs font-semibold text-slate-600">
                            {{ event.user?.name || 'Student' }}
                          </span>

                          <span class="text-[10px] text-slate-400">
                            {{ timelineActionLabel(event.type) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Action Buttons -->
        <div
            class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <div class="text-xs text-slate-500">
            Lend a Hand Errand #{{ errand.id }}
          </div>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <!-- Edit button for creator -->
            <button
                v-if="canEdit"
                id="edit-errand-btn"
                class="flex-1 sm:flex-none px-5 py-2.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl font-bold text-xs transition-colors border border-brand-200 cursor-pointer"
                type="button"
                @click="navigateTo(`/errands/edit?id=${errand.id}`)"
            >
              Edit Errand
            </button>

            <!-- Cancel button for creator -->
            <button
                v-if="canCancel"
                id="cancel-errand-detail-btn"
                class="flex-1 sm:flex-none px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs transition-colors border border-rose-200 cursor-pointer"
                type="button"
                :disabled="actionLoading"
                @click="handleCancel"
            >
              Cancel Errand
            </button>

            <!-- Creator cannot accept own errand -->
            <button
                v-if="currentStatus === 'open' && isCreator"
                id="own-errand-detail-btn"
                disabled
                class="w-full sm:w-auto px-8 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2"
                type="button"
            >
              <i class="fi fi-rr-user"></i>
              <span>Your Errand</span>
            </button>

            <!-- Other students can accept -->
            <button
                v-else-if="currentStatus === 'open' && !isCreator"
                id="accept-errand-detail-btn"
                :disabled="actionLoading"
                class="w-full sm:w-auto px-8 py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                type="button"
                @click="handleAccept"
            >
              <i class="fi fi-rr-hand-holding-heart"></i>

              <span>
                {{ actionLoading ? 'Accepting...' : 'Accept & Fulfill Errand' }}
              </span>
            </button>

            <!-- Helper can complete -->
            <button
                v-else-if="
                currentStatus === 'accepted' &&
                isAcceptedByMe &&
                !isCreator
              "
                id="complete-errand-detail-btn"
                :disabled="actionLoading"
                class="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                type="button"
                @click="handleComplete"
            >
              <i class="fi fi-rr-check text-sm"></i>

              <span>
                {{ actionLoading ? 'Completing...' : 'Mark as Completed' }}
              </span>
            </button>

            <!-- Helper can release the errand -->
            <button
                v-if="
                currentStatus === 'accepted' &&
                isAcceptedByMe &&
                !isCreator
              "
                id="cancel-acceptance-detail-btn"
                :disabled="actionLoading"
                class="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white disabled:text-slate-400 rounded-xl font-bold text-xs border border-rose-200 disabled:border-slate-200 shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                type="button"
                @click="handleCancelAcceptance"
            >
              <svg
                  class="w-4 h-4 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
              >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 6l12 12M6 18L18 6"
                />
              </svg>

              <span>
                {{ actionLoading ? 'Releasing...' : 'Release Errand' }}
              </span>
            </button>

            <!-- Requester / other users see progress -->
            <button
                v-else-if="currentStatus === 'accepted'"
                id="errand-in-progress-detail-btn"
                disabled
                class="w-full sm:w-auto px-8 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2"
                type="button"
            >
              <i class="fi fi-rr-hourglass-end"></i>
              <span>In Progress</span>
            </button>

            <!-- Completed -->
            <button
                v-else-if="currentStatus === 'completed'"
                id="completed-errand-detail-btn"
                disabled
                class="w-full sm:w-auto px-8 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2"
                type="button"
            >
              <i class="fi fi-rr-check text-emerald-500"></i>
              <span>Completed</span>
            </button>

            <!-- Cancelled -->
            <button
                v-else-if="currentStatus === 'cancelled'"
                id="cancelled-errand-detail-btn"
                disabled
                class="w-full sm:w-auto px-8 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2"
                type="button"
            >
              <i class="fi fi-rr-cross-circle"></i>
              <span>Cancelled</span>
            </button>

            <!-- Expired -->
            <button
                v-else-if="currentStatus === 'expired'"
                id="expired-errand-detail-btn"
                disabled
                class="w-full sm:w-auto px-8 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed flex items-center justify-center gap-2"
                type="button"
            >
              <i class="fi fi-rr-clock"></i>
              <span>Expired</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onUnmounted
} from 'vue'
import { useRouter } from 'vue-router'
import {
  ElMessage,
  ElMessageBox
} from 'element-plus'
import studentConnect from '@/api'

const props = defineProps({
  errandId: {
    type: String,
    required: true
  },

  currentUser: {
    type: Object,
    default: () => ({
      id: '',
      name: 'Student'
    })
  }
})

const router = useRouter()

const errand = ref(null)
const loading = ref(true)
const error = ref('')
const actionLoading = ref(false)

/**
 * Creates or updates a meta tag in the document head.
 *
 * @param {string} key - Meta tag name or property.
 * @param {string} content - Meta tag content.
 * @param {string} attribute - Attribute used to identify the meta tag.
 * @returns {void} Updates the corresponding meta element.
 */
function setMeta(
    key,
    content,
    attribute = 'name'
) {
  let meta = document.head.querySelector(
      `meta[${attribute}="${key}"]`
  )

  if (!meta) {
    meta = document.createElement('meta')

    meta.setAttribute(
        attribute,
        key
    )

    document.head.appendChild(meta)
  }

  meta.setAttribute(
      'content',
      content
  )
}

/**
 * Creates or updates the canonical link for the current page.
 *
 * @param {string} url - Canonical page URL.
 * @returns {void} Updates the canonical link element.
 */
function setCanonicalUrl(url) {
  let link = document.head.querySelector(
      'link[data-student-connect-canonical="true"]'
  )

  if (!link) {
    link = document.createElement('link')

    link.setAttribute(
        'rel',
        'canonical'
    )

    link.setAttribute(
        'data-student-connect-canonical',
        'true'
    )

    document.head.appendChild(link)
  }

  link.setAttribute(
      'href',
      url
  )
}

/**
 * Updates document and social sharing metadata for the current errand.
 *
 * @returns {void} Updates the document title and relevant meta tags.
 */
function updatePageMetadata() {
  if (!errand.value) {
    return
  }

  const origin = window.location.origin

  const url =
      `${origin}/errands?id=${encodeURIComponent(
          errand.value.id
      )}`

  const titleText =
      String(
          errand.value.title ||
          'Student Errand'
      ).trim()

  const location =
      String(
          errand.value.location ||
          'campus'
      ).trim()

  const descriptionText =
      String(
          errand.value.description ||
          ''
      )
          .replace(/\s+/g, ' ')
          .trim()

  const description =
      descriptionText
          ? `Student errand at ${location}: ${descriptionText}`
          : `A student errand request at ${location}.`

  const title =
      `${titleText} | Lend a Hand`

  document.title = title

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
      'Lend a Hand',
      'property'
  )

  setMeta(
      'twitter:card',
      'summary'
  )

  setMeta(
      'twitter:title',
      title
  )

  setMeta(
      'twitter:description',
      description
  )

  setCanonicalUrl(url)
}

/**
 * Restores the default Lend a Hand metadata.
 *
 * @returns {void} Restores default page metadata.
 */
function resetPageMetadata() {
  document.title = 'Lend a Hand'

  setMeta(
      'description',
      'Lend a Hand helps students connect, share rides, and discover campus services.'
  )

  setMeta(
      'og:title',
      'Lend a Hand',
      'property'
  )

  setMeta(
      'og:description',
      'Connect with students and discover campus services.',
      'property'
  )

  setMeta(
      'og:url',
      window.location.origin,
      'property'
  )

  setMeta(
      'og:type',
      'website',
      'property'
  )

  setMeta(
      'og:site_name',
      'Lend a Hand',
      'property'
  )

  setMeta(
      'twitter:card',
      'summary'
  )

  setMeta(
      'twitter:title',
      'Lend a Hand'
  )

  setMeta(
      'twitter:description',
      'Connect with students and discover campus services.'
  )

  setCanonicalUrl(
      window.location.origin
  )
}

/**
 * Shares the current errand using the Web Share API.
 *
 * Falls back to copying the current errand URL to the clipboard
 * when native sharing is unavailable.
 *
 * @returns {Promise<void>}
 */
async function shareErrand() {
  if (!errand.value) {
    return
  }

  const url =
      `${window.location.origin}/errands?id=${encodeURIComponent(
          errand.value.id
      )}`

  const title =
      String(
          errand.value.title ||
          'Student Errand'
      ).trim()

  const description =
      String(
          errand.value.description ||
          'Check out this student errand on Lend a Hand.'
      )
          .replace(/\s+/g, ' ')
          .trim()

  try {
    if (
        typeof navigator.share === 'function'
    ) {
      await navigator.share({
        title,
        text: description,
        url
      })

      return
    }

    if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === 'function'
    ) {
      await navigator.clipboard.writeText(url)

      ElMessage.success(
          'Errand link copied to clipboard.'
      )

      return
    }

    throw new Error(
        'Sharing is not supported on this device.'
    )
  } catch (err) {
    if (
        err?.name === 'AbortError'
    ) {
      return
    }

    try {
      if (
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === 'function'
      ) {
        await navigator.clipboard.writeText(url)

        ElMessage.success(
            'Errand link copied to clipboard.'
        )

        return
      }
    } catch {
      // Continue to the final error message.
    }

    ElMessage.error(
        err?.message ||
        'Unable to share this errand.'
    )
  }
}

/**
 * Returns a short action description for a timeline event.
 *
 * @param {string} type - Timeline event type.
 * @returns {string} Short event action label.
 */
function timelineActionLabel(type) {
  switch (type) {
    case 'created':
      return 'posted the errand'

    case 'accepted':
      return 'accepted the request'

    case 'acceptance_cancelled':
      return 'released the request'

    case 'completed':
      return 'completed the errand'

    case 'cancelled':
      return 'cancelled the errand'

    default:
      return 'updated the errand'
  }
}

/**
 * Determines whether the current authenticated student
 * is the requester who created the errand.
 *
 * @returns {boolean} True when the current user is the requester.
 */
const isCreator = computed(() => {
  if (
      !errand.value?.requester?.id ||
      !props.currentUser?.id
  ) {
    return false
  }

  return (
      errand.value.requester.id ===
      props.currentUser.id
  )
})

/**
 * Determines whether the current authenticated student
 * is the helper currently assigned to the errand.
 *
 * @returns {boolean} True when the current user is the helper.
 */
const isAcceptedByMe = computed(() => {
  if (
      !errand.value?.helper?.id ||
      !props.currentUser?.id
  ) {
    return false
  }

  return (
      errand.value.helper.id ===
      props.currentUser.id
  )
})

/**
 * Determines whether the current student is allowed to edit
 * the current errand.
 *
 * Only the requester may edit an open errand.
 *
 * @returns {boolean} True when the errand can be edited.
 */
const canEdit = computed(() => {
  return Boolean(
      isCreator.value &&
      currentStatus.value === 'open'
  )
})

/**
 * Returns the normalized backend-aligned errand status.
 *
 * @returns {string} open, accepted, completed, cancelled, or expired.
 */
const currentStatus = computed(() => {
  const status = String(
      errand.value?.status || ''
  ).toLowerCase()

  if (
      [
        'accepted',
        'completed',
        'cancelled',
        'expired'
      ].includes(status)
  ) {
    return status
  }

  const deadline = Number(
      errand.value?.deadline
  )

  return (
      Number.isFinite(deadline) &&
      deadline > 0 &&
      Date.now() >= deadline * 1000
  )
      ? 'expired'
      : 'open'
})

/**
 * Determines whether the requester may cancel the errand.
 *
 * @returns {boolean} True while the errand is open or accepted.
 */
const canCancel = computed(() => {
  return (
      isCreator.value &&
      ['open', 'accepted'].includes(
          currentStatus.value
      )
  )
})

/**
 * Returns a human-readable label for the current errand status.
 *
 * @returns {string} Status label.
 */
const statusLabel = computed(() => {
  switch (currentStatus.value) {
    case 'accepted':
      return 'In Progress / Accepted'

    case 'completed':
      return 'Completed'

    case 'cancelled':
      return 'Cancelled'

    case 'expired':
      return 'Expired'

    case 'open':
    default:
      return 'Available for Help'
  }
})

/**
 * Returns the CSS classes used by the status badge.
 *
 * @returns {string} Tailwind CSS class list.
 */
const statusBadgeClass = computed(() => {
  switch (currentStatus.value) {
    case 'completed':
      return 'bg-slate-700 text-slate-300'

    case 'cancelled':
      return 'bg-rose-500/20 text-rose-300 border border-rose-400/30'

    case 'expired':
      return 'bg-amber-500/20 text-amber-300 border border-amber-400/30'

    case 'accepted':
      return 'bg-blue-500/20 text-blue-300 border border-blue-400/30'

    case 'open':
    default:
      return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
  }
})

/**
 * Returns the errand timeline sorted chronologically.
 *
 * The backend is the source of truth for timeline events.
 *
 * @returns {Array<Object>} Chronologically ordered timeline events.
 */
const timelineEvents = computed(() => {
  if (!Array.isArray(errand.value?.timeline)) {
    return []
  }

  return [...errand.value.timeline].sort(
      (a, b) =>
          Number(a.timestamp || 0) -
          Number(b.timestamp || 0)
  )
})

/**
 * Loads the errand details by ID.
 *
 * @param {string} id - Unique errand identifier.
 * @returns {Promise<void>}
 */
async function fetchErrandDetails(id) {
  if (!id) {
    error.value = 'No errand ID provided.'
    errand.value = null
    loading.value = false
    resetPageMetadata()

    return
  }

  loading.value = true
  error.value = ''

  try {
    const res =
        await studentConnect.getErrand(id)

    if (!res?.success) {
      throw new Error(
          res?.message ||
          'Failed to load errand details'
      )
    }

    errand.value =
        res.data || null

    if (!errand.value) {
      throw new Error(
          res?.message ||
          'The requested student errand could not be retrieved.'
      )
    }

    updatePageMetadata()
  } catch (err) {
    errand.value = null

    error.value =
        err?.message ||
        'Failed to load errand details'

    resetPageMetadata()

    ElMessage.error(
        error.value
    )
  } finally {
    loading.value = false
  }
}

watch(
    () => props.errandId,
    (newId) => {
      fetchErrandDetails(newId)
    },
    {
      immediate: true
    }
)

/**
 * Navigates to a target application route.
 *
 * @param {string} path - Target route path.
 * @returns {void}
 */
function navigateTo(path) {
  router.push(path)
}

/**
 * Accepts the current errand as the authenticated helper.
 *
 * @returns {Promise<void>}
 */
async function handleAccept() {
  if (
      !errand.value ||
      actionLoading.value
  ) {
    return
  }

  if (isCreator.value) {
    ElMessage.warning(
        'You cannot accept your own errand.'
    )

    return
  }

  if (currentStatus.value !== 'open') {
    ElMessage.warning(
        'This errand is no longer available.'
    )

    return
  }

  actionLoading.value = true

  try {
    const res =
        await studentConnect.acceptErrand(
            errand.value.id
        )

    errand.value =
        res.data || res

    updatePageMetadata()

    ElMessage.success(
        'You accepted this errand! Thank you for helping a peer.'
    )
  } catch (err) {
    ElMessage.error(
        err?.message ||
        'Could not accept errand'
    )
  } finally {
    actionLoading.value = false
  }
}

/**
 * Marks the current errand as completed by the assigned helper.
 *
 * @returns {Promise<void>}
 */
async function handleComplete() {
  if (
      !errand.value ||
      actionLoading.value
  ) {
    return
  }

  if (isCreator.value) {
    ElMessage.warning(
        'You cannot complete your own errand.'
    )

    return
  }

  if (!isAcceptedByMe.value) {
    ElMessage.warning(
        'Only the assigned helper can complete this errand.'
    )

    return
  }

  if (currentStatus.value !== 'accepted') {
    ElMessage.warning(
        'This errand is no longer in progress.'
    )

    return
  }

  try {
    await ElMessageBox.confirm(
        'Mark this errand as completed? This action will be recorded in the activity timeline.',
        'Complete Errand',
        {
          confirmButtonText: 'Mark Completed',
          cancelButtonText: 'Cancel',
          type: 'success'
        }
    )
  } catch {
    return
  }

  actionLoading.value = true

  try {
    const res =
        await studentConnect.completeErrand(
            errand.value.id
        )

    errand.value =
        res.data || res

    updatePageMetadata()

    ElMessage.success(
        'Errand marked as completed! Great job.'
    )
  } catch (err) {
    ElMessage.error(
        err?.message ||
        'Could not complete errand'
    )
  } finally {
    actionLoading.value = false
  }
}

/**
 * Cancels the current errand as its requester.
 *
 * @returns {Promise<void>} Resolves after cancellation or user dismissal.
 */
async function handleCancel() {
  if (
      !errand.value ||
      actionLoading.value ||
      !canCancel.value
  ) {
    return
  }

  try {
    await ElMessageBox.confirm(
        'Cancel this errand? This action cannot be undone.',
        'Cancel Errand',
        {
          confirmButtonText: 'Cancel Errand',
          cancelButtonText: 'Keep',
          type: 'warning'
        }
    )
  } catch {
    return
  }

  actionLoading.value = true

  try {
    const response =
        await studentConnect.cancelErrand(
            errand.value.id
        )

    errand.value =
        response?.data ??
        response

    updatePageMetadata()

    ElMessage.success(
        'Errand cancelled.'
    )
  } catch (error) {
    ElMessage.error(
        error?.message ||
        'Could not cancel errand.'
    )
  } finally {
    actionLoading.value = false
  }
}

/**
 * Releases the current helper's acceptance of the errand.
 *
 * @returns {Promise<void>}
 */
async function handleCancelAcceptance() {
  if (
      !errand.value ||
      actionLoading.value
  ) {
    return
  }

  if (!isAcceptedByMe.value) {
    ElMessage.warning(
        'Only the assigned helper can release this errand.'
    )

    return
  }

  if (currentStatus.value !== 'accepted') {
    ElMessage.warning(
        'This errand is no longer in progress.'
    )

    return
  }

  try {
    await ElMessageBox.confirm(
        'Release this errand? It will become available for another student to accept.',
        'Release Errand',
        {
          confirmButtonText: 'Release',
          cancelButtonText: 'Keep',
          type: 'warning'
        }
    )
  } catch {
    return
  }

  actionLoading.value = true

  try {
    const res =
        await studentConnect.cancelErrandAcceptance(
            errand.value.id
        )

    errand.value =
        res.data || res

    updatePageMetadata()

    ElMessage.success(
        'You released the errand. It is available for another student.'
    )
  } catch (err) {
    ElMessage.error(
        err?.message ||
        'Could not release errand'
    )
  } finally {
    actionLoading.value = false
  }
}

/**
 * Formats a Unix timestamp into a local date and time.
 *
 * @param {number|string} timestamp - Unix timestamp in seconds.
 * @returns {string} Formatted local date and time.
 */
function formatDeadline(timestamp) {
  const numericTimestamp =
      Number(timestamp)

  if (
      !Number.isFinite(numericTimestamp) ||
      numericTimestamp <= 0
  ) {
    return 'No deadline'
  }

  const date =
      new Date(
          numericTimestamp * 1000
      )

  if (Number.isNaN(date.getTime())) {
    return 'Invalid deadline'
  }

  return date.toLocaleString(
      'en-GB',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
  )
}

/**
 * Formats a timeline event timestamp for display.
 *
 * @param {number|string} timestamp - Unix timestamp in seconds.
 * @returns {string} Formatted local timestamp.
 */
function formatTimelineTimestamp(timestamp) {
  const numericTimestamp =
      Number(timestamp)

  if (
      !Number.isFinite(numericTimestamp) ||
      numericTimestamp <= 0
  ) {
    return 'Unknown time'
  }

  const date =
      new Date(
          numericTimestamp * 1000
      )

  if (Number.isNaN(date.getTime())) {
    return 'Unknown time'
  }

  return date.toLocaleString(
      'en-GB',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
  )
}

/**
 * Returns the human-readable description of a timeline event.
 *
 * @param {Object} event - Timeline event object.
 * @returns {string} Timeline event description.
 */
function timelineTitle(event) {
  switch (event?.type) {
    case 'created':
      return 'Errand created'

    case 'accepted':
      return 'Errand accepted'

    case 'acceptance_cancelled':
      return 'Acceptance released'

    case 'completed':
      return 'Errand completed'

    case 'cancelled':
      return 'Errand cancelled'

    default:
      return 'Errand updated'
  }
}

/**
 * Returns the Flaticon icon class for a timeline event.
 *
 * @param {string} type - Timeline event type.
 * @returns {string} Flaticon class name.
 */
function timelineIcon(type) {
  switch (type) {
    case 'created':
      return 'fi fi-rr-document'

    case 'accepted':
      return 'fi fi-rr-user-check'

    case 'acceptance_cancelled':
      return 'fi fi-rr-rotate-left'

    case 'completed':
      return 'fi fi-rr-check'

    case 'cancelled':
      return 'fi fi-rr-cross-circle'

    default:
      return 'fi fi-rr-time-past'
  }
}

/**
 * Returns Tailwind classes for a timeline event indicator.
 *
 * @param {string} type - Timeline event type.
 * @returns {string} Tailwind CSS class list.
 */
function timelineIconClass(type) {
  switch (type) {
    case 'accepted':
      return 'bg-blue-100 text-blue-700'

    case 'completed':
      return 'bg-emerald-100 text-emerald-700'

    case 'cancelled':
      return 'bg-rose-100 text-rose-700'

    case 'acceptance_cancelled':
      return 'bg-amber-100 text-amber-700'

    case 'created':
    default:
      return 'bg-brand-100 text-brand-700'
  }
}

onUnmounted(() => {
  resetPageMetadata()
})
</script>
