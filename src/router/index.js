/**
 * Student Connect Vue Router Configuration
 *
 * Defines the client-side navigation routes for Student Connect:
 *
 * Carpool:
 * - /carpool : Carpool listing (or detail if ?id=xxxxxxx)
 * - /carpool/new : Create a new carpool ride
 * - /carpool/edit : Edit existing carpool ride (?id=xxxxxxx)
 *
 * Errands:
 * - /errands : Errands listing (or detail if ?id=xxxxxxx)
 * - /errands/new : Post a new student errand
 * - /errands/edit : Edit existing student errand (?id=xxxxxxx)
 *
 * Study Groups:
 * - /study (and /study) : Study group listing (or detail if ?id=xxxxxxx)
 * - /study/new : Create a new study group
 * - /study/edit : Edit existing study group (?id=xxxxxxx)
 *
 * Authentication:
 * - /login : Firebase student authentication
 *
 * User Profile:
 * - /profile : View and edit user profile
 */

import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import CarpoolView from '../views/CarpoolView.vue'
import CarpoolFormView from '../views/CarpoolFormView.vue'
import ErrandsView from '../views/ErrandsView.vue'
import ErrandFormView from '../views/ErrandFormView.vue'
import ProfileView from '../views/ProfileView.vue'
import StudyGroupsView from '../views/StudyGroupsView.vue'
import StudyFormView from '../views/StudyFormView.vue'
import { getCurrentUser, waitForAuthReady } from '@/services/auth'

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

    // Study Group Routes
    {
      path: '/study',
      name: 'study',
      alias: '/study',
      component: StudyGroupsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/study/new',
      name: 'study-new',
      alias: '/study/new',
      component: StudyFormView,
      meta: { requiresAuth: true }
    },
    {
      path: '/study/edit',
      name: 'study-edit',
      alias: '/study/edit',
      component: StudyFormView,
      meta: { requiresAuth: true }
    },

    // Fallback redirect
    {
      path: '/:pathMatch(.*)*',
      redirect: '/carpool'
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    }
  ]
})

/**
 * Authentication navigation guard.
 *
 * Directs unauthenticated students to the login screen, and authenticated
 * students away from the login screen to the default dashboard.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target destination route.
 * @param {import('vue-router').RouteLocationNormalized} from - Origin source route.
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

  return true
})

export default router
