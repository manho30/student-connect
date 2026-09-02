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
 * - /study (and /study-groups) : Study group listing (or detail if ?id=xxxxxxx)
 * - /study/new : Create a new study group
 * - /study/edit : Edit existing study group (?id=xxxxxxx)
 *
 * Authentication:
 * - /login : Student authentication and demo access
 */

import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import CarpoolView from '../views/CarpoolView.vue'
import CarpoolFormView from '../views/CarpoolFormView.vue'
import ErrandsView from '../views/ErrandsView.vue'
import ErrandFormView from '../views/ErrandFormView.vue'
import StudyGroupsView from '../views/StudyGroupsView.vue'
import StudyFormView from '../views/StudyFormView.vue'

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
      component: CarpoolView
    },
    {
      path: '/carpool/new',
      name: 'carpool-new',
      component: CarpoolFormView
    },
    {
      path: '/carpool/edit',
      name: 'carpool-edit',
      component: CarpoolFormView
    },

    // Errands Routes
    {
      path: '/errands',
      name: 'errands',
      component: ErrandsView
    },
    {
      path: '/errands/new',
      name: 'errands-new',
      component: ErrandFormView
    },
    {
      path: '/errands/edit',
      name: 'errands-edit',
      component: ErrandFormView
    },

    // Study Group Routes
    {
      path: '/study',
      name: 'study',
      alias: '/study-groups',
      component: StudyGroupsView
    },
    {
      path: '/study/new',
      name: 'study-new',
      alias: '/study-groups/new',
      component: StudyFormView
    },
    {
      path: '/study/edit',
      name: 'study-edit',
      alias: '/study-groups/edit',
      component: StudyFormView
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
 * Directs unauthenticated students to the login screen, and authenticated
 * students away from the login screen to the default dashboard.
 *
 * @param {import('vue-router').RouteLocationNormalized} to - Target destination route.
 * @param {import('vue-router').RouteLocationNormalized} from - Origin source route.
 * @param {import('vue-router').NavigationGuardNext} next - Navigation resolution callback.
 * @returns {void}
 */
router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('student_logged_in') === 'true'

  if (to.path === '/login') {
    if (isLoggedIn) {
      next('/carpool')
    } else {
      next()
    }
  } else {
    if (!isLoggedIn) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
