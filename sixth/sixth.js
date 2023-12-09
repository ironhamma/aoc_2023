const { readFileSync } = require('fs');

const getNumbers = (line) => line
  .split(':')[1]
  .trim()
  .split(' ')
  .filter((e) => e)
  .map((e) => parseInt(e, 10));

const task = 2;

(async () => {
  const input = await readFileSync('./input.txt', 'utf-8').split('\n');
  let times = getNumbers(input[0]);
  let distances = getNumbers(input[1]);
  if (task === 2) {
    times = [parseInt(times.join(''), 10)];
    distances = [parseInt(distances.join(''), 10)];
  }
  const races = times.map((el, i) => ({ time: el, distance: distances[i] }));

  const results = [];

  for (const race of races) {
    let winables = 0;
    for (let i = 0; i < race.time; i++) {
      const currentDistance = i * (race.time - i);
      if (currentDistance > race.distance) {
        winables += 1;
      }
    }
    results.push(winables);
  }
  console.log(results.reduce((res, item) => res * item));
})();
