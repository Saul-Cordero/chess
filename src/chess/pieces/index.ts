import { Board, Position } from "../types";
import { getPawnMoves } from "./pawn";
import { getKnightMoves } from "./knight";
import { getBishopMoves } from "./bishop";
import { getRookMoves } from "./rook";
import { getQueenMoves } from "./queen";
import { getKingMoves } from "./king";

export function getRawMoves(
  board: Board,
  row: number,
  col: number,
  enPassantTarget: Position | null
): Position[] {
  const piece = board[row][col];
  if (!piece) return [];

  const { type, color } = piece;

  switch (type) {
    case "pawn":
      return getPawnMoves(board, row, col, color, enPassantTarget);
    case "knight":
      return getKnightMoves(board, row, col, color);
    case "bishop":
      return getBishopMoves(board, row, col, color);
    case "rook":
      return getRookMoves(board, row, col, color);
    case "queen":
      return getQueenMoves(board, row, col, color);
    case "king":
      return getKingMoves(board, row, col, color, piece);
    default:
      return [];
  }
}

export * from "./pawn";
export * from "./knight";
export * from "./bishop";
export * from "./rook";
export * from "./queen";
export * from "./king";
