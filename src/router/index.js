import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import CarpoolView from '../views/CarpoolView.vue'
import ErrandsView from '../views/ErrandsView.vue'
import StudyGroupsView from '../views/StudyGroupsView.vue'
import NotificationsView from '../views/NotificationsView.vue'

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
    {
      path: '/carpool',
      name: 'carpool',
      component: CarpoolView
    },
    {
      path: '/errands',
      name: 'errands',
      component: ErrandsView
    },
    {
      path: '/study-groups',
      name: 'study-groups',
      component: StudyGroupsView
    },
    {
      path: '/notify',
      name: 'notify',
      component: NotificationsView
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/carpool'
    }
  ]
})

// Authentication navigation guard
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
