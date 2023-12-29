const { readFileSync, writeFileSync } = require('fs');

const tasknum = parseInt(process.argv.slice(3), 10);
const TASK = !isNaN(tasknum) ? tasknum : 1;

function isPointInsideBox(matrix, startX, startY) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const queue = [[startX, startY]];

  function isBoundary(x, y) {
    return matrix[x][y].char === '#';
  }

  while (queue.length > 0) {
    const [x, y] = queue.shift();

    if (x < 0 || x >= rows || y < 0 || y >= cols) {
      return false;
    }
    if (visited[x][y] || isBoundary(x, y)) {
      continue;
    }

    visited[x][y] = true;
    queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  return true;
}

(async () => {
  const input = await readFileSync('./input.txt', 'utf-8').split('\n').map((line) => line.split(' ').map((e) => e.trim()));
  const data = input.map((line) => {
    const [dir, amount, color] = line;
    const parsedAmount = parseInt(amount, 10);
    return { dir, amount: parsedAmount, color: color.slice(1, -1) };
  });

  const dims = {
    up: 0,
    left: 0,
    right: 0,
    down: 0,
  };

  let currentPosition = [1, 1];
  for (const plan of data) {
    for (let i = 0; i < plan.amount; i++) {
      switch (plan.dir) {
        case 'R':
          currentPosition[1]++;
          if (dims.right < currentPosition[1]) {
            dims.right = currentPosition[1];
          }
          break;
        case 'L':
          currentPosition[1]--;
          if (dims.left > currentPosition[1]) {
            dims.left = currentPosition[1];
          }
          break;
        case 'U':
          currentPosition[0]++;
          if (dims.up < currentPosition[0]) {
            dims.up = currentPosition[0];
          }
          break;
        case 'D':
          currentPosition[0]--;
          if (dims.down > currentPosition[0]) {
            dims.down = currentPosition[0];
          }
          break;
        default:
          break;
      }
    }
  }

  const digMap = [];

  for (let i = 0; i < Math.abs(dims.up) + Math.abs(dims.down) * 1.5; i++) {
    const row = [];
    for (let j = 0; j < Math.abs(dims.left) + Math.abs(dims.right) * 1.5; j++) {
      row.push({ char: '.', color: '' });
    }
    digMap.push(row);
  }

  currentPosition = [Math.abs(dims.up), Math.abs(dims.left) + 1];
  for (const plan of data) {
    for (let i = 0; i < plan.amount; i++) {
      switch (plan.dir) {
        case 'R':
          currentPosition[1]++;
          break;
        case 'L':
          currentPosition[1]--;
          break;
        case 'U':
          currentPosition[0]--;
          break;
        case 'D':
          currentPosition[0]++;
          break;
        default:
          break;
      }
      digMap[currentPosition[0]][currentPosition[1]] = { char: '#', color: plan.color };
    }
  }

  for (let i = 0; i < digMap.length; i++) {
    for (let j = 0; j < digMap[i].length; j++) {
      const isInDigMap = isPointInsideBox(digMap, i, j);
      if (isInDigMap) {
        digMap[i][j] = { char: '#', color: '' };
      }
    }
    console.log(i);
    await writeFileSync('./output.txt', digMap.map((line) => line.map(e => e.char).join('')).join('\n'));
  }

  let result = 0;
  console.log(`TASK ${TASK}: ${result}`);
})();
