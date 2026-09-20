<template>
  <div class="space-y-5 sm:space-y-6">
    <!-- Header -->
    <header
        class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div class="min-w-0">
        <h1 class="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          User Management
        </h1>

        <p class="mt-1 text-sm leading-relaxed text-slate-500">
          Manage Student Connect profiles, roles, and account access.
        </p>
      </div>

      <button
          type="button"
          class="flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 sm:w-auto"
          @click="openCreateDialog"
      >
        <i class="fi fi-rr-user-add"></i>
        Add User
      </button>
    </header>

    <!-- Summary -->
    <section class="grid grid-cols-3 gap-2 sm:gap-4">
      <!-- Total Users -->
      <div
          class="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs sm:p-5"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0">
            <p class="truncate text-[10px] font-medium text-slate-500 sm:text-xs">
              Total Users
            </p>

            <p
                class="mt-1 text-xl font-semibold text-slate-900 sm:mt-2 sm:text-2xl"
            >
              {{ users.length }}
            </p>
          </div>

          <div
              class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 sm:flex"
          >
            <i class="fi fi-rr-users"></i>
          </div>
        </div>
      </div>

      <!-- Administrators -->
      <div
          class="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs sm:p-5"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0">
            <p class="truncate text-[10px] font-medium text-slate-500 sm:text-xs">
              Administrators
            </p>

            <p
                class="mt-1 text-xl font-semibold text-slate-900 sm:mt-2 sm:text-2xl"
            >
              {{ administratorCount }}
            </p>
          </div>

          <div
              class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 sm:flex"
          >
            <i class="fi fi-rr-shield-check"></i>
          </div>
        </div>
      </div>

      <!-- Students -->
      <div
          class="rounded-2xl border border-slate-200 bg-white p-3 shadow-xs sm:p-5"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="min-w-0">
            <p class="truncate text-[10px] font-medium text-slate-500 sm:text-xs">
              Students
            </p>

            <p
                class="mt-1 text-xl font-semibold text-slate-900 sm:mt-2 sm:text-2xl"
            >
              {{ studentCount }}
            </p>
          </div>

          <div
              class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 sm:flex"
          >
            <i class="fi fi-rr-graduation-cap"></i>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Panel -->
    <section
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
    >
      <!-- Toolbar -->
      <div
          class="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5"
      >
        <!-- Search -->
        <div class="relative w-full">
          <i
              class="fi fi-rr-search pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400"
          ></i>

          <input
              v-model="searchQuery"
              type="search"
              placeholder="Search name, email, phone, or UID..."
              class="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
          />

          <button
              v-if="searchQuery"
              type="button"
              class="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
              aria-label="Clear search"
              @click="searchQuery = ''"
          >
            <i class="fi fi-rr-cross-small"></i>
          </button>
        </div>

        <!-- Filters -->
        <div class="flex gap-2">
          <select
              v-model="roleFilter"
              class="min-w-0 flex-1 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition-all focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-100"
          >
            <option value="all">
              All roles
            </option>

            <option value="user">
              Students
            </option>

            <option value="admin">
              Admins
            </option>

            <option value="superadmin">
              Superadmins
            </option>
          </select>

          <button
              v-if="searchQuery || roleFilter !== 'all'"
              type="button"
              class="flex min-h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
              @click="clearFilters"
          >
            <i class="fi fi-rr-cross-small"></i>
            <span class="hidden sm:inline">
              Clear
            </span>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div
          v-if="loading"
          class="flex flex-col items-center justify-center px-6 py-16"
      >
        <i
            class="fi fi-rr-spinner animate-spin text-xl text-brand-600"
        ></i>

        <p class="mt-3 text-sm text-slate-500">
          Loading users...
        </p>
      </div>

      <!-- Error -->
      <div
          v-else-if="errorMessage"
          class="flex flex-col items-center justify-center px-6 py-16 text-center"
      >
        <div
            class="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-500"
        >
          <i class="fi fi-rr-exclamation"></i>
        </div>

        <h2 class="mt-3 text-sm font-medium text-slate-800">
          Unable to load users
        </h2>

        <p class="mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
          {{ errorMessage }}
        </p>

        <button
            type="button"
            class="mt-4 min-h-10 cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
            @click="loadUsers"
        >
          Try Again
        </button>
      </div>

      <!-- Empty -->
      <div
          v-else-if="filteredUsers.length === 0"
          class="flex flex-col items-center justify-center px-6 py-16 text-center"
      >
        <div
            class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"
        >
          <i class="fi fi-rr-user-search text-lg"></i>
        </div>

        <h2 class="mt-3 text-sm font-medium text-slate-800">
          {{ users.length ? 'No matching users' : 'No users found' }}
        </h2>

        <p class="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">
          {{
            users.length
                ? 'Try adjusting your search or role filter.'
                : 'There are currently no Student Connect profiles.'
          }}
        </p>

        <button
            v-if="searchQuery || roleFilter !== 'all'"
            type="button"
            class="mt-4 min-h-10 cursor-pointer text-xs font-medium text-brand-600 hover:text-brand-700"
            @click="clearFilters"
        >
          Clear filters
        </button>
      </div>

      <!-- User List -->
      <div v-else>
        <!-- ============================================ -->
        <!-- DESKTOP TABLE -->
        <!-- ============================================ -->
        <div class="hidden overflow-x-auto md:block">
          <el-table
              :data="filteredUsers"
              class="w-full"
              row-class-name="user-management-row"
          >
            <!-- User -->
            <el-table-column
                label="User"
                min-width="240"
            >
              <template #default="{ row }">
                <div class="flex min-w-0 items-center gap-3">
                  <div
                      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-medium text-brand-700"
                  >
                    {{ getInitials(row.name) }}
                  </div>

                  <div class="min-w-0">
                    <p class="truncate text-sm font-medium text-slate-800">
                      {{ row.name || 'Unnamed User' }}
                    </p>

                    <p class="truncate text-xs text-slate-400">
                      {{ row.id }}
                    </p>
                  </div>
                </div>
              </template>
            </el-table-column>

            <!-- Email -->
            <el-table-column
                label="Email"
                min-width="230"
            >
              <template #default="{ row }">
                <span class="text-sm text-slate-600">
                  {{ row.email || 'Not provided' }}
                </span>
              </template>
            </el-table-column>

            <!-- Phone -->
            <el-table-column
                label="Phone"
                min-width="150"
            >
              <template #default="{ row }">
                <span class="text-sm text-slate-500">
                  {{ row.phone || 'Not provided' }}
                </span>
              </template>
            </el-table-column>

            <!-- Role -->
            <el-table-column
                label="Role"
                width="140"
            >
              <template #default="{ row }">
                <span :class="roleBadgeClass(row.role)">
                  <span
                      class="mr-1.5 h-1.5 w-1.5 rounded-full"
                      :class="roleDotClass(row.role)"
                  ></span>

                  {{ formatRole(row.role) }}
                </span>
              </template>
            </el-table-column>

            <!-- Actions -->
            <el-table-column
                label=""
                width="150"
                fixed="right"
                align="right"
            >
              <template #default="{ row }">
                <div class="flex items-center justify-end gap-1">
                  <button
                      type="button"
                      class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-30"
                      title="Edit user"
                      :disabled="!canManage(row)"
                      @click="openEditDialog(row)"
                  >
                    <i class="fi fi-rr-pencil"></i>
                  </button>

                  <button
                      type="button"
                      class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"
                      title="Remove user"
                      :disabled="!canManage(row)"
                      @click="removeUser(row)"
                  >
                    <i class="fi fi-rr-trash"></i>
                  </button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- ============================================ -->
        <!-- MOBILE CARDS -->
        <!-- ============================================ -->
        <div class="divide-y divide-slate-100 md:hidden">
          <article
              v-for="row in filteredUsers"
              :key="row.id"
              class="p-4"
          >
            <!-- User Header -->
            <div class="flex items-start gap-3">
              <!-- Avatar -->
              <div
                  class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700"
              >
                {{ getInitials(row.name) }}
              </div>

              <!-- Name + Role -->
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <h3
                        class="truncate text-sm font-semibold text-slate-800"
                    >
                      {{ row.name || 'Unnamed User' }}
                    </h3>

                    <p
                        class="mt-0.5 truncate text-xs text-slate-400"
                    >
                      {{ row.id }}
                    </p>
                  </div>

                  <span
                      :class="roleBadgeClass(row.role)"
                      class="shrink-0"
                  >
                    <span
                        class="mr-1.5 h-1.5 w-1.5 rounded-full"
                        :class="roleDotClass(row.role)"
                    ></span>

                    {{ formatRole(row.role) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- User Details -->
            <div class="mt-4 space-y-2.5">
              <!-- Email -->
              <div class="flex items-start gap-3">
                <div
                    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400"
                >
                  <i class="fi fi-rr-envelope text-xs"></i>
                </div>

                <div class="min-w-0 flex-1">
                  <p
                      class="text-[10px] font-medium uppercase tracking-wide text-slate-400"
                  >
                    Email
                  </p>

                  <p
                      class="mt-0.5 break-all text-xs text-slate-600"
                  >
                    {{ row.email || 'Not provided' }}
                  </p>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex items-start gap-3">
                <div
                    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400"
                >
                  <i class="fi fi-rr-phone-call text-xs"></i>
                </div>

                <div class="min-w-0 flex-1">
                  <p
                      class="text-[10px] font-medium uppercase tracking-wide text-slate-400"
                  >
                    Phone
                  </p>

                  <p class="mt-0.5 text-xs text-slate-600">
                    {{ row.phone || 'Not provided' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-4 grid grid-cols-2 gap-2">
              <button
                  type="button"
                  class="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="!canManage(row)"
                  @click="openEditDialog(row)"
              >
                <i class="fi fi-rr-pencil"></i>
                Edit
              </button>

              <button
                  type="button"
                  class="flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40"
                  :disabled="!canManage(row)"
                  @click="removeUser(row)"
              >
                <i class="fi fi-rr-trash"></i>
                Remove
              </button>
            </div>
          </article>
        </div>
      </div>

      <!-- Footer -->
      <div
          v-if="!loading && !errorMessage && filteredUsers.length"
          class="border-t border-slate-100 px-4 py-3 sm:px-5"
      >
        <p class="text-xs text-slate-400">
          Showing
          <span class="font-medium text-slate-600">
            {{ filteredUsers.length }}
          </span>
          of
          <span class="font-medium text-slate-600">
            {{ users.length }}
          </span>
          users
        </p>
      </div>
    </section>

    <!-- User Dialog -->
    <el-dialog
        v-model="dialogVisible"
        :title="editingUser ? 'Edit User' : 'Add User'"
        width="min(92vw, 520px)"
        destroy-on-close
        class="user-management-dialog"
    >
      <!-- Dialog Intro -->
      <div
          v-if="!editingUser"
          class="mb-5 flex gap-3 rounded-xl border border-brand-100 bg-brand-50 p-4"
      >
        <div
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-600"
        >
          <i class="fi fi-rr-info"></i>
        </div>

        <div class="min-w-0">
          <p class="text-sm font-medium text-brand-800">
            Initialize an existing Firebase account
          </p>

          <p
              class="mt-1 text-xs leading-relaxed text-brand-700"
          >
            This creates the Student Connect profile for an existing Firebase
            Authentication UID. It does not create a password or Firebase account.
          </p>
        </div>
      </div>

      <el-form
          label-position="top"
          class="user-form"
      >
        <!-- Firebase UID -->
        <el-form-item
            v-if="!editingUser"
            label="Firebase UID"
        >
          <el-input
              v-model="form.id"
              placeholder="Paste the existing Firebase UID"
          />
        </el-form-item>

        <!-- Name -->
        <el-form-item label="Name">
          <el-input
              v-model="form.name"
              placeholder="Student or staff name"
          />
        </el-form-item>

        <!-- Email -->
        <el-form-item
            v-if="!editingUser"
            label="Email"
        >
          <el-input
              v-model="form.email"
              type="email"
              placeholder="name@example.com"
          />
        </el-form-item>

        <!-- Phone -->
        <el-form-item label="Phone">
          <el-input
              v-model="form.phone"
              placeholder="Optional"
          />
        </el-form-item>

        <!-- Role -->
        <el-form-item label="Role">
          <el-select
              v-model="form.role"
              class="w-full"
          >
            <el-option
                v-for="role in availableRoles"
                :key="role"
                :label="formatRole(role)"
                :value="role"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- Footer -->
      <template #footer>
        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
              type="button"
              class="min-h-11 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
              @click="dialogVisible = false"
          >
            Cancel
          </button>

          <button
              type="button"
              class="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="saving"
              @click="saveUser"
          >
            <i
                v-if="saving"
                class="fi fi-rr-spinner animate-spin"
            ></i>

            <i
                v-else
                :class="
                  editingUser
                    ? 'fi fi-rr-check'
                    : 'fi fi-rr-user-add'
                "
            ></i>

            {{ editingUser ? 'Save Changes' : 'Initialize User' }}
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref
} from 'vue'

import {
  ElMessage,
  ElMessageBox
} from 'element-plus'

import studentConnect from '@/api'
import { currentUserProfile } from '@/services/auth'

const users = ref([])
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const dialogVisible = ref(false)
const editingUser = ref(null)

const searchQuery = ref('')
const roleFilter = ref('all')

const form = reactive({
  id: '',
  name: '',
  email: '',
  phone: '',
  role: 'user'
})

function canManage(target) {
  return currentUserProfile.value?.role === 'superadmin' ||
      target.role !== 'superadmin'
}

const filteredUsers = computed(() => {
  const query = searchQuery.value
      .trim()
      .toLowerCase()

  return users.value.filter((target) => {
    const matchesRole =
        roleFilter.value === 'all' ||
        target.role === roleFilter.value

    if (!matchesRole) {
      return false
    }

    if (!query) {
      return true
    }

    const searchableText = [
      target.name,
      target.email,
      target.phone,
      target.id
    ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

    return searchableText.includes(query)
  })
})

const administratorCount = computed(() => {
  return users.value.filter((target) =>
      ['admin', 'superadmin'].includes(target.role)
  ).length
})

const studentCount = computed(() => {
  return users.value.filter(
      (target) => target.role === 'user'
  ).length
})

function roleBadgeClass(role) {
  const classes = {
    user:
        'inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600',

    admin:
        'inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-700',

    superadmin:
        'inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700'
  }

  return classes[role] || classes.user
}

function roleDotClass(role) {
  const classes = {
    user: 'bg-slate-400',
    admin: 'bg-brand-500',
    superadmin: 'bg-amber-500'
  }

  return classes[role] || classes.user
}

function formatRole(role) {
  return {
    user: 'Student',
    admin: 'Admin',
    superadmin: 'Superadmin'
  }[role] || 'User'
}

function getInitials(name) {
  const value = String(name || '').trim()

  if (!value) {
    return 'U'
  }

  const parts = value
      .split(/\s+/)
      .filter(Boolean)

  if (parts.length === 1) {
    return parts[0]
        .slice(0, 2)
        .toUpperCase()
  }

  return (
      parts[0][0] +
      parts[parts.length - 1][0]
  ).toUpperCase()
}

function clearFilters() {
  searchQuery.value = ''
  roleFilter.value = 'all'
}

async function loadUsers() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response =
        await studentConnect.getUsers()

    users.value = Array.isArray(response.data)
        ? response.data
        : response.data?.users || []
  } catch (error) {
    errorMessage.value =
        error?.message ||
        'Unable to load users.'
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  editingUser.value = null

  Object.assign(form, {
    id: '',
    name: '',
    email: '',
    phone: '',
    role: 'user'
  })

  dialogVisible.value = true
}

function openEditDialog(target) {
  if (!canManage(target)) {
    return
  }

  editingUser.value = target

  Object.assign(form, {
    id: target.id,
    name: target.name || '',
    email: target.email || '',
    phone: target.phone || '',
    role: target.role || 'user'
  })

  dialogVisible.value = true
}

async function saveUser() {
  saving.value = true

  try {
    const response =
        editingUser.value
            ? await studentConnect.updateUser(
                editingUser.value.id,
                form
            )
            : await studentConnect.createUser(form)

    const savedUser = response.data

    if (editingUser.value) {
      const index =
          users.value.findIndex(
              (userItem) =>
                  userItem.id ===
                  editingUser.value.id
          )

      if (index !== -1) {
        users.value[index] = savedUser
      }
    } else {
      users.value.push(savedUser)
    }

    dialogVisible.value = false

    ElMessage.success(
        editingUser.value
            ? 'User updated successfully.'
            : 'User initialized successfully.'
    )
  } catch (error) {
    ElMessage.error(
        error?.message ||
        'Unable to save user.'
    )
  } finally {
    saving.value = false
  }
}

async function removeUser(target) {
  if (!canManage(target)) {
    return
  }

  try {
    await ElMessageBox.confirm(
        "This will remove the user's Student Connect profile and Firebase account.",
        'Remove User?',
        {
          confirmButtonText: 'Remove User',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
    )

    await studentConnect.deleteUser(target.id)

    users.value =
        users.value.filter(
            (userItem) =>
                userItem.id !== target.id
        )

    ElMessage.success(
        'User removed successfully.'
    )
  } catch (error) {
    if (
        error !== 'cancel' &&
        error !== 'close'
    ) {
      ElMessage.error(
          error?.message ||
          'Unable to remove user.'
      )
    }
  }
}

const availableRoles = computed(() => {
  return currentUserProfile.value?.role === 'superadmin'
      ? ['user', 'admin', 'superadmin']
      : ['user', 'admin']
})

onMounted(loadUsers)
</script>

<style scoped>
:deep(.el-table) {
  --el-table-border-color: #f1f5f9;
  --el-table-header-bg-color: #fafafa;
  --el-table-row-hover-bg-color: #fafdfb;
}

:deep(.el-table th.el-table__cell) {
  height: 48px;
  background: #fafafa;
  color: #64748b;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

:deep(.el-table td.el-table__cell) {
  padding: 14px 0;
}

:deep(.el-table .cell) {
  line-height: 1.4;
}

:deep(.el-dialog) {
  width: min(92vw, 520px);
  max-width: calc(100vw - 24px);
  border-radius: 18px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 20px 20px 16px;
  margin-right: 0;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-dialog__footer) {
  padding: 14px 20px 20px;
  border-top: 1px solid #f1f5f9;
}

:deep(.user-form .el-form-item__label) {
  color: #475569;
  font-size: 13px;
  font-weight: 500;
}

:deep(.user-form .el-input__wrapper),
:deep(.user-form .el-select__wrapper) {
  min-height: 42px;
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e2e8f0 inset;
}

:deep(.user-form .el-input__wrapper:hover),
:deep(.user-form .el-select__wrapper:hover) {
  box-shadow: 0 0 0 1px #cbd5e1 inset;
}

@media (max-width: 639px) {
  :deep(.el-dialog) {
    margin: 12px auto;
  }

  :deep(.el-dialog__header) {
    padding: 18px 18px 14px;
  }

  :deep(.el-dialog__body) {
    padding: 18px;
  }

  :deep(.el-dialog__footer) {
    padding: 12px 18px 18px;
  }

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }
}
</style>
