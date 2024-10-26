type Cell = [number, number];

export function generateMaze(rows: number, cols: number): boolean[][] {
  const maze: boolean[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(true));

  const stack: Cell[] = [];
  const startCell: Cell = [1, 1];

  maze[startCell[0]][startCell[1]] = false;
  stack.push(startCell);

  while (stack.length > 0) {
    const currentCell = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(currentCell, maze);

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const [nextCell, wall] =
        neighbors[Math.floor(Math.random() * neighbors.length)];
      maze[wall[0]][wall[1]] = false;
      maze[nextCell[0]][nextCell[1]] = false;
      stack.push(nextCell);
    }
  }

  return maze;
}

function getUnvisitedNeighbors(cell: Cell, maze: boolean[][]): [Cell, Cell][] {
  const [row, col] = cell;
  const neighbors: [Cell, Cell][] = [];
  const directions = [
    [
      [-1, 0],
      [-2, 0],
    ], // Up
    [
      [1, 0],
      [2, 0],
    ], // Down
    [
      [0, -1],
      [0, -2],
    ], // Left
    [
      [0, 1],
      [0, 2],
    ], // Right
  ];

  for (const [wallDir, neighborDir] of directions) {
    const wallRow = row + wallDir[0];
    const wallCol = col + wallDir[1];
    const neighborRow = row + neighborDir[0];
    const neighborCol = col + neighborDir[1];

    if (
      neighborRow >= 0 &&
      neighborRow < maze.length &&
      neighborCol >= 0 &&
      neighborCol < maze[0].length &&
      maze[neighborRow][neighborCol]
    ) {
      neighbors.push([
        [neighborRow, neighborCol],
        [wallRow, wallCol],
      ]);
    }
  }

  return neighbors;
}
