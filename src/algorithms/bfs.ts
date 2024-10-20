type Node = [number, number];

export function bfs(
  grid: boolean[][],
  start: Node,
  end: Node
): { path: Node[]; visited: Node[] } {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue: Node[] = [start];
  const visited: boolean[][] = grid.map((row) => row.map(() => false));
  const parent: { [key: string]: Node | null } = {};
  const visitedOrder: Node[] = [];

  visited[start[0]][start[1]] = true;

  while (queue.length > 0) {
    const current = queue.shift()!;
    visitedOrder.push(current);

    if (current[0] === end[0] && current[1] === end[1]) {
      const path: Node[] = [];
      let node: Node | null = end;
      while (node) {
        path.unshift(node);
        node = parent[`${node[0]},${node[1]}`];
      }
      return { path, visited: visitedOrder };
    }

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
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
      }
    }
  }

  return { path: [], visited: visitedOrder };
}
