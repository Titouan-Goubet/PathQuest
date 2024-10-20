type Node = [number, number];

export function bfs(
  grid: boolean[][],
  start: Node,
  end: Node
): { steps: Node[][]; path: Node[] } {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue: Node[] = [start];
  const visited: boolean[][] = grid.map((row) => row.map(() => false));
  const parent: { [key: string]: Node | null } = {};
  const steps: Node[][] = [[start]];

  visited[start[0]][start[1]] = true;

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current[0] === end[0] && current[1] === end[1]) {
      // Path found
      const path: Node[] = [];
      let node: Node | null = end;
      while (node) {
        path.unshift(node);
        node = parent[`${node[0]},${node[1]}`];
      }
      return { steps, path };
    }

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const newVisited: Node[] = [];
    for (const [dx, dy] of directions) {
      const newRow = current[0] + dx;
      const newCol = current[1] + dy;

      if (
        newRow >= 0 &&
        newRow < rows &&
        newCol >= 0 &&
        newCol < cols &&
        !visited[newRow][newCol] &&
        !grid[newRow][newCol]
      ) {
        queue.push([newRow, newCol]);
        visited[newRow][newCol] = true;
        parent[`${newRow},${newCol}`] = current;
        newVisited.push([newRow, newCol]);
      }
    }
    if (newVisited.length > 0) {
      steps.push([...steps[steps.length - 1], ...newVisited]);
    }
  }

  return { steps, path: [] };
}
