import { useState } from 'react'
import * as Separator from '@radix-ui/react-separator'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

const MAX_ENTRIES = 12

export default function Controls({ entries, onAddEntry, onRemoveEntry, disabled }) {
    const [input, setInput] = useState('')
    const [error, setError] = useState('')

    const handleAdd = () => {
        const trimmed = input.trim()
        if (!trimmed) {
            setError('Enter a name')
            return
        }
        if (entries.length >= MAX_ENTRIES) {
            setError(`Maximum ${MAX_ENTRIES} entries allowed`)
            return
        }
        if (entries.some((e) => e.toLowerCase() === trimmed.toLowerCase())) {
            setError('Duplicate entry')
            return
        }
        setError('')
        onAddEntry(trimmed)
        setInput('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleAdd()
    }

    return (
        <div className="space-y-3">
            {/* Input row */}
            <div className="flex gap-2">
                <label htmlFor="entry-input">
                    <VisuallyHidden.Root>Enter participant name</VisuallyHidden.Root>
                </label>
                <input
                    id="entry-input"
                    type="text"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setError('') }}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    placeholder=""
                    maxLength={20}
                    aria-label="Enter name"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white
                     placeholder-white/30 text-sm font-medium outline-none
                     focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30
                     transition-all disabled:opacity-40"
                />
                <button
                    id="add-entry-btn"
                    onClick={handleAdd}
                    disabled={disabled || entries.length >= MAX_ENTRIES}
                    aria-label="Add entry"
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white
                     text-sm font-semibold transition-all active:scale-95
                     disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                    Add
                </button>
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-xs font-medium px-1" role="alert">{error}</p>
            )}

            {/* Entry count */}
            <div className="flex items-center justify-between px-1">
                <span className="text-xs text-white/40 font-medium">
                    {entries.length} / {MAX_ENTRIES} entries
                </span>
            </div>

            <Separator.Root className="radix-separator" decorative />

            {/* Entry chips */}
            <div className="flex flex-wrap gap-2">
                {entries.map((entry, i) => (
                    <div
                        key={entry + i}
                        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-white/5 border border-white/10 text-sm text-white/80
                       hover:bg-white/10 transition-all"
                    >
                        <span className="truncate max-w-[100px]">{entry}</span>
                        {!disabled && (
                            <button
                                onClick={() => onRemoveEntry(i)}
                                className="w-4 h-4 flex items-center justify-center rounded-full
                           text-white/30 hover:text-red-400 hover:bg-red-400/10
                           transition-all text-xs leading-none"
                                aria-label={`Remove ${entry}`}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
