"use client";

import { useState } from "react";
import Grid from "../components/grid/grid";

const GRID_SIZE = 20;

export default function Home() {
  const [grid, setGrid] = useState<boolean[][]>(
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(false))
  );
  const [startNode, setStartNode] = useState<[number, number] | null>(null);
  const [endNode, setEndNode] = useState<[number, number] | null>(null);

  const handleCellClick = (row: number, col: number) => {
    if (!startNode) {
      setStartNode([row, col]);
    } else if (!endNode) {
      setEndNode([row, col]);
    } else {
      const newGrid = [...grid];
      newGrid[row][col] = !newGrid[row][col];
      setGrid(newGrid);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">PathQuest</h1>
      <Grid
        grid={grid}
        startNode={startNode}
        endNode={endNode}
        onCellClick={handleCellClick}
      />
    </main>
  );
}
