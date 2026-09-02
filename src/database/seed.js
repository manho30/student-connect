// Seed / Demo data for competition prototype
// Separated from database logic and engine

export const demoUser = {
  id: 'student-001',
  name: 'Manho',
  email: 'student@student.com',
  matricNo: 'STU-2026-001'
}

export const demoUsers = [
  {
    id: 'student-001',
    name: 'Manho',
    email: 'student@student.com',
    password: '123456',
    matricNo: 'STU-2026-001',
    createdAt: '2026-09-01T07:00:00.000Z'
  },
  {
    id: 'student-002',
    name: 'Farhan',
    email: 'farhan@student.com',
    password: '123456',
    matricNo: 'STU-2026-002',
    createdAt: '2026-09-01T07:00:00.000Z'
  }
]

export const demoCarpools = [
  {
    id: 'c-1',
    creatorId: 'student-002',
    creatorName: 'Farhan',
    from: 'Butterworth KTM',
    to: 'Matriculation College',
    date: '2026-09-02',
    time: '08:00 PM',
    capacity: 6,
    cost: 5,
    notes: 'Meeting near the main drop-off point at Butterworth KTM',
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'c-2',
    creatorId: 'student-003',
    creatorName: 'Ahmad',
    from: 'College Campus Gate A',
    to: 'Sunway Carnival Mall',
    date: '2026-09-03',
    time: '02:30 PM',
    capacity: 4,
    cost: 4,
    notes: 'Heading out for quick grocery run & lunch',
    createdAt: '2026-09-01T08:15:00.000Z',
    updatedAt: '2026-09-01T08:15:00.000Z'
  },
  {
    id: 'c-3',
    creatorId: 'student-004',
    creatorName: 'Kavitha',
    from: 'College Hostel',
    to: 'Penang Sentral Bus Terminal',
    date: '2026-09-04',
    time: '05:00 PM',
    capacity: 6,
    cost: 6,
    notes: 'Weekend balik kampung carpool. Please be on time!',
    createdAt: '2026-09-01T08:30:00.000Z',
    updatedAt: '2026-09-01T08:30:00.000Z'
  },
  {
    id: 'c-4',
    creatorId: 'student-005',
    creatorName: 'Bryan',
    from: 'Raja Uda Food Street',
    to: 'College Campus',
    date: '2026-09-05',
    time: '07:45 AM',
    capacity: 4,
    cost: 3,
    notes: 'Early morning ride before 8:30 AM lectures',
    createdAt: '2026-09-01T08:45:00.000Z',
    updatedAt: '2026-09-01T08:45:00.000Z'
  }
]

export const demoCarpoolParticipants = [
  // Carpool 1: 4 participants
  { id: 'cp-1', carpoolId: 'c-1', userId: 'student-002', userName: 'Farhan', joinedAt: '2026-09-01T08:00:00.000Z' },
  { id: 'cp-2', carpoolId: 'c-1', userId: 'student-006', userName: 'Wei Ming', joinedAt: '2026-09-01T08:05:00.000Z' },
  { id: 'cp-3', carpoolId: 'c-1', userId: 'student-007', userName: 'Divya', joinedAt: '2026-09-01T08:10:00.000Z' },
  { id: 'cp-4', carpoolId: 'c-1', userId: 'student-008', userName: 'Sarah', joinedAt: '2026-09-01T08:15:00.000Z' },

  // Carpool 2: 2 participants
  { id: 'cp-5', carpoolId: 'c-2', userId: 'student-003', userName: 'Ahmad', joinedAt: '2026-09-01T08:15:00.000Z' },
  { id: 'cp-6', carpoolId: 'c-2', userId: 'student-009', userName: 'Aisyah', joinedAt: '2026-09-01T08:20:00.000Z' },

  // Carpool 3: 5 participants
  { id: 'cp-7', carpoolId: 'c-3', userId: 'student-004', userName: 'Kavitha', joinedAt: '2026-09-01T08:30:00.000Z' },
  { id: 'cp-8', carpoolId: 'c-3', userId: 'student-010', userName: 'Jason', joinedAt: '2026-09-01T08:35:00.000Z' },
  { id: 'cp-9', carpoolId: 'c-3', userId: 'student-011', userName: 'Nurul', joinedAt: '2026-09-01T08:40:00.000Z' },
  { id: 'cp-10', carpoolId: 'c-3', userId: 'student-012', userName: 'Chong', joinedAt: '2026-09-01T08:45:00.000Z' },
  { id: 'cp-11', carpoolId: 'c-3', userId: 'student-013', userName: 'Zack', joinedAt: '2026-09-01T08:50:00.000Z' },

  // Carpool 4: 4 participants (Full)
  { id: 'cp-12', carpoolId: 'c-4', userId: 'student-005', userName: 'Bryan', joinedAt: '2026-09-01T08:45:00.000Z' },
  { id: 'cp-13', carpoolId: 'c-4', userId: 'student-014', userName: 'Haziq', joinedAt: '2026-09-01T08:50:00.000Z' },
  { id: 'cp-14', carpoolId: 'c-4', userId: 'student-015', userName: 'Siti', joinedAt: '2026-09-01T08:55:00.000Z' },
  { id: 'cp-15', carpoolId: 'c-4', userId: 'student-016', userName: 'Lim', joinedAt: '2026-09-01T09:00:00.000Z' }
]

export const demoErrands = [
  {
    id: 'e-1',
    creatorId: 'student-017',
    creatorName: 'Amira',
    title: 'Pick up Shopee parcel',
    description: 'Collect parcel from Butterworth parcel locker (Code: #9382). Package is already paid.',
    category: 'Parcel',
    location: 'Butterworth KTM Parcel Hub',
    deadline: '2026-09-02 06:00 PM',
    status: 'OPEN', // OPEN | ACCEPTED | COMPLETED
    acceptedBy: null,
    acceptedByName: null,
    createdAt: '2026-09-01T07:30:00.000Z',
    updatedAt: '2026-09-01T07:30:00.000Z'
  },
  {
    id: 'e-2',
    creatorId: 'student-018',
    creatorName: 'Marcus',
    title: 'Print 30-page Lab Report',
    description: 'Print Engineering Mechanics report with color cover and spiral binding.',
    category: 'Printing',
    location: 'Campus Printing Kiosk',
    deadline: '2026-09-03 10:30 AM',
    status: 'OPEN',
    acceptedBy: null,
    acceptedByName: null,
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-01T08:00:00.000Z'
  },
  {
    id: 'e-3',
    creatorId: 'student-019',
    creatorName: 'Darren',
    title: 'Buy Nasi Kandar lunch',
    description: '1x Ayam Madu + Sayur Kubis + Kuah Campur from Subaidah restaurant.',
    category: 'Food',
    location: 'Restoran Subaidah (Near Gate B)',
    deadline: '2026-09-01 01:15 PM',
    status: 'ACCEPTED',
    acceptedBy: 'student-001',
    acceptedByName: 'Manho',
    createdAt: '2026-09-01T08:20:00.000Z',
    updatedAt: '2026-09-01T08:30:00.000Z'
  },
  {
    id: 'e-4',
    creatorId: 'student-020',
    creatorName: 'Shanthi',
    title: 'Buy A4 Drawing Paper & 2B Pencils',
    description: 'Need 1 pack of 120gsm drawing paper for design studio submission.',
    category: 'Stationery',
    location: 'Popular Bookstore Megamall',
    deadline: '2026-09-04 04:00 PM',
    status: 'OPEN',
    acceptedBy: null,
    acceptedByName: null,
    createdAt: '2026-09-01T08:40:00.000Z',
    updatedAt: '2026-09-01T08:40:00.000Z'
  }
]

export const demoStudyGroups = [
  {
    id: 's-1',
    creatorId: 'student-021',
    creatorName: 'Zul',
    name: 'Biology Revision & Past Papers',
    subject: 'Cell Biology',
    description: 'Focusing on Chapter 5 — Cell Biology & Osmosis past year question drilling.',
    date: '2026-09-05',
    time: '02:00 PM',
    location: 'Library Level 2 (Discussion Pod 3)',
    capacity: 8,
    createdAt: '2026-09-01T07:00:00.000Z',
    updatedAt: '2026-09-01T07:00:00.000Z'
  },
  {
    id: 's-2',
    creatorId: 'student-001',
    creatorName: 'Manho',
    name: 'Calculus II Problem Solving',
    subject: 'Mathematics',
    description: 'Working through integration by parts, series convergence, and exam tips.',
    date: '2026-09-03',
    time: '04:30 PM',
    location: 'Student Activity Center Room B',
    capacity: 6,
    createdAt: '2026-09-01T07:15:00.000Z',
    updatedAt: '2026-09-01T07:15:00.000Z'
  },
  {
    id: 's-3',
    creatorId: 'student-022',
    creatorName: 'Kevin',
    name: 'Python & Web Tech Hack Session',
    subject: 'Computer Science',
    description: 'Debugging assignments and building small prototype features together.',
    date: '2026-09-06',
    time: '10:00 AM',
    location: 'Computer Lab 3 (Open Lounge)',
    capacity: 10,
    createdAt: '2026-09-01T07:30:00.000Z',
    updatedAt: '2026-09-01T07:30:00.000Z'
  }
]

export const demoStudyGroupMembers = [
  // Study Group 1: 4 members
  { id: 'sm-1', groupId: 's-1', userId: 'student-021', userName: 'Zul', joinedAt: '2026-09-01T07:00:00.000Z' },
  { id: 'sm-2', groupId: 's-1', userId: 'student-023', userName: 'Hannah', joinedAt: '2026-09-01T07:05:00.000Z' },
  { id: 'sm-3', groupId: 's-1', userId: 'student-024', userName: 'Praveen', joinedAt: '2026-09-01T07:10:00.000Z' },
  { id: 'sm-4', groupId: 's-1', userId: 'student-025', userName: 'Alicia', joinedAt: '2026-09-01T07:15:00.000Z' },

  // Study Group 2: 3 members
  { id: 'sm-5', groupId: 's-2', userId: 'student-001', userName: 'Manho', joinedAt: '2026-09-01T07:15:00.000Z' },
  { id: 'sm-6', groupId: 's-2', userId: 'student-026', userName: 'Li Wei', joinedAt: '2026-09-01T07:20:00.000Z' },
  { id: 'sm-7', groupId: 's-2', userId: 'student-027', userName: 'Irfan', joinedAt: '2026-09-01T07:25:00.000Z' },

  // Study Group 3: 7 members
  { id: 'sm-8', groupId: 's-3', userId: 'student-022', userName: 'Kevin', joinedAt: '2026-09-01T07:30:00.000Z' },
  { id: 'sm-9', groupId: 's-3', userId: 'student-028', userName: 'Natasha', joinedAt: '2026-09-01T07:35:00.000Z' },
  { id: 'sm-10', groupId: 's-3', userId: 'student-029', userName: 'Raj', joinedAt: '2026-09-01T07:40:00.000Z' },
  { id: 'sm-11', groupId: 's-3', userId: 'student-030', userName: 'Danial', joinedAt: '2026-09-01T07:45:00.000Z' },
  { id: 'sm-12', groupId: 's-3', userId: 'student-031', userName: 'Chloe', joinedAt: '2026-09-01T07:50:00.000Z' },
  { id: 'sm-13', groupId: 's-3', userId: 'student-032', userName: 'Zhi Hao', joinedAt: '2026-09-01T07:55:00.000Z' },
  { id: 'sm-14', groupId: 's-3', userId: 'student-033', userName: 'Fatin', joinedAt: '2026-09-01T08:00:00.000Z' }
]

export const demoNotifications = [
  {
    id: 'notif-1',
    type: 'CARPOOL_READY',
    title: 'Ride Ready to Depart! 🚗',
    message: 'Farhan has signaled that the Butterworth KTM carpool is ready and waiting at the pickup point.',
    entityType: 'carpool',
    entityId: 'c-1',
    senderId: 'student-002',
    senderName: 'Farhan',
    targetUserId: 'student-001',
    targetUserName: 'Manho',
    isBroadcast: false,
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString() // 12 mins ago
  },
  {
    id: 'notif-2',
    type: 'ERRAND_ACCEPTED',
    title: 'Errand Accepted 📦',
    message: 'Manho accepted the Nasi Kandar errand request from Darren.',
    entityType: 'errand',
    entityId: 'e-3',
    senderId: 'student-001',
    senderName: 'Manho',
    targetUserId: 'student-019',
    targetUserName: 'Darren',
    isBroadcast: false,
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 mins ago
  },
  {
    id: 'notif-3',
    type: 'STUDY_REMINDER',
    title: 'Study Pod Starting Soon 📚',
    message: 'Calculus II Problem Solving session starts at 04:30 PM in Student Activity Center.',
    entityType: 'study',
    entityId: 's-2',
    senderId: 'student-001',
    senderName: 'Manho',
    targetUserId: 'all',
    targetUserName: 'All Members',
    isBroadcast: true,
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
  }
]

