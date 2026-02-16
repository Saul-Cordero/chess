import { Board, Color, Position } from "./types";
import { cloneBoard, findKing } from "./board";
import { getRawMoves } from "./pieces";

export function isInCheck(board: Board, color: Color): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const opponent = color === "white" ? "black" : "white";

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === opponent) {
        const moves = getRawMoves(board, r, c, null);
        if (moves.some(([mr, mc]) => mr === kingPos[0] && mc === kingPos[1])) {
          return true;
        }
      }
    }
  }
  return false;
}

export function applyMove(
  board: Board,
  from: Position,
  to: Position,
  enPassantTarget: Position | null
): Board {
  const newBoard = cloneBoard(board);
  const piece = newBoard[from[0]][from[1]]!;

  // En passant capture
  if (
    piece.type === "pawn" &&
    enPassantTarget &&
    to[0] === enPassantTarget[0] &&
    to[1] === enPassantTarget[1]
  ) {
    const capturedRow = piece.color === "white" ? to[0] + 1 : to[0] - 1;
    newBoard[capturedRow][to[1]] = null;
  }

  // Castling
  if (piece.type === "king" && Math.abs(to[1] - from[1]) === 2) {
    if (to[1] === 6) {
      // King-side
      newBoard[from[0]][5] = newBoard[from[0]][7];
      newBoard[from[0]][7] = null;
      if (newBoard[from[0]][5]) newBoard[from[0]][5]!.hasMoved = true;
    } else if (to[1] === 2) {
      // Queen-side
      newBoard[from[0]][3] = newBoard[from[0]][0];
      newBoard[from[0]][0] = null;
      if (newBoard[from[0]][3]) newBoard[from[0]][3]!.hasMoved = true;
    }
  }

  // Promotion (auto-promote to queen)
  if (piece.type === "pawn" && (to[0] === 0 || to[0] === 7)) {
    newBoard[to[0]][to[1]] = { type: "queen", color: piece.color, hasMoved: true };
  } else {
    newBoard[to[0]][to[1]] = { ...piece, hasMoved: true };
  }
  newBoard[from[0]][from[1]] = null;

  return newBoard;
}

export function getLegalMoves(
  board: Board,
  row: number,
  col: number,
  enPassantTarget: Position | null
): Position[] {
  const piece = board[row][col];
  if (!piece) return [];

  const rawMoves = getRawMoves(board, row, col, enPassantTarget);

  return rawMoves.filter(([tr, tc]) => {
    // For castling, ensure king doesn't pass through or land in check
    if (piece.type === "king" && Math.abs(tc - col) === 2) {
      if (isInCheck(board, piece.color)) return false;
      const dir = tc > col ? 1 : -1;
      const midBoard = applyMove(board, [row, col], [row, col + dir], null);
      if (isInCheck(midBoard, piece.color)) return false;
    }

    const newBoard = applyMove(board, [row, col], [tr, tc], enPassantTarget);
    return !isInCheck(newBoard, piece.color);
  });
}

export function getGameStatus(
  board: Board,
  currentTurn: Color,
  enPassantTarget: Position | null
): "playing" | "checkmate" | "stalemate" {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === currentTurn) {
        if (getLegalMoves(board, r, c, enPassantTarget).length > 0) {
          return "playing";
        }
      }
    }
  }
  return isInCheck(board, currentTurn) ? "checkmate" : "stalemate";
}
