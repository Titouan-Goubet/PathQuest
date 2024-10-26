type Node = [number, number];

export function dijkstra(
  grid: boolean[][],
  start: Node,
  end: Node
): { steps: Node[][]; path: Node[] } {
  const rows = grid.length;
  const cols = grid[0].length;
  const distances: number[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(Infinity));
  const visited: boolean[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(false));
  const previous: (Node | null)[][] = Array(rows)
    .fill(null)
    .map(() => Array(cols).fill(null));
  const queue: Node[] = [];
  const steps: Node[][] = [];

  distances[start[0]][start[1]] = 0;
  queue.push(start);

  while (queue.length > 0) {
    queue.sort((a, b) => distances[a[0]][a[1]] - distances[b[0]][b[1]]);
    const current = queue.shift()!;
    steps.push([...queue, current]);

    if (current[0] === end[0] && current[1] === end[1]) {
      return { steps, path: reconstructPath(previous, end) };
    }

    visited[current[0]][current[1]] = true;

    const neighbors = getNeighbors(current, rows, cols);
    for (const neighbor of neighbors) {
      const [nx, ny] = neighbor;

      if (visited[nx][ny] || grid[nx][ny]) continue;

      const tentativeDistance = distances[current[0]][current[1]] + 1;

      if (tentativeDistance < distances[nx][ny]) {
        distances[nx][ny] = tentativeDistance;
        previous[nx][ny] = current;
        if (!queue.some(([x, y]) => x === nx && y === ny)) {
          queue.push(neighbor);
        }
      }
    }
  }

  return { steps, path: [] };
}

function getNeighbors(node: Node, rows: number, cols: number): Node[] {
  const [x, y] = node;
  const directions: Node[] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  return directions
    .map(([dx, dy]) => [x + dx, y + dy] as Node)
    .filter(([nx, ny]) => nx >= 0 && nx < rows && ny >= 0 && ny < cols);
}

function reconstructPath(previous: (Node | null)[][], end: Node): Node[] {
  const path: Node[] = [];
  let current: Node | null = end;
  while (current !== null) {
    path.unshift(current);
    current = previous[current[0]][current[1]];
  }
  return path;
}
