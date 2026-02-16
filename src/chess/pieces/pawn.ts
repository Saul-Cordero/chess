import { Board, Position, Color } from "../types";
import { inBounds } from "../board";

export function getPawnMoves(
  board: Board,
  row: number,
  col: number,
  color: Color,
  enPassantTarget: Position | null
): Position[] {
  const moves: Position[] = [];
  const dir = color === "white" ? -1 : 1;
  const startRow = color === "white" ? 6 : 1;

  // Forward movement
  if (inBounds(row + dir, col) && !board[row + dir][col]) {
    moves.push([row + dir, col]);
    // Double move from start
    if (row === startRow && !board[row + 2 * dir][col]) {
      moves.push([row + 2 * dir, col]);
    }
  }

  // Captures
  for (const dc of [-1, 1]) {
    const nr = row + dir;
    const nc = col + dc;
    if (inBounds(nr, nc)) {
      const target = board[nr][nc];
      if (target && target.color !== color) {
        moves.push([nr, nc]);
      }
      // En passant
      if (
        enPassantTarget &&
        enPassantTarget[0] === nr &&
        enPassantTarget[1] === nc
      ) {
        moves.push([nr, nc]);
      }
    }
  }

  return moves;
}
