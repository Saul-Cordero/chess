import { Piece, Position, Color } from "@/chess/types";
import { PIECE_SYMBOLS } from "@/chess/constants";

interface ChessSquareProps {
  piece: Piece | null;
  rowIdx: number;
  colIdx: number;
  isSelected: boolean;
  isLegalTarget: boolean;
  isLastMoveSquare: boolean;
  isKingInCheck: boolean;
  turn: Color;
  onClick: () => void;
}

export function ChessSquare({
  piece,
  rowIdx,
  colIdx,
  isSelected,
  isLegalTarget,
  isLastMoveSquare,
  isKingInCheck,
  onClick,
}: ChessSquareProps) {
  const isLight = (rowIdx + colIdx) % 2 === 0;

  let bg = isLight ? "bg-amber-100" : "bg-amber-800";

  if (isLastMoveSquare) {
    bg = isLight ? "bg-yellow-200" : "bg-yellow-600";
  }

  if (isSelected) {
    bg = "bg-emerald-400";
  }

  if (isKingInCheck) {
    bg = "bg-red-400";
  }

  return (
    <button
      onClick={onClick}
      className={`
        w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px]
        flex items-center justify-center
        relative cursor-pointer
        transition-colors duration-100
        ${bg}
        hover:brightness-110
      `}
    >
      {/* Legal move dot / capture ring */}
      {isLegalTarget && !piece && (
        <div className="absolute w-3 h-3 rounded-full bg-black/20" />
      )}
      {isLegalTarget && piece && (
        <div className="absolute inset-1 rounded-full border-[3px] border-black/20" />
      )}

      {/* Piece */}
      {piece && (
        <span
          className={`
            text-3xl sm:text-4xl md:text-[42px] select-none
            drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]
            ${piece.color === "white" ? "text-white" : "text-stone-900"}
            ${isSelected ? "scale-110" : ""}
            transition-transform duration-100
          `}
          style={{
            WebkitTextStroke:
              piece.color === "white" ? "0.5px #888" : "0.3px #444",
          }}
        >
          {PIECE_SYMBOLS[piece.color][piece.type]}
        </span>
      )}
    </button>
  );
}
