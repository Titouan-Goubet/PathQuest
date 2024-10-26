"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, Play, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { astar } from "../algorithms/astar";
import { bfs } from "../algorithms/bfs";
import { dijkstra } from "../algorithms/dijkstra";
import Grid from "../components/grid/grid";
import { generateMaze } from "../lib/mazeGenerator";

const GRID_SIZE = 21;
const CELLS_PER_FRAME = 300;
const VISIT_DELAY = 1;
const PATH_DELAY = 30;

type Algorithm = "BFS" | "A*" | "Dijkstra";

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
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm>("BFS");

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

  const runAlgorithm = () => {
    if (startNode && endNode) {
      const startTime = performance.now();
      let result;
      switch (selectedAlgorithm) {
        case "BFS":
          result = bfs(grid, startNode, endNode);
          break;
        case "A*":
          result = astar(grid, startNode, endNode);
          break;
        case "Dijkstra":
          result = dijkstra(grid, startNode, endNode);
          break;
      }
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);
      setAllVisited(result.steps.flat());
      setFullPath(result.path);
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

  const generateNewMaze = () => {
    const newMaze = generateMaze(GRID_SIZE, GRID_SIZE);
    setGrid(newMaze);
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
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold text-primary">
            PathQuest
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Visualisez les algorithmes de pathfinding en action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-center space-x-4">
            <Select
              value={selectedAlgorithm}
              onValueChange={(value) =>
                setSelectedAlgorithm(value as Algorithm)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionnez un algorithme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BFS">BFS</SelectItem>
                <SelectItem value="A*">A*</SelectItem>
                <SelectItem value="Dijkstra">Dijkstra</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-6 flex justify-center">
            <Grid
              grid={grid}
              startNode={startNode}
              endNode={endNode}
              path={path}
              visited={visited}
              onCellClick={handleCellClick}
            />
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={runAlgorithm}
              disabled={isRunning || !startNode || !endNode}
              variant="default"
            >
              <Play className="mr-2 h-4 w-4" />
              Lancer {selectedAlgorithm}
            </Button>
            <Button onClick={resetGrid} variant="destructive">
              <RefreshCw className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
            <Button onClick={generateNewMaze} variant="outline">
              <LayoutGrid className="mr-2 h-4 w-4" />
              Générer un labyrinthe
            </Button>
          </div>
          {executionTime !== null && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Temps d&apos;exécution : {executionTime.toFixed(2)} ms
            </p>
          )}
          {fullPath.length > 0 && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Longueur du chemin : {fullPath.length} cellules
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
