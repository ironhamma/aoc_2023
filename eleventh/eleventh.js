const { readFileSync } = require('fs');

const tasknum = parseInt(process.argv.slice(3), 10);
const TASK = !isNaN(tasknum) ? tasknum : 1;

const transpose = matrix => matrix[0].map((_, col) => matrix.map(row => row[col]));

const getDistance = (pair, rows, cols) => {
  const start = pair[0];
  const end = pair[1];
  let res = null;
  if (start.y === end.y && res === null) {
    res = Math.abs(start.x - end.x);
  }
  if (start.x === end.x && res === null) {
    res = Math.abs(start.y - end.y);
  }
  if (res === null) {
    res = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
  }
  if (TASK === 2) {
    const sortedX = [start.x, end.x].sort();
    const sortedY = [start.y, end.y].sort();

    let bilCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (sortedY[0] < row && row < sortedY[1]) {
        bilCount += 1;
      }
    }

    for (let i = 0; i < cols.length; i++) {
      const col = cols[i];
      if (sortedX[0] < col && col < sortedX[1]) {
        bilCount += 1;
      }
    }
    res += (bilCount * 999999); // one is already there
  }
  return res;
};

(async () => {
  const input = await readFileSync('./input.txt', 'utf-8');
  let galaxies = input.split('\n').map(line => line.split(''));
  const transposed = transpose(galaxies);

  const rows = [];
  const cols = [];

  for (let i = 0; i < galaxies.length; i++) {
    const row = galaxies[i];
    const col = transposed[i];
    if (row.every(e => e === '.')) {
      rows.push(i);
    }
    if (col.every(e => e === '.')) {
      cols.push(i);
    }
  }

  if (TASK === 1) {
    // expand cols
    for (let i = 0; i < galaxies.length; i++) {
      for (let j = 0; j < cols.length; j++) {
        galaxies[i].splice(cols[j] + j, 0, '.');
      }
    }
    galaxies = transpose(galaxies);

    // expand rows
    for (let i = 0; i < galaxies.length; i++) {
      for (let j = 0; j < rows.length; j++) {
        galaxies[i].splice(rows[j] + j, 0, '.');
      }
    }
    galaxies = transpose(galaxies);
  }

  // at this point the galaxies are expanded

  let count = 0;
  const numbers = [{}];
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = 0; j < galaxies[i].length; j++) {
      if (galaxies[i][j] === '#') {
        count += 1;
        galaxies[i][j] = count;
        numbers.push({ x: j, y: i });
      }
    }
  }

  const pairs = {};
  for (let i = 1; i < numbers.length; i++) {
    for (let j = 1; j < numbers.length; j++) {
      if (i !== j) {
        const sorted = [i, j].sort();
        const key = `${sorted[0]}-${sorted[1]}`;
        pairs[key] = [numbers[sorted[0]], numbers[sorted[1]]];
      }
    }
  }

  let result = 0;
  for (const pair of Object.values(pairs)) {
    result += getDistance(pair, rows, cols);
  }

  // console.log(galaxies.map(e => e.join('')).join('\n'));
  console.log(`TASK ${TASK}: ${result}`);
})();

// task 1 answer: 9742154
// also task 2 should be correct, but yet I dont get the appoval of AoC.
// will try to resolve this issue later
