const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024

/**
 * Uploads an activity poster directly to the configured Cloudinary preset.
 *
 * @param {File} file - Image file selected by the user.
 * @returns {Promise<{url: string, publicId: string}>} Uploaded asset details.
 */
async function uploadActivityPoster(file) {
  if (!(file instanceof File)) {
    throw new Error('Please select an image file.')
  }

  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error('Poster must be JPG, PNG, or WebP.')
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Poster must be 5 MB or smaller.')
  }

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary upload is not configured.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', 'student-connect/activities')

  const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      { method: 'POST', body: formData }
  )

  const payload = await response.json()

  if (!response.ok || !payload.secure_url || !payload.public_id) {
    throw new Error(payload.error?.message || 'Poster upload failed.')
  }

  return {
    url: payload.secure_url,
    publicId: payload.public_id
  }
}

export {
  uploadActivityPoster
}
