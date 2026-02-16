import { Piece } from "@/chess/types";
import { PIECE_SYMBOLS } from "@/chess/constants";

interface CapturedPiecesProps {
  pieces: Piece[];
}

export function CapturedPieces({ pieces }: CapturedPiecesProps) {
  return (
    <div className="h-8 flex items-center gap-0.5">
      {pieces.map((p, i) => (
        <span key={i} className="text-xl opacity-70">
          {PIECE_SYMBOLS[p.color][p.type]}
        </span>
      ))}
    </div>
  );
}
