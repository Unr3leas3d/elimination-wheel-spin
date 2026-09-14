import { describe, expect, it } from 'vitest'
import { decodeNames, encodeNames, hasName, sanitizeNames } from './entries'

const legacy = (text) => Buffer.from(text, 'utf-8').toString('base64')

describe('encodeNames / decodeNames', () => {
    it('round-trips names containing commas and unicode', () => {
        const names = ['Smith, John', 'Zoë', '李雷', 'Party 🎉']
        expect(decodeNames(encodeNames(names), 12)).toEqual(names)
    })

    it('reads legacy comma-separated links', () => {
        expect(decodeNames(legacy('Alice,Bob,Zoë'), 12)).toEqual(['Alice', 'Bob', 'Zoë'])
    })

    it('returns an empty list for missing or malformed input', () => {
        expect(decodeNames(null, 12)).toEqual([])
        expect(decodeNames('%%%not-base64', 12)).toEqual([])
        expect(decodeNames(btoa('\xff\xfe'), 12)).toEqual([])
    })

    it('sanitizes decoded names', () => {
        const encoded = encodeNames(['a', 'A', '', '   ', 42, 'x'.repeat(30), 'b'])
        expect(decodeNames(encoded, 12)).toEqual(['a', 'x'.repeat(20), 'b'])
    })

    it('caps the number of names', () => {
        const names = Array.from({ length: 50 }, (_, i) => `n${i}`)
        expect(decodeNames(encodeNames(names), 12)).toHaveLength(12)
    })
})

describe('sanitizeNames', () => {
    it('trims and removes blanks and duplicates', () => {
        expect(sanitizeNames([' Ann ', 'ann', 'Bo', ''], 12)).toEqual(['Ann', 'Bo'])
    })

    it('does not split emoji when truncating', () => {
        const [name] = sanitizeNames(['🎉'.repeat(25)], 12)
        expect(Array.from(name)).toHaveLength(20)
        expect(name).toBe('🎉'.repeat(20))
    })
})

describe('hasName', () => {
    it('matches case-insensitively', () => {
        expect(hasName(['Alice'], 'aLICE')).toBe(true)
        expect(hasName(['Alice'], 'Bob')).toBe(false)
    })
})
