/**
 * Centralized Student Connect backend API client.
 *
 * @module studentConnect
 */

import { getCurrentUser, getIdToken } from '@/services/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || ''

/**
 * Sends an HTTP request to the Student Connect backend.
 *
 * @param {string} path - API endpoint path.
 * @param {Object} [options={}] - Fetch request options.
 * @param {boolean} [requiresAuth=true] - Whether a Firebase ID token is required.
 * @returns {Promise<Object>} Parsed backend response.
 * @throws {Error} When authentication is unavailable or the request fails.
 */
async function request(path, options = {}, auth = true) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  if (auth) {
    if (!getCurrentUser()) {
      throw new Error('Authentication is required for this request.')
    }

    const token = await getIdToken()
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(
    `${API_BASE_URL.replace(/\/$/, '')}${path}`,
    {
      ...options,
      headers
    }
  )

  let json

  try {
    json = await response.json()
  } catch {
    throw new Error(`Backend returned an invalid JSON response (${response.status})`)
  }

  if (!response.ok || json.success === false) {
    throw new Error(
      json.message || `Request failed with status ${response.status}`
    )
  }

  return json
}

/**
 * Retrieves all available carpools.
 *
 * @returns {Promise<Object>} API response containing carpools.
 */
function getAllCarPoolList() {
  return request('/api/carpools', {}, false)
}

/**
 * Retrieves one carpool.
 *
 * @param {string} id - Carpool identifier.
 * @returns {Promise<Object>} API response containing the carpool.
 */
function getCarPool(id) {
  return request(`/api/carpools/${encodeURIComponent(id)}`, {}, false)
}

/**
 * Creates a carpool.
 *
 * @param {Object} data - Carpool form data.
 * @returns {Promise<Object>} API response containing the created carpool.
 */
function createCarPool(data) {
  return request('/api/carpools', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Deletes a carpool owned by the authenticated user.
 *
 * @param {string} id - Carpool identifier.
 * @returns {Promise<Object>} API response confirming deletion.
 */
function deleteCarPool(id) {
    return request(`/api/carpools/${encodeURIComponent(id)}`, {
        method: 'DELETE'
    })
}

/**
 * Updates a carpool.
 *
 * @param {string} id - Carpool identifier.
 * @param {Object} data - Updated carpool form data.
 * @returns {Promise<Object>} API response containing the updated carpool.
 */
function updateCarPool(id, data) {
  return request(`/api/carpools/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

/**
 * Joins a carpool using the authenticated Firebase user.
 *
 * @param {string} id - Carpool identifier.
 * @returns {Promise<Object>} API response containing the updated carpool.
 */
function joinCarPool(id) {
  return request(`/api/carpools/${encodeURIComponent(id)}/join`, {
    method: 'POST'
  })
}

/**
 * Leaves a carpool using the authenticated Firebase user.
 *
 * @param {string} id - Carpool identifier.
 * @returns {Promise<Object>} API response containing the updated carpool.
 */
function leaveCarPool(id) {
  return request(`/api/carpools/${encodeURIComponent(id)}/leave`, {
    method: 'POST'
  })
}

/**
 * Retrieves all errands.
 *
 * @returns {Promise<Object>} API response containing errands.
 */
function getAllErrands() {
  return request('/api/errands', {}, false)
}

/**
 * Retrieves one errand.
 *
 * @param {string} id - Errand identifier.
 * @returns {Promise<Object>} API response containing the errand.
 */
function getErrand(id) {
  return request(`/api/errands/${encodeURIComponent(id)}`, {}, false)
}

/**
 * Creates an errand.
 *
 * @param {Object} data - Errand form data.
 * @returns {Promise<Object>} API response containing the created errand.
 */
function createErrand(data) {
  return request('/api/errands', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Updates an errand.
 *
 * @param {string} id - Errand identifier.
 * @param {Object} data - Updated errand form data.
 * @returns {Promise<Object>} API response containing the updated errand.
 */
function updateErrand(id, data) {
  return request(`/api/errands/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

/**
 * Deletes an errand owned by the authenticated user.
 *
 * @param {string} id - Errand identifier.
 * @returns {Promise<Object>} API response confirming deletion.
 */
function deleteErrand(id) {
  return request(`/api/errands/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  })
}

/**
 * Cancels the current user's acceptance of an errand.
 *
 * @param {string} id - The errand ID.
 * @returns {Promise<Object>} The updated errand returned by the backend.
 * @throws {Error} When the backend request fails.
 */
async function cancelErrandAcceptance(id) {
  return request(`/api/errands/${encodeURIComponent(id)}/cancel-acceptance`, {
    method: 'POST'
  })
}

/**
 * Accepts an errand using the authenticated Firebase user.
 *
 * @param {string} id - Errand identifier.
 * @returns {Promise<Object>} API response containing the updated errand.
 */
function acceptErrand(id) {
  return request(`/api/errands/${encodeURIComponent(id)}/accept`, {
    method: 'POST'
  })
}

/**
 * Cancels an errand or withdraws the authenticated user's acceptance.
 *
 * @param {string} id - Errand identifier.
 * @returns {Promise<Object>} API response containing the updated errand.
 */
function cancelErrand(id) {
  return request(`/api/errands/${encodeURIComponent(id)}/cancel`, {
    method: 'POST'
  })
}

/**
 * Marks an errand as completed.
 *
 * @param {string} id - Errand identifier.
 * @returns {Promise<Object>} API response containing the updated errand.
 */
function completeErrand(id) {
  return request(`/api/errands/${encodeURIComponent(id)}/complete`, {
    method: 'POST'
  })
}

/**
 * Retrieves all study groups.
 *
 * @returns {Promise<Object>} API response containing study groups.
 */
function getAllStudyGroups() {
  return request('/api/study', {}, false)
}

/**
 * Retrieves one study group.
 *
 * @param {string} id - Study group identifier.
 * @returns {Promise<Object>} API response containing the study group.
 */
function getStudyGroup(id) {
  return request(`/api/study/${encodeURIComponent(id)}`, {}, false)
}

/**
 * Creates a study group.
 *
 * @param {Object} data - Study group form data.
 * @returns {Promise<Object>} API response containing the created study group.
 */
function createStudyGroup(data) {
  return request('/api/study', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Updates a study group.
 *
 * @param {string} id - Study group identifier.
 * @param {Object} data - Updated study group form data.
 * @returns {Promise<Object>} API response containing the updated study group.
 */
function updateStudyGroup(id, data) {
  return request(`/api/study/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

/**
 * Deletes a study group owned by the authenticated user.
 *
 * @param {string} id - Study group identifier.
 * @returns {Promise<Object>} API response confirming deletion.
 */
function deleteStudyGroup(id) {
  return request(`/api/study/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  })
}

/**
 * Joins a study group using the authenticated Firebase user.
 *
 * @param {string} id - Study group identifier.
 * @returns {Promise<Object>} API response containing the updated study group.
 */
function joinStudyGroup(id) {
  return request(`/api/study/${encodeURIComponent(id)}/join`, {
    method: 'POST'
  })
}

/**
 * Leaves a study group using the authenticated Firebase user.
 *
 * @param {string} id - Study group identifier.
 * @returns {Promise<Object>} API response containing the updated study group.
 */
function leaveStudyGroup(id) {
    return request(`/api/study/${encodeURIComponent(id)}/leave`, {
    method: 'DELETE'
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
  deleteCarPool,
  getAllErrands,
  getErrand,
  createErrand,
  updateErrand,
  deleteErrand,
  acceptErrand,
  cancelErrand,
  cancelErrandAcceptance,
  completeErrand,
  getAllStudyGroups,
  getStudyGroup,
  createStudyGroup,
  updateStudyGroup,
  deleteStudyGroup,
  joinStudyGroup,
  leaveStudyGroup
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
  deleteCarPool,
  getAllErrands,
  getErrand,
  createErrand,
  updateErrand,
  deleteErrand,
  acceptErrand,
  cancelErrand,
  cancelErrandAcceptance,
  completeErrand,
  getAllStudyGroups,
  getStudyGroup,
  createStudyGroup,
  updateStudyGroup,
  deleteStudyGroup,
  joinStudyGroup,
  leaveStudyGroup
}
