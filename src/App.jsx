import { useState, useCallback, useEffect } from 'react'
import confetti from 'canvas-confetti'
import Wheel from './components/Wheel'
import Controls from './components/Controls'
import EliminationTracker from './components/EliminationTracker'
import Modal from './components/Modal'
import SEOContent from './components/SEOContent'

// Helper to safely encode/decode Base64 with Unicode support
const encodeChoices = (choices) => {
    try {
        return btoa(unescape(encodeURIComponent(choices.join(','))))
    } catch (e) {
        console.error('Error encoding choices:', e)
        return ''
    }
}

const decodeChoices = (encoded) => {
    try {
        const decoded = decodeURIComponent(escape(atob(encoded)))
        return decoded ? decoded.split(',') : []
    } catch (e) {
        console.error('Error decoding choices:', e)
        return []
    }
}

export default function App() {
    const [entries, setEntries] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        const choicesParam = params.get('choices')
        if (choicesParam) {
            return decodeChoices(choicesParam)
        }
        return []
    })

    const [eliminated, setEliminated] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        const eliminatedParam = params.get('eliminated')
        if (eliminatedParam) {
            return decodeChoices(eliminatedParam)
        }
        return []
    })
    const [isSpinning, setIsSpinning] = useState(false)
    const [selectedName, setSelectedName] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [isWinner, setIsWinner] = useState(false)

    // Sync entries and eliminated to URL
    useEffect(() => {
        const url = new URL(window.location)
        if (entries.length > 0) {
            url.searchParams.set('choices', encodeChoices(entries))
        } else {
            url.searchParams.delete('choices')
        }
        
        if (eliminated.length > 0) {
            url.searchParams.set('eliminated', encodeChoices(eliminated))
        } else {
            url.searchParams.delete('eliminated')
        }
        
        window.history.replaceState({}, '', url)
    }, [entries, eliminated])

    const handleAddEntry = (name) => {
        setEntries((prev) => [...prev, name])
    }

    const handleRemoveEntry = (index) => {
        setEntries((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSpin = () => {
        if (entries.length < 2 || isSpinning) return
        setIsSpinning(true)
    }

    const handleSpinEnd = useCallback((name) => {
        setIsSpinning(false)
        setSelectedName(name)

        // Check if this is the second-to-last entry (winner will be the remaining one)
        if (entries.length === 2) {
            // The remaining entry after elimination is the winner
            const winner = entries.find((e) => e !== name)
            setSelectedName(winner)
            setIsWinner(true)
            setShowModal(true)
            // Remove the eliminated one
            setEliminated((prev) => [...prev, name])
            setEntries((prev) => prev.filter((e) => e !== name))
            // Confetti for winner!
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#7c3aed', '#f59e0b', '#ec4899', '#10b981', '#3b82f6'],
            })
        } else {
            setIsWinner(false)
            setShowModal(true)
        }
    }, [entries])

    const handleConfirmElimination = () => {
        setEliminated((prev) => [...prev, selectedName])
        setEntries((prev) => prev.filter((e) => e !== selectedName))
        setSelectedName(null)
        setShowModal(false)
    }

    const handleReset = () => {
        setEntries([])
        setEliminated([])
        setSelectedName(null)
        setShowModal(false)
        setIsWinner(false)
    }

    const canSpin = entries.length >= 2 && !isSpinning

    return (
        <div className="min-h-dvh flex flex-col items-center justify-center p-3 sm:p-6 overflow-x-hidden">
            <main className="w-full max-w-md flex flex-col items-center">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-5
                    bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent
                    tracking-tight">
                    Wheel of Elimination
                </h1>
                <div className="glass-card w-full p-5 sm:p-7 space-y-5">
                    {/* Wheel */}
                    <Wheel
                        entries={entries}
                        isSpinning={isSpinning}
                        onSpinEnd={handleSpinEnd}
                    />

                    {/* Spin Button — always present, disabled state when < 2 entries */}
                    <button
                        id="spin-btn"
                        onClick={handleSpin}
                        disabled={!canSpin}
                        className={`w-full py-3.5 rounded-xl font-bold text-base tracking-wide uppercase
                            transition-all duration-300 ${canSpin
                                ? 'spin-btn text-white'
                                : 'bg-white/5 border border-white/10 text-white/25 cursor-not-allowed'
                            }`}
                        aria-label={isSpinning ? "Wheel is spinning" : entries.length < 2 ? "Add at least 2 entries" : "Spin the wheel"}
                    >
                        {isSpinning ? 'Spinning…' : entries.length < 2 ? `Add ${2 - entries.length} more entr${2 - entries.length === 1 ? 'y' : 'ies'}` : 'Spin the Wheel'}
                    </button>

                    {/* Controls / Entries */}
                    <Controls
                        entries={entries}
                        onAddEntry={handleAddEntry}
                        onRemoveEntry={handleRemoveEntry}
                        disabled={isSpinning}
                    />

                    {/* Elimination Tracker */}
                    <EliminationTracker eliminated={eliminated} />

                    {/* Reset button (only show if there are eliminations) */}
                    {eliminated.length > 0 && !isSpinning && (
                        <button
                            id="reset-game-btn"
                            onClick={handleReset}
                            className="w-full py-2.5 rounded-xl border border-white/10 text-white/40
                           text-sm font-medium hover:text-white/70 hover:border-white/20
                           transition-all active:scale-95"
                        >
                            Reset Game
                        </button>
                    )}
                </div>
            </main>

            {/* SEO Content Section */}
            <SEOContent />

            {/* Modal */}
            <Modal
                show={showModal}
                name={selectedName}
                isWinner={isWinner}
                onConfirm={handleConfirmElimination}
                onReset={handleReset}
            />
        </div>
    )
}
