const { readFileSync } = require('fs');

const task = 2;

const findGears = (partsParam) => {
  const gears = [];
  const parts = [...partsParam];
  for (let i = 0; i < partsParam.length; i++) {
    const part = parts.pop();
    if (part.char.char === '*') {
      const otherPart = parts.filter(
        (e) => part.char.position === e.char.position,
      )[0];
      if (otherPart) {
        gears.push(parseInt(part.number, 10) * parseInt(otherPart.number, 10));
      }
    }
  }

  let result = 0;
  for (const gear of gears) {
    result += gear;
  }

  return result;
};

(async () => {
  const input = await readFileSync('./input.txt', 'utf-8');
  const lines = input.split('\n');
  const numbers = {};
  const characters = {};
  for (let i = 0; i < lines.length; i++) {
    const numberOnlyLine = lines[i]
      .split('')
      .map((e) => (isNaN(parseInt(e, 10)) ? '.' : e))
      .join('');
    const numbersOfLine = numberOnlyLine
      .split('.')
      .filter((e) => e)
      .map((e) => e
        .split('')
        .filter((el) => !isNaN(parseInt(el, 10)))
        .join(''))
      .map((e) => parseInt(e, 10).toString())
      .toReversed();
    let skipturn = 0;
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (isNaN(parseInt(char, 10)) && char !== '.') {
        characters[`${i}-${j}`] = char;
      }
      if (!isNaN(parseInt(char, 10)) && skipturn === 0) {
        const num = numbersOfLine.pop();
        numbers[`${i}-${j}`] = num;
        skipturn = num.length - 1;
      } else if (skipturn !== 0) {
        skipturn -= 1;
      }
    }
  }

  const checkNumber = (number, position) => {
    let isPart = false;
    const [x, y] = position.split('-').map((e) => parseInt(e, 10));
    let charFound = null;
    for (let i = 0; i < number.toString().length; i++) {
      if (characters[`${x}-${y + i + 1}`]) {
        // up
        isPart = true;
        charFound = {
          position: `${x}-${y + i + 1}`,
          char: characters[`${x}-${y + i + 1}`],
        };
      }
      if (characters[`${x}-${y + i - 1}`]) {
        // down
        isPart = true;
        charFound = {
          position: `${x}-${y + i - 1}`,
          char: characters[`${x}-${y + i - 1}`],
        };
      }
      if (characters[`${x + 1}-${y + i}`]) {
        // right
        isPart = true;
        charFound = {
          position: `${x + 1}-${y + i}`,
          char: characters[`${x + 1}-${y + i}`],
        };
      }
      if (characters[`${x - 1}-${y + i}`]) {
        // left
        isPart = true;
        charFound = {
          position: `${x - 1}-${y + i}`,
          char: characters[`${x - 1}-${y + i}`],
        };
      }
      if (characters[`${x + 1}-${y + i + 1}`]) {
        // diagonal right up
        isPart = true;
        charFound = {
          position: `${x + 1}-${y + i + 1}`,
          char: characters[`${x + 1}-${y + i + 1}`],
        };
      }
      if (characters[`${x + 1}-${y + i - 1}`]) {
        // diagonal right down
        isPart = true;
        charFound = {
          position: `${x + 1}-${y + i - 1}`,
          char: characters[`${x + 1}-${y + i - 1}`],
        };
      }
      if (characters[`${x - 1}-${y + i + 1}`]) {
        // diagonal left up
        isPart = true;
        charFound = {
          position: `${x - 1}-${y + i + 1}`,
          char: characters[`${x - 1}-${y + i + 1}`],
        };
      }
      if (characters[`${x - 1}-${y + i - 1}`]) {
        // diagonal left down
        isPart = true;
        charFound = {
          position: `${x - 1}-${y + i - 1}`,
          char: characters[`${x - 1}-${y + i - 1}`],
        };
      }
    }
    return { isPart, char: charFound };
  };

  let sum = 0;
  const gearParts = [];
  for (const numberEntry of Object.entries(numbers)) {
    const { isPart, char } = checkNumber(numberEntry[1], numberEntry[0]);
    if (isPart) {
      sum += parseInt(numberEntry[1], 10);
    }
    if (task === 2 && isPart) {
      gearParts.push({ number: numberEntry[1], numPos: numberEntry[0], char });
    }
  }
  if (task === 2) {
    sum = findGears(gearParts);
  }
  console.log(sum);
})();
