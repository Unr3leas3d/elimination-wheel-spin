import { useState } from 'react'
import * as Separator from '@radix-ui/react-separator'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { cleanName, hasName, MAX_ENTRIES, MAX_NAME_LENGTH } from '../lib/entries'

export default function Controls({ entries, onAddEntry, onRemoveEntry, disabled }) {
    const [input, setInput] = useState('')
    const [error, setError] = useState('')

    const handleAdd = () => {
        const name = cleanName(input)
        if (!name) {
            setError('Enter a name')
            return
        }
        if (entries.length >= MAX_ENTRIES) {
            setError(`Maximum ${MAX_ENTRIES} entries allowed`)
            return
        }
        if (hasName(entries, name)) {
            setError('Duplicate entry')
            return
        }
        setError('')
        onAddEntry(name)
        setInput('')
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleAdd()
    }

    return (
        <div className="space-y-3">
            {/* Input row */}
            <VisuallyHidden.Root asChild>
                <label htmlFor="entry-input">Enter participant name</label>
            </VisuallyHidden.Root>
            <div className="flex gap-2">
                <input
                    id="entry-input"
                    type="text"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setError('') }}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    maxLength={MAX_NAME_LENGTH}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? 'entry-error' : undefined}
                    className="flex-1 min-w-0 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white
                     text-base font-medium outline-none
                     focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30
                     transition-all disabled:opacity-40"
                />
                <button
                    id="add-entry-btn"
                    onClick={handleAdd}
                    disabled={disabled || entries.length >= MAX_ENTRIES}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white
                     text-sm font-semibold transition-all active:scale-95
                     disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                    Add
                </button>
            </div>

            {/* Error */}
            {error && (
                <p id="entry-error" className="text-red-400 text-xs font-medium px-1" role="alert">{error}</p>
            )}

            {/* Entry count */}
            <div className="flex items-center justify-between px-1">
                <span className="text-xs text-white/60 font-medium">
                    {entries.length} / {MAX_ENTRIES} entries
                </span>
            </div>

            <Separator.Root className="radix-separator" decorative />

            {/* Entry chips */}
            <div className="flex flex-wrap gap-2">
                {entries.map((entry, i) => (
                    <div
                        key={entry}
                        className="group flex items-center gap-1 pl-3 pr-1 py-1 rounded-full
                       bg-white/5 border border-white/10 text-sm text-white/80
                       hover:bg-white/10 transition-all"
                    >
                        <span className="truncate max-w-[100px] py-0.5">{entry}</span>
                        {!disabled && (
                            <button
                                onClick={() => onRemoveEntry(i)}
                                className="w-6 h-6 flex items-center justify-center rounded-full
                           text-white/60 hover:text-red-400 hover:bg-red-400/10
                           transition-all text-base leading-none"
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
