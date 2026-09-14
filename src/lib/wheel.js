export const TAU = Math.PI * 2

export const normalizeAngle = (angle) => ((angle % TAU) + TAU) % TAU

// Sectors are drawn clockwise starting at the top, offset by `rotation`; the pointer sits at the top
export const indexAtPointer = (rotation, count) =>
    Math.floor(normalizeAngle(-rotation) / (TAU / count)) % count

// `fraction` in [0, 1) picks the landing angle uniformly, so every sector is equally likely
export const spinTarget = (start, turns, fraction) => start + (turns + fraction) * TAU

export const easeOutCubic = (t) => 1 - (1 - t) ** 3

export function secureRandom() {
    const [value] = crypto.getRandomValues(new Uint32Array(1))
    return value / 2 ** 32
}
