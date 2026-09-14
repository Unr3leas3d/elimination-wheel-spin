import { describe, expect, it } from 'vitest'
import { TAU, easeOutCubic, indexAtPointer, secureRandom, spinTarget } from './wheel'

describe('indexAtPointer', () => {
    const count = 6
    const slice = TAU / count

    it('lands on the first sector with no rotation', () => {
        expect(indexAtPointer(0, count)).toBe(0)
        expect(indexAtPointer(-slice / 2, count)).toBe(0)
    })

    it('moves backwards through sectors as the wheel turns clockwise', () => {
        expect(indexAtPointer(slice / 2, count)).toBe(count - 1)
        expect(indexAtPointer(slice * 1.5, count)).toBe(count - 2)
        expect(indexAtPointer(slice * 1.5 + TAU * 7, count)).toBe(count - 2)
    })
})

describe('spinTarget', () => {
    it('gives every sector an equal share of landing angles', () => {
        const count = 5
        const samples = 1000
        const hits = new Array(count).fill(0)
        for (let k = 0; k < samples; k++) {
            const target = spinTarget(0, 5, (k + 0.5) / samples)
            hits[indexAtPointer(target, count)]++
        }
        expect(hits).toEqual(new Array(count).fill(samples / count))
    })

    it('always spins at least the requested number of turns', () => {
        expect(spinTarget(1, 5, 0)).toBeCloseTo(1 + 5 * TAU)
        expect(spinTarget(1, 5, 0.999)).toBeLessThan(1 + 6 * TAU)
    })
})

describe('secureRandom', () => {
    it('returns values in [0, 1)', () => {
        for (let i = 0; i < 1000; i++) {
            const value = secureRandom()
            expect(value).toBeGreaterThanOrEqual(0)
            expect(value).toBeLessThan(1)
        }
    })
})

describe('easeOutCubic', () => {
    it('starts at 0 and ends at 1', () => {
        expect(easeOutCubic(0)).toBe(0)
        expect(easeOutCubic(1)).toBe(1)
    })
})
