import { Color } from "@/chess/types";

interface GameOverModalProps {
  gameOver: { type: "checkmate"; winner: Color } | { type: "stalemate" };
  onReset: () => void;
}

export function GameOverModal({ gameOver, onReset }: GameOverModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-stone-800 border border-stone-600 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm mx-4 animate-[fadeIn_0.3s_ease-out]">
        {gameOver.type === "checkmate" ? (
          <>
            <div className="text-6xl mb-2">
              {gameOver.winner === "white" ? "\u2654" : "\u265A"}
            </div>
            <h2 className="text-2xl font-bold text-stone-100">
              Jaque Mate
            </h2>
            <p className="text-lg text-stone-300">
              {gameOver.winner === "white"
                ? "Ganaron las Blancas"
                : "Ganaron las Negras"}
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-2">=</div>
            <h2 className="text-2xl font-bold text-stone-100">Tablas</h2>
            <p className="text-lg text-stone-300">
              Ahogado - No hay movimientos legales
            </p>
          </>
        )}
        <button
          onClick={onReset}
          className="mt-4 px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-colors font-semibold text-lg shadow-lg"
        >
          Jugar de nuevo
        </button>
      </div>
    </div>
  );
}
