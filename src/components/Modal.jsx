import * as Dialog from '@radix-ui/react-dialog'

// Open/close animations live in index.css; Radix keeps the dialog mounted until they finish
export default function Modal({ show, name, isWinner, onConfirm, onReset }) {
    return (
        <Dialog.Root open={show}>
            <Dialog.Portal>
                <Dialog.Overlay className="dialog-overlay fixed inset-0 z-50" />
                <Dialog.Content
                    className="dialog-content fixed inset-0 z-50 flex items-center justify-center p-4"
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    onPointerDownOutside={(e) => e.preventDefault()}
                >
                    <div className="dialog-card glass-card p-6 sm:p-8 max-w-sm w-full text-center space-y-5">
                        {isWinner ? (
                            <>
                                <div className="text-5xl" aria-hidden="true">🏆</div>
                                <Dialog.Title className="text-2xl font-extrabold text-transparent bg-clip-text
                                   bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400">
                                    WINNER!
                                </Dialog.Title>
                                <Dialog.Description className="sr-only">
                                    {name} is the winner!
                                </Dialog.Description>
                                <p className="text-xl font-bold text-white">{name}</p>
                                <p className="text-sm text-white/70">Last one standing!</p>
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
                                <div className="text-5xl" aria-hidden="true">💥</div>
                                <Dialog.Title className="text-xl font-bold text-red-400">
                                    ELIMINATED
                                </Dialog.Title>
                                <Dialog.Description className="sr-only">
                                    {name} has been eliminated from the wheel.
                                </Dialog.Description>
                                <p className="text-2xl font-extrabold text-white">{name}</p>
                                <p className="text-sm text-white/70">This entry will be removed from the wheel.</p>
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
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
