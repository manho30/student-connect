import { computed, ref } from 'vue'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth'
import { auth } from '@/firebase/config'

const user = ref(null)
const currentUserProfile = ref(null)
const authLoading = ref(true)
const isAuthenticated = computed(() => Boolean(user.value))

let resolveAuthReady

const authReady = new Promise((resolve) => {
  resolveAuthReady = resolve
})

firebaseOnAuthStateChanged(auth, (firebaseUser) => {
  user.value = firebaseUser

  if (!firebaseUser) {
    currentUserProfile.value = null
  }

  authLoading.value = false
  resolveAuthReady(firebaseUser)
})

/**
 * Stores the backend profile associated with the current Firebase user.
 *
 * @param {Object|null} profile - Backend user profile or null when unavailable.
 * @returns {Object|null} The stored backend profile.
 */
function setCurrentUserProfile(profile) {
  currentUserProfile.value = profile
  return currentUserProfile.value
}

/**
 * Signs a student in through Firebase Authentication.
 *
 * @param {string} email - Student email address.
 * @param {string} password - Student password.
 * @returns {Promise<import('firebase/auth').UserCredential>} Firebase sign-in result.
 * @throws {Error} When Firebase rejects the credentials.
 */
function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

/**
 * Signs a student in through Firebase Authentication with Google.
 *
 * Uses Firebase's GoogleAuthProvider and popup-based authentication.
 * The original Firebase error is intentionally rethrown so the caller
 * can handle specific authentication error codes such as
 * auth/popup-blocked and auth/popup-closed-by-user.
 *
 * @returns {Promise<import('firebase/auth').UserCredential>} Firebase sign-in result.
 * @throws {Error} When Google authentication fails.
 */
async function signInWithGoogle() {
  const provider = new GoogleAuthProvider()

  provider.setCustomParameters({
    prompt: 'select_account'
  })

  try {
    return await signInWithPopup(auth, provider)
  } catch (error) {
    console.error('Firebase Google sign-in failed:', error)
    throw error
  }
}

/**
 * Creates a student account through Firebase Authentication.
 *
 * @param {string} email - Student email address.
 * @param {string} password - Student password.
 * @param {string} [displayName] - Optional student display name.
 * @returns {Promise<import('firebase/auth').UserCredential>} Firebase registration result.
 * @throws {Error} When Firebase rejects the registration.
 */
async function register(email, password, displayName = '') {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  )

  if (displayName.trim()) {
    await updateProfile(credential.user, {
      displayName: displayName.trim()
    })
  }

  return credential
}

/**
 * Signs the current student out of Firebase Authentication.
 *
 * @returns {Promise<void>} Resolves after Firebase clears the session.
 * @throws {Error} When Firebase cannot complete sign-out.
 */
function logout() {
  return signOut(auth)
}

/**
 * Returns the Firebase user currently known by the Auth SDK.
 *
 * @returns {import('firebase/auth').User|null} Current Firebase user, if signed in.
 */
function getCurrentUser() {
  return auth.currentUser
}

/**
 * Gets a current Firebase ID token for authenticated backend requests.
 *
 * @returns {Promise<string>} Current Firebase ID token.
 * @throws {Error} When no authenticated Firebase user exists.
 */
async function getIdToken() {
  const currentUser = getCurrentUser()

  if (!currentUser) {
    throw new Error('Authentication is required for this request.')
  }

  return currentUser.getIdToken()
}

/**
 * Subscribes to Firebase authentication state changes.
 *
 * @param {(currentUser: import('firebase/auth').User|null) => void} callback - State callback.
 * @returns {() => void} Function that removes the subscription.
 */
function onAuthStateChanged(callback) {
  return firebaseOnAuthStateChanged(auth, callback)
}

/**
 * Waits until Firebase has restored the persisted authentication state.
 *
 * @returns {Promise<import('firebase/auth').User|null>} Resolved Firebase user state.
 */
function waitForAuthReady() {
  return authReady
}

export {
  authLoading,
  currentUserProfile,
  getCurrentUser,
  getIdToken,
  isAuthenticated,
  login,
  logout,
  onAuthStateChanged,
  register,
  setCurrentUserProfile,
  signInWithGoogle,
  user,
  waitForAuthReady
}
