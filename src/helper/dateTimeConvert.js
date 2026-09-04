/**
 * Converts a Unix timestamp in seconds into separate local date and time
 * strings suitable for the carpool form.
 *
 * The timestamp is interpreted as an absolute Unix timestamp, while the
 * returned date and time are formatted using the browser's local timezone.
 *
 * @param {number} unixDate - Unix timestamp in seconds.
 * @returns {{date: string, time: string}} Date in YYYY-MM-DD and time in HH:mm.
 * @throws {TypeError} If the supplied timestamp is not a valid number.
 */
const formatDateTime = (unixDate) => {
    if (
        typeof unixDate !== 'number' ||
        !Number.isFinite(unixDate)
    ) {
        throw new TypeError(
            'unixDate must be a valid Unix timestamp in seconds'
        )
    }

    const dateObj = new Date(unixDate * 1000)

    if (Number.isNaN(dateObj.getTime())) {
        throw new TypeError(
            'unixDate must represent a valid date'
        )
    }

    const year = dateObj.getFullYear()
    const month = String(
        dateObj.getMonth() + 1
    ).padStart(2, '0')
    const day = String(
        dateObj.getDate()
    ).padStart(2, '0')

    const hours = String(
        dateObj.getHours()
    ).padStart(2, '0')
    const minutes = String(
        dateObj.getMinutes()
    ).padStart(2, '0')

    return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`
    }
}

/**
 * Converts a local date and time into a Unix timestamp in seconds.
 *
 * The supplied date and time are interpreted as local browser time rather
 * than UTC. This prevents the selected Malaysian time from being shifted
 * by the UTC+8 timezone offset.
 *
 * @param {string} dateString - Date in YYYY-MM-DD format.
 * @param {string} timeString - Time in HH:mm format.
 * @returns {number} Unix timestamp in seconds.
 * @throws {TypeError} If the date or time format is invalid.
 */
const inverseFormatDateTime = (
    dateString,
    timeString
) => {
    if (
        typeof dateString !== 'string' ||
        typeof timeString !== 'string'
    ) {
        throw new TypeError(
            'dateString and timeString must be strings'
        )
    }

    const dateMatch = dateString.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
    )

    const timeMatch = timeString.match(
        /^(\d{2}):(\d{2})$/
    )

    if (!dateMatch || !timeMatch) {
        throw new TypeError(
            'Date must use YYYY-MM-DD and time must use HH:mm'
        )
    }

    const year = Number(dateMatch[1])
    const month = Number(dateMatch[2])
    const day = Number(dateMatch[3])
    const hour = Number(timeMatch[1])
    const minute = Number(timeMatch[2])

    const dateObj = new Date(
        year,
        month - 1,
        day,
        hour,
        minute,
        0,
        0
    )

    if (
        dateObj.getFullYear() !== year ||
        dateObj.getMonth() !== month - 1 ||
        dateObj.getDate() !== day ||
        dateObj.getHours() !== hour ||
        dateObj.getMinutes() !== minute
    ) {
        throw new TypeError(
            'Invalid date or time value'
        )
    }

    return Math.floor(
        dateObj.getTime() / 1000
    )
}

export {
    formatDateTime,
    inverseFormatDateTime
}
