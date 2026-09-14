import { useState, useCallback, useEffect } from 'react'
import confetti from 'canvas-confetti'
import Wheel from './components/Wheel'
import Controls from './components/Controls'
import EliminationTracker from './components/EliminationTracker'
import Modal from './components/Modal'
import SEOContent from './components/SEOContent'
import { decodeNames, encodeNames, MAX_ELIMINATED, MAX_ENTRIES } from './lib/entries'

const readNamesParam = (key, limit) =>
    decodeNames(new URLSearchParams(window.location.search).get(key), limit)

export default function App() {
    const [entries, setEntries] = useState(() => readNamesParam('choices', MAX_ENTRIES))
    const [eliminated, setEliminated] = useState(() => readNamesParam('eliminated', MAX_ELIMINATED))
    const [isSpinning, setIsSpinning] = useState(false)
    const [selectedName, setSelectedName] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [isWinner, setIsWinner] = useState(false)

    // Sync entries and eliminated to URL
    useEffect(() => {
        const url = new URL(window.location)
        if (entries.length > 0) {
            url.searchParams.set('choices', encodeNames(entries))
        } else {
            url.searchParams.delete('choices')
        }

        if (eliminated.length > 0) {
            url.searchParams.set('eliminated', encodeNames(eliminated))
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

        // With two entries left, eliminating one leaves the winner
        if (entries.length === 2) {
            setSelectedName(entries.find((e) => e !== name))
            setIsWinner(true)
            setShowModal(true)
            setEliminated((prev) => [...prev, name])
            setEntries((prev) => prev.filter((e) => e !== name))
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.6 },
                colors: ['#7c3aed', '#f59e0b', '#ec4899', '#10b981', '#3b82f6'],
                disableForReducedMotion: true,
            })
        } else {
            setSelectedName(name)
            setIsWinner(false)
            setShowModal(true)
        }
    }, [entries])

    // Name and winner state are left in place so the modal keeps its content while it animates out
    const handleConfirmElimination = () => {
        setEliminated((prev) => [...prev, selectedName])
        setEntries((prev) => prev.filter((e) => e !== selectedName))
        setShowModal(false)
    }

    const handleReset = () => {
        setEntries([])
        setEliminated([])
        setShowModal(false)
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
                                : 'bg-white/5 border border-white/10 text-white/60 cursor-not-allowed'
                            }`}
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
                            className="w-full py-2.5 rounded-xl border border-white/15 text-white/70
                           text-sm font-medium hover:text-white hover:border-white/30
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
