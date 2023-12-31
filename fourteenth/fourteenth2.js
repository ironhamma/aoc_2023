const { readFileSync, writeFileSync } = require('fs');

const tasknum = parseInt(process.argv.slice(3), 10);
const TASK = !isNaN(tasknum) ? tasknum : 1;

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const DIRECTIONS = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  UP: 'UP',
  DOWN: 'DOWN',
  NONE: 'NONE',
};

const TYPES = {
  ROCK: 'ROCK',
  WALL: 'WALL',
  EMPTY: 'EMPTY',
};

class Rock {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.type = TYPES.ROCK;
    this.display = 'O';
  }

  get position() {
    return { x: this.x, y: this.y };
  }

  move(direction) {
    if (direction === DIRECTIONS.DOWN) {
      this.y += 1;
    }
    if (direction === DIRECTIONS.UP) {
      this.y -= 1;
    }
    if (direction === DIRECTIONS.LEFT) {
      this.x -= 1;
    }
    if (direction === DIRECTIONS.RIGHT) {
      this.x += 1;
    }
    if (direction === DIRECTIONS.NONE) {}
  }
}

class Wall extends Rock {
  constructor(x, y) {
    super(x, y);
    this.type = TYPES.WALL;
    this.display = '#';
  }

  move() {
    super.move(DIRECTIONS.NONE);
  }
}

class Empty extends Rock {
  constructor(x, y) {
    super(x, y);
    this.type = TYPES.EMPTY;
    this.display = ' ';
  }

  move() {
    super.move(DIRECTIONS.NONE);
  }
}

class Plate {
  constructor(width, height, initialDirection, elements) {
    this.width = width;
    this.height = height;
    this.direction = initialDirection;
    this.movesHappened = 0;
    const rockArray = [];
    const els = [];
    this.iterations = 0;
    for (let i = 0; i < height; i++) {
      const row = [];
      for (let j = 0; j < width; j++) {
        const el = elements[i][j];
        if (el === 'O') {
          const rock = new Rock(j, i);
          rockArray.push(rock);
          row.push(rock);
          continue;
        }
        if (el === '.') {
          row.push(new Empty(j, i));
          continue;
        }
        if (el === '#') {
          row.push(new Wall(j, i));
          continue;
        }
        row.push(new Empty(j, i));
      }
      els.push(row);
    }
    this.elements = els;
    this.rocks = rockArray;
  }

  getElement({ x, y }) {
    return this.elements[y][x];
  }

  canMove(source, dest) {
    if (dest.x < 0 || dest.x > this.width - 1) {
      return false;
    }

    if (dest.y < 0 || dest.y > this.height - 1) {
      return false;
    }
    const sourceElement = this.getElement(source);
    const destElement = this.getElement(dest);

    if (sourceElement.type === TYPES.EMPTY || sourceElement.type === TYPES.WALL || destElement.type === TYPES.WALL || destElement.type === TYPES.ROCK) {
      return false;
    }
    this.elements[dest.y][dest.x] = sourceElement;
    this.elements[source.y][source.x] = destElement;
    return true;
  }

  sortRocks() {
    switch (this.direction) {
      case DIRECTIONS.UP:
        this.rocks.sort((a, b) => a.position.y - b.position.y);
        break;
      case DIRECTIONS.DOWN:
        this.rocks.sort((a, b) => b.position.y - a.position.y);
        break;
      case DIRECTIONS.LEFT:
        this.rocks.sort((a, b) => a.position.x - b.position.x);
        break;
      case DIRECTIONS.RIGHT:
        this.rocks.sort((a, b) => b.position.x - a.position.x);
        break;
      default:
        break;
    }
  }

  sumStones() {
    let count = 0;
    for (let i = 0; i < this.height; i++) {
      const rowCount = this.elements[i].map(e => e.display).filter(e => e === 'O').length;
      count += (rowCount * ((this.height - i)));
    }
    return count;
  }

  // Assuming rocks is a sorted array based on the direction of movement
  moveStones() {
    this.movesHappened = 0;
    const pos = this.rocks[0].position;
    let newPos;

    switch (this.direction) {
      case DIRECTIONS.UP:
        newPos = { x: pos.x, y: pos.y - 1 };
        break;
      case DIRECTIONS.DOWN:
        newPos = { x: pos.x, y: pos.y + 1 };
        break;
      case DIRECTIONS.LEFT:
        newPos = { x: pos.x - 1, y: pos.y };
        break;
      case DIRECTIONS.RIGHT:
        newPos = { x: pos.x + 1, y: pos.y };
        break;
      default:
        break;
    }

    if (this.canMove(pos, newPos)) {
      this.rocks[0].move(this.direction);
      this.movesHappened += 1;
      // Re-sort the rocks array if needed
      this.sortRocks();
    }
    if (this.movesHappened === 0) {
      this.tilt();
    }
  }

  tilt() {
    switch (this.direction) {
      case DIRECTIONS.UP:
        this.direction = DIRECTIONS.LEFT;
        this.iterations += 1;
        break;
      case DIRECTIONS.RIGHT:
        this.direction = DIRECTIONS.UP;
        break;
      case DIRECTIONS.DOWN:
        this.direction = DIRECTIONS.RIGHT;
        break;
      case DIRECTIONS.LEFT:
        this.direction = DIRECTIONS.DOWN;
        break;
      default:
        break;
    }
    if (TASK === 1) {
      this.direction = DIRECTIONS.UP;
    }
  }

  async printPlate() {
    const out = [];
    for (let i = 0; i < this.elements.length; i++) {
      const line = [];
      for (let j = 0; j < this.elements[i].length; j++) {
        line.push(this.elements[i][j].display);
      }
      out.push(line);
    }
    await writeFileSync('output.txt', out.map(line => line.join('')).join('\n'));
  }
}

(async () => {
  const input = await readFileSync('./test.txt', 'utf-8').split('\n').map(e => e.split(''));
  const gameMap = new Plate(input[0].length, input.length, DIRECTIONS.UP, input);

  let breakMe = true;
  while (breakMe) {
    await gameMap.printPlate();
    gameMap.sortRocks();
    gameMap.moveStones();
    if (gameMap.iterations % 1000000 === 0) {
      const res = gameMap.sumStones();
      console.log(gameMap.iterations, res);
    }
    if (gameMap.iterations === 1000000000 - 1) {
      breakMe = false;
      const res = gameMap.sumStones();
      console.log(res);
    }
    await delay(100);
  }

  let result = 0;
  console.log(`TASK ${TASK}: ${result}`);
})();
