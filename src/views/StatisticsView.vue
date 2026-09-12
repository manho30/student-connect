<template>
  <div class="min-h-full bg-slate-50/60">
    <div class="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <header class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
            Analytics
          </p>

          <h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Statistics
          </h1>

          <p class="mt-1.5 text-sm text-slate-500">
            Monitor platform activity, service performance and student engagement.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <el-select
              v-model="selectedPeriod"
              class="statistics-period"
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


      <!-- Error -->
      <div
          v-if="errorMessage"
          class="rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm"
      >
        <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50">
          <i class="fi fi-rr-exclamation text-lg text-rose-500"></i>
        </div>

        <h2 class="mt-4 text-sm font-semibold text-slate-900">
          Unable to load statistics
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          There was a problem retrieving the latest analytics data.
        </p>

        <el-button
            class="mt-4"
            @click="loadStatistics"
        >
          Try again
        </el-button>
      </div>


      <template v-else>

        <!-- Platform Overview -->
        <section>
          <div class="mb-3">
            <h2 class="text-sm font-semibold text-slate-900">
              Platform overview
            </h2>

            <p class="mt-0.5 text-xs text-slate-500">
              {{ periodLabel }} activity
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">

            <template v-if="loading">
              <div
                  v-for="item in 6"
                  :key="item"
                  class="h-[122px] animate-pulse rounded-2xl bg-slate-200/70"
              ></div>
            </template>

            <template v-else>
              <div
                  v-for="item in overviewMetrics"
                  :key="item.label"
                  class="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-slate-500">
                {{ item.label }}
              </span>

                  <div
                      class="flex h-8 w-8 items-center justify-center rounded-lg"
                      :class="item.iconBackground"
                  >
                    <i
                        class="fi text-sm"
                        :class="[item.icon, item.iconColor]"
                    ></i>
                  </div>
                </div>

                <div class="mt-4">
                  <p class="text-2xl font-bold tracking-tight text-slate-900">
                    {{ item.value }}
                  </p>

                  <p
                      v-if="item.description"
                      class="mt-1 text-[11px] text-slate-400"
                  >
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </template>

          </div>
        </section>


        <!-- Activity Overview -->
        <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div
              class="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <h2 class="text-base font-semibold text-slate-900">
                Activity overview
              </h2>

              <p class="mt-0.5 text-xs text-slate-500">
                Daily activity across the platform.
              </p>
            </div>

            <div class="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <div
                  v-for="series in trendSeries"
                  :key="series.key"
                  class="flex items-center gap-1.5"
              >
            <span
                class="h-1.5 w-1.5 rounded-full"
                :style="{ backgroundColor: series.color }"
            ></span>

                <span class="text-[11px] font-medium text-slate-500">
              {{ series.label }}
            </span>
              </div>
            </div>
          </div>


          <!-- Trend Summary -->
          <div class="px-5 pt-4 sm:px-6">
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-5">

              <div
                  v-for="summary in trendSummary"
                  :key="summary.key"
                  class="rounded-lg bg-slate-50 px-3 py-2"
              >
                <p class="text-[10px] font-medium text-slate-500">
                  {{ summary.label }}
                </p>

                <div class="mt-0.5 flex items-baseline gap-1">
              <span class="text-base font-bold text-slate-900">
                {{ formatCount(summary.value) }}
              </span>

                  <span class="text-[9px] text-slate-400">
                total
              </span>
                </div>
              </div>

            </div>
          </div>


          <!-- Chart -->
          <div class="px-4 pb-4 pt-3">

            <div
                v-if="loading"
                class="h-[160px] w-full animate-pulse rounded-xl bg-slate-50"
            ></div>

            <div
                v-else-if="trendData.length === 0"
                class="flex h-[160px] w-full items-center justify-center"
            >
              <div class="text-center">
                <div class="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                  <i class="fi fi-rr-chart-line-up text-sm text-slate-400"></i>
                </div>

                <p class="mt-2 text-xs font-medium text-slate-700">
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
                class="relative h-[160px] w-full overflow-hidden"
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
                  class="pointer-events-none absolute z-20 w-[155px] rounded-lg border border-slate-200 bg-white p-2.5 shadow-lg"
                  :style="tooltipStyle"
              >
                <p class="mb-1.5 text-[11px] font-semibold text-slate-900">
                  {{ formatDateLong(hoveredPoint.date) }}
                </p>

                <div class="space-y-1">
                  <div
                      v-for="item in hoveredPoint.values"
                      :key="item.key"
                      class="flex items-center justify-between gap-3"
                  >
                <span class="flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span
                      class="h-1.5 w-1.5 rounded-full"
                      :style="{ backgroundColor: item.color }"
                  ></span>

                  {{ item.label }}
                </span>

                    <span class="text-[10px] font-semibold text-slate-800">
                  {{ formatCount(item.value) }}
                </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>


        <!-- Service Performance -->
        <section>

          <div class="mb-4">
            <h2 class="text-sm font-semibold tracking-tight text-slate-900">
              Service performance
            </h2>

            <p class="mt-1 text-xs leading-5 text-slate-500">
              Breakdown of activity, participation, capacity and service outcomes.
            </p>
          </div>


          <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">

            <!-- Carpool -->
            <article
                class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >

              <div class="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                  <i class="fi fi-rr-car text-sm text-indigo-600"></i>
                </div>

                <div class="min-w-0">
                  <h3 class="text-sm font-semibold text-slate-900">
                    Carpool
                  </h3>

                  <p class="mt-0.5 text-[11px] text-slate-500">
                    Ride sharing activity
                  </p>
                </div>
              </div>


              <div class="grid grid-cols-3 divide-x divide-slate-100">

                <div class="px-3 py-4 text-center">
                  <p class="text-xl font-bold tracking-tight text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'created')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Created
                  </p>
                </div>

                <div class="px-3 py-4 text-center">
                  <p class="text-xl font-bold tracking-tight text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'active')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Active
                  </p>
                </div>

                <div class="px-3 py-4 text-center">
                  <p class="text-xl font-bold tracking-tight text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'served')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Served
                  </p>
                </div>

              </div>


              <div class="border-t border-slate-100 px-5 py-4">

                <!-- Capacity -->
                <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Capacity
                </p>

                <div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Seats Offered
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'seatsOffered')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Seats Filled
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'seatsFilled')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Utilisation
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatPercent(getOptionalNumber(safeStatistics.carpool, 'utilisationRate')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between py-2">
                <span class="text-xs text-slate-500">
                  Avg. Passengers
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatCount(getOptionalNumber(safeStatistics.carpool, 'averagePassengers')) }}
                </span>
                  </div>

                </div>


                <!-- Status -->
                <p class="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Status
                </p>

                <div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Cancelled
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'cancelled')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between py-2">
                <span class="text-xs text-slate-500">
                  Served
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatCount(getNumber(safeStatistics.carpool, 'served')) }}
                </span>
                  </div>

                </div>


                <!-- Timing -->
                <p class="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Timing
                </p>

                <div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  First Participant
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.carpool, 'averageTimeToFirstParticipantMinutes')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Full Capacity
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.carpool, 'averageTimeToFullCapacityMinutes')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Creation → Departure
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.carpool, 'averageCreationToDepartureMinutes')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between py-2">
                <span class="text-xs text-slate-500">
                  Avg. Waiting Time
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.carpool, 'averageWaitingTimeMinutes')) }}
                </span>
                  </div>

                </div>

              </div>
            </article>


            <!-- Errands -->
            <article
                class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >

              <div class="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                  <i class="fi fi-rr-checklist text-sm text-amber-600"></i>
                </div>

                <div class="min-w-0">
                  <h3 class="text-sm font-semibold text-slate-900">
                    Errands
                  </h3>

                  <p class="mt-0.5 text-[11px] text-slate-500">
                    Student-to-student requests
                  </p>
                </div>
              </div>


              <div class="grid grid-cols-3 divide-x divide-slate-100">

                <div class="px-3 py-4 text-center">
                  <p class="text-xl font-bold tracking-tight text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.errands, 'created')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Created
                  </p>
                </div>

                <div class="px-3 py-4 text-center">
                  <p class="text-xl font-bold tracking-tight text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.errands, 'pending')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Pending
                  </p>
                </div>

                <div class="px-3 py-4 text-center">
                  <p class="text-xl font-bold tracking-tight text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.errands, 'served')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Served
                  </p>
                </div>

              </div>


              <div class="border-t border-slate-100 px-5 py-4">

                <!-- Outcome -->
                <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Outcome
                </p>

                <div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Accepted
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatCount(getNumber(safeStatistics.errands, 'accepted')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Cancelled
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatCount(getNumber(safeStatistics.errands, 'cancelled')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Completion Rate
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatPercent(getOptionalNumber(safeStatistics.errands, 'completionRate')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between py-2">
                <span class="text-xs text-slate-500">
                  Cancellation Rate
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatPercent(getOptionalNumber(safeStatistics.errands, 'cancellationRate')) }}
                </span>
                  </div>

                </div>


                <!-- Service Timing -->
                <p class="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Service timing
                </p>

                <div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Acceptance
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.errands, 'averageAcceptanceTimeMinutes')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Completion
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.errands, 'averageCompletionTimeMinutes')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between py-2">
                <span class="text-xs text-slate-500">
                  Total Service
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.errands, 'averageTotalServiceTimeMinutes')) }}
                </span>
                  </div>

                </div>

              </div>


              <div
                  v-if="!loading && getNumber(safeStatistics.errands, 'created') === 0"
                  class="border-t border-slate-100 px-5 py-3 text-[11px] text-slate-400"
              >
                No errands were recorded during this period.
              </div>

            </article>


            <!-- Study -->
            <article
                class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >

              <div class="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                  <i class="fi fi-rr-book-alt text-sm text-emerald-600"></i>
                </div>

                <div class="min-w-0">
                  <h3 class="text-sm font-semibold text-slate-900">
                    Study
                  </h3>

                  <p class="mt-0.5 text-[11px] text-slate-500">
                    Collaborative study activity
                  </p>
                </div>
              </div>


              <div class="grid grid-cols-3 divide-x divide-slate-100">

                <div class="px-3 py-4 text-center">
                  <p class="text-xl font-bold tracking-tight text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'created')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Created
                  </p>
                </div>

                <div class="px-3 py-4 text-center">
                  <p class="text-xl font-bold tracking-tight text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'active')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Active
                  </p>
                </div>

                <div class="px-3 py-4 text-center">
                  <p class="text-xl font-bold tracking-tight text-slate-900">
                    {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'served')) }}
                  </p>

                  <p class="mt-1 text-[10px] font-medium text-slate-400">
                    Served
                  </p>
                </div>

              </div>


              <div class="border-t border-slate-100 px-5 py-4">

                <!-- Participation -->
                <p class="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Participation
                </p>

                <div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Participants
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'participants')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Average Participants
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatCount(getOptionalNumber(safeStatistics.study, 'averageParticipants')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between py-2">
                <span class="text-xs text-slate-500">
                  Utilisation
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatPercent(getOptionalNumber(safeStatistics.study, 'utilisationRate')) }}
                </span>
                  </div>

                </div>


                <!-- Status -->
                <p class="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Status
                </p>

                <div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Upcoming
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'upcoming')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  Served
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'served')) }}
                </span>
                  </div>

                  <div class="flex items-center justify-between py-2">
                <span class="text-xs text-slate-500">
                  Cancelled
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatCount(getNumber(safeStatistics.study, 'cancelled')) }}
                </span>
                  </div>

                </div>


                <!-- Member Timing -->
                <p class="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  Member timing
                </p>

                <div>

                  <div class="flex items-center justify-between border-b border-slate-50 py-2">
                <span class="text-xs text-slate-500">
                  First Member
                </span>

                    <span class="text-xs font-semibold text-slate-800">
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
                </span>
                  </div>

                  <div class="flex items-center justify-between py-2">
                <span class="text-xs text-slate-500">
                  Full Capacity
                </span>

                    <span class="text-xs font-semibold text-slate-800">
                  {{ loading ? '—' : formatDuration(getOptionalNumber(safeStatistics.study, 'averageTimeToFullCapacityMinutes')) }}
                </span>
                  </div>

                </div>

              </div>

            </article>

          </div>
        </section>


        <!-- User Activity -->
        <section class="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div class="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div class="flex items-center gap-3">

              <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                <i class="fi fi-rr-users-alt text-sm text-slate-600"></i>
              </div>

              <div>
                <h2 class="text-sm font-semibold text-slate-900">
                  User activity
                </h2>

                <p class="mt-0.5 text-xs text-slate-500">
                  Community growth and engagement.
                </p>
              </div>

            </div>
          </div>


          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">

            <template v-if="loading">

              <div
                  v-for="item in 6"
                  :key="item"
                  class="h-24 animate-pulse border-b border-slate-100 bg-slate-50"
              ></div>

            </template>

            <template v-else>

              <div
                  v-for="item in userMetrics"
                  :key="item.label"
                  class="border-b border-r border-slate-100 p-4 last:border-r-0"
              >
                <p class="text-xs text-slate-500">
                  {{ item.label }}
                </p>

                <p class="mt-2 text-xl font-bold tracking-tight text-slate-900">
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

  return Array.isArray(data)
      ? data
      : []
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
      label: 'Total Activities',
      value: formatCount(
          getNumber(data, 'totalActivities')
      ),
      description: 'All services',
      icon: 'fi-rr-apps',
      iconColor: 'text-indigo-600',
      iconBackground: 'bg-indigo-50'
    },
    {
      label: 'Active',
      value: formatCount(
          getNumber(data, 'activeActivities')
      ),
      description: 'Current workload',
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
      label: 'Completion Rate',
      value: formatPercent(
          getOptionalNumber(data, 'completionRate')
      ),
      description: 'Activities completed',
      icon: 'fi-rr-check',
      iconColor: 'text-emerald-600',
      iconBackground: 'bg-emerald-50'
    },
    {
      label: 'Cancellation Rate',
      value: formatPercent(
          getOptionalNumber(data, 'cancellationRate')
      ),
      description: 'Activities cancelled',
      icon: 'fi-rr-cross-circle',
      iconColor: 'text-rose-600',
      iconBackground: 'bg-rose-50'
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
 * CSS size:
 *   width: 100%
 *   height: 160px
 *
 * Internal bitmap:
 *   width: CSS width × DPR
 *   height: CSS height × DPR
 *
 * @param {HTMLCanvasElement} canvas - Canvas.
 * @returns {Object} Geometry.
 */
function getChartGeometry(canvas) {
  const width = canvas.clientWidth
  const height = canvas.clientHeight

  const left = 48
  const right = 18
  const top = 20
  const bottom = 38

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
                  getNumber(item, series.key)
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
        (
            geometry.plotHeight /
            gridLines
        ) * index

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
        (
            maximum /
            gridLines
        ) * index

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
            13
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

          context.fillStyle = '#ffffff'
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
      (
          clampedX -
          geometry.left
      ) /
      geometry.plotWidth

  const index =
      Math.round(
          ratio *
          (
              trendData.value.length -
              1
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

<style scoped>
.statistics-period {
  width: 120px;
}

:deep(.statistics-period .el-input__wrapper) {
  min-height: 38px;
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
}

:deep(.statistics-period .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #cbd5e1 inset;
}

:deep(.el-button) {
  border-radius: 10px;
}

:deep(.el-button--primary) {
  border-radius: 10px;
}
</style>
