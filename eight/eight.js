const { readFileSync } = require('fs');

const tasknum = parseInt(process.argv.slice(3), 10);
const TASK = !isNaN(tasknum) ? tasknum : 1;

const DIR = {
  R: 1,
  L: 0,
};

const decideLine = (options, directions, iteration) => options[directions[iteration % directions.length]];

const getGreatesCommonDivisor = (a, b) => (b === 0 ? a : getGreatesCommonDivisor(b, a % b));

const getLeastCommonMultiplier = (a, b) => (a * b) / getGreatesCommonDivisor(a, b);

const lcmOfArray = (numbers) => numbers.reduce((result, current) => getLeastCommonMultiplier(result, current), 1);

(async () => {
  let input = await readFileSync('./input.txt', 'utf-8').split('\n');
  const directions = input[0].split('').map((e) => DIR[e]);
  input = input.splice(2);
  const map = {};
  for (const line of input) {
    const [key, value] = line.split('=');
    map[key.trim()] = value.trim().slice(1, -1).split(',').map((e) => e.trim());
  }

  let iteration = 0;

  if (TASK === 1) {
    let current = 'AAA';
    while (current !== 'ZZZ') {
      current = decideLine(map[current], directions, iteration);
      iteration += 1;
    }
    console.log(iteration);
    return;
  }

  const starters = Object.keys(map).filter((e) => e.endsWith('A'));

  const iterations = [];
  for (const start of starters) {
    let current = start;

    while (!current.endsWith('Z')) {
      current = decideLine(map[current], directions, iteration);
      iteration += 1;
    }
    iterations.push(iteration);
    iteration = 0;
  }

  console.log(lcmOfArray(iterations));
})();
