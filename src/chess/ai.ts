import { Board, Color, Position, Piece } from "./types";
import { getLegalMoves, applyMove } from "./game";

// Valores de las piezas
const PIECE_VALUES: Record<string, number> = {
  pawn: 100,
  knight: 320,
  bishop: 330,
  rook: 500,
  queen: 900,
  king: 20000,
};

// Tablas de posición para peones (mejora el valor según la posición)
const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

// Tabla de posición para caballos
const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

// Tabla de posición para alfiles
const BISHOP_TABLE = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

// Tabla de posición para torres
const ROOK_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

// Tabla de posición para la reina
const QUEEN_TABLE = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

// Tabla de posición para el rey (medio juego)
const KING_TABLE = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

// Obtener valor de posición para una pieza
function getPositionValue(piece: Piece, row: number, col: number): number {
  // Invertir la fila para piezas negras
  const r = piece.color === "white" ? 7 - row : row;

  switch (piece.type) {
    case "pawn":
      return PAWN_TABLE[r][col];
    case "knight":
      return KNIGHT_TABLE[r][col];
    case "bishop":
      return BISHOP_TABLE[r][col];
    case "rook":
      return ROOK_TABLE[r][col];
    case "queen":
      return QUEEN_TABLE[r][col];
    case "king":
      return KING_TABLE[r][col];
    default:
      return 0;
  }
}

// Evaluar el tablero desde la perspectiva del color dado
export function evaluateBoard(board: Board, color: Color): number {
  let score = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      const pieceValue = PIECE_VALUES[piece.type];
      const positionValue = getPositionValue(piece, row, col);
      const totalValue = pieceValue + positionValue;

      if (piece.color === color) {
        score += totalValue;
      } else {
        score -= totalValue;
      }
    }
  }

  return score;
}

// Obtener todos los movimientos posibles para un color
function getAllPossibleMoves(
  board: Board,
  color: Color,
  enPassantTarget: Position | null
): Array<{ from: Position; to: Position }> {
  const moves: Array<{ from: Position; to: Position }> = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const legalMoves = getLegalMoves(board, row, col, enPassantTarget);
        for (const move of legalMoves) {
          moves.push({ from: [row, col], to: move });
        }
      }
    }
  }

  return moves;
}

// Algoritmo Minimax con poda Alpha-Beta
function minimax(
  board: Board,
  depth: number,
  alpha: number,
  beta: number,
  maximizingPlayer: boolean,
  color: Color,
  enPassantTarget: Position | null
): number {
  if (depth === 0) {
    return evaluateBoard(board, color);
  }

  const currentColor = maximizingPlayer ? color : color === "white" ? "black" : "white";
  const moves = getAllPossibleMoves(board, currentColor, enPassantTarget);

  if (moves.length === 0) {
    // No hay movimientos legales - jaque mate o tablas
    return maximizingPlayer ? -999999 : 999999;
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      const newBoard = applyMove(board, move.from, move.to, enPassantTarget);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, false, color, null);
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Poda Beta
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      const newBoard = applyMove(board, move.from, move.to, enPassantTarget);
      const evaluation = minimax(newBoard, depth - 1, alpha, beta, true, color, null);
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Poda Alpha
    }
    return minEval;
  }
}

export type Difficulty = "easy" | "medium" | "hard";

// Obtener la profundidad según la dificultad
function getDepth(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy":
      return 1;
    case "medium":
      return 2;
    case "hard":
      return 3;
    default:
      return 2;
  }
}

// Encontrar el mejor movimiento para el bot
export function findBestMove(
  board: Board,
  color: Color,
  enPassantTarget: Position | null,
  difficulty: Difficulty = "medium"
): { from: Position; to: Position } | null {
  const moves = getAllPossibleMoves(board, color, enPassantTarget);

  if (moves.length === 0) return null;

  // Para dificultad fácil, a veces hacer movimientos aleatorios
  if (difficulty === "easy" && Math.random() < 0.4) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const depth = getDepth(difficulty);
  let bestMove = moves[0];
  let bestValue = -Infinity;

  // Barajar los movimientos para variedad
  const shuffledMoves = [...moves].sort(() => Math.random() - 0.5);

  for (const move of shuffledMoves) {
    const newBoard = applyMove(board, move.from, move.to, enPassantTarget);
    const boardValue = minimax(
      newBoard,
      depth - 1,
      -Infinity,
      Infinity,
      false,
      color,
      null
    );

    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = move;
    }
  }

  return bestMove;
}
