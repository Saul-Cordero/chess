import { Color } from "@/chess/types";

interface TurnIndicatorProps {
  turn: Color;
  inCheck: boolean;
  gameOver: boolean;
  isThinking?: boolean;
}

export function TurnIndicator({ turn, inCheck, gameOver, isThinking = false }: TurnIndicatorProps) {
  const getMessage = () => {
    if (isThinking) {
      return "Bot pensando...";
    }
    if (inCheck && !gameOver) {
      return `Jaque - Turno de ${turn === "white" ? "Blancas" : "Negras"}`;
    }
    return `Turno de ${turn === "white" ? "Blancas" : "Negras"}`;
  };

  return (
    <div className="mb-4 flex items-center gap-3">
      <div
        className={`w-4 h-4 rounded-full border-2 border-stone-400 ${
          turn === "white" ? "bg-white" : "bg-stone-900"
        } ${inCheck && !gameOver ? "ring-2 ring-red-500 ring-offset-2 ring-offset-stone-800" : ""} ${
          isThinking ? "animate-pulse" : ""
        }`}
      />
      <span className="text-stone-300 text-lg font-medium">
        {getMessage()}
      </span>
    </div>
  );
}
