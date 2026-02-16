import { Board, Position, Color } from "../types";
import { inBounds } from "../board";

export function getRookMoves(
  board: Board,
  row: number,
  col: number,
  color: Color
): Position[] {
  const moves: Position[] = [];
  const directions: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  for (const [dr, dc] of directions) {
    for (let i = 1; i < 8; i++) {
      const nr = row + dr * i;
      const nc = col + dc * i;

      if (!inBounds(nr, nc)) break;

      const target = board[nr][nc];
      if (target && target.color === color) break;

      moves.push([nr, nc]);

      if (target) break; // Stop after capture
    }
  }

  return moves;
}
