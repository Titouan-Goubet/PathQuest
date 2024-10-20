import React from "react";

interface CellProps {
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isPath: boolean;
  isVisited: boolean;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({
  isStart,
  isEnd,
  isWall,
  isPath,
  isVisited,
  onClick,
}) => {
  let bgColor = "bg-white";
  if (isStart) bgColor = "bg-green-500";
  else if (isEnd) bgColor = "bg-red-500";
  else if (isWall) bgColor = "bg-gray-700";
  else if (isPath) bgColor = "bg-yellow-300";
  else if (isVisited) bgColor = "bg-blue-200";

  return (
    <div
      className={`w-6 h-6 border border-gray-300 ${bgColor} hover:bg-gray-100 cursor-pointer`}
      onClick={onClick}
    />
  );
};

interface GridProps {
  grid: boolean[][];
  startNode: [number, number] | null;
  endNode: [number, number] | null;
  path: [number, number][];
  visited: [number, number][];
  onCellClick: (row: number, col: number) => void;
}

const Grid: React.FC<GridProps> = ({
  grid,
  startNode,
  endNode,
  path,
  visited,
  onCellClick,
}) => {
  const isInPath = (row: number, col: number): boolean => {
    return Array.isArray(path) && path.some(([r, c]) => r === row && c === col);
  };

  const isVisited = (row: number, col: number): boolean => {
    return (
      Array.isArray(visited) && visited.some(([r, c]) => r === row && c === col)
    );
  };

  return (
    <div
      className="inline-grid gap-0"
      style={{
        gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))`,
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((isWall, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            isStart={startNode?.[0] === rowIndex && startNode?.[1] === colIndex}
            isEnd={endNode?.[0] === rowIndex && endNode?.[1] === colIndex}
            isWall={isWall}
            isPath={isInPath(rowIndex, colIndex)}
            isVisited={isVisited(rowIndex, colIndex)}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
