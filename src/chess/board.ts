import { Board, Piece, PieceType, Color, Position } from "./types";

export function createInitialBoard(): Board {
  const board: Board = Array.from({ length: 8 }, () => Array(8).fill(null));

  const backRow: PieceType[] = [
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];

  for (let col = 0; col < 8; col++) {
    board[0][col] = { type: backRow[col], color: "black" };
    board[1][col] = { type: "pawn", color: "black" };
    board[6][col] = { type: "pawn", color: "white" };
    board[7][col] = { type: backRow[col], color: "white" };
  }

  return board;
}

export function cloneBoard(board: Board): Board {
  return board.map((row) =>
    row.map((cell) => (cell ? { ...cell } : null))
  );
}

export function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

export function findKing(board: Board, color: Color): Position | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === "king" && p.color === color) return [r, c];
    }
  }
  return null;
}

export function getCapturedPieces(initial: Board, current: Board) {
  const count = (board: Board, color: Color) => {
    const pieces: Record<PieceType, number> = {
      king: 0, queen: 0, rook: 0, bishop: 0, knight: 0, pawn: 0,
    };
    for (const row of board) {
      for (const cell of row) {
        if (cell && cell.color === color) pieces[cell.type]++;
      }
    }
    return pieces;
  };

  const result: Record<Color, Piece[]> = { white: [], black: [] };
  for (const color of ["white", "black"] as Color[]) {
    const init = count(initial, color);
    const curr = count(current, color);
    for (const type of Object.keys(init) as PieceType[]) {
      const diff = init[type] - curr[type];
      for (let i = 0; i < diff; i++) {
        result[color].push({ type, color });
      }
    }
  }
  return result;
}
