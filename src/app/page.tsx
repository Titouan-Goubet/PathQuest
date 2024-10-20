"use client";

import { useState } from "react";
import { bfs } from "../algorithms/bfs";
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
  const [path, setPath] = useState<[number, number][]>([]);
  const [visited, setVisited] = useState<[number, number][]>([]);

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

  const runBFS = () => {
    if (startNode && endNode) {
      const { path, visited } = bfs(grid, startNode, endNode);
      setPath(path);
      setVisited(visited);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">PathQuest</h1>
      <Grid
        grid={grid}
        startNode={startNode}
        endNode={endNode}
        path={path}
        visited={visited}
        onCellClick={handleCellClick}
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={runBFS}
      >
        Run BFS
      </button>
    </main>
  );
}
