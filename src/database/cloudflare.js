// Cloudflare Database Implementation Provider
// Interacts with persistent database stores and enforces data integrity, participant tracking, and timestamps

import {
  demoUser,
  demoUsers,
  demoCarpools,
  demoCarpoolParticipants,
  demoErrands,
  demoStudyGroups,
  demoStudyGroupMembers,
  demoNotifications
} from './seed'

const STORAGE_KEYS = {
  USERS: 'cf_db_users',
  CARPOOLS: 'cf_db_carpools',
  CARPOOL_PARTICIPANTS: 'cf_db_carpool_participants',
  ERRANDS: 'cf_db_errands',
  STUDY_GROUPS: 'cf_db_study_groups',
  STUDY_GROUP_MEMBERS: 'cf_db_study_group_members',
  NOTIFICATIONS: 'cf_db_notifications'
}

function getStoredTable(key, defaultSeed) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultSeed))
      return JSON.parse(JSON.stringify(defaultSeed))
    }
    return JSON.parse(raw)
  } catch (e) {
    console.error(`Error reading store [${key}]:`, e)
    return JSON.parse(JSON.stringify(defaultSeed))
  }
}

function saveStoredTable(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error(`Error writing store [${key}]:`, e)
  }
}

const cloudflare = {
  // ==========================================
  // AUTH & USER MANAGEMENT
  // ==========================================
  async getUsers() {
    return getStoredTable(STORAGE_KEYS.USERS, demoUsers)
  },

  async registerUser(data) {
    const users = getStoredTable(STORAGE_KEYS.USERS, demoUsers)
    const name = data.name?.trim()
    const email = data.email?.trim().toLowerCase()
    const password = data.password?.trim()
    const matricNo = data.matricNo?.trim() || ''

    if (!name) {
      throw new Error('Please provide your full student name')
    }
    if (!email) {
      throw new Error('Please provide your student email')
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters long')
    }

    const emailExists = users.some((u) => u.email.toLowerCase() === email)
    if (emailExists) {
      throw new Error('An account with this student email is already registered. Please sign in instead.')
    }

    const newUser = {
      id: 'student-' + Date.now(),
      name,
      email,
      password,
      matricNo,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    saveStoredTable(STORAGE_KEYS.USERS, users)

    const { password: _, ...safeUser } = newUser
    return safeUser
  },

  async loginUser(email, password) {
    const users = getStoredTable(STORAGE_KEYS.USERS, demoUsers)
    const cleanEmail = email?.trim().toLowerCase()
    const cleanPass = password?.trim()

    const user = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
    )

    if (!user) {
      throw new Error('Invalid student email or password.')
    }

    const { password: _, ...safeUser } = user
    return safeUser
  },

  getCurrentUser() {
    try {
      const storedName = localStorage.getItem('student_user_name')
      const storedEmail = localStorage.getItem('student_user_email')
      const storedId = localStorage.getItem('student_user_id')
      const storedMatric = localStorage.getItem('student_user_matric')

      if (storedEmail) {
        return {
          id: storedId || 'student-001',
          name: storedName || 'Student',
          email: storedEmail,
          matricNo: storedMatric || ''
        }
      }
    } catch (e) {
      // ignore
    }
    return demoUser
  },

  // ==========================================
  // CARPOOLS & PARTICIPANTS
  // ==========================================
  async getCarpools() {
    const carpools = getStoredTable(STORAGE_KEYS.CARPOOLS, demoCarpools)
    const participants = getStoredTable(STORAGE_KEYS.CARPOOL_PARTICIPANTS, demoCarpoolParticipants)

    return carpools.map((carpool) => {
      const itemParticipants = participants.filter((p) => p.carpoolId === carpool.id)
      return {
        ...carpool,
        creator: carpool.creatorName || 'Student',
        joined: itemParticipants.length,
        joinedStudents: itemParticipants.map((p) => p.userName || p.userId),
        participants: itemParticipants
      }
    })
  },

  async getCarpoolById(id) {
    const all = await this.getCarpools()
    return all.find((c) => c.id === id) || null
  },

  async createCarpool(data, user = demoUser) {
    const carpools = getStoredTable(STORAGE_KEYS.CARPOOLS, demoCarpools)
    const participants = getStoredTable(STORAGE_KEYS.CARPOOL_PARTICIPANTS, demoCarpoolParticipants)

    const capacity = Number(data.capacity) === 6 ? 6 : 4
    const newId = 'c-' + Date.now()
    const now = new Date().toISOString()

    // Validate cost explicitly: do not auto-default undefined/empty to 0 silently
    let parsedCost = 0
    if (data.cost !== undefined && data.cost !== null && data.cost !== '') {
      parsedCost = Number(data.cost)
      if (isNaN(parsedCost) || parsedCost < 0) {
        throw new Error('Please specify a valid cost per person (enter 0 for free)')
      }
    } else {
      throw new Error('Please specify the cost per person (enter 0 if this ride is free)')
    }

    const newRecord = {
      id: newId,
      creatorId: user.id,
      creatorName: user.name,
      from: data.from?.trim() || '',
      to: data.to?.trim() || '',
      date: data.date || 'Today',
      time: data.time || '08:00 PM',
      capacity,
      cost: parsedCost,
      notes: data.notes?.trim() || '',
      createdAt: now,
      updatedAt: now
    }

    const creatorParticipant = {
      id: 'cp-' + Date.now(),
      carpoolId: newId,
      userId: user.id,
      userName: user.name,
      joinedAt: now
    }

    carpools.unshift(newRecord)
    participants.push(creatorParticipant)

    saveStoredTable(STORAGE_KEYS.CARPOOLS, carpools)
    saveStoredTable(STORAGE_KEYS.CARPOOL_PARTICIPANTS, participants)

    return {
      ...newRecord,
      creator: user.name,
      joined: 1,
      joinedStudents: [user.name],
      participants: [creatorParticipant]
    }
  },

  async updateCarpool(id, data, user = demoUser) {
    const carpools = getStoredTable(STORAGE_KEYS.CARPOOLS, demoCarpools)
    const index = carpools.findIndex((c) => c.id === id)
    if (index === -1) {
      throw new Error('Carpool ride not found')
    }

    const existing = carpools[index]
    const capacity = Number(data.capacity) === 6 ? 6 : 4

    // Validate cost explicitly
    let parsedCost = 0
    if (data.cost !== undefined && data.cost !== null && data.cost !== '') {
      parsedCost = Number(data.cost)
      if (isNaN(parsedCost) || parsedCost < 0) {
        throw new Error('Please specify a valid cost per person (enter 0 for free)')
      }
    } else {
      throw new Error('Please specify the cost per person (enter 0 if this ride is free)')
    }

    const updatedRecord = {
      ...existing,
      from: data.from?.trim() || existing.from,
      to: data.to?.trim() || existing.to,
      date: data.date || existing.date,
      time: data.time || existing.time,
      capacity,
      cost: parsedCost,
      notes: data.notes !== undefined ? data.notes.trim() : existing.notes,
      updatedAt: new Date().toISOString()
    }

    carpools[index] = updatedRecord
    saveStoredTable(STORAGE_KEYS.CARPOOLS, carpools)

    return this.getCarpoolById(id)
  },

  async deleteCarpool(id, user = demoUser) {
    let carpools = getStoredTable(STORAGE_KEYS.CARPOOLS, demoCarpools)
    let participants = getStoredTable(STORAGE_KEYS.CARPOOL_PARTICIPANTS, demoCarpoolParticipants)

    carpools = carpools.filter((c) => c.id !== id)
    participants = participants.filter((p) => p.carpoolId !== id)

    saveStoredTable(STORAGE_KEYS.CARPOOLS, carpools)
    saveStoredTable(STORAGE_KEYS.CARPOOL_PARTICIPANTS, participants)

    return true
  },

  async joinCarpool(id, user = demoUser) {
    const userId = typeof user === 'string' ? user : user.id
    const userName = typeof user === 'string' ? user : user.name

    const carpools = getStoredTable(STORAGE_KEYS.CARPOOLS, demoCarpools)
    const participants = getStoredTable(STORAGE_KEYS.CARPOOL_PARTICIPANTS, demoCarpoolParticipants)

    const carpool = carpools.find((c) => c.id === id)
    if (!carpool) {
      throw new Error('Carpool not found')
    }

    const currentParticipants = participants.filter((p) => p.carpoolId === id)

    // Rule: User cannot join twice
    const alreadyJoined = currentParticipants.some((p) => p.userId === userId || p.userName === userName)
    if (alreadyJoined) {
      return this.getCarpoolById(id)
    }

    // Rule: User cannot join full carpool
    if (currentParticipants.length >= Number(carpool.capacity)) {
      throw new Error('Carpool is already full')
    }

    const newParticipant = {
      id: 'cp-' + Date.now(),
      carpoolId: id,
      userId,
      userName,
      joinedAt: new Date().toISOString()
    }

    participants.push(newParticipant)
    saveStoredTable(STORAGE_KEYS.CARPOOL_PARTICIPANTS, participants)

    return this.getCarpoolById(id)
  },

  async leaveCarpool(id, user = demoUser) {
    const userId = typeof user === 'string' ? user : user.id
    const userName = typeof user === 'string' ? user : user.name

    let participants = getStoredTable(STORAGE_KEYS.CARPOOL_PARTICIPANTS, demoCarpoolParticipants)
    participants = participants.filter(
      (p) => !(p.carpoolId === id && (p.userId === userId || p.userName === userName))
    )

    saveStoredTable(STORAGE_KEYS.CARPOOL_PARTICIPANTS, participants)
    return this.getCarpoolById(id)
  },

  // ==========================================
  // ERRANDS
  // ==========================================
  async getErrands() {
    const errands = getStoredTable(STORAGE_KEYS.ERRANDS, demoErrands)
    return errands.map((errand) => ({
      ...errand,
      creator: errand.creatorName || 'Student',
      // backward compatibility for UI checks
      status: errand.status === 'ACCEPTED' ? 'accepted' : errand.status === 'COMPLETED' ? 'completed' : 'available'
    }))
  },

  async getErrandById(id) {
    const all = await this.getErrands()
    return all.find((e) => e.id === id) || null
  },

  async createErrand(data, user = demoUser) {
    const errands = getStoredTable(STORAGE_KEYS.ERRANDS, demoErrands)
    const newId = 'e-' + Date.now()
    const now = new Date().toISOString()

    const newRecord = {
      id: newId,
      creatorId: user.id,
      creatorName: user.name,
      title: data.title?.trim() || '',
      description: data.description?.trim() || '',
      category: data.category || 'Other',
      location: data.location?.trim() || '',
      deadline: data.deadline || 'Today',
      status: 'OPEN',
      acceptedBy: null,
      acceptedByName: null,
      createdAt: now,
      updatedAt: now
    }

    errands.unshift(newRecord)
    saveStoredTable(STORAGE_KEYS.ERRANDS, errands)

    return {
      ...newRecord,
      creator: user.name,
      status: 'available'
    }
  },

  async acceptErrand(id, user = demoUser) {
    const userId = typeof user === 'string' ? user : user.id
    const userName = typeof user === 'string' ? user : user.name

    const errands = getStoredTable(STORAGE_KEYS.ERRANDS, demoErrands)
    const index = errands.findIndex((e) => e.id === id)
    if (index === -1) {
      throw new Error('Errand not found')
    }

    const errand = errands[index]
    if (errand.status !== 'OPEN' && errand.status !== 'available') {
      throw new Error('Errand is already accepted or completed')
    }

    errand.status = 'ACCEPTED'
    errand.acceptedBy = userId
    errand.acceptedByName = userName
    errand.updatedAt = new Date().toISOString()

    errands[index] = errand
    saveStoredTable(STORAGE_KEYS.ERRANDS, errands)

    return this.getErrandById(id)
  },

  async completeErrand(id) {
    const errands = getStoredTable(STORAGE_KEYS.ERRANDS, demoErrands)
    const index = errands.findIndex((e) => e.id === id)
    if (index === -1) {
      throw new Error('Errand not found')
    }

    const errand = errands[index]
    errand.status = 'COMPLETED'
    errand.updatedAt = new Date().toISOString()

    errands[index] = errand
    saveStoredTable(STORAGE_KEYS.ERRANDS, errands)

    return this.getErrandById(id)
  },

  // ==========================================
  // STUDY GROUPS & MEMBERS
  // ==========================================
  async getStudyGroups() {
    const groups = getStoredTable(STORAGE_KEYS.STUDY_GROUPS, demoStudyGroups)
    const members = getStoredTable(STORAGE_KEYS.STUDY_GROUP_MEMBERS, demoStudyGroupMembers)

    return groups.map((group) => {
      const itemMembers = members.filter((m) => m.groupId === group.id)
      return {
        ...group,
        creator: group.creatorName || 'Student',
        members: itemMembers.length,
        maxMembers: group.capacity || 8,
        memberList: itemMembers.map((m) => m.userName || m.userId),
        groupMembers: itemMembers
      }
    })
  },

  async getStudyGroupById(id) {
    const all = await this.getStudyGroups()
    return all.find((g) => g.id === id) || null
  },

  async createStudyGroup(data, user = demoUser) {
    const groups = getStoredTable(STORAGE_KEYS.STUDY_GROUPS, demoStudyGroups)
    const members = getStoredTable(STORAGE_KEYS.STUDY_GROUP_MEMBERS, demoStudyGroupMembers)

    const capacity = Number(data.maxMembers || data.capacity) || 8
    const newId = 's-' + Date.now()
    const now = new Date().toISOString()

    const newRecord = {
      id: newId,
      creatorId: user.id,
      creatorName: user.name,
      name: data.name?.trim() || '',
      subject: data.subject?.trim() || '',
      description: data.description?.trim() || '',
      date: data.date || 'Saturday',
      time: data.time || '02:00 PM',
      location: data.location?.trim() || 'Library',
      capacity,
      createdAt: now,
      updatedAt: now
    }

    const creatorMember = {
      id: 'sm-' + Date.now(),
      groupId: newId,
      userId: user.id,
      userName: user.name,
      joinedAt: now
    }

    groups.unshift(newRecord)
    members.push(creatorMember)

    saveStoredTable(STORAGE_KEYS.STUDY_GROUPS, groups)
    saveStoredTable(STORAGE_KEYS.STUDY_GROUP_MEMBERS, members)

    return {
      ...newRecord,
      creator: user.name,
      members: 1,
      maxMembers: capacity,
      memberList: [user.name],
      groupMembers: [creatorMember]
    }
  },

  async joinStudyGroup(id, user = demoUser) {
    const userId = typeof user === 'string' ? user : user.id
    const userName = typeof user === 'string' ? user : user.name

    const groups = getStoredTable(STORAGE_KEYS.STUDY_GROUPS, demoStudyGroups)
    const members = getStoredTable(STORAGE_KEYS.STUDY_GROUP_MEMBERS, demoStudyGroupMembers)

    const group = groups.find((g) => g.id === id)
    if (!group) {
      throw new Error('Study group not found')
    }

    const currentMembers = members.filter((m) => m.groupId === id)

    // Rule: User cannot join twice
    const alreadyJoined = currentMembers.some((m) => m.userId === userId || m.userName === userName)
    if (alreadyJoined) {
      return this.getStudyGroupById(id)
    }

    // Rule: Group cannot exceed capacity
    if (currentMembers.length >= Number(group.capacity)) {
      throw new Error('Study group is at maximum capacity')
    }

    const newMember = {
      id: 'sm-' + Date.now(),
      groupId: id,
      userId,
      userName,
      joinedAt: new Date().toISOString()
    }

    members.push(newMember)
    saveStoredTable(STORAGE_KEYS.STUDY_GROUP_MEMBERS, members)

    return this.getStudyGroupById(id)
  },

  async leaveStudyGroup(id, user = demoUser) {
    const userId = typeof user === 'string' ? user : user.id
    const userName = typeof user === 'string' ? user : user.name

    let members = getStoredTable(STORAGE_KEYS.STUDY_GROUP_MEMBERS, demoStudyGroupMembers)
    members = members.filter(
      (m) => !(m.groupId === id && (m.userId === userId || m.userName === userName))
    )

    saveStoredTable(STORAGE_KEYS.STUDY_GROUP_MEMBERS, members)
    return this.getStudyGroupById(id)
  },

  // ==========================================
  // NOTIFICATION CENTRE & BROADCAST ALERTS
  // ==========================================
  async getNotifications(user = demoUser) {
    const userId = typeof user === 'string' ? user : user.id
    const userName = typeof user === 'string' ? user : user.name
    const notifications = getStoredTable(STORAGE_KEYS.NOTIFICATIONS, demoNotifications)

    // Return notifications targeted to this user, broadcasted, or sent by this user
    return notifications
      .filter((n) => {
        if (n.targetUserId === 'all' || n.targetUserId === userId || n.targetUserName === userName) {
          return true
        }
        if (n.senderId === userId || n.senderName === userName) {
          return true
        }
        return false
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  async sendNotification(data) {
    const notifications = getStoredTable(STORAGE_KEYS.NOTIFICATIONS, demoNotifications)
    const newNotif = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      type: data.type || 'GENERAL',
      title: data.title || 'Student Connect Update',
      message: data.message || '',
      entityType: data.entityType || 'general',
      entityId: data.entityId || null,
      senderId: data.senderId || 'system',
      senderName: data.senderName || 'Student Connect',
      targetUserId: data.targetUserId || 'all',
      targetUserName: data.targetUserName || 'All Members',
      isBroadcast: data.isBroadcast !== undefined ? data.isBroadcast : true,
      read: false,
      createdAt: new Date().toISOString()
    }

    notifications.unshift(newNotif)
    saveStoredTable(STORAGE_KEYS.NOTIFICATIONS, notifications)
    return newNotif
  },

  async notifyRideMembers(carpoolId, statusPayload, hostUser = demoUser) {
    const carpool = await this.getCarpoolById(carpoolId)
    if (!carpool) {
      throw new Error('Carpool ride not found')
    }

    const hostName = typeof hostUser === 'string' ? hostUser : hostUser.name || carpool.creator
    const hostId = typeof hostUser === 'string' ? hostUser : hostUser.id || carpool.creatorId

    const statusTitle = statusPayload.title || `Ride is Ready! 🚗`
    const statusMsg =
      statusPayload.message ||
      `${hostName} marked the carpool from ${carpool.from} to ${carpool.to} as Ready. Please head to the pickup point!`

    // Get all joined participants except the host
    const participants = carpool.participants || []
    const otherMembers = participants.filter(
      (p) => p.userId !== hostId && p.userName !== hostName
    )

    const notifications = getStoredTable(STORAGE_KEYS.NOTIFICATIONS, demoNotifications)
    const createdNotifs = []
    const now = new Date().toISOString()

    // 1. Broadcast notification to each joined passenger
    if (otherMembers.length > 0) {
      otherMembers.forEach((member) => {
        const notif = {
          id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
          type: 'CARPOOL_READY',
          title: statusTitle,
          message: statusMsg,
          entityType: 'carpool',
          entityId: carpool.id,
          senderId: hostId,
          senderName: hostName,
          targetUserId: member.userId,
          targetUserName: member.userName,
          isBroadcast: false,
          read: false,
          createdAt: now
        }
        notifications.unshift(notif)
        createdNotifs.push(notif)
      })
    } else {
      // If no other members yet, add a broadcast notification for record
      const notif = {
        id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
        type: 'CARPOOL_READY',
        title: statusTitle,
        message: `${hostName} set ride status: "${statusMsg}" (${carpool.from} ➔ ${carpool.to}). Waiting for passengers to arrive.`,
        entityType: 'carpool',
        entityId: carpool.id,
        senderId: hostId,
        senderName: hostName,
        targetUserId: 'all',
        targetUserName: 'All Members',
        isBroadcast: true,
        read: false,
        createdAt: now
      }
      notifications.unshift(notif)
      createdNotifs.push(notif)
    }

    saveStoredTable(STORAGE_KEYS.NOTIFICATIONS, notifications)
    return {
      success: true,
      recipientsCount: otherMembers.length,
      notifications: createdNotifs
    }
  },

  async markNotificationRead(id) {
    const notifications = getStoredTable(STORAGE_KEYS.NOTIFICATIONS, demoNotifications)
    const index = notifications.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications[index].read = true
      saveStoredTable(STORAGE_KEYS.NOTIFICATIONS, notifications)
    }
    return true
  },

  async markAllNotificationsRead(user = demoUser) {
    const userId = typeof user === 'string' ? user : user.id
    const userName = typeof user === 'string' ? user : user.name
    let notifications = getStoredTable(STORAGE_KEYS.NOTIFICATIONS, demoNotifications)

    notifications = notifications.map((n) => {
      if (n.targetUserId === 'all' || n.targetUserId === userId || n.targetUserName === userName) {
        return { ...n, read: true }
      }
      return n
    })

    saveStoredTable(STORAGE_KEYS.NOTIFICATIONS, notifications)
    return true
  },

  async toggleNotificationRead(id) {
    const notifications = getStoredTable(STORAGE_KEYS.NOTIFICATIONS, demoNotifications)
    const index = notifications.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications[index].read = !notifications[index].read
      saveStoredTable(STORAGE_KEYS.NOTIFICATIONS, notifications)
      return notifications[index]
    }
    return null
  },

  async deleteNotification(id) {
    let notifications = getStoredTable(STORAGE_KEYS.NOTIFICATIONS, demoNotifications)
    notifications = notifications.filter((n) => n.id !== id)
    saveStoredTable(STORAGE_KEYS.NOTIFICATIONS, notifications)
    return true
  },

  async clearAllNotifications(user = demoUser) {
    const userId = typeof user === 'string' ? user : user.id
    const userName = typeof user === 'string' ? user : user.name
    let notifications = getStoredTable(STORAGE_KEYS.NOTIFICATIONS, demoNotifications)

    notifications = notifications.filter(
      (n) => n.targetUserId !== 'all' && n.targetUserId !== userId && n.targetUserName !== userName
    )

    saveStoredTable(STORAGE_KEYS.NOTIFICATIONS, notifications)
    return true
  }
}

export default cloudflare
