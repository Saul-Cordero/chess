import { Board, Position, Color } from "../types";
import { inBounds } from "../board";

export function getKnightMoves(
  board: Board,
  row: number,
  col: number,
  color: Color
): Position[] {
  const moves: Position[] = [];
  const knightOffsets: [number, number][] = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1],
  ];

  for (const [dr, dc] of knightOffsets) {
    const nr = row + dr;
    const nc = col + dc;
    if (inBounds(nr, nc)) {
      const target = board[nr][nc];
      if (!target || target.color !== color) {
        moves.push([nr, nc]);
      }
    }
  }

  return moves;
}
