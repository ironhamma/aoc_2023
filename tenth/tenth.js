const { readFileSync, writeFileSync } = require('fs');

const tasknum = parseInt(process.argv.slice(3), 10);
const TASK = !isNaN(tasknum) ? tasknum : 1;

const DIRECTIONS = {
  NORTH: 'NORTH',
  EAST: 'EAST',
  SOUTH: 'SOUTH',
  WEST: 'WEST',
};

const PIPES = {
  '|': [DIRECTIONS.NORTH, DIRECTIONS.SOUTH],
  '-': [DIRECTIONS.WEST, DIRECTIONS.EAST],
  L: [DIRECTIONS.NORTH, DIRECTIONS.EAST],
  J: [DIRECTIONS.NORTH, DIRECTIONS.WEST],
  7: [DIRECTIONS.SOUTH, DIRECTIONS.WEST],
  F: [DIRECTIONS.SOUTH, DIRECTIONS.EAST],
  S: [DIRECTIONS.NORTH, DIRECTIONS.EAST, DIRECTIONS.WEST, DIRECTIONS.SOUTH],
  START: [DIRECTIONS.NORTH],
  '.': [],
};

const getOpposite = dir => {
  switch (dir) {
    case DIRECTIONS.EAST:
      return DIRECTIONS.WEST;
    case DIRECTIONS.WEST:
      return DIRECTIONS.EAST;
    case DIRECTIONS.NORTH:
      return DIRECTIONS.SOUTH;
    case DIRECTIONS.SOUTH:
      return DIRECTIONS.NORTH;
    default:
      return null;
  }
};

(async () => {
  const input = await readFileSync('./input.txt', 'utf-8');
  const pipes = input.split('\n').map((line) => line.split(''));
  const startRow = pipes.findIndex((line) => line.indexOf('S') !== -1);
  const startCol = pipes[startRow].indexOf('S');

  const visited = new Set();

  let result = 0;

  const findNextTile = (tile, row, col, from) => {
    visited.add(`${row}-${col}`);
    const opposite = getOpposite(from);
    result += 1;
    let north = [];
    let west = [];
    let south = [];
    let east = [];
    if (PIPES[tile].includes(DIRECTIONS.NORTH)) {
      north = PIPES[pipes[row - 1][col]].filter(e => e !== opposite);
    }
    if (PIPES[tile].includes(DIRECTIONS.WEST)) {
      west = PIPES[pipes[row][col - 1]].filter(e => e !== opposite);
    }
    if (PIPES[tile].includes(DIRECTIONS.SOUTH)) {
      south = PIPES[pipes[row + 1][col]].filter(e => e !== opposite);
    }
    if (PIPES[tile].includes(DIRECTIONS.EAST)) {
      east = PIPES[pipes[row][col + 1]].filter(e => e !== opposite);
    }

    if (north.length === 1 && !visited.has(`${row - 1}-${col}`)) {
      return {
        tile: pipes[row - 1][col],
        row: row - 1,
        col,
        from: north[0],
      };
    }
    if (west.length === 1 && !visited.has(`${[row]}-${[col - 1]}`)) {
      return {
        tile: pipes[row][col - 1],
        row,
        col: col - 1,
        from: west[0],
      };
    }
    if (south.length === 1 && !visited.has(`${[row + 1]}-${[col]}`)) {
      return {
        tile: pipes[row + 1][col],
        row: row + 1,
        col,
        from: south[0],
      };
    }
    if (east.length === 1 && !visited.has(`${[row]}-${[col + 1]}`)) {
      return {
        tile: pipes[row][col + 1],
        row,
        col: col + 1,
        from: east[0],
      };
    }
    return {};
  };

  let ended = false;
  let iteration = 0;
  const loop = [{
    tile: 'START', row: startRow, col: startCol, from: DIRECTIONS.NORTH,
  }];
  while (!ended) {
    const el = loop[iteration];
    const nextTile = findNextTile(el.tile, el.row, el.col, el.from);
    loop.push(nextTile);
    iteration++;
    if (nextTile && nextTile.tile === 'S') {
      console.log(nextTile);
    }
    if (nextTile === undefined) {
      ended = true;
    }
  }

  const out = [];
  for (let i = 0; i < pipes.length; i++) {
    const row = [];
    for (let j = 0; j < pipes[0].length; j++) {
      row.push('.');
    }
    out.push(row);
  }

  for (const el of loop) {
    if (!el) {
      break;
    }
    out[el.row][el.col] = el.tile;
  }

  for (let i = 0; i < out.length; i++) {
    out[i] = out[i].join('').replaceAll(/F-*J/g, '|').split('');
    out[i] = out[i].join('').replaceAll(/L-*7/g, '|').split('');
    out[i] = out[i].join('').replaceAll(/F-*7/g, '-').split('');
    out[i] = out[i].join('').replaceAll(/L-*J/g, '-').split('');
  }

  // this would need some refinement for it to actually work (so I dont have to count it visually :))
  if (TASK === 2) {
    result = 0;
    for (let i = 0; i < out.length; i++) {
      let parity = -1;
      for (let j = 0; j < out[i].length; j++) {
        const currentchar = out[i][j];
        if (currentchar === '|') {
          parity *= -1;
        }
        if (parity === 1 && currentchar === '.') {
          result += 1;
        }
      }
    }
  }

  await writeFileSync('out3.txt', out.map(line => line.join('').toString()).join('\n').toString());
  console.log(`TASK: ${TASK}: ${TASK === 1 ? result / 2 : result}`);
})();

// PART 2 answer is 529
// PART 1 answer is 6923
