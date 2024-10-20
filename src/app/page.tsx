"use client";

import { useEffect, useState } from "react";
import { bfs } from "../algorithms/bfs";
import Grid from "../components/grid/grid";

const GRID_SIZE = 20;
const CELLS_PER_FRAME = 300;
const VISIT_DELAY = 1;
const PATH_DELAY = 30;

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
  const [fullPath, setFullPath] = useState<[number, number][]>([]);
  const [allVisited, setAllVisited] = useState<[number, number][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDrawingPath, setIsDrawingPath] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  useEffect(() => {
    if (isRunning && !isDrawingPath && currentStep < allVisited.length) {
      const timer = setTimeout(() => {
        const nextStep = Math.min(
          currentStep + CELLS_PER_FRAME,
          allVisited.length
        );
        setVisited(allVisited.slice(0, nextStep));
        setCurrentStep(nextStep);
      }, VISIT_DELAY);
      return () => clearTimeout(timer);
    } else if (
      isRunning &&
      !isDrawingPath &&
      currentStep === allVisited.length
    ) {
      setIsDrawingPath(true);
      setCurrentStep(0);
    } else if (isDrawingPath && currentStep < fullPath.length) {
      const timer = setTimeout(() => {
        setPath(fullPath.slice(0, currentStep + 1));
        setCurrentStep(currentStep + 1);
      }, PATH_DELAY);
      return () => clearTimeout(timer);
    } else if (isDrawingPath && currentStep === fullPath.length) {
      setIsRunning(false);
      setIsDrawingPath(false);
    }
  }, [isRunning, isDrawingPath, currentStep, allVisited, fullPath]);

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
      const startTime = performance.now();
      const { steps, path } = bfs(grid, startNode, endNode);
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setAllVisited(steps.flat());
      setFullPath(path);
      setPath([]);
      setVisited([]);
      setCurrentStep(0);
      setIsRunning(true);
      setIsDrawingPath(false);
    }
  };

  const resetGrid = () => {
    setGrid(
      Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(false))
    );
    setStartNode(null);
    setEndNode(null);
    setPath([]);
    setVisited([]);
    setFullPath([]);
    setAllVisited([]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsDrawingPath(false);
    setExecutionTime(null);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-2">PathQuest</h1>
      <p className="text-center mb-6 max-w-md text-sm text-gray-600">
        Visualisez l&apos;algorithme BFS en action. Cliquez pour définir le
        départ (vert), l&apos;arrivée (rouge), et les murs (gris). Lancez BFS
        pour voir le chemin le plus court.
      </p>
      <Grid
        grid={grid}
        startNode={startNode}
        endNode={endNode}
        path={path}
        visited={visited}
        onCellClick={handleCellClick}
      />
      <div className="mt-4 space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={runBFS}
          disabled={isRunning || !startNode || !endNode}
        >
          Lancer BFS
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={resetGrid}
        >
          Réinitialiser la grille
        </button>
      </div>
      {executionTime !== null && (
        <p className="mt-4">
          Temps d&apos;exécution : {executionTime.toFixed(2)} ms
        </p>
      )}
      {fullPath.length > 0 && (
        <p className="mt-2">Longueur du chemin : {fullPath.length} cellules</p>
      )}
    </main>
  );
}
