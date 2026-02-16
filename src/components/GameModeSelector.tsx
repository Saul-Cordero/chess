import { Difficulty } from "@/chess/ai";

export type GameMode = "pvp" | "pve";

interface GameModeSelectorProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  onGameModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export function GameModeSelector({
  gameMode,
  difficulty,
  onGameModeChange,
  onDifficultyChange,
}: GameModeSelectorProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 items-center">
      {/* Selector de modo de juego */}
      <div className="flex gap-3">
        <button
          onClick={() => onGameModeChange("pvp")}
          className={`px-5 py-2 rounded-lg font-medium transition-all ${
            gameMode === "pvp"
              ? "bg-amber-600 text-white shadow-lg scale-105"
              : "bg-stone-700 text-stone-300 hover:bg-stone-600"
          }`}
        >
          Jugador vs Jugador
        </button>
        <button
          onClick={() => onGameModeChange("pve")}
          className={`px-5 py-2 rounded-lg font-medium transition-all ${
            gameMode === "pve"
              ? "bg-amber-600 text-white shadow-lg scale-105"
              : "bg-stone-700 text-stone-300 hover:bg-stone-600"
          }`}
        >
          Jugador vs Bot
        </button>
      </div>

      {/* Selector de dificultad (solo visible en modo vs Bot) */}
      {gameMode === "pve" && (
        <div className="flex gap-2 items-center">
          <span className="text-stone-400 text-sm font-medium">Dificultad:</span>
          <div className="flex gap-2">
            <button
              onClick={() => onDifficultyChange("easy")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${
                difficulty === "easy"
                  ? "bg-green-600 text-white shadow-md"
                  : "bg-stone-700 text-stone-300 hover:bg-stone-600"
              }`}
            >
              Fácil
            </button>
            <button
              onClick={() => onDifficultyChange("medium")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${
                difficulty === "medium"
                  ? "bg-yellow-600 text-white shadow-md"
                  : "bg-stone-700 text-stone-300 hover:bg-stone-600"
              }`}
            >
              Medio
            </button>
            <button
              onClick={() => onDifficultyChange("hard")}
              className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${
                difficulty === "hard"
                  ? "bg-red-600 text-white shadow-md"
                  : "bg-stone-700 text-stone-300 hover:bg-stone-600"
              }`}
            >
              Difícil
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
