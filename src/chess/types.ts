export type Color = "white" | "black";
export type PieceType = "king" | "queen" | "rook" | "bishop" | "knight" | "pawn";

export interface Piece {
  type: PieceType;
  color: Color;
  hasMoved?: boolean;
}

export type Board = (Piece | null)[][];
export type Position = [number, number]; // [row, col]

export interface GameState {
  board: Board;
  turn: Color;
  enPassantTarget: Position | null;
  gameOver: null | { type: "checkmate"; winner: Color } | { type: "stalemate" };
  lastMove: { from: Position; to: Position } | null;
}
