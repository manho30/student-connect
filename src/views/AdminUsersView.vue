<template>
  <div class="space-y-6">
    <header class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">User Management</h1>
        <p class="mt-1 text-sm text-slate-500">Initialize and manage Student Connect profiles.</p>
      </div>
      <el-button type="primary" @click="openCreateDialog">Add User</el-button>
    </header>

    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div v-if="loading" class="py-12 text-center text-sm text-slate-500">Loading users...</div>
      <div v-else-if="errorMessage" class="py-8 text-center">
        <p class="text-sm font-semibold text-rose-500">{{ errorMessage }}</p>
        <el-button class="mt-4" @click="loadUsers">Retry</el-button>
      </div>
      <div v-else-if="users.length === 0" class="py-12 text-center text-sm text-slate-500">
        No users found.
      </div>
      <el-table v-else :data="users" stripe>
        <el-table-column prop="name" label="Name" min-width="160" />
        <el-table-column prop="email" label="Email" min-width="210" />
        <el-table-column prop="phone" label="Phone" min-width="150">
          <template #default="{ row }">{{ row.phone || 'Not provided' }}</template>
        </el-table-column>
        <el-table-column label="Role" width="140">
          <template #default="{ row }">
            <span :class="roleBadgeClass(row.role)">{{ row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" :disabled="!canManage(row)" @click="openEditDialog(row)">
              Edit
            </el-button>
            <el-button link type="danger" :disabled="!canManage(row)" @click="removeUser(row)">
              Remove
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>

    <el-dialog v-model="dialogVisible" :title="editingUser ? 'Edit User' : 'Add User'" width="min(92vw, 520px)">
      <p v-if="!editingUser" class="mb-4 rounded-xl bg-indigo-50 p-3 text-xs leading-relaxed text-indigo-700">
        This initializes a profile for an existing Firebase Authentication UID. It does not create a password or Firebase account.
      </p>
      <el-form label-position="top">
        <el-form-item v-if="!editingUser" label="Existing Firebase UID">
          <el-input v-model="form.id" placeholder="Firebase UID" />
        </el-form-item>
        <el-form-item label="Name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item v-if="!editingUser" label="Email">
          <el-input v-model="form.email" type="email" />
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="Role">
          <el-select v-model="form.role" class="w-full">
            <el-option v-for="role in availableRoles" :key="role" :label="role" :value="role" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" :loading="saving" @click="saveUser">
          {{ editingUser ? 'Save Changes' : 'Initialize User' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import studentConnect from '@/api'
import { currentUserProfile } from '@/services/auth'

const users = ref([])
const loading = ref(false)
const saving = ref(false)
const errorMessage = ref('')
const dialogVisible = ref(false)
const editingUser = ref(null)
const form = reactive({
  id: '',
  name: '',
  email: '',
  phone: '',
  role: 'user'
})

/**
 * Determines whether the current administrator may manage a target user.
 *
 * @param {Object} target - Target backend user profile.
 * @returns {boolean} True when the action is allowed by known UI rules.
 */
function canManage(target) {
  return currentUserProfile.value?.role === 'superadmin' ||
    target.role !== 'superadmin'
}

/**
 * Returns the visual classes for a backend role badge.
 *
 * @param {string} role - Backend role name.
 * @returns {string} Tailwind classes for the role badge.
 */
function roleBadgeClass(role) {
  const classes = {
    user: 'inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600',
    admin: 'inline-flex rounded-full bg-indigo-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-700',
    superadmin: 'inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700'
  }
  return classes[role] || classes.user
}

/**
 * Loads all users visible to the authenticated administrator.
 *
 * @returns {Promise<void>} Resolves after the user list state is updated.
 */
async function loadUsers() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await studentConnect.getUsers()
    users.value = Array.isArray(response.data)
      ? response.data
      : response.data?.users || []
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

/**
 * Resets and opens the profile initialization dialog.
 *
 * @returns {void} Opens the add-user form.
 */
function openCreateDialog() {
  editingUser.value = null
  Object.assign(form, { id: '', name: '', email: '', phone: '', role: 'user' })
  dialogVisible.value = true
}

/**
 * Opens the profile editor for a selected backend user.
 *
 * @param {Object} target - User profile to edit.
 * @returns {void} Opens the edit-user form.
 */
function openEditDialog(target) {
  if (!canManage(target)) return
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

/**
 * Saves a new or edited backend user profile.
 *
 * @returns {Promise<void>} Resolves after the user list is refreshed.
 */
async function saveUser() {
  saving.value = true

  try {
    const response = editingUser.value
      ? await studentConnect.updateUser(editingUser.value.id, form)
      : await studentConnect.createUser(form)
    const savedUser = response.data

    if (editingUser.value) {
      const index = users.value.findIndex((userItem) => userItem.id === editingUser.value.id)
      if (index !== -1) users.value[index] = savedUser
    } else {
      users.value.push(savedUser)
    }

    dialogVisible.value = false
    ElMessage.success(editingUser.value ? 'User updated successfully.' : 'User initialized successfully.')
  } catch (error) {
    ElMessage.error(error.message)
  } finally {
    saving.value = false
  }
}

/**
 * Confirms and removes a selected backend user.
 *
 * @param {Object} target - User profile to remove.
 * @returns {Promise<void>} Resolves after deletion or cancellation.
 */
async function removeUser(target) {
  if (!canManage(target)) return

  try {
    await ElMessageBox.confirm(
      "This will remove the user's Student Connect profile and Firebase account.",
      'Remove User?',
      { confirmButtonText: 'Remove User', cancelButtonText: 'Cancel', type: 'warning' }
    )
    await studentConnect.deleteUser(target.id)
    users.value = users.value.filter((userItem) => userItem.id !== target.id)
    ElMessage.success('User removed successfully.')
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error(error.message)
  }
}

/**
 * Returns roles allowed by the current backend profile's role.
 *
 * @returns {string[]} Role options for the editor.
 */
const availableRoles = computed(() => {
  return currentUserProfile.value?.role === 'superadmin'
    ? ['user', 'admin', 'superadmin']
    : ['user', 'admin']
})

onMounted(loadUsers)
</script>
