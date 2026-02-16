import { motion, AnimatePresence } from 'framer-motion'

export default function EliminationTracker({ eliminated }) {
    if (eliminated.length === 0) return null

    return (
        <div className="glass-card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                Eliminated ({eliminated.length})
            </h3>
            <ul className="flex flex-wrap gap-2">
                <AnimatePresence>
                    {eliminated.map((name, i) => (
                        <motion.li
                            key={name + i}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                            className="px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20
                         text-sm text-red-300/80 line-through decoration-red-500/40"
                        >
                            {name}
                        </motion.li>
                    ))}
                </AnimatePresence>
            </ul>
        </div>
    )
}
