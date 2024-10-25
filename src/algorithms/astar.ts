type Node = [number, number];

function manhattan(a: Node, b: Node): number {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
}

export function astar(
  grid: boolean[][],
  start: Node,
  end: Node
): { steps: Node[][]; path: Node[] } {
  const rows = grid.length;
  const cols = grid[0].length;
  const openSet: Node[] = [start];
  const closedSet: Set<string> = new Set();
  const gScore: { [key: string]: number } = { [`${start[0]},${start[1]}`]: 0 };
  const fScore: { [key: string]: number } = {
    [`${start[0]},${start[1]}`]: manhattan(start, end),
  };
  const cameFrom: { [key: string]: Node } = {};
  const steps: Node[][] = [];

  while (openSet.length > 0) {
    openSet.sort(
      (a, b) => fScore[`${a[0]},${a[1]}`] - fScore[`${b[0]},${b[1]}`]
    );
    const current = openSet.shift()!;
    steps.push([...openSet, current]);

    if (current[0] === end[0] && current[1] === end[1]) {
      const path: Node[] = [];
      let node: Node | undefined = current;
      while (node) {
        path.unshift(node);
        node = cameFrom[`${node[0]},${node[1]}`];
      }
      return { steps, path };
    }

    closedSet.add(`${current[0]},${current[1]}`);

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    for (const [dx, dy] of directions) {
      const neighbor: Node = [current[0] + dx, current[1] + dy];
      const [nx, ny] = neighbor;

      if (
        nx < 0 ||
        nx >= rows ||
        ny < 0 ||
        ny >= cols ||
        grid[nx][ny] ||
        closedSet.has(`${nx},${ny}`)
      ) {
        continue;
      }

      const tentativeGScore = gScore[`${current[0]},${current[1]}`] + 1;

      if (!openSet.some(([x, y]) => x === nx && y === ny)) {
        openSet.push(neighbor);
      } else if (tentativeGScore >= gScore[`${nx},${ny}`]) {
        continue;
      }

      cameFrom[`${nx},${ny}`] = current;
      gScore[`${nx},${ny}`] = tentativeGScore;
      fScore[`${nx},${ny}`] = gScore[`${nx},${ny}`] + manhattan(neighbor, end);
    }
  }

  return { steps, path: [] };
}
