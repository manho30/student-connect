<template>
  <div class="min-h-full bg-slate-50">
    <div class="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">

      <!-- ========================================================= -->
      <!-- Header -->
      <!-- ========================================================= -->
      <header
          class="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center lg:justify-between"
      >
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span
                class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50"
            >
              <i class="fi fi-rr-chart-histogram text-sm text-brand-600"></i>
            </span>

            <p
                class="text-xs font-bold uppercase tracking-[0.16em] text-brand-600"
            >
              Analytics
            </p>
          </div>

          <h1
              class="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
          >
            Statistics
          </h1>

          <p class="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
            Monitor platform activity, service performance and student
            engagement.
          </p>
        </div>

        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <el-select
              v-model="selectedPeriod"
              class="statistics-period w-full sm:w-[125px]"
              :disabled="loading"
          >
            <el-option
                v-for="option in periodOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
            />
          </el-select>

          <el-button
              class="statistics-refresh"
              :loading="loading"
              :disabled="loading"
              @click="loadStatistics"
          >
            <i
                v-if="!loading"
                class="fi fi-rr-refresh mr-1.5"
            ></i>

            Refresh
          </el-button>
        </div>
      </header>

      <!-- ========================================================= -->
      <!-- Error -->
      <!-- ========================================================= -->
      <div
          v-if="errorMessage"
          class="rounded-2xl bg-white p-8 text-center shadow-sm"
      >
        <div
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50"
        >
          <i class="fi fi-rr-exclamation text-lg text-rose-500"></i>
        </div>

        <h2 class="mt-4 text-sm font-semibold text-slate-900">
          Unable to load statistics
        </h2>

        <p class="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
          There was a problem retrieving the latest analytics data.
          Please try again.
        </p>

        <el-button
            class="mt-5"
            @click="loadStatistics"
        >
          <i class="fi fi-rr-refresh mr-1.5"></i>
          Try again
        </el-button>
      </div>

      <template v-else>

        <!-- ========================================================= -->
        <!-- Platform Overview -->
        <!-- ========================================================= -->
        <section>
          <div class="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 class="text-sm font-bold text-slate-900">
                Platform overview
              </h2>

              <p class="mt-0.5 text-xs text-slate-500">
                {{ periodLabel }} activity
              </p>
            </div>

            <span
                v-if="!loading"
                class="hidden text-[11px] font-medium text-slate-400 sm:block"
            >
              Updated for selected period
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
            <template v-if="loading">
              <div
                  v-for="item in 6"
                  :key="item"
                  class="h-[126px] animate-pulse rounded-2xl bg-white shadow-sm"
              ></div>
            </template>

            <template v-else>
              <article
                  v-for="item in overviewMetrics"
                  :key="item.label"
                  class="rounded-2xl bg-white p-4 shadow-sm"
              >
                <div class="flex items-start justify-between gap-3">
                  <span
                      class="text-[11px] font-semibold leading-4 text-slate-500"
                  >
                    {{ item.label }}
                  </span>

                  <div
                      class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      :class="item.iconBackground"
                  >
                    <i
                        class="fi text-sm"
                        :class="[item.icon, item.iconColor]"
                    ></i>
                  </div>
                </div>

                <div class="mt-4">
                  <p
                      class="text-2xl font-bold tracking-tight text-slate-900"
                  >
                    {{ item.value }}
                  </p>

                  <p
                      v-if="item.description"
                      class="mt-1 text-[10px] leading-4 text-slate-400"
                  >
                    {{ item.description }}
                  </p>
                </div>
              </article>
            </template>
          </div>
        </section>

        <!-- ========================================================= -->
        <!-- Activity Trend -->
        <!-- ========================================================= -->
        <section
            class="overflow-hidden rounded-2xl bg-white shadow-sm"
        >
          <div
              class="px-5 py-4 sm:px-6"
          >
            <div
                class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-base font-bold text-slate-900">
                    Activity trend
                  </h2>

                  <span
                      class="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-slate-500"
                  >
                    Daily
                  </span>
                </div>

                <p class="mt-1 text-xs text-slate-500">
                  New platform activity over the selected period.
                </p>
              </div>

              <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
                <div
                    v-for="series in trendSeries"
                    :key="series.key"
                    class="flex items-center gap-1.5"
                >
                  <span
                      class="h-1.5 w-1.5 rounded-full"
                      :style="{ backgroundColor: series.color }"
                  ></span>

                  <span class="text-[10px] font-medium text-slate-500">
                    {{ series.label }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Trend summary -->
          <div class="px-5 pb-4 sm:px-6">
            <div
                class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6"
            >
              <div
                  v-for="summary in trendSummary"
                  :key="summary.key"
                  class="rounded-xl bg-slate-50 px-3 py-2.5"
              >
                <div class="flex items-center gap-1.5">
                  <span
                      class="h-1.5 w-1.5 rounded-full"
                      :style="{ backgroundColor: summary.color }"
                  ></span>

                  <p class="text-[10px] font-medium text-slate-500">
                    {{ summary.label }}
                  </p>
                </div>

                <p
                    class="mt-1 text-base font-bold tracking-tight text-slate-900"
                >
                  {{ formatCount(summary.value) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Chart -->
          <div class="px-3 pb-5 pt-1 sm:px-5">
            <div
                v-if="loading"
                class="h-[230px] w-full animate-pulse rounded-xl bg-slate-50"
            ></div>

            <div
                v-else-if="trendData.length === 0"
                class="flex h-[230px] items-center justify-center rounded-xl bg-slate-50"
            >
              <div class="text-center">
                <div
                    class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm"
                >
                  <i
                      class="fi fi-rr-chart-line-up text-sm text-slate-400"
                  ></i>
                </div>

                <p class="mt-3 text-xs font-semibold text-slate-700">
                  No trend data
                </p>

                <p class="mt-1 text-[10px] text-slate-400">
                  Activity will appear here when available.
                </p>
              </div>
            </div>

            <div
                v-else
                ref="chartWrapper"
                class="relative h-[230px] w-full overflow-hidden"
            >
              <canvas
                  ref="chartCanvas"
                  role="img"
                  aria-label="Student Connect activity trend chart"
                  class="block h-full w-full"
                  @mousemove="handleChartMouseMove"
                  @mouseleave="handleChartMouseLeave"
              ></canvas>

              <!-- Tooltip -->
              <div
                  v-if="hoveredPoint"
                  class="pointer-events-none absolute z-20 w-[170px] rounded-xl bg-white p-3 shadow-xl"
                  :style="tooltipStyle"
              >
                <p
                    class="mb-2 text-[11px] font-bold text-slate-900"
                >
                  {{ formatDateLong(hoveredPoint.date) }}
                </p>

                <div class="space-y-1.5">
                  <div
                      v-for="item in hoveredPoint.values"
                      :key="item.key"
                      class="flex items-center justify-between gap-3"
                  >
                    <span
                        class="flex items-center gap-1.5 text-[10px] text-slate-500"
                    >
                      <span
                          class="h-1.5 w-1.5 rounded-full"
                          :style="{ backgroundColor: item.color }"
                      ></span>

                      {{ item.label }}
                    </span>

                    <span
                        class="text-[10px] font-bold text-slate-800"
                    >
                      {{ formatCount(item.value) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ========================================================= -->
        <!-- Service Performance -->
        <!-- ========================================================= -->
        <section>
          <div class="mb-4">
            <h2 class="text-sm font-bold tracking-tight text-slate-900">
              Service performance
            </h2>

            <p class="mt-1 text-xs leading-5 text-slate-500">
              Compare activity, outcomes and capacity across Student Connect services.
            </p>
          </div>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">

            <!-- ===================================================== -->
            <!-- Carpool -->
            <!-- ===================================================== -->
            <article
                class="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div
                  class="flex items-center justify-between gap-3 px-5 py-4"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50"
                  >
                    <i class="fi fi-rr-car text-sm text-brand-600"></i>
                  </div>

                  <div class="min-w-0">
                    <h3 class="text-sm font-bold text-slate-900">
                      Carpool
                    </h3>

                    <p class="mt-0.5 text-[11px] text-slate-500">
                      Ride sharing activity
                    </p>
                  </div>
                </div>

                <span
                    class="rounded-full bg-brand-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-brand-700"
                >
                  {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'active')) }}
                  active
                </span>
              </div>

              <div class="grid grid-cols-3 px-3 pb-4">
                <div class="px-2 py-2 text-center">
                  <p class="text-xl font-bold text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'created')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Created
                  </p>
                </div>

                <div class="px-2 py-2 text-center">
                  <p class="text-xl font-bold text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'participants')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Participants
                  </p>
                </div>

                <div class="px-2 py-2 text-center">
                  <p class="text-xl font-bold text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'served')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Served
                  </p>
                </div>
              </div>

              <div class="px-5 pb-5 pt-2">
                <p class="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Capacity
                </p>

                <div class="space-y-0.5">
                  <div class="metric-row">
                    <span>Seats offered</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'seatsOffered')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Seats filled</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'seatsFilled')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Utilisation</span>
                    <strong>
                      {{ loading ? '—' : formatPercent(getOptionalNumber(safeStatistics.carpool, 'utilisationRate')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Average passengers</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getOptionalNumber(safeStatistics.carpool, 'averagePassengers')) }}
                    </strong>
                  </div>
                </div>

                <p class="mb-2 mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Timing
                </p>

                <div class="space-y-0.5">
                  <div class="metric-row">
                    <span>First participant</span>
                    <strong>
                      {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.carpool, 'averageTimeToFirstParticipantMinutes')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Full capacity</span>
                    <strong>
                      {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.carpool, 'averageTimeToFullCapacityMinutes')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Creation → departure</span>
                    <strong>
                      {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.carpool, 'averageCreationToDepartureMinutes')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Average waiting</span>
                    <strong>
                      {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.carpool, 'averageWaitingTimeMinutes')) }}
                    </strong>
                  </div>
                </div>

                <div class="mt-4 flex gap-2">
                  <div class="status-chip status-chip-rose">
                    <span>Cancelled</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'cancelled')) }}
                    </strong>
                  </div>

                  <div class="status-chip status-chip-amber">
                    <span>Expired</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'expired')) }}
                    </strong>
                  </div>
                </div>
              </div>
            </article>

            <!-- ===================================================== -->
            <!-- Errands -->
            <!-- ===================================================== -->
            <article
                class="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div
                  class="flex items-center justify-between gap-3 px-5 py-4"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50"
                  >
                    <i class="fi fi-rr-checklist text-sm text-amber-600"></i>
                  </div>

                  <div class="min-w-0">
                    <h3 class="text-sm font-bold text-slate-900">
                      Errands
                    </h3>

                    <p class="mt-0.5 text-[11px] text-slate-500">
                      Student-to-student requests
                    </p>
                  </div>
                </div>

                <span
                    class="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-700"
                >
                  {{ loading ? '—' : formatCount(getNumber(safeStatistics.errands, 'pending')) }}
                  pending
                </span>
              </div>

              <div class="grid grid-cols-3 px-3 pb-4">
                <div class="px-2 py-2 text-center">
                  <p class="text-xl font-bold text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.errands, 'created')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Created
                  </p>
                </div>

                <div class="px-2 py-2 text-center">
                  <p class="text-xl font-bold text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.errands, 'accepted')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Accepted
                  </p>
                </div>

                <div class="px-2 py-2 text-center">
                  <p class="text-xl font-bold text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.errands, 'served')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Served
                  </p>
                </div>
              </div>

              <div class="px-5 pb-5 pt-2">
                <p class="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Outcome
                </p>

                <div class="space-y-0.5">
                  <div class="metric-row">
                    <span>Completion rate</span>
                    <strong>
                      {{ loading ? '—' : formatPercent(getOptionalNumber(safeStatistics.errands, 'completionRate')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Cancellation rate</span>
                    <strong>
                      {{ loading ? '—' : formatPercent(getOptionalNumber(safeStatistics.errands, 'cancellationRate')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Participations</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getNumber(safeStatistics.errands, 'participations')) }}
                    </strong>
                  </div>
                </div>

                <p class="mb-2 mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Service timing
                </p>

                <div class="space-y-0.5">
                  <div class="metric-row">
                    <span>Acceptance</span>
                    <strong>
                      {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.errands, 'averageAcceptanceTimeMinutes')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Completion</span>
                    <strong>
                      {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.errands, 'averageCompletionTimeMinutes')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Total service</span>
                    <strong>
                      {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.errands, 'averageTotalServiceTimeMinutes')) }}
                    </strong>
                  </div>
                </div>

                <div class="mt-4 flex gap-2">
                  <div class="status-chip status-chip-rose">
                    <span>Cancelled</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getNumber(safeStatistics.errands, 'cancelled')) }}
                    </strong>
                  </div>

                  <div class="status-chip status-chip-amber">
                    <span>Expired</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getNumber(safeStatistics.errands, 'expired')) }}
                    </strong>
                  </div>
                </div>
              </div>
            </article>

            <!-- ===================================================== -->
            <!-- Study -->
            <!-- ===================================================== -->
            <article
                class="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div
                  class="flex items-center justify-between gap-3 px-5 py-4"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50"
                  >
                    <i class="fi fi-rr-book-alt text-sm text-emerald-600"></i>
                  </div>

                  <div class="min-w-0">
                    <h3 class="text-sm font-bold text-slate-900">
                      Study
                    </h3>

                    <p class="mt-0.5 text-[11px] text-slate-500">
                      Collaborative study activity
                    </p>
                  </div>
                </div>

                <span
                    class="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700"
                >
                  {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'active')) }}
                  active
                </span>
              </div>

              <div class="grid grid-cols-3 px-3 pb-4">
                <div class="px-2 py-2 text-center">
                  <p class="text-xl font-bold text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'created')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Created
                  </p>
                </div>

                <div class="px-2 py-2 text-center">
                  <p class="text-xl font-bold text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'participants')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Participants
                  </p>
                </div>

                <div class="px-2 py-2 text-center">
                  <p class="text-xl font-bold text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'served')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Served
                  </p>
                </div>
              </div>

              <div class="px-5 pb-5 pt-2">
                <p class="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Participation
                </p>

                <div class="space-y-0.5">
                  <div class="metric-row">
                    <span>Average participants</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getOptionalNumber(safeStatistics.study, 'averageParticipants')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Capacity utilisation</span>
                    <strong>
                      {{ loading ? '—' : formatPercent(getOptionalNumber(safeStatistics.study, 'utilisationRate')) }}
                    </strong>
                  </div>
                </div>

                <p class="mb-2 mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Status
                </p>

                <div class="space-y-0.5">
                  <div class="metric-row">
                    <span>Upcoming</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'upcoming')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Cancelled</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'cancelled')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Expired</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'expired')) }}
                    </strong>
                  </div>
                </div>

                <p class="mb-2 mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Member timing
                </p>

                <div class="space-y-0.5">
                  <div class="metric-row">
                    <span>First member</span>
                    <strong>
                      {{
                        loading
                            ? '—'
                            : formatDuration(
                                getOptionalNumber(
                                    safeStatistics.study,
                                    'averageTimeToFirstMemberMinutes'
                                ) ??
                                getOptionalNumber(
                                    safeStatistics.study,
                                    'averageTimeToFirstJoinMinutes'
                                )
                            )
                      }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Full capacity</span>
                    <strong>
                      {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.study, 'averageTimeToFullCapacityMinutes')) }}
                    </strong>
                  </div>
                </div>
              </div>
            </article>

            <!-- ===================================================== -->
            <!-- Activities -->
            <!-- ===================================================== -->
            <article
                class="overflow-hidden rounded-2xl bg-white shadow-sm"
            >
              <div
                  class="flex items-center justify-between gap-3 px-5 py-4"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <div
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50"
                  >
                    <i class="fi fi-rr-bullhorn text-sm text-violet-600"></i>
                  </div>

                  <div class="min-w-0">
                    <h3 class="text-sm font-bold text-slate-900">
                      Activities
                    </h3>

                    <p class="mt-0.5 text-[11px] text-slate-500">
                      Events, competitions and programmes
                    </p>
                  </div>
                </div>

                <span
                    class="rounded-full bg-violet-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-violet-700"
                >
                  Promotion
                </span>
              </div>

              <div class="grid grid-cols-3 px-3 pb-4">
                <div class="px-2 py-2 text-center">
                  <p class="text-xl font-bold text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.activities, 'created')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Created
                  </p>
                </div>

                <div class="px-2 py-2 text-center">
                  <p class="text-xl font-bold text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.activities, 'active')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Active
                  </p>
                </div>

                <div class="px-2 py-2 text-center">
                  <p class="text-xl font-bold text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.activities, 'publishers')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Publishers
                  </p>
                </div>
              </div>

              <div class="px-5 pb-5 pt-2">
                <div class="rounded-xl bg-violet-50/60 p-3">
                  <div class="flex items-start gap-2.5">
                    <i
                        class="fi fi-rr-info mt-0.5 text-xs text-violet-500"
                    ></i>

                    <p class="text-[10px] leading-4 text-violet-700">
                      Activities are promotional listings and do not track
                      participants, capacity or attendance.
                    </p>
                  </div>
                </div>

                <p class="mb-2 mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Status
                </p>

                <div class="space-y-0.5">
                  <div class="metric-row">
                    <span>Completed</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getNumber(safeStatistics.activities, 'completed')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Cancelled</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getNumber(safeStatistics.activities, 'cancelled')) }}
                    </strong>
                  </div>

                  <div class="metric-row">
                    <span>Expired</span>
                    <strong>
                      {{ loading ? '—' : formatCount(getNumber(safeStatistics.activities, 'expired')) }}
                    </strong>
                  </div>
                </div>

                <p class="mb-2 mt-5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  Categories
                </p>

                <div
                    v-if="activityCategories.length"
                    class="flex flex-wrap gap-1.5"
                >
                  <span
                      v-for="category in activityCategories"
                      :key="category.name"
                      class="rounded-full bg-slate-50 px-2 py-1 text-[9px] font-semibold text-slate-600"
                  >
                    {{ category.name }}

                    <span class="ml-1 text-slate-400">
                      {{ category.value }}
                    </span>
                  </span>
                </div>

                <p
                    v-else
                    class="text-[11px] text-slate-400"
                >
                  No activity categories recorded.
                </p>
              </div>
            </article>

          </div>
        </section>

        <!-- ========================================================= -->
        <!-- User Activity -->
        <!-- ========================================================= -->
        <section
            class="overflow-hidden rounded-2xl bg-white shadow-sm"
        >
          <div class="px-5 py-5 sm:px-6">
            <div class="flex items-center gap-3">
              <div
                  class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100"
              >
                <i class="fi fi-rr-users-alt text-sm text-slate-600"></i>
              </div>

              <div>
                <h2 class="text-sm font-bold text-slate-900">
                  User activity
                </h2>

                <p class="mt-0.5 text-xs text-slate-500">
                  Community growth and engagement.
                </p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 px-5 pb-5 sm:grid-cols-3 lg:grid-cols-6">
            <template v-if="loading">
              <div
                  v-for="item in 6"
                  :key="item"
                  class="h-24 animate-pulse rounded-xl bg-slate-50"
              ></div>
            </template>

            <template v-else>
              <div
                  v-for="item in userMetrics"
                  :key="item.label"
                  class="rounded-xl bg-slate-50 p-4"
              >
                <p class="text-xs font-medium text-slate-500">
                  {{ item.label }}
                </p>

                <p
                    class="mt-2 text-xl font-bold tracking-tight text-slate-900"
                >
                  {{ item.value }}
                </p>
              </div>
            </template>
          </div>
        </section>

      </template>
    </div>
  </div>
</template>

<style scoped>
.statistics-period {
  width: 125px;
}

:deep(.statistics-period .el-input__wrapper) {
  height: 38px;
  min-height: 38px;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
  transition: box-shadow 0.15s ease;
}

:deep(.statistics-period .el-input__wrapper:hover) {
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.09);
}

:deep(.statistics-period .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.12);
}

:deep(.statistics-period .el-input__inner) {
  line-height: 36px;
}

:deep(.statistics-refresh) {
  height: 38px;
  min-height: 38px;
  margin: 0;
  padding: 0 14px;
  box-sizing: border-box;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

:deep(.statistics-refresh .fi) {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

:deep(.el-button) {
  border-radius: 10px;
}

/* Secondary metric rows */
.metric-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0;
}

.metric-row > span {
  min-width: 0;
  color: #64748b;
  font-size: 0.75rem;
  line-height: 1rem;
}

.metric-row > strong {
  flex-shrink: 0;
  color: #1e293b;
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1rem;
}

/* Small status summaries */
.status-chip {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  border-radius: 0.625rem;
  padding: 0.5rem 0.65rem;
  font-size: 0.625rem;
  font-weight: 500;
}

.status-chip strong {
  font-weight: 700;
}

.status-chip-rose {
  background: #fff1f2;
  color: #be123c;
}

.status-chip-amber {
  background: #fffbeb;
  color: #b45309;
}
</style>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch
} from 'vue'

import studentConnect from '@/api'

const selectedPeriod = ref('30d')
const statistics = ref(null)
const loading = ref(false)
const errorMessage = ref('')

const chartCanvas = ref(null)
const chartWrapper = ref(null)
const hoveredPoint = ref(null)

const tooltipPosition = ref({
  x: 0,
  y: 0
})

let resizeObserver = null
let resizeFrame = null

const periodOptions = [
  {
    label: '7 Days',
    value: '7d'
  },
  {
    label: '30 Days',
    value: '30d'
  },
  {
    label: '90 Days',
    value: '90d'
  },
  {
    label: 'All Time',
    value: 'all'
  }
]

const trendSeries = [
  {
    key: 'users',
    label: 'Users',
    color: '#4f46e5'
  },
  {
    key: 'carpool',
    label: 'Carpool',
    color: '#0891b2'
  },
  {
    key: 'errands',
    label: 'Errands',
    color: '#d97706'
  },
  {
    key: 'study',
    label: 'Study',
    color: '#059669'
  },
  {
    key: 'activities',
    label: 'Activities',
    color: '#7c3aed'
  },
  {
    key: 'served',
    label: 'Served',
    color: '#e11d48'
  }
]

const periodLabel = computed(() => {
  return periodOptions.find(
      (item) => item.value === selectedPeriod.value
  )?.label || '30 Days'
})

const safeStatistics = computed(() => {
  return statistics.value || {}
})

const trendData = computed(() => {
  const data = safeStatistics.value.trends?.daily

  if (!Array.isArray(data)) {
    return []
  }

  return data.map((item) => ({
    ...item,

    // Support both API spellings without changing
    // the backend response schema.
    carpool:
        typeof item.carpool === 'number'
            ? item.carpool
            : typeof item.carpools === 'number'
                ? item.carpools
                : 0
  }))
})

/**
 * Returns a numeric metric.
 *
 * @param {Object} source - Data source.
 * @param {string} key - Metric key.
 * @returns {number} Numeric value.
 */
function getNumber(source, key) {
  const value = source?.[key]

  return typeof value === 'number' &&
  Number.isFinite(value)
      ? value
      : 0
}

/**
 * Returns an optional metric.
 *
 * @param {Object} source - Data source.
 * @param {string} key - Metric key.
 * @returns {number|null} Numeric value or null.
 */
function getOptionalNumber(source, key) {
  const value = source?.[key]

  return typeof value === 'number' &&
  Number.isFinite(value)
      ? value
      : null
}

/**
 * Formats a number.
 *
 * @param {number|string|null} value - Value.
 * @returns {string} Formatted value.
 */
function formatCount(value) {
  if (
      value === null ||
      value === undefined ||
      value === 'N/A'
  ) {
    return 'N/A'
  }

  const number = Number(value)

  if (!Number.isFinite(number)) {
    return 'N/A'
  }

  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1
  }).format(number)
}

/**
 * Formats a percentage.
 *
 * @param {number|null} value - Percentage.
 * @returns {string} Formatted percentage.
 */
function formatPercent(value) {
  if (
      value === null ||
      value === undefined
  ) {
    return 'N/A'
  }

  return `${formatCount(value)}%`
}

/**
 * Formats a duration in minutes.
 *
 * @param {number|null} value - Duration.
 * @returns {string} Formatted duration.
 */
function formatDuration(value) {
  if (
      value === null ||
      value === undefined
  ) {
    return 'N/A'
  }

  if (value < 60) {
    return `${formatCount(value)} min`
  }

  const hours = value / 60

  if (hours < 24) {
    return `${formatCount(hours)}h`
  }

  const days = Math.floor(hours / 24)
  const remainingHours = Math.floor(hours % 24)

  return remainingHours
      ? `${days}d ${remainingHours}h`
      : `${days}d`
}

/**
 * Formats a short date.
 *
 * @param {string} value - ISO date.
 * @returns {string} Formatted date.
 */
function formatDate(value) {
  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(
      undefined,
      {
        month: 'short',
        day: 'numeric'
      }
  ).format(date)
}

/**
 * Formats a full date.
 *
 * @param {string} value - ISO date.
 * @returns {string} Formatted date.
 */
function formatDateLong(value) {
  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(
      undefined,
      {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }
  ).format(date)
}

/**
 * Builds overview metrics.
 *
 * @returns {Object[]} Metrics.
 */
const overviewMetrics = computed(() => {
  const data = safeStatistics.value.overall || {}

  return [
    {
      label: 'Total Services',
      value: formatCount(
          getNumber(data, 'totalActivities')
      ),
      description: 'All service records',
      icon: 'fi-rr-apps',
      iconColor: 'text-brand-600',
      iconBackground: 'bg-brand-50'
    },
    {
      label: 'Active',
      value: formatCount(
          getNumber(data, 'activeActivities')
      ),
      description: 'Currently active',
      icon: 'fi-rr-pulse',
      iconColor: 'text-emerald-600',
      iconBackground: 'bg-emerald-50'
    },
    {
      label: 'Served',
      value: formatCount(
          getNumber(data, 'totalServed')
      ),
      description: 'Completed services',
      icon: 'fi-rr-check-double',
      iconColor: 'text-cyan-600',
      iconBackground: 'bg-cyan-50'
    },
    {
      label: 'Participations',
      value: formatCount(
          getNumber(data, 'totalStudentParticipations')
      ),
      description: 'Student involvement',
      icon: 'fi-rr-users-alt',
      iconColor: 'text-violet-600',
      iconBackground: 'bg-violet-50'
    },
    {
      label: 'Cancelled',
      value: formatCount(
          getNumber(data, 'cancelledActivities')
      ),
      description: 'Cancelled services',
      icon: 'fi-rr-cross-circle',
      iconColor: 'text-rose-600',
      iconBackground: 'bg-rose-50'
    },
    {
      label: 'Expired',
      value: formatCount(
          getNumber(data, 'expiredActivities')
      ),
      description: 'Expired services',
      icon: 'fi-rr-time-forward',
      iconColor: 'text-amber-600',
      iconBackground: 'bg-amber-50'
    }
  ]
})

/**
 * Builds user metrics.
 *
 * @returns {Object[]} Metrics.
 */
const userMetrics = computed(() => {
  const data = safeStatistics.value.users || {}

  return [
    {
      label: 'Total Users',
      value: formatCount(
          getNumber(data, 'total')
      )
    },
    {
      label: 'New Users',
      value: formatCount(
          getNumber(data, 'new')
      )
    },
    {
      label: 'Active Today',
      value: formatCount(
          getNumber(data, 'activeToday')
      )
    },
    {
      label: 'Active This Week',
      value: formatCount(
          getNumber(data, 'activeThisWeek')
      )
    },
    {
      label: 'Active This Month',
      value: formatCount(
          getNumber(data, 'activeThisMonth')
      )
    },
    {
      label: 'Login Count',
      value: formatCount(
          getNumber(data, 'loginCount')
      )
    }
  ]
})

/**
 * Returns activity category metrics.
 *
 * @returns {Object[]} Category metrics.
 */
const activityCategories = computed(() => {
  const categories =
      safeStatistics.value.activities?.categories || {}

  return Object.entries(categories)
      .map(([name, value]) => ({
        name,
        value: getNumber(
            { value },
            'value'
        )
      }))
      .sort(
          (a, b) => b.value - a.value
      )
})

/**
 * Calculates total trend value.
 *
 * @param {string} key - Trend key.
 * @returns {number} Total.
 */
function trendTotal(key) {
  return trendData.value.reduce(
      (total, item) =>
          total + getNumber(item, key),
      0
  )
}

/**
 * Builds trend summary values.
 *
 * @returns {Object[]} Summary.
 */
const trendSummary = computed(() => {
  return trendSeries.map(
      (series) => ({
        key: series.key,
        label: series.label,
        color: series.color,
        value: trendTotal(series.key)
      })
  )
})

/**
 * Returns chart geometry.
 *
 * @param {HTMLCanvasElement} canvas - Canvas.
 * @returns {Object} Geometry.
 */
function getChartGeometry(canvas) {
  const width = canvas.clientWidth
  const height = canvas.clientHeight

  const left = 48
  const right = 18
  const top = 18
  const bottom = 40

  return {
    width,
    height,
    left,
    right,
    top,
    bottom,
    plotWidth: Math.max(
        1,
        width - left - right
    ),
    plotHeight: Math.max(
        1,
        height - top - bottom
    )
  }
}

/**
 * Returns chart maximum.
 *
 * @returns {number} Maximum.
 */
function getChartMax() {
  const values = trendSeries.flatMap(
      (series) =>
          trendData.value.map(
              (item) =>
                  getNumber(
                      item,
                      series.key
                  )
          )
  )

  const maximum = Math.max(
      0,
      ...values
  )

  if (maximum <= 5) {
    return 5
  }

  const magnitude =
      10 ** Math.floor(
          Math.log10(maximum)
      )

  const normalized =
      maximum / magnitude

  let rounded

  if (normalized <= 1) {
    rounded = 1
  } else if (normalized <= 2) {
    rounded = 2
  } else if (normalized <= 5) {
    rounded = 5
  } else {
    rounded = 10
  }

  return rounded * magnitude
}

/**
 * Converts index to X coordinate.
 *
 * @param {number} index - Index.
 * @param {Object} geometry - Geometry.
 * @returns {number} X coordinate.
 */
function getChartX(index, geometry) {
  const length = trendData.value.length

  if (length <= 1) {
    return (
        geometry.left +
        geometry.plotWidth / 2
    )
  }

  return (
      geometry.left +
      (index / (length - 1)) *
      geometry.plotWidth
  )
}

/**
 * Converts value to Y coordinate.
 *
 * @param {number} value - Value.
 * @param {number} maximum - Maximum.
 * @param {Object} geometry - Geometry.
 * @returns {number} Y coordinate.
 */
function getChartY(
    value,
    maximum,
    geometry
) {
  return (
      geometry.top +
      geometry.plotHeight -
      (value / maximum) *
      geometry.plotHeight
  )
}

/**
 * Returns chart label indexes.
 *
 * @returns {number[]} Indexes.
 */
function getChartTickIndexes() {
  const length = trendData.value.length

  if (!length) {
    return []
  }

  const target =
      selectedPeriod.value === '7d'
          ? 7
          : selectedPeriod.value === '30d'
              ? 7
              : 8

  const step = Math.max(
      1,
      Math.ceil(length / target)
  )

  const indexes = []

  for (
      let index = 0;
      index < length;
      index += step
  ) {
    indexes.push(index)
  }

  if (
      indexes[indexes.length - 1] !==
      length - 1
  ) {
    indexes.push(length - 1)
  }

  return [
    ...new Set(indexes)
  ]
}

/**
 * Draws a smooth chart line.
 *
 * @param {CanvasRenderingContext2D} context - Context.
 * @param {Object[]} points - Points.
 * @returns {void}
 */
function drawSmoothLine(
    context,
    points
) {
  if (!points.length) {
    return
  }

  context.beginPath()

  context.moveTo(
      points[0].x,
      points[0].y
  )

  for (
      let index = 0;
      index < points.length - 1;
      index += 1
  ) {
    const current = points[index]
    const next = points[index + 1]

    const midpointX =
        (current.x + next.x) / 2

    context.quadraticCurveTo(
        current.x,
        current.y,
        midpointX,
        (current.y + next.y) / 2
    )

    context.quadraticCurveTo(
        next.x,
        next.y,
        next.x,
        next.y
    )
  }

  context.stroke()
}

/**
 * Configures the responsive canvas backing resolution.
 *
 * @param {HTMLCanvasElement} canvas - Canvas.
 * @returns {Object|null} Canvas context.
 */
function setupCanvas(canvas) {
  if (!canvas) {
    return null
  }

  const width = canvas.clientWidth
  const height = canvas.clientHeight

  if (!width || !height) {
    return null
  }

  const dpr = Math.min(
      window.devicePixelRatio || 1,
      2
  )

  canvas.width = Math.round(
      width * dpr
  )

  canvas.height = Math.round(
      height * dpr
  )

  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  context.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
  )

  return {
    context,
    width,
    height
  }
}

/**
 * Draws the activity chart.
 *
 * @returns {void}
 */
function drawChart() {
  const canvas = chartCanvas.value

  if (
      !canvas ||
      !trendData.value.length
  ) {
    return
  }

  const result = setupCanvas(canvas)

  if (!result) {
    return
  }

  const {
    context,
    width,
    height
  } = result

  const geometry =
      getChartGeometry(canvas)

  const maximum = getChartMax()

  context.clearRect(
      0,
      0,
      width,
      height
  )

  /*
   * Background.
   */
  context.fillStyle = '#ffffff'

  context.fillRect(
      0,
      0,
      width,
      height
  )

  /*
   * Horizontal grid.
   */
  const gridLines = 5

  context.lineWidth = 1
  context.strokeStyle = '#e2e8f0'
  context.fillStyle = '#94a3b8'

  context.font =
      '10px Arial, sans-serif'

  context.textAlign = 'right'
  context.textBaseline = 'middle'

  for (
      let index = 0;
      index <= gridLines;
      index += 1
  ) {
    const y =
        geometry.top +
        (geometry.plotHeight / gridLines) *
        index

    context.beginPath()

    context.moveTo(
        geometry.left,
        y
    )

    context.lineTo(
        geometry.left +
        geometry.plotWidth,
        y
    )

    context.stroke()

    const value =
        maximum -
        (maximum / gridLines) *
        index

    context.fillText(
        formatCount(value),
        geometry.left - 9,
        y
    )
  }

  /*
   * X-axis labels.
   */
  context.textAlign = 'center'
  context.textBaseline = 'top'

  getChartTickIndexes().forEach(
      (index) => {
        const x =
            getChartX(
                index,
                geometry
            )

        context.fillText(
            formatDate(
                trendData.value[index].date
            ),
            x,
            geometry.top +
            geometry.plotHeight +
            14
        )
      }
  )

  /*
   * Series.
   */
  trendSeries.forEach(
      (series) => {
        const points =
            trendData.value.map(
                (item, index) => ({
                  x: getChartX(
                      index,
                      geometry
                  ),
                  y: getChartY(
                      getNumber(
                          item,
                          series.key
                      ),
                      maximum,
                      geometry
                  )
                })
            )

        context.strokeStyle =
            series.color

        context.lineWidth = 2
        context.lineCap = 'round'
        context.lineJoin = 'round'

        drawSmoothLine(
            context,
            points
        )
      }
  )

  /*
   * Hover crosshair and points.
   */
  if (hoveredPoint.value) {
    const index =
        hoveredPoint.value.index

    const x =
        getChartX(
            index,
            geometry
        )

    context.save()

    context.strokeStyle =
        '#cbd5e1'

    context.lineWidth = 1

    context.setLineDash([
      4,
      4
    ])

    context.beginPath()

    context.moveTo(
        x,
        geometry.top
    )

    context.lineTo(
        x,
        geometry.top +
        geometry.plotHeight
    )

    context.stroke()

    context.restore()

    hoveredPoint.value.values.forEach(
        (item) => {
          const y =
              getChartY(
                  item.value,
                  maximum,
                  geometry
              )

          context.beginPath()

          context.fillStyle =
              '#ffffff'

          context.strokeStyle =
              item.color

          context.lineWidth = 2

          context.arc(
              x,
              y,
              4,
              0,
              Math.PI * 2
          )

          context.fill()
          context.stroke()
        }
    )
  }
}

/**
 * Handles chart mouse movement.
 *
 * @param {MouseEvent} event - Mouse event.
 * @returns {void}
 */
function handleChartMouseMove(event) {
  const canvas = chartCanvas.value

  if (
      !canvas ||
      !trendData.value.length
  ) {
    return
  }

  const rect =
      canvas.getBoundingClientRect()

  const geometry =
      getChartGeometry(canvas)

  const mouseX =
      event.clientX - rect.left

  const clampedX =
      Math.max(
          geometry.left,
          Math.min(
              geometry.left +
              geometry.plotWidth,
              mouseX
          )
      )

  const ratio =
      (clampedX - geometry.left) /
      geometry.plotWidth

  const index =
      Math.round(
          ratio *
          (
              trendData.value.length - 1
          )
      )

  const safeIndex =
      Math.max(
          0,
          Math.min(
              trendData.value.length - 1,
              index
          )
      )

  const item =
      trendData.value[safeIndex]

  hoveredPoint.value = {
    index: safeIndex,
    date: item.date,
    values:
        trendSeries.map(
            (series) => ({
              key: series.key,
              label: series.label,
              color: series.color,
              value: getNumber(
                  item,
                  series.key
              )
            })
        )
  }

  const tooltipWidth = 170

  let tooltipX =
      clampedX + 14

  if (
      tooltipX + tooltipWidth >
      rect.width
  ) {
    tooltipX =
        clampedX -
        tooltipWidth -
        14
  }

  tooltipPosition.value = {
    x: Math.max(
        8,
        tooltipX
    ),
    y: 14
  }

  drawChart()
}

/**
 * Clears chart hover state.
 *
 * @returns {void}
 */
function handleChartMouseLeave() {
  hoveredPoint.value = null

  drawChart()
}

/**
 * Returns tooltip style.
 *
 * @returns {Object} CSS properties.
 */
const tooltipStyle = computed(() => ({
  left: `${tooltipPosition.value.x}px`,
  top: `${tooltipPosition.value.y}px`
}))

/**
 * Schedules a chart redraw.
 *
 * @returns {void}
 */
function scheduleChartDraw() {
  if (resizeFrame) {
    cancelAnimationFrame(
        resizeFrame
    )
  }

  resizeFrame =
      requestAnimationFrame(
          () => {
            resizeFrame = null
            drawChart()
          }
      )
}

/**
 * Loads statistics.
 *
 * @returns {Promise<void>} Completion promise.
 */
async function loadStatistics() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response =
        await studentConnect.getStatistics(
            selectedPeriod.value
        )

    statistics.value =
        response.data

    hoveredPoint.value = null

    await nextTick()

    scheduleChartDraw()
  } catch (error) {
    console.error(
        'Failed to load statistics:',
        error
    )

    statistics.value = null

    errorMessage.value =
        'Unable to load statistics.'
  } finally {
    loading.value = false
  }
}

watch(
    selectedPeriod,
    () => {
      loadStatistics()
    }
)

onMounted(async () => {
  await loadStatistics()

  await nextTick()

  if (chartWrapper.value) {
    resizeObserver =
        new ResizeObserver(
            () => {
              scheduleChartDraw()
            }
        )

    resizeObserver.observe(
        chartWrapper.value
    )
  }

  scheduleChartDraw()
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  if (resizeFrame) {
    cancelAnimationFrame(
        resizeFrame
    )

    resizeFrame = null
  }
})
</script>
