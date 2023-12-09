const { readFileSync } = require('fs');

const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const firstOrSecond = 1; // first: 0, second: 1

const getNum = (num, rev = false) => {
  if (!rev) {
    switch (num) {
      case 1:
        return 'one';
      case 2:
        return 'two';
      case 3:
        return 'three';
      case 4:
        return 'four';
      case 5:
        return 'five';
      case 6:
        return 'six';
      case 7:
        return 'seven';
      case 8:
        return 'eight';
      case 9:
        return 'nine';
      default:
        return null;
    }
  } else {
    switch (num) {
      case 1:
        return 'eno';
      case 2:
        return 'owt';
      case 3:
        return 'eerht';
      case 4:
        return 'ruof';
      case 5:
        return 'evif';
      case 6:
        return 'xis';
      case 7:
        return 'neves';
      case 8:
        return 'thgie';
      case 9:
        return 'enin';
      default:
        return null;
    }
  }
};

const replacer = (line, rev = false) => {
  let res = '';
  let numLength = 0;
  for (const char of line) {
    res += char;
    let found = false;
    if (nums.some((num) => res.includes(getNum(num, rev)))) {
      found = true;
      for (const num of nums) {
        if (res.includes(getNum(num, rev))) {
          numLength = getNum(num, rev).length;
        }
      }
    }
    for (const num of nums) {
      res = res.replace(getNum(num, rev), `${num}`);
    }
    if (found) {
      break;
    }
  }
  return {
    text: `${res}${line.slice(
      res.length > numLength ? res.length + numLength : numLength,
    )}`,
  };
};

(async () => {
  const rawlines = await readFileSync('./input.txt', 'utf-8');

  const lines = rawlines.split('\n'); // Split the content into lines

  let output = 0;
  for (const line of lines) {
    let first = null;
    let last = null;
    let partialText = '';
    if (firstOrSecond === 1) {
      partialText = replacer(line, false).text;
      const revText = line.split('').reverse().join('');
      const { text: ntext } = replacer(revText, true);
      partialText = `${partialText}${ntext.split('').reverse().join('')}`;
    } else {
      partialText = line;
    }
    for (const char of partialText) {
      if (!isNaN(parseInt(char, 10))) {
        if (first === null) {
          first = char;
        }
        last = char;
      }
    }
    output += parseInt(`${first}${last}`, 10);
  }
  console.log(output);
})();
