import { Board, Position, Color, Piece } from "../types";
import { inBounds } from "../board";

export function getKingMoves(
  board: Board,
  row: number,
  col: number,
  color: Color,
  piece: Piece
): Position[] {
  const moves: Position[] = [];
  const directions: [number, number][] = [
    [-1, -1], [-1, 0], [-1, 1], [0, -1],
    [0, 1], [1, -1], [1, 0], [1, 1],
  ];

  // Normal king moves
  for (const [dr, dc] of directions) {
    const nr = row + dr;
    const nc = col + dc;
    if (inBounds(nr, nc)) {
      const target = board[nr][nc];
      if (!target || target.color !== color) {
        moves.push([nr, nc]);
      }
    }
  }

  // Castling
  if (!piece.hasMoved) {
    // King-side castling
    const rookK = board[row][7];
    if (
      rookK &&
      rookK.type === "rook" &&
      !rookK.hasMoved &&
      !board[row][5] &&
      !board[row][6]
    ) {
      moves.push([row, 6]);
    }

    // Queen-side castling
    const rookQ = board[row][0];
    if (
      rookQ &&
      rookQ.type === "rook" &&
      !rookQ.hasMoved &&
      !board[row][1] &&
      !board[row][2] &&
      !board[row][3]
    ) {
      moves.push([row, 2]);
    }
  }

  return moves;
}
