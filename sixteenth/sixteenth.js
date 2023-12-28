const { readFileSync, writeFile, writeFileSync } = require('fs');

const tasknum = parseInt(process.argv.slice(3), 10);
const TASK = !isNaN(tasknum) ? tasknum : 1;

const TYPES = {
  EMPTY: '.',
  MIRROS_LEFT: '/',
  MIRROS_RIGHT: '\\',
  SPLITTER_VERTICAL: '|',
  SPLITTER_HORIZONTAL: '-',
};

const DIRECTIONS = {
  UP: 4,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
};

const getChar = (dir) => {
  if (dir === DIRECTIONS.UP) {
    return '^';
  }

  if (dir === DIRECTIONS.RIGHT) {
    return '>';
  }

  if (dir === DIRECTIONS.DOWN) {
    return 'v';
  }

  if (dir === DIRECTIONS.LEFT) {
    return '<';
  }
  return '';
};

const getNewDirection = (dir, currentEl) => {
  let direction = dir;
  let newDir = null;
  if (currentEl === TYPES.SPLITTER_VERTICAL) {
    if (direction === DIRECTIONS.RIGHT || direction === DIRECTIONS.LEFT) {
      direction = DIRECTIONS.DOWN;
      newDir = DIRECTIONS.UP;
    }
  }

  if (currentEl === TYPES.SPLITTER_HORIZONTAL) {
    if (direction === DIRECTIONS.UP || direction === DIRECTIONS.DOWN) {
      direction = DIRECTIONS.RIGHT;
      newDir = DIRECTIONS.LEFT;
    }
  }

  if (currentEl === TYPES.MIRROS_LEFT) {
    if (direction === DIRECTIONS.UP) {
      direction = DIRECTIONS.RIGHT;
    } else if (direction === DIRECTIONS.RIGHT) {
      direction = DIRECTIONS.UP;
    } else if (direction === DIRECTIONS.DOWN) {
      direction = DIRECTIONS.LEFT;
    } else if (direction === DIRECTIONS.LEFT) {
      direction = DIRECTIONS.DOWN;
    }
  }

  if (currentEl === TYPES.MIRROS_RIGHT) {
    if (direction === DIRECTIONS.UP) {
      direction = DIRECTIONS.LEFT;
    } else if (direction === DIRECTIONS.RIGHT) {
      direction = DIRECTIONS.DOWN;
    } else if (direction === DIRECTIONS.DOWN) {
      direction = DIRECTIONS.RIGHT;
    } else if (direction === DIRECTIONS.LEFT) {
      direction = DIRECTIONS.UP;
    }
  }
  if (currentEl === TYPES.EMPTY) {
    direction = dir;
    newDir = null;
  }

  return { direction, newDir };
};

const moveInDir = (dir, currentPos) => {
  if (dir === DIRECTIONS.UP) {
    return { x: currentPos.x, y: currentPos.y - 1 };
  }

  if (dir === DIRECTIONS.RIGHT) {
    return { x: currentPos.x + 1, y: currentPos.y };
  }

  if (dir === DIRECTIONS.DOWN) {
    return { x: currentPos.x, y: currentPos.y + 1 };
  }

  if (dir === DIRECTIONS.LEFT) {
    return { x: currentPos.x - 1, y: currentPos.y };
  }
  return currentPos;
};

const Beams = [];

class Beam {
  constructor(startPos, startDir) {
    this.direction = startDir;
    this.currentIndex = startPos;
  }

  move(input, traceArray) {
    const currentEl = input[this.currentIndex.y][this.currentIndex.x];
    traceArray[this.currentIndex.y][this.currentIndex.x] = '#';
    const res = getNewDirection(this.direction, currentEl);
    this.direction = res.direction;

    if (res.newDir) {
      const nBeam = new Beam({ ...this.currentIndex }, res.newDir);
      Beams.push(nBeam);
    }

    const newCurrentPos = moveInDir(res.direction, this.currentIndex);
    if (newCurrentPos.x < 0 || newCurrentPos.x >= input[0].length || newCurrentPos.y < 0 || newCurrentPos.y >= input.length) {
      return;
    }
    this.currentIndex = newCurrentPos;
  }
}

const countHashes = (traceArray) => {
  let count = 0;
  traceArray.forEach((row) => {
    row.forEach((el) => {
      if (el === '#') {
        count++;
      }
    });
  });
  return count;
};

const writeTrace = async (traceArray) => {
  let str = '';
  traceArray.forEach((row) => {
    str += `${row.join('')}\n`;
  });
  await writeFileSync('./trace.txt', str);
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const input = await readFileSync('./input.txt', 'utf-8').split('\n').map((line) => line.split(''));
  const traceArray = [];
  for (let i = 0; i < input.length; i++) {
    const row = [];
    for (let j = 0; j < input[0].length; j++) {
      row.push(input[i][j]);
    }
    traceArray.push(row);
  }

  const startBeam = new Beam({ x: 0, y: 0 }, DIRECTIONS.RIGHT);
  Beams.push(startBeam);
  while (true) {
    const count = countHashes(traceArray);
    Beams.forEach((beam) => beam.move(input, traceArray, count));
    console.log(count);
    await writeTrace(traceArray);
    await delay(10);
  }

  let result = 0;
  console.log(`TASK ${TASK}: ${result}`);
})();
