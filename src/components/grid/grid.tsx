interface CellProps {
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  onClick: () => void;
}

const Cell = ({ isStart, isEnd, isWall, onClick }: CellProps) => {
  let bgColor = "bg-white";
  if (isStart) bgColor = "bg-green-500";
  else if (isEnd) bgColor = "bg-red-500";
  else if (isWall) bgColor = "bg-gray-700";

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
  onCellClick: (row: number, col: number) => void;
}

const Grid = ({ grid, startNode, endNode, onCellClick }: GridProps) => {
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
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
};

export default Grid;
