import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ show, name, isWinner, onConfirm, onReset }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    role="dialog"
                    aria-modal="true"
                >
                    <motion.div
                        className="glass-card p-6 sm:p-8 max-w-sm w-full text-center space-y-5"
                        initial={{ scale: 0.7, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.7, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    >
                        {isWinner ? (
                            <>
                                {/* Winner celebration */}
                                <div className="text-5xl">🏆</div>
                                <h2 className="text-2xl font-extrabold text-transparent bg-clip-text
                               bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400">
                                    WINNER!
                                </h2>
                                <p className="text-xl font-bold text-white">{name}</p>
                                <p className="text-sm text-white/50">Last one standing!</p>
                                <button
                                    id="reset-btn"
                                    onClick={onReset}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400
                             text-black font-bold text-sm hover:brightness-110 active:scale-95
                             transition-all"
                                >
                                    Play Again
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Elimination announcement */}
                                <div className="text-5xl">💥</div>
                                <h2 className="text-xl font-bold text-red-400">ELIMINATED</h2>
                                <p className="text-2xl font-extrabold text-white">{name}</p>
                                <p className="text-sm text-white/40">This entry will be removed from the wheel.</p>
                                <button
                                    id="confirm-elimination-btn"
                                    onClick={onConfirm}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500
                             text-white font-bold text-sm hover:brightness-110 active:scale-95
                             transition-all"
                                >
                                    Confirm Elimination
                                </button>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
