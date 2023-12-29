const { readFileSync, writeFileSync } = require('fs');

(async () => {
  const input = await readFileSync('./output.txt', 'utf-8').split('\n').map((line) => line.split(''));
  let count = 0;
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === '#') {
        count++;
      }
    }
  }
  console.log(count);
})();
