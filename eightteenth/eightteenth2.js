const { readFileSync } = require('fs');

const tasknum = parseInt(process.argv.slice(3), 10);
const IS_TEST = parseInt(tasknum, 10) === 1;

const DIRS = {
  0: 'R',
  1: 'D',
  2: 'L',
  3: 'U',
};

function shoelaceFormula(walls) {
  let area = 0;

  for (let i = 0; i < walls.length; i++) {
    let currentStart = walls[i].start;
    let currentEnd = walls[i].end;

    area += currentStart.x * currentEnd.y;
    area -= currentEnd.x * currentStart.y;
  }

  return Math.abs(area / 2);
}

(async () => {
  const input = await readFileSync(IS_TEST ? './test.txt' : './input.txt', 'utf-8').split('\n').map((line) => line.split(' ')[2].slice(2, -1)).map(hex => {
    const num = parseInt(hex.slice(0, 5), 16);
    const dir = hex.charAt(hex.length - 1);
    return { num, dir: DIRS[dir] };
  });

  const sum = input.reduce((acc, curr) => acc + curr.num, 0);

  const walls = [];

  let currentPosition = { x: 0, y: 0 };
  for (const plan of input) {
    const start = { ...currentPosition };
    switch (plan.dir) {
      case 'R':
        currentPosition.x += plan.num;
        break;
      case 'L':
        currentPosition.x -= plan.num;
        break;
      case 'U':
        currentPosition.y -= plan.num;
        break;
      case 'D':
        currentPosition.y += plan.num;
        break;
      default:
        break;
    }
    const end = { ...currentPosition };
    walls.push({ start, end });
  }

  let result = shoelaceFormula(walls);

  console.log(`TASK 2: ${result + sum / 2 + 1}`);
})();
