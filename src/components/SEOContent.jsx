import { useState } from 'react'

export default function SEOContent() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <section className="mt-10 w-full max-w-2xl pb-10">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-5 py-3 rounded-xl
                    bg-white/5 border border-white/10 text-white/60 text-sm font-medium
                    hover:bg-white/10 hover:text-white/80 transition-all cursor-pointer"
                aria-expanded={isOpen}
            >
                <span>About this Tool</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className={`overflow-hidden transition-all duration-400 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="text-center md:text-left text-white/80 space-y-6 px-2">
                    <article className="prose prose-invert max-w-none">
                        <h2 className="text-xl font-semibold text-white/90 mb-2">What is an Elimination Wheel?</h2>
                        <p className="text-sm leading-relaxed mb-4">
                            Unlike standard spinner wheels that just pick one winner, an
                            <strong> Elimination Wheel</strong> removes the winner from the list after each spin.
                            This is perfect for raffles where you have multiple prizes, or for "last man standing"
                            games where the last person remaining is the loser (or winner, depending on your rules!).
                        </p>

                        <h2 className="text-xl font-semibold text-white/90 mb-2">How to Use</h2>
                        <ul className="text-sm space-y-1 list-disc list-inside text-white/70">
                            <li>Add the names of all participants to the list.</li>
                            <li>Spin the wheel to select a random name.</li>
                            <li>The selected name is automatically removed (eliminated) from the wheel.</li>
                            <li>Repeat until you have your desired number of winners!</li>
                        </ul>

                        <h2 className="text-xl font-semibold text-white/90 mb-2 mt-4">Features</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                <h3 className="font-medium text-purple-400">100% Random</h3>
                                <p className="text-xs text-white/50">Cryptographically secure random number generation.</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                <h3 className="font-medium text-pink-400">Mobile Friendly</h3>
                                <p className="text-xs text-white/50">Works perfectly on phones, tablets, and desktops.</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                <h3 className="font-medium text-blue-400">Instant Re-Spin</h3>
                                <p className="text-xs text-white/50">No need to manually remove names.</p>
                            </div>
                            <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                <h3 className="font-medium text-green-400">No Ads</h3>
                                <p className="text-xs text-white/50">Clean interface with zero distractions.</p>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    )
}
