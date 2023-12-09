const { readFileSync } = require('fs');

const TURN = 2;

(async () => {
  let input = await readFileSync('./input.txt', 'utf-8').split('\n');

  const seeds = input[0]
    .split(':')[1]
    .split(' ')
    .filter((e) => e);

  const maps = {};

  input = input.slice(1).filter((e) => e);
  let currentKey = null;
  for (const line of input) {
    if (isNaN(parseInt(line, 10))) {
      const lineKey = line.replace(':', '');
      maps[lineKey] = [];
      currentKey = lineKey;
      continue;
    }
    const vals = line.split(' ');
    maps[currentKey].push({
      destStart: vals[0],
      sourceStart: vals[1],
      rangeLength: vals[2],
    });
  }

  function applyMap(category, source) {
    let result = null;

    for (const mapElement of maps[category]) {
      const range = parseInt(mapElement.rangeLength, 10);
      const sStart = parseInt(mapElement.sourceStart, 10);
      const dStart = parseInt(mapElement.destStart, 10);

      if (sStart <= source && source < sStart + range) {
        const distance = source - sStart;
        result = dStart + distance;
        break;
      }
    }

    return result === null ? source : result;
  }

  let destinations = seeds.map((seed) => parseInt(seed, 10));
  const locations = [];

  const mapCategories = Object.keys(maps);

  if (TURN === 1) {
    for (const category of mapCategories) {
      destinations = destinations.map((source) => applyMap(category, source));
    }
  } else {
    const seedY = [];
    const ranges = [];
    for (let i = 0; i < destinations.length; i++) {
      if (i % 2 === 0) {
        seedY.push(destinations[i]);
        continue;
      }
      ranges.push(destinations[i]);
    }
    for (let i = 0; i < seedY.length; i++) {
      let min = Infinity;
      for (let j = 0; j < ranges[i]; j++) {
        for (const category of mapCategories) {
          const seedNum = seedY[i] + j;
          const curr = applyMap(category, seedNum);
          if (curr < min) {
            min = curr;
          }
        }
      }
      locations.push(min);
    }
  }

  if (TURN === 1) {
    console.log(Math.min(...destinations));
    return;
  }
  console.log(Math.min(...locations) - 1);
})();
