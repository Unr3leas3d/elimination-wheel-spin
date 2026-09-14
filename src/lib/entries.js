export const MAX_ENTRIES = 12
export const MAX_NAME_LENGTH = 20
export const MAX_ELIMINATED = 100

const nameKey = (name) => name.toLowerCase()

export const hasName = (names, name) => names.some((n) => nameKey(n) === nameKey(name))

export const cleanName = (name) =>
    Array.from(name.trim()).slice(0, MAX_NAME_LENGTH).join('').trim()

// Trims, truncates, drops blanks and case-insensitive duplicates, and caps the list length
export function sanitizeNames(names, limit) {
    const result = []
    for (const raw of names) {
        if (typeof raw !== 'string') continue
        const name = cleanName(raw)
        if (name && !hasName(result, name)) result.push(name)
        if (result.length >= limit) break
    }
    return result
}

const toBase64 = (text) => {
    let binary = ''
    for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte)
    return btoa(binary)
}

const fromBase64 = (encoded) =>
    new TextDecoder('utf-8', { fatal: true }).decode(
        Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0)),
    )

// Names are stored in the URL as a Base64-encoded JSON array
export const encodeNames = (names) => toBase64(JSON.stringify(names))

export function decodeNames(encoded, limit) {
    if (!encoded) return []
    let text
    try {
        text = fromBase64(encoded)
    } catch {
        return []
    }
    let names
    try {
        names = JSON.parse(text)
    } catch {
        names = null
    }
    // Older links stored a plain comma-separated list
    if (!Array.isArray(names)) names = text.split(',')
    return sanitizeNames(names, limit)
}
