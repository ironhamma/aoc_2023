const { readFileSync } = require('fs');

const tasknum = parseInt(process.argv.slice(3), 10);
const TASK = !isNaN(tasknum) ? tasknum : 1;

function isValid(line, numbers) {
  const n = line.length;
  const runs = [];

  let i = 0;
  while (i < n) {
    while (i < n && !line[i]) {
      i += 1;
    }
    if (i === n) {
      break;
    }
    let j = i;
    let c = 0;
    while (j < n && line[j]) {
      j += 1;
      c += 1;
    }

    runs.push(c);
    i = j;
  }

  return JSON.stringify(runs) === JSON.stringify(numbers);
}

function getPossibilities(springs, numbers) {
  const line = [];
  const ids = [];
  for (let i = 0; i < springs.length; i++) {
    const x = springs[i];
    if (x === '.') {
      line.push(0);
    }
    if (x === '?') {
      line.push(-1);
      ids.push(i);
    }
    if (x === '#') {
      line.push(1);
    }
  }

  let count = 0;
  // hipiti hopiti there is a power here
  for (let mask = 0; mask < 2 ** ids.length; mask++) {
    const lineCopy = [...line];
    for (let i = 0; i < ids.length; i++) {
      // a little bit of reddit magic
      if (mask & 2 ** i) {
        lineCopy[ids[i]] = 0;
      } else {
        lineCopy[ids[i]] = 1;
      }
    }

    if (isValid(lineCopy, numbers)) {
      count += 1;
    }
  }

  return count;
}

(async () => {
  const input = await readFileSync('./input.txt', 'utf-8').split('\n');

  const lines = input.map(line => {
    const [springs, numbers] = line.split(' ');

    return {
      springs: springs.split('').join(''),
      numbers: numbers.split(',').map(e => parseInt(e, 10)),
    };
  });

  let result = 0;
  for (const line of lines) {
    result += getPossibilities(line.springs, line.numbers);
  }

  console.log(`TASK ${TASK}: ${result}`);
})();
