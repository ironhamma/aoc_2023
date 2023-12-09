const { readFileSync } = require('fs');

const task = 2;

const checkCard = (card) => {
  let product = 0;
  let matches = 0;
  for (const num of card.elf) {
    if (card.winning.includes(num)) {
      product = product === 0 ? 1 : product * 2;
      matches += 1;
    }
  }
  return { product, matches };
};

(async () => {
  const input = await readFileSync('./input.txt', 'utf-8');
  const cards = input.split('\n').map((row, index) => {
    const card = row.split(':')[1].split('|');
    return {
      id: index,
      winning: card[0].split(' ').filter((e) => e),
      elf: card[1].split(' ').filter((e) => e),
    };
  });

  let result = 0;
  const matchers = [];
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const val = checkCard(card);
    result += val.product;
    matchers.push({ id: card.id, match: val.matches });
  }
  const matcherCopy = {};
  for (let i = 0; i < matchers.length; i++) {
    matcherCopy[i] = 1;
  }
  for (let i = 0; i < matchers.length; i++) {
    const matcher = matchers[i];
    for (let j = 1; j <= matcher.match; j++) {
      for (let k = 0; k < matcherCopy[matcher.id]; k++) {
        matcherCopy[matcher.id + j] += 1;
      }
    }
  }

  if (task === 2) {
    result = 0;
    for (let i = 0; i < Object.values(matcherCopy).length; i++) {
      result += matcherCopy[i];
    }
  }
  console.log(result);
})();
