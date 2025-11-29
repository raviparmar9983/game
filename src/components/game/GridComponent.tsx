"use client";

import React, { useEffect, useState, useCallback } from "react";
import { IconsMap } from "@/icons/IconMap";

export interface Player {
  _id: string;
  icon: string;
  name?: string;
}

export interface MovePayload {
  row: number;
  col: number;
  playerId: string;
}

interface GridProps {
  gridSize: number;
  players: Player[];
  currTurn: string;
  onMove?: (payload: MovePayload) => void;
  gridData: string[][];
  disabled?: boolean;
}

const GameGrid: React.FC<GridProps> = ({
  gridSize,
  players,
  currTurn,
  onMove,
  gridData,
  disabled = false,
}) => {
  const [grid, setGrid] = useState<(string | null)[][]>([]);

  // initialize grid
  useEffect(() => {
    if (Array.isArray(gridData) && gridData.length > 0) {
      setGrid(gridData);
    } else {
      setGrid(Array.from({ length: gridSize }, () => Array(gridSize).fill(null)));
    }
  }, [gridData, gridSize]);

  const currentPlayer = players.find((p) => p._id === currTurn);

  const isMyTurn = useCallback((playerId: string) => playerId === currTurn, [currTurn]);

  const handleCellClick = (r: number, c: number) => {
    if (disabled) return;
    if (!currentPlayer) return;
    if (!isMyTurn(currentPlayer._id)) return;
    if (grid[r][c] !== null) return;

    const newGrid = grid.map((row) => [...row]);
    newGrid[r][c] = currentPlayer.icon;
    // setGrid(newGrid);

    onMove?.({
      row: r,
      col: c,
      playerId: currentPlayer._id,
    });
  };
  return (
    <div
      key={gridSize ?? ""}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        width: "100%",
        maxWidth: "420px",
        aspectRatio: "1 / 1",
        gap: "4px",
        padding: "8px",
        background: "#1e1e1e",
        borderRadius: "12px",
      }}
    >
      {grid.map((row, r) =>
        row.map((cell, c) => {
          const clickable =
            !disabled && cell === null && currentPlayer && isMyTurn(currentPlayer._id);

          return (
            <div
              key={`${r}-${c}`}
              onClick={() => clickable && handleCellClick(r, c)}
              style={{
                position: "relative",
                background: "#2a2a2a",
                borderRadius: "10px",
                cursor: clickable ? "pointer" : "default",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "32px",
                userSelect: "none",
                transition: "background 0.2s ease",

                ...(clickable && {
                  background: "#333",
                }),
              }}
            >
              {/* Placed icon */}
              <span style={{ zIndex: 2 }}>{cell ? IconsMap[cell] : ""}</span>

              {/* Hover preview */}
              {}
            </div>
          );
        })
      )}
    </div>
  );
};

export default GameGrid;
