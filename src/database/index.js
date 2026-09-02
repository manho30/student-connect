// Central Database Entry Point (Database Abstraction Layer)
// This is the ONLY database module that Vue views and components should import.
// It wraps and decouples the underlying database provider (Cloudflare).

import cloudflare from './cloudflare'

const database = {
  auth: {
    login: (email, password) => cloudflare.loginUser(email, password),
    register: (data) => cloudflare.registerUser(data),
    getCurrentUser: () => cloudflare.getCurrentUser(),
    getAllUsers: () => cloudflare.getUsers()
  },

  carpool: {
    getAll: () => cloudflare.getCarpools(),
    getById: (id) => cloudflare.getCarpoolById(id),
    create: (data, user) => cloudflare.createCarpool(data, user),
    update: (id, data, user) => cloudflare.updateCarpool(id, data, user),
    delete: (id, user) => cloudflare.deleteCarpool(id, user),
    join: (id, user) => cloudflare.joinCarpool(id, user),
    leave: (id, user) => cloudflare.leaveCarpool(id, user)
  },

  errands: {
    getAll: () => cloudflare.getErrands(),
    getById: (id) => cloudflare.getErrandById(id),
    create: (data, user) => cloudflare.createErrand(data, user),
    accept: (id, user) => cloudflare.acceptErrand(id, user),
    complete: (id) => cloudflare.completeErrand(id)
  },

  studyGroups: {
    getAll: () => cloudflare.getStudyGroups(),
    getById: (id) => cloudflare.getStudyGroupById(id),
    create: (data, user) => cloudflare.createStudyGroup(data, user),
    join: (id, user) => cloudflare.joinStudyGroup(id, user),
    leave: (id, user) => cloudflare.leaveStudyGroup(id, user)
  },

  notifications: {
    getAll: (user) => cloudflare.getNotifications(user),
    send: (data) => cloudflare.sendNotification(data),
    notifyRideMembers: (carpoolId, statusPayload, hostUser) =>
      cloudflare.notifyRideMembers(carpoolId, statusPayload, hostUser),
    markAsRead: (id) => cloudflare.markNotificationRead(id),
    toggleRead: (id) => cloudflare.toggleNotificationRead(id),
    delete: (id) => cloudflare.deleteNotification(id),
    markAllAsRead: (user) => cloudflare.markAllNotificationsRead(user),
    clearAll: (user) => cloudflare.clearAllNotifications(user)
  }
}

export default database
