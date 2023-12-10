const { readFileSync } = require('fs');

const tasknum = parseInt(process.argv.slice(3), 10);
const TASK = !isNaN(tasknum) ? tasknum : 1;

const processLine = (line) => {
  const piramid = [];
  piramid.push(line);

  let bottomReached = false;
  let newHistory = 0;

  for (let j = 0; piramid.length > 0; j++) {
    if (!bottomReached) {
      const diffs = [];
      for (let i = 0; i < piramid[j].length; i++) {
        const currLine = piramid[j];
        if (i === 0) {
          continue;
        }
        const curr = currLine[i];
        const prev = currLine[i - 1];
        const diff = curr - prev;
        diffs.push(diff);
      }
      piramid.push(diffs);
      if (diffs.every((e) => e === diffs[e])) {
        bottomReached = true;
      }
      continue;
    } else {
      const currLine = piramid.pop();
      if (TASK === 1) {
        const num = currLine[currLine.length - 1];
        newHistory += num;
      } else {
        const num = currLine[0];
        newHistory = num - newHistory;
      }
    }
  }

  return newHistory;
};

(async () => {
  const lines = await readFileSync('./input.txt', 'utf-8').split('\n').map((line) => line.split(' ').map((num) => parseInt(num, 10)));
  let result = 0;

  for (const line of lines) {
    result += processLine(line);
  }

  console.log(`TASK-${TASK}: ${result}`);
})();
