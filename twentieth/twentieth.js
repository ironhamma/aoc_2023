const { readFileSync } = require('fs');

const tasknum = parseInt(process.argv.slice(3), 10);
const TASK = !isNaN(tasknum) ? tasknum : 1;

(async () => {
  const input = await readFileSync('./input.txt', 'utf-8');

  let result = 0;
  console.log(`TASK ${TASK}: ${result}`);
})();
