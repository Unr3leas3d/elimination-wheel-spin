export default function EliminationTracker({ eliminated }) {
    if (eliminated.length === 0) return null

    return (
        <div className="glass-card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" aria-hidden="true"></span>
                Eliminated ({eliminated.length})
            </h3>
            <ul className="flex flex-wrap gap-2">
                {eliminated.map((name, i) => (
                    <li
                        key={name + i}
                        className="chip-pop px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20
                     text-sm text-red-300/80 line-through decoration-red-500/40"
                    >
                        {name}
                    </li>
                ))}
            </ul>
        </div>
    )
}
