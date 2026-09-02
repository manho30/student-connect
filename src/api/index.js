/**
 * Student Connect API Client
 *
 * Centralized frontend communication layer for the Student Connect backend.
 *
 * All HTTP communication from the Vue application must pass through this module.
 *
 * The frontend does not communicate directly with the database.
 *
 * @module studentConnect
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

// Local storage fallback keys for offline prototype mode
const STORAGE_KEYS = {
  CARPOOLS: 'sc_carpools_data',
  ERRANDS: 'sc_errands_data',
  STUDY_GROUPS: 'sc_studygroups_data',
  USERS: 'sc_users_data'
}

/**
 * Initializes default prototype mock data in localStorage if empty.
 *
 * Ensures the frontend remains interactive in standalone development environments.
 *
 * @returns {void}
 */
function initDefaultData() {
  if (!localStorage.getItem(STORAGE_KEYS.CARPOOLS)) {
    const defaultCarpools = [
      {
        id: 'cp-1',
        from: 'Butterworth KTM Station',
        to: 'Penang Matriculation College (KMPP)',
        date: '2026-09-03',
        time: '04:30 PM',
        capacity: 4,
        joined: 3,
        cost: 6,
        creator: 'Alex Tan',
        creatorId: 'student-001',
        joinedStudents: ['Alex Tan', 'Sarah Lim', 'David Lee'],
        notes: 'Silver Toyota Vios waiting at the main pickup bay.'
      },
      {
        id: 'cp-2',
        from: 'Queensbay Mall',
        to: 'Main Campus Gate A',
        date: '2026-09-03',
        time: '07:00 PM',
        capacity: 6,
        joined: 2,
        cost: 8,
        creator: 'Manho',
        creatorId: 'student-002',
        joinedStudents: ['Manho', 'Chloe Wong'],
        notes: 'Red MPV heading back after dinner. 4 seats open.'
      },
      {
        id: 'cp-3',
        from: 'Penang Sentral',
        to: 'Kolej Kediaman 2',
        date: '2026-09-04',
        time: '02:00 PM',
        capacity: 4,
        joined: 4,
        cost: 5,
        creator: 'Nurul Huda',
        creatorId: 'student-003',
        joinedStudents: ['Nurul Huda', 'Marcus Lee', 'Priya', 'Hafiz'],
        notes: 'Fully booked ride.'
      }
    ]
    localStorage.setItem(STORAGE_KEYS.CARPOOLS, JSON.stringify(defaultCarpools))
  }

  if (!localStorage.getItem(STORAGE_KEYS.ERRANDS)) {
    const defaultErrands = [
      {
        id: 'er-1',
        title: 'Pick up Shopee parcel from Hub',
        description: 'Need someone to collect a parcel from Butterworth Parcel Locker. Order PIN will be provided.',
        category: 'Parcel',
        location: 'KTM Butterworth Hub',
        deadline: '2026-09-03 06:00 PM',
        status: 'available',
        creator: 'Sarah Lim',
        creatorId: 'student-004',
        acceptedBy: null,
        acceptedById: null
      },
      {
        id: 'er-2',
        title: 'Print 40 pages Biology Lecture Notes',
        description: 'Double-sided black & white printout from Central Library printing kiosk. PDF ready.',
        category: 'Printing',
        location: 'Central Library Level 1',
        deadline: '2026-09-03 08:30 PM',
        status: 'accepted',
        creator: 'David Lee',
        creatorId: 'student-005',
        acceptedBy: 'Manho',
        acceptedById: 'student-002'
      },
      {
        id: 'er-3',
        title: 'Buy iced Americano from Campus Cafe',
        description: 'Sugar-free iced Americano delivered to Block B study lounge.',
        category: 'Food',
        location: 'Campus Cafe Block B',
        deadline: '2026-09-02 05:00 PM',
        status: 'completed',
        creator: 'Chloe Wong',
        creatorId: 'student-006',
        acceptedBy: 'Alex Tan',
        acceptedById: 'student-001'
      }
    ]
    localStorage.setItem(STORAGE_KEYS.ERRANDS, JSON.stringify(defaultErrands))
  }

  if (!localStorage.getItem(STORAGE_KEYS.STUDY_GROUPS)) {
    const defaultStudy = [
      {
        id: 'sg-1',
        name: 'Cell Biology Revision & Past Year Papers',
        subject: 'Biology 101',
        description: 'Reviewing Chapter 4 to 7 questions and discussing previous semester exam trends.',
        date: '2026-09-04',
        time: '03:00 PM',
        location: 'Library Discussion Room 3',
        maxMembers: 6,
        members: 4,
        creator: 'Alex Tan',
        creatorId: 'student-001',
        memberList: ['Alex Tan', 'Sarah Lim', 'Manho', 'Chloe Wong']
      },
      {
        id: 'sg-2',
        name: 'Calculus II Problem Solving Marathon',
        subject: 'Mathematics',
        description: 'Solving challenging integration by parts and differential equations together.',
        date: '2026-09-05',
        time: '08:00 PM',
        location: 'Hostel Block C Common Study Room',
        maxMembers: 8,
        members: 3,
        creator: 'David Lee',
        creatorId: 'student-005',
        memberList: ['David Lee', 'Marcus Lee', 'Priya']
      },
      {
        id: 'sg-3',
        name: 'Organic Chemistry Reactions Review',
        subject: 'Chemistry',
        description: 'Group drill on reaction mechanisms and synthesis pathways for upcoming test.',
        date: '2026-09-06',
        time: '10:00 AM',
        location: 'Science Lab Foyer',
        maxMembers: 4,
        members: 4,
        creator: 'Nurul Huda',
        creatorId: 'student-003',
        memberList: ['Nurul Huda', 'Sarah Lim', 'Alex Tan', 'Hafiz']
      }
    ]
    localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(defaultStudy))
  }
}

// Run initial local data bootstrap
initDefaultData()

/**
 * Sends an HTTP request to the Student Connect backend API.
 *
 * Implements fallback handling for standalone frontend operation.
 *
 * @param {string} endpoint - API endpoint relative to the backend URL (e.g. '/api/carpools').
 * @param {Object} [options={}] - Fetch request options (method, headers, body).
 * @returns {Promise<Object>} Standardized API response object { success: boolean, message: string, data: any }.
 * @throws {Error} When the API request encounters an error.
 */
async function request(endpoint, options = {}) {
  // If backend base URL is provided, perform live network request
  if (API_BASE_URL) {
    try {
      const url = `${API_BASE_URL.replace(/\/$/, '')}${endpoint}`
      const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }

      const response = await fetch(url, {
        ...options,
        headers
      })

      const json = await response.json()

      if (!response.ok || json.success === false) {
        const errorMsg = json.message || `Request failed with status ${response.status}`
        throw new Error(errorMsg)
      }

      return json
    } catch (networkError) {
      console.warn(`[StudentConnect API] Backend request to ${endpoint} failed:`, networkError.message)
      throw networkError
    }
  }

  // Fallback simulator for offline prototype mode
  return handleMockRequest(endpoint, options)
}

/**
 * Simulates API request routing and persistence when running in offline/prototype mode.
 *
 * @param {string} endpoint - API endpoint path.
 * @param {Object} options - Request options including method and body.
 * @returns {Promise<Object>} Standard JSON response protocol.
 */
async function handleMockRequest(endpoint, options = {}) {
  // Simulate standard network latency (100ms)
  await new Promise((resolve) => setTimeout(resolve, 80))

  const method = (options.method || 'GET').toUpperCase()
  let body = null
  if (options.body) {
    try {
      body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body
    } catch (e) {
      body = options.body
    }
  }

  // 1. Carpools routing
  if (endpoint === '/api/carpools') {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARPOOLS) || '[]')
    if (method === 'GET') {
      return { success: true, message: 'Carpool list retrieved successfully', data: list }
    }
    if (method === 'POST') {
      const newCarpool = {
        id: `cp-${Date.now()}`,
        from: body.from || '',
        to: body.to || '',
        date: body.date || '',
        time: body.time || '',
        capacity: Number(body.capacity) || 4,
        joined: 1,
        cost: Number(body.cost) || 0,
        creator: body.creatorName || body.creator || 'Student',
        creatorId: body.creatorId || 'student-001',
        joinedStudents: [body.creatorName || body.creator || 'Student'],
        notes: body.notes || ''
      }
      list.unshift(newCarpool)
      localStorage.setItem(STORAGE_KEYS.CARPOOLS, JSON.stringify(list))
      return { success: true, message: 'Carpool created successfully', data: newCarpool }
    }
  }

  // Get specific Carpool by ID
  if (endpoint.startsWith('/api/carpools/') && !endpoint.includes('/join') && !endpoint.includes('/leave') && method === 'GET') {
    const id = endpoint.split('/')[3]
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARPOOLS) || '[]')
    const item = list.find((c) => String(c.id) === String(id))
    if (!item) {
      throw new Error(`Carpool ride with ID '${id}' was not found.`)
    }
    return { success: true, message: 'Carpool retrieved successfully', data: item }
  }

  // Update existing Carpool
  if (endpoint.startsWith('/api/carpools/') && !endpoint.includes('/join') && !endpoint.includes('/leave') && method === 'PUT') {
    const id = endpoint.split('/')[3]
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARPOOLS) || '[]')
    const index = list.findIndex((c) => String(c.id) === String(id))
    if (index !== -1) {
      list[index] = { ...list[index], ...body }
      localStorage.setItem(STORAGE_KEYS.CARPOOLS, JSON.stringify(list))
      return { success: true, message: 'Carpool updated successfully', data: list[index] }
    }
    throw new Error(`Carpool ride with ID '${id}' was not found.`)
  }

  // Carpool Join
  if (endpoint.startsWith('/api/carpools/') && endpoint.endsWith('/join')) {
    const parts = endpoint.split('/')
    const id = parts[3]
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARPOOLS) || '[]')
    const item = list.find((c) => String(c.id) === String(id))
    if (!item) throw new Error('Carpool ride not found')

    const userName = (body && body.userName) || 'Student'
    if (!item.joinedStudents) item.joinedStudents = [item.creator]
    if (!item.joinedStudents.includes(userName)) {
      if (item.joined < item.capacity) {
        item.joinedStudents.push(userName)
        item.joined = item.joinedStudents.length
        localStorage.setItem(STORAGE_KEYS.CARPOOLS, JSON.stringify(list))
      } else {
        throw new Error('This carpool is already fully booked')
      }
    }
    return { success: true, message: 'Joined carpool successfully', data: item }
  }

  // Carpool Leave
  if (endpoint.startsWith('/api/carpools/') && endpoint.endsWith('/leave')) {
    const parts = endpoint.split('/')
    const id = parts[3]
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARPOOLS) || '[]')
    const item = list.find((c) => String(c.id) === String(id))
    if (!item) throw new Error('Carpool ride not found')

    const userName = (body && body.userName) || 'Student'
    if (item.joinedStudents && item.joinedStudents.includes(userName)) {
      item.joinedStudents = item.joinedStudents.filter((u) => u !== userName)
      item.joined = Math.max(0, item.joinedStudents.length)
      localStorage.setItem(STORAGE_KEYS.CARPOOLS, JSON.stringify(list))
    }
    return { success: true, message: 'Left carpool successfully', data: item }
  }

  // 2. Errands routing
  if (endpoint === '/api/errands') {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ERRANDS) || '[]')
    if (method === 'GET') {
      return { success: true, message: 'Errands retrieved successfully', data: list }
    }
    if (method === 'POST') {
      const newErrand = {
        id: `er-${Date.now()}`,
        title: body.title || '',
        description: body.description || '',
        category: body.category || 'Other',
        location: body.location || '',
        deadline: body.deadline || '',
        status: 'available',
        creator: body.creatorName || body.creator || 'Student',
        creatorId: body.creatorId || 'student-001',
        acceptedBy: null,
        acceptedById: null
      }
      list.unshift(newErrand)
      localStorage.setItem(STORAGE_KEYS.ERRANDS, JSON.stringify(list))
      return { success: true, message: 'Errand created successfully', data: newErrand }
    }
  }

  // Get specific Errand by ID
  if (endpoint.startsWith('/api/errands/') && !endpoint.includes('/accept') && !endpoint.includes('/complete') && method === 'GET') {
    const id = endpoint.split('/')[3]
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ERRANDS) || '[]')
    const item = list.find((e) => String(e.id) === String(id))
    if (!item) {
      throw new Error(`Errand with ID '${id}' was not found.`)
    }
    return { success: true, message: 'Errand retrieved successfully', data: item }
  }

  // Update existing Errand
  if (endpoint.startsWith('/api/errands/') && !endpoint.includes('/accept') && !endpoint.includes('/complete') && method === 'PUT') {
    const id = endpoint.split('/')[3]
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ERRANDS) || '[]')
    const index = list.findIndex((e) => String(e.id) === String(id))
    if (index !== -1) {
      list[index] = { ...list[index], ...body }
      localStorage.setItem(STORAGE_KEYS.ERRANDS, JSON.stringify(list))
      return { success: true, message: 'Errand updated successfully', data: list[index] }
    }
    throw new Error(`Errand with ID '${id}' was not found.`)
  }

  // Errand Accept
  if (endpoint.startsWith('/api/errands/') && endpoint.endsWith('/accept')) {
    const parts = endpoint.split('/')
    const id = parts[3]
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ERRANDS) || '[]')
    const item = list.find((e) => String(e.id) === String(id))
    if (!item) throw new Error('Errand not found')

    item.status = 'accepted'
    item.acceptedBy = (body && body.userName) || 'Student'
    item.acceptedById = (body && body.userId) || 'student-001'
    localStorage.setItem(STORAGE_KEYS.ERRANDS, JSON.stringify(list))
    return { success: true, message: 'Errand accepted successfully', data: item }
  }

  // Errand Complete
  if (endpoint.startsWith('/api/errands/') && endpoint.endsWith('/complete')) {
    const parts = endpoint.split('/')
    const id = parts[3]
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.ERRANDS) || '[]')
    const item = list.find((e) => String(e.id) === String(id))
    if (!item) throw new Error('Errand not found')

    item.status = 'completed'
    localStorage.setItem(STORAGE_KEYS.ERRANDS, JSON.stringify(list))
    return { success: true, message: 'Errand marked completed', data: item }
  }

  // 3. Study Groups routing
  if (endpoint === '/api/study-groups') {
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDY_GROUPS) || '[]')
    if (method === 'GET') {
      return { success: true, message: 'Study groups retrieved successfully', data: list }
    }
    if (method === 'POST') {
      const newGroup = {
        id: `sg-${Date.now()}`,
        name: body.name || '',
        subject: body.subject || '',
        description: body.description || '',
        date: body.date || '',
        time: body.time || '',
        location: body.location || '',
        maxMembers: Number(body.maxMembers) || 8,
        members: 1,
        creator: body.creatorName || body.creator || 'Student',
        creatorId: body.creatorId || 'student-001',
        memberList: [body.creatorName || body.creator || 'Student']
      }
      list.unshift(newGroup)
      localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(list))
      return { success: true, message: 'Study group created successfully', data: newGroup }
    }
  }

  // Get specific Study Group by ID
  if (endpoint.startsWith('/api/study-groups/') && !endpoint.includes('/join') && !endpoint.includes('/leave') && method === 'GET') {
    const id = endpoint.split('/')[3]
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDY_GROUPS) || '[]')
    const item = list.find((g) => String(g.id) === String(id))
    if (!item) {
      throw new Error(`Study group with ID '${id}' was not found.`)
    }
    return { success: true, message: 'Study group retrieved successfully', data: item }
  }

  // Update existing Study Group
  if (endpoint.startsWith('/api/study-groups/') && !endpoint.includes('/join') && !endpoint.includes('/leave') && method === 'PUT') {
    const id = endpoint.split('/')[3]
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDY_GROUPS) || '[]')
    const index = list.findIndex((g) => String(g.id) === String(id))
    if (index !== -1) {
      list[index] = { ...list[index], ...body }
      localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(list))
      return { success: true, message: 'Study group updated successfully', data: list[index] }
    }
    throw new Error(`Study group with ID '${id}' was not found.`)
  }

  // Study Group Join
  if (endpoint.startsWith('/api/study-groups/') && endpoint.endsWith('/join')) {
    const parts = endpoint.split('/')
    const id = parts[3]
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDY_GROUPS) || '[]')
    const item = list.find((g) => String(g.id) === String(id))
    if (!item) throw new Error('Study group not found')

    const userName = (body && body.userName) || 'Student'
    if (!item.memberList) item.memberList = [item.creator]
    if (!item.memberList.includes(userName)) {
      if (item.members < item.maxMembers) {
        item.memberList.push(userName)
        item.members = item.memberList.length
        localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(list))
      } else {
        throw new Error('This study group is already full')
      }
    }
    return { success: true, message: 'Joined study group successfully', data: item }
  }

  // Study Group Leave
  if (endpoint.startsWith('/api/study-groups/') && endpoint.endsWith('/leave')) {
    const parts = endpoint.split('/')
    const id = parts[3]
    const list = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDY_GROUPS) || '[]')
    const item = list.find((g) => String(g.id) === String(id))
    if (!item) throw new Error('Study group not found')

    const userName = (body && body.userName) || 'Student'
    if (item.memberList && item.memberList.includes(userName)) {
      item.memberList = item.memberList.filter((u) => u !== userName)
      item.members = Math.max(0, item.memberList.length)
      localStorage.setItem(STORAGE_KEYS.STUDY_GROUPS, JSON.stringify(list))
    }
    return { success: true, message: 'Left study group successfully', data: item }
  }

  // 4. Authentication routing
  if (endpoint === '/api/login' && method === 'POST') {
    const email = (body.email || '').toLowerCase().trim()
    const name = email.split('@')[0] || 'Student'
    return {
      success: true,
      message: 'Login successful',
      data: {
        id: 'student-' + Math.floor(100 + Math.random() * 900),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        email: email,
        matricNo: 'MS2024' + Math.floor(10 + Math.random() * 90)
      }
    }
  }

  if (endpoint === '/api/register' && method === 'POST') {
    return {
      success: true,
      message: 'Registration successful',
      data: {
        id: 'student-' + Math.floor(100 + Math.random() * 900),
        name: body.name || 'Student',
        email: body.email,
        matricNo: body.matricNo || 'MS202488'
      }
    }
  }

  return { success: true, message: 'OK', data: {} }
}

/**
 * Retrieves all available carpools from the backend.
 *
 * @returns {Promise<Object>} API response containing the carpool list.
 */
function getAllCarPoolList() {
  return request('/api/carpools')
}

/**
 * Retrieves a single carpool by its unique ID.
 *
 * @param {string|number} id - Carpool unique identifier.
 * @returns {Promise<Object>} API response containing the specific carpool details.
 * @throws {Error} When the carpool cannot be found or request fails.
 */
function getCarPool(id) {
  return request(`/api/carpools/${id}`)
}

/**
 * Creates a new carpool.
 *
 * @param {Object} data - Carpool information submitted by the student.
 * @param {string} data.from - Starting location.
 * @param {string} data.to - Destination.
 * @param {string} data.date - Carpool date (YYYY-MM-DD).
 * @param {string} data.time - Carpool departure time.
 * @param {number} data.capacity - Maximum vehicle capacity (4 or 6).
 * @param {number} [data.cost=0] - Estimated cost per passenger.
 * @param {string} [data.notes] - Additional trip instructions or notes.
 * @returns {Promise<Object>} API response containing the created carpool.
 */
function createCarPool(data) {
  return request('/api/carpools', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Updates an existing carpool ride.
 *
 * @param {string|number} id - Carpool unique identifier.
 * @param {Object} data - Updated carpool fields.
 * @returns {Promise<Object>} API response containing the updated carpool.
 */
function updateCarPool(id, data) {
  return request(`/api/carpools/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

/**
 * Joins a specific carpool ride.
 *
 * @param {string|number} id - Carpool unique identifier.
 * @param {Object} data - Student join payload.
 * @param {string} data.userName - Student full name.
 * @param {string} [data.userId] - Student identifier.
 * @returns {Promise<Object>} API response containing updated carpool data.
 */
function joinCarPool(id, data = {}) {
  return request(`/api/carpools/${id}/join`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Leaves a specific carpool ride.
 *
 * @param {string|number} id - Carpool unique identifier.
 * @param {Object} data - Student leave payload.
 * @param {string} data.userName - Student full name.
 * @param {string} [data.userId] - Student identifier.
 * @returns {Promise<Object>} API response after leaving the carpool.
 */
function leaveCarPool(id, data = {}) {
  return request(`/api/carpools/${id}/leave`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Retrieves all available errands from the backend.
 *
 * @returns {Promise<Object>} API response containing the errand list.
 */
function getAllErrands() {
  return request('/api/errands')
}

/**
 * Retrieves a single student errand by its unique ID.
 *
 * @param {string|number} id - Errand unique identifier.
 * @returns {Promise<Object>} API response containing the specific errand details.
 * @throws {Error} When the errand cannot be found or request fails.
 */
function getErrand(id) {
  return request(`/api/errands/${id}`)
}

/**
 * Creates a new student errand.
 *
 * @param {Object} data - Errand details.
 * @param {string} data.title - Short title describing the task.
 * @param {string} data.description - Detailed errand instructions.
 * @param {string} data.category - Errand category (Food, Parcel, Printing, Stationery, Other).
 * @param {string} data.location - Pickup or drop-off location.
 * @param {string} data.deadline - Errand deadline date and time.
 * @returns {Promise<Object>} API response containing the created errand.
 */
function createErrand(data) {
  return request('/api/errands', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Updates an existing student errand.
 *
 * @param {string|number} id - Errand unique identifier.
 * @param {Object} data - Updated errand fields.
 * @returns {Promise<Object>} API response containing the updated errand.
 */
function updateErrand(id, data) {
  return request(`/api/errands/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

/**
 * Accepts a student errand.
 *
 * @param {string|number} id - Errand unique identifier.
 * @param {Object} data - Student accepting the errand.
 * @param {string} data.userName - Student full name.
 * @param {string} [data.userId] - Student identifier.
 * @returns {Promise<Object>} API response containing updated errand data.
 */
function acceptErrand(id, data = {}) {
  return request(`/api/errands/${id}/accept`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Marks an accepted errand as completed.
 *
 * @param {string|number} id - Errand unique identifier.
 * @returns {Promise<Object>} API response after marking errand completed.
 */
function completeErrand(id) {
  return request(`/api/errands/${id}/complete`, {
    method: 'POST'
  })
}

/**
 * Retrieves all available study groups from the backend.
 *
 * @returns {Promise<Object>} API response containing the study group list.
 */
function getAllStudyGroups() {
  return request('/api/study-groups')
}

/**
 * Retrieves a single study group by its unique ID.
 *
 * @param {string|number} id - Study group unique identifier.
 * @returns {Promise<Object>} API response containing the specific study group details.
 * @throws {Error} When the study group cannot be found or request fails.
 */
function getStudyGroup(id) {
  return request(`/api/study-groups/${id}`)
}

/**
 * Creates a new study group.
 *
 * @param {Object} data - Study group information.
 * @param {string} data.name - Study group title.
 * @param {string} data.subject - Academic course or subject name.
 * @param {string} data.description - Discussion goals and revision topics.
 * @param {string} data.date - Scheduled study date (YYYY-MM-DD).
 * @param {string} data.time - Scheduled study time.
 * @param {string} data.location - Meeting room or library venue.
 * @param {number} data.maxMembers - Maximum student capacity.
 * @returns {Promise<Object>} API response containing the created study group.
 */
function createStudyGroup(data) {
  return request('/api/study-groups', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Updates an existing study group.
 *
 * @param {string|number} id - Study group unique identifier.
 * @param {Object} data - Updated study group fields.
 * @returns {Promise<Object>} API response containing the updated study group.
 */
function updateStudyGroup(id, data) {
  return request(`/api/study-groups/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

/**
 * Joins a specific study group.
 *
 * @param {string|number} id - Study group unique identifier.
 * @param {Object} data - Student join payload.
 * @param {string} data.userName - Student full name.
 * @param {string} [data.userId] - Student identifier.
 * @returns {Promise<Object>} API response containing updated study group data.
 */
function joinStudyGroup(id, data = {}) {
  return request(`/api/study-groups/${id}/join`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Leaves a specific study group.
 *
 * @param {string|number} id - Study group unique identifier.
 * @param {Object} data - Student leave payload.
 * @param {string} data.userName - Student full name.
 * @param {string} [data.userId] - Student identifier.
 * @returns {Promise<Object>} API response after leaving the study group.
 */
function leaveStudyGroup(id, data = {}) {
  return request(`/api/study-groups/${id}/leave`, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Authenticates a student via the backend API.
 *
 * @param {Object} data - Login credentials.
 * @param {string} data.email - Student email address.
 * @param {string} data.password - Password.
 * @returns {Promise<Object>} API response containing authenticated student session data.
 */
function login(data) {
  return request('/api/login', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Registers a new student account via the backend API.
 *
 * @param {Object} data - Student registration details.
 * @param {string} data.name - Student full name.
 * @param {string} data.email - Student email.
 * @param {string} data.password - Student password.
 * @param {string} [data.matricNo] - Matric / student ID number.
 * @returns {Promise<Object>} API response containing new student data.
 */
function register(data) {
  return request('/api/register', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

const studentConnect = {
  request,
  getAllCarPoolList,
  getCarPool,
  createCarPool,
  updateCarPool,
  joinCarPool,
  leaveCarPool,
  getAllErrands,
  getErrand,
  createErrand,
  updateErrand,
  acceptErrand,
  completeErrand,
  getAllStudyGroups,
  getStudyGroup,
  createStudyGroup,
  updateStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
  login,
  register
}

export default studentConnect
export {
  studentConnect,
  request,
  getAllCarPoolList,
  getCarPool,
  createCarPool,
  updateCarPool,
  joinCarPool,
  leaveCarPool,
  getAllErrands,
  getErrand,
  createErrand,
  updateErrand,
  acceptErrand,
  completeErrand,
  getAllStudyGroups,
  getStudyGroup,
  createStudyGroup,
  updateStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
  login,
  register
}
