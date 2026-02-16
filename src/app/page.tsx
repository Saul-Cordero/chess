"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Board, Color, Position } from "@/chess/types";
import { createInitialBoard, getCapturedPieces } from "@/chess/board";
import { getLegalMoves, applyMove, getGameStatus, isInCheck } from "@/chess/game";
import { findBestMove, Difficulty } from "@/chess/ai";
import { ChessBoard } from "@/components/ChessBoard";
import { TurnIndicator } from "@/components/TurnIndicator";
import { CapturedPieces } from "@/components/CapturedPieces";
import { GameOverModal } from "@/components/GameOverModal";
import { GameModeSelector, GameMode } from "@/components/GameModeSelector";

export default function ChessGame() {
  const initialBoard = useMemo(() => createInitialBoard(), []);
  const [board, setBoard] = useState<Board>(() => createInitialBoard());
  const [turn, setTurn] = useState<Color>("white");
  const [selected, setSelected] = useState<Position | null>(null);
  const [legalMoves, setLegalMoves] = useState<Position[]>([]);
  const [enPassantTarget, setEnPassantTarget] = useState<Position | null>(null);
  const [gameOver, setGameOver] = useState<
    null | { type: "checkmate"; winner: Color } | { type: "stalemate" }
  >(null);
  const [lastMove, setLastMove] = useState<{ from: Position; to: Position } | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>("pvp");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [isThinking, setIsThinking] = useState(false);

  const inCheck = useMemo(() => isInCheck(board, turn), [board, turn]);

  const captured = useMemo(
    () => getCapturedPieces(initialBoard, board),
    [initialBoard, board]
  );

  // Efecto para que el bot juegue automáticamente
  useEffect(() => {
    if (gameMode === "pve" && turn === "black" && !gameOver && !isThinking) {
      // Añadir un pequeño delay para que se vea más natural
      const timeoutId = setTimeout(() => {
        setIsThinking(true);
        const botMove = findBestMove(board, "black", enPassantTarget, difficulty);

        if (botMove) {
          const movingPiece = board[botMove.from[0]][botMove.from[1]]!;
          const newBoard = applyMove(board, botMove.from, botMove.to, enPassantTarget);

          // Update en passant target
          let newEnPassant: Position | null = null;
          if (
            movingPiece.type === "pawn" &&
            Math.abs(botMove.to[0] - botMove.from[0]) === 2
          ) {
            const epRow = (botMove.to[0] + botMove.from[0]) / 2;
            newEnPassant = [epRow, botMove.to[1]];
          }

          setBoard(newBoard);
          setEnPassantTarget(newEnPassant);
          setLastMove({ from: botMove.from, to: botMove.to });

          const nextTurn = "white";
          const status = getGameStatus(newBoard, nextTurn, newEnPassant);

          if (status === "checkmate") {
            setGameOver({ type: "checkmate", winner: "black" });
          } else if (status === "stalemate") {
            setGameOver({ type: "stalemate" });
          }

          setTurn(nextTurn);
          setIsThinking(false);
        }
      }, 500); // Delay de 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [gameMode, turn, board, gameOver, enPassantTarget, difficulty, isThinking]);

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (gameOver) return;

      // En modo vs Bot, el jugador solo puede mover piezas blancas
      if (gameMode === "pve" && turn === "black") return;

      const piece = board[row][col];

      // If clicking on own piece, select it
      if (piece && piece.color === turn) {
        setSelected([row, col]);
        setLegalMoves(getLegalMoves(board, row, col, enPassantTarget));
        return;
      }

      // If a piece is selected and clicking a legal move, execute it
      if (selected) {
        const isLegal = legalMoves.some(([r, c]) => r === row && c === col);
        if (isLegal) {
          const movingPiece = board[selected[0]][selected[1]]!;
          const newBoard = applyMove(board, selected, [row, col], enPassantTarget);

          // Update en passant target
          let newEnPassant: Position | null = null;
          if (
            movingPiece.type === "pawn" &&
            Math.abs(row - selected[0]) === 2
          ) {
            const epRow = (row + selected[0]) / 2;
            newEnPassant = [epRow, col];
          }

          setBoard(newBoard);
          setEnPassantTarget(newEnPassant);
          setLastMove({ from: selected, to: [row, col] });
          setSelected(null);
          setLegalMoves([]);

          const nextTurn = turn === "white" ? "black" : "white";
          const status = getGameStatus(newBoard, nextTurn, newEnPassant);

          if (status === "checkmate") {
            setGameOver({ type: "checkmate", winner: turn });
          } else if (status === "stalemate") {
            setGameOver({ type: "stalemate" });
          }

          setTurn(nextTurn);
        } else {
          // Deselect
          setSelected(null);
          setLegalMoves([]);
        }
      }
    },
    [board, turn, selected, legalMoves, enPassantTarget, gameOver, gameMode]
  );

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setTurn("white");
    setSelected(null);
    setLegalMoves([]);
    setEnPassantTarget(null);
    setGameOver(null);
    setLastMove(null);
    setIsThinking(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex flex-col items-center justify-center p-4 selection:bg-amber-500/30">
      <h1 className="text-4xl font-bold text-stone-100 mb-6 tracking-wide">
        Ajedrez
      </h1>

      <GameModeSelector
        gameMode={gameMode}
        difficulty={difficulty}
        onGameModeChange={(mode) => {
          setGameMode(mode);
          resetGame();
        }}
        onDifficultyChange={setDifficulty}
      />

      <TurnIndicator turn={turn} inCheck={inCheck} gameOver={!!gameOver} isThinking={isThinking} />

      <div className="mb-2">
        <CapturedPieces pieces={captured.white} />
      </div>

      <ChessBoard
        board={board}
        selected={selected}
        legalMoves={legalMoves}
        lastMove={lastMove}
        inCheck={inCheck}
        gameOver={!!gameOver}
        turn={turn}
        onSquareClick={handleSquareClick}
      />

      <div className="mt-2">
        <CapturedPieces pieces={captured.black} />
      </div>

      <button
        onClick={resetGame}
        className="mt-6 px-6 py-2 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg transition-colors text-sm font-medium border border-stone-600"
      >
        Nueva Partida
      </button>

      {gameOver && <GameOverModal gameOver={gameOver} onReset={resetGame} />}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
