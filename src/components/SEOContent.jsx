import { useId, useState } from 'react'

// The content stays in the DOM while collapsed (inert and visually hidden) so crawlers can index it
export default function SEOContent() {
    const [isOpen, setIsOpen] = useState(false)
    const contentId = useId()

    return (
        <section className="mt-10 w-full max-w-2xl pb-10">
            <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                aria-expanded={isOpen}
                aria-controls={contentId}
                className="w-full flex items-center justify-between px-5 py-3 rounded-xl
                    bg-white/5 border border-white/10 text-white/70 text-sm font-medium
                    hover:bg-white/10 hover:text-white/90 transition-all cursor-pointer"
            >
                <span>About this Tool</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                id={contentId}
                className="disclosure-content"
                data-state={isOpen ? 'open' : 'closed'}
                inert={!isOpen}
            >
                <div>
                    <div className="text-center md:text-left text-white/80 space-y-6 px-2 pt-4">
                        <article>
                            <h2 className="text-xl font-semibold text-white/90 mb-2">What is an Elimination Wheel?</h2>
                            <p className="text-sm leading-relaxed mb-4">
                                A regular spinner wheel just picks a name. An <strong>Elimination Wheel</strong> knocks
                                the name it lands on out of the game. Keep spinning until only one name is left: the
                                last one standing wins. It's great for raffles, classroom picks, team games, or
                                deciding who goes next.
                            </p>

                            <h2 className="text-xl font-semibold text-white/90 mb-2">How to Use</h2>
                            <ul className="text-sm space-y-1 list-disc list-inside text-white/70">
                                <li>Add up to 12 names to the wheel.</li>
                                <li>Spin the wheel. The name it lands on is eliminated.</li>
                                <li>Confirm the elimination to remove that name from the wheel.</li>
                                <li>Keep spinning until one name remains. That's your winner!</li>
                                <li>Your list is saved in the page link, so you can bookmark or share it.</li>
                            </ul>

                            <h2 className="text-xl font-semibold text-white/90 mb-2 mt-4">Features</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                    <h3 className="font-medium text-purple-400">Fair &amp; Random</h3>
                                    <p className="text-xs text-white/60">Every spin uses your browser's cryptographically secure random number generator, and every slice has an equal chance.</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                    <h3 className="font-medium text-pink-400">Mobile Friendly</h3>
                                    <p className="text-xs text-white/60">Works on phones, tablets, and desktops.</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                    <h3 className="font-medium text-blue-400">Shareable Lists</h3>
                                    <p className="text-xs text-white/60">Copy the page link to share your wheel and its progress.</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                    <h3 className="font-medium text-green-400">No Ads</h3>
                                    <p className="text-xs text-white/60">Clean interface with zero distractions.</p>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    )
}
