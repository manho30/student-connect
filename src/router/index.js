import { createRouter, createWebHistory } from 'vue-router'
import {
  currentUserProfile,
  getCurrentUser,
  setCurrentUserProfile,
  waitForAuthReady
} from '@/services/auth'
import studentConnect from '@/api'

const LoginView = () => import('@/views/LoginView.vue')
const CarpoolView = () => import('@/views/CarpoolView.vue')
const CarpoolFormView = () => import('@/views/CarpoolFormView.vue')
const ErrandsView = () => import('@/views/ErrandsView.vue')
const ErrandFormView = () => import('@/views/ErrandFormView.vue')
const StudyGroupsView = () => import('@/views/StudyGroupsView.vue')
const StudyFormView = () => import('@/views/StudyFormView.vue')
const ProfileView = () => import('@/views/ProfileView.vue')
const AdminUsersView = () => import('@/views/AdminUsersView.vue')
const StatisticsView = () => import('@/views/StatisticsView.vue')
const ActivitiesView = () => import('@/views/ActivitiesView.vue')
const ActivitiesFormView = () => import('@/views/ActivitiesFormView.vue')
const MyServicesView = () => import('@/views/MyServiceView.vue')

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      redirect: '/carpool'
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView
    },

    // Carpool Routes
    {
      path: '/carpool',
      name: 'carpool',
      component: CarpoolView,
      meta: { requiresAuth: true }
    },
    {
      path: '/carpool/new',
      name: 'carpool-new',
      component: CarpoolFormView,
      meta: { requiresAuth: true }
    },
    {
      path: '/carpool/edit',
      name: 'carpool-edit',
      component: CarpoolFormView,
      meta: { requiresAuth: true }
    },

    // Errands Routes
    {
      path: '/errands',
      name: 'errands',
      component: ErrandsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/errands/new',
      name: 'errands-new',
      component: ErrandFormView,
      meta: { requiresAuth: true }
    },
    {
      path: '/errands/edit',
      name: 'errands-edit',
      component: ErrandFormView,
      meta: { requiresAuth: true }
    },

    // Study Routes
    {
      path: '/study',
      name: 'study',
      component: StudyGroupsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/study/new',
      name: 'study-new',
      component: StudyFormView,
      meta: { requiresAuth: true }
    },
    {
      path: '/study/edit',
      name: 'study-edit',
      component: StudyFormView,
      meta: { requiresAuth: true }
    },

    // Activities Routes
    {
      path: '/activities',
      name: 'activities',
      component: ActivitiesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/activities/new',
      name: 'activities-new',
      component: ActivitiesFormView,
      meta: { requiresAuth: true }
    },
    {
      path: '/activities/edit',
      name: 'activities-edit',
      component: ActivitiesFormView,
      meta: { requiresAuth: true }
    },

    // User Profile
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile/services',
        name: 'My Services',
        component: MyServicesView,
        meta: { requiresAuth: true }
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: AdminUsersView,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/statistics',
      name: 'admin-statistics',
      component: StatisticsView,
      meta: { requiresAuth: true, requiresSuperadmin: true }
    },

    // Fallback redirect
    {
      path: '/:pathMatch(.*)*',
      redirect: '/carpool'
    }
  ]
})

/**
 * Authentication navigation guard.
 *
 * Directs unauthenticated students to the login screen and authenticated
 * students away from the login screen to the default dashboard.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target destination route.
 * @returns {Promise<boolean|string|Object>} Navigation decision.
 */
router.beforeEach(async (to) => {
  await waitForAuthReady()

  const isAuthenticated = Boolean(getCurrentUser())

  if (to.path === '/login' && isAuthenticated) {
    return '/carpool'
  }

  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    }
  }

  if (to.meta.requiresAdmin) {
    if (!currentUserProfile.value) {
      try {
        const response = await studentConnect.getCurrentUserProfile()
        setCurrentUserProfile(response.data)
      } catch {
        return '/profile'
      }
    }

    if (!['admin', 'superadmin'].includes(currentUserProfile.value?.role)) {
      return '/profile'
    }
  }

  if (to.meta.requiresSuperadmin) {
    if (!currentUserProfile.value) {
      try {
        const response = await studentConnect.getCurrentUserProfile()
        setCurrentUserProfile(response.data)
      } catch {
        return '/profile'
      }
    }

    if (currentUserProfile.value?.role !== 'superadmin') {
      return '/profile'
    }
  }

  return true
})

export default router
