import { Board, Position, Color } from "@/chess/types";
import { FILES, RANKS } from "@/chess/constants";
import { ChessSquare } from "./ChessSquare";

interface ChessBoardProps {
  board: Board;
  selected: Position | null;
  legalMoves: Position[];
  lastMove: { from: Position; to: Position } | null;
  inCheck: boolean;
  gameOver: boolean;
  turn: Color;
  onSquareClick: (row: number, col: number) => void;
}

export function ChessBoard({
  board,
  selected,
  legalMoves,
  lastMove,
  inCheck,
  gameOver,
  turn,
  onSquareClick,
}: ChessBoardProps) {
  return (
    <div className="relative">
      {/* Rank labels (left side) */}
      <div className="absolute -left-7 top-0 h-full flex flex-col">
        {RANKS.map((rank) => (
          <div
            key={rank}
            className="flex-1 flex items-center justify-center text-stone-500 text-xs font-mono"
          >
            {rank}
          </div>
        ))}
      </div>

      {/* Board grid */}
      <div className="border-2 border-stone-600 rounded-sm shadow-2xl shadow-black/50 overflow-hidden">
        {board.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((piece, colIdx) => {
              const isSelected =
                selected && selected[0] === rowIdx && selected[1] === colIdx;
              const isLegalTarget = legalMoves.some(
                ([r, c]) => r === rowIdx && c === colIdx
              );
              const isLastMoveSquare =
                lastMove &&
                ((lastMove.from[0] === rowIdx && lastMove.from[1] === colIdx) ||
                  (lastMove.to[0] === rowIdx && lastMove.to[1] === colIdx));
              const isKingInCheck =
                inCheck &&
                !gameOver &&
                piece?.type === "king" &&
                piece?.color === turn;

              return (
                <ChessSquare
                  key={colIdx}
                  piece={piece}
                  rowIdx={rowIdx}
                  colIdx={colIdx}
                  isSelected={!!isSelected}
                  isLegalTarget={isLegalTarget}
                  isLastMoveSquare={!!isLastMoveSquare}
                  isKingInCheck={isKingInCheck}
                  turn={turn}
                  onClick={() => onSquareClick(rowIdx, colIdx)}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* File labels (bottom) */}
      <div className="flex mt-1">
        {FILES.map((file) => (
          <div
            key={file}
            className="w-14 sm:w-16 md:w-[72px] text-center text-stone-500 text-xs font-mono"
          >
            {file}
          </div>
        ))}
      </div>
    </div>
  );
}
