const { readFileSync } = require('fs');

const tasknum = parseInt(process.argv.slice(3), 10);
const TASK = !isNaN(tasknum) ? tasknum : 1;

const getHash = (input) => input.split('').reduce((sum, el) => {
  let res1 = sum + el.charCodeAt(0);
  res1 *= 17;
  return res1 % 256;
}, 0);

(async () => {
  const input = await readFileSync('./input.txt', 'utf-8').split(',');
  const results = input.map((element) => getHash(element));

  let result = 0;
  if (TASK === 1) {
    result = results.reduce((sum, el) => sum + el, 0);
    console.log(`TASK ${TASK}: ${result}`);
    return;
  }

  const boxes = {};
  for (let i = 0; i < 256; i++) {
    boxes[i] = [];
  }
  for (const step of input) {
    const isRemove = !!step.includes('-');
    if (isRemove) {
      const lensLabel = step.split('-')[0];
      const hashVal = getHash(lensLabel);
      boxes[hashVal] = boxes[hashVal].filter((el) => el.label !== lensLabel);
      continue;
    }
    const lensLabel = step.split('=')[0];
    const hashVal = getHash(lensLabel);
    if (boxes[hashVal].some((el) => el.label === lensLabel)) {
      // eslint-disable-next-line prefer-destructuring
      boxes[hashVal].find((el) => el.label === lensLabel).focal = step.split('=')[1];
    } else {
      boxes[hashVal].push({ label: lensLabel, focal: step.split('=')[1] });
    }
  }
  result = 0;
  for (const [key, value] of Object.entries(boxes)) {
    if (value.length === 0) {
      continue;
    }
    let localSum = 0;
    for (let i = 1; i <= value.length; i++) {
      localSum += (i * parseInt(value[i - 1].focal, 10) * (parseInt(key, 10) + 1));
    }
    result += localSum;
  }
  console.log(`TASK ${TASK}: ${result}`);

  // console.log(boxes);
})();
