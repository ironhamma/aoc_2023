const { readFileSync } = require('fs');

const tasknum = parseInt(process.argv.slice(3), 10);
const TASK = !isNaN(tasknum) ? tasknum : 1;

function transpose(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const result = [];

  for (let j = 0; j < cols; j++) {
    result[j] = [];

    for (let i = 0; i < rows; i++) {
      result[j][i] = matrix[i][j];
    }
  }

  return result;
}

const checkHorizontal = (grid, i) => {
  for (let j = 0; j < grid[0].length; j++) {
    for (let k = 0; k < grid.length; k++) {
      const x = i * 2 + 1 - k;
      if (!(x >= 0 && x < grid.length)) {
        continue;
      }
      if (grid[k][j] !== grid[x][j]) {
        return false;
      }
    }
  }
  return true;
};

const getReflection = (grid) => {
  const n = grid.length;
  const m = grid[0].length;
  let horizontal = -1;

  for (let i = 0; i < n - 1; i++) {
    if (checkHorizontal(grid, i)) {
      horizontal = i;
      break;
    }
  }

  let vertical = -1;
  const transposed = transpose(grid);
  for (let j = 0; j < m - 1; j++) {
    if (checkHorizontal(transposed, j)) {
      vertical = j;
      break;
    }
  }
  return vertical + 1 + 100 * (horizontal + 1);
};

const getReflection2 = (grid, skip = [-1, -1]) => {
  let horizontal = -1;

  for (let i = 0; i < grid.length - 1; i++) {
    if (i !== skip[0] && checkHorizontal(grid, i)) {
      horizontal = i;
      break;
    }
  }

  let vertical = -1;
  const transposed = transpose(grid);
  for (let j = 0; j < grid[0].length - 1; j++) {
    if (j !== skip[1] && checkHorizontal(transposed, j)) {
      vertical = j;
      break;
    }
  }
  return [horizontal, vertical];
};

const changeCharacters = (grid) => {
  const reflections = getReflection2(grid);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      const copy = JSON.parse(JSON.stringify(grid));
      copy[i][j] = grid[i][j] === '#' ? '.' : '#';

      const newReflections = getReflection2(copy, reflections);

      if (!([reflections].includes(newReflections) || newReflections.every(e => e === -1))) {
        let result = 0;
        if (newReflections[0] !== -1) {
          result = (newReflections[0] + 1) * 100;
        } else {
          result = newReflections[1] + 1;
        }
        return result;
      }
    }
  }
};

(async () => {
  const patterns = await readFileSync('./input.txt', 'utf-8').split('\n\n').map(e => e.split('\n').map(line => line.split('')));

  let result = 0;
  for (const pattern of patterns) {
    let res = 0;
    if (TASK === 1) {
      res = getReflection(pattern);
    } else {
      res = changeCharacters(pattern);
    }
    result += res;
  }

  console.log(`TASK ${TASK}: ${result}`);
})();
