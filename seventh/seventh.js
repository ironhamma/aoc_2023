const { readFileSync } = require('fs');

const TURN = 2; // Change this value to 1 or 2 as needed

const mapCard = (card) => {
  switch (card) {
    case 'T':
      return 10;
    case 'J':
      return 11;
    case 'Q':
      return 12;
    case 'K':
      return 13;
    case 'A':
      return 14;
    default:
      return parseInt(card, 10);
  }
};

const RANKS = {
  FIVE: 7,
  FOUR: 6,
  FULL: 5,
  THREE: 4,
  TWOP: 3,
  PAIR: 2,
  HIGH: 1,
};

const getRating = (cards) => {
  const strength = new Set();
  let paired = null;
  for (const card of cards) {
    const matches = cards.filter((e) => e === card).length;
    if (matches === 5) {
      strength.add(RANKS.FIVE);
      break;
    }
    if (matches === 4) {
      strength.add(RANKS.FOUR);
      break;
    }
    if (matches === 3) {
      strength.add(RANKS.THREE);
    }
    if (matches === 2) {
      if (strength.has(RANKS.PAIR) && paired !== card) {
        strength.add(RANKS.TWOP);
        break;
      } else {
        paired = card;
        strength.add(RANKS.PAIR);
      }
    }
    strength.add(RANKS.HIGH);
  }

  if (strength.has(RANKS.THREE) && strength.has(RANKS.PAIR)) {
    strength.add(RANKS.FULL);
  }
  const res = Math.max(...strength.values());
  return res;
};

const compareSame = (cards) => {
  const first = cards[0];
  const second = cards[1];
  let result = null;

  for (let i = 0; i < first.length; i++) {
    let card1 = first[i];
    let card2 = second[i];

    if (card1 === 11 && TURN === 2) {
      card1 = 1;
    }
    if (card2 === 11 && TURN === 2) {
      card2 = 1;
    }

    if (card1 > card2) {
      result = -1;
      break;
    }
    if (card1 < card2) {
      result = 1;
      break;
    }
  }

  return result;
};

(async () => {
  const input = await readFileSync('./input.txt', 'utf-8').split('\n');

  let hands = input.map((e) => {
    const hand = e.split(' ');
    return {
      cards: hand[0].split('').map((card) => mapCard(card)),
      bid: parseInt(hand[1], 10),
      rank: 0,
      type: null,
    };
  });

  for (const hand of hands) {
    if (TURN === 1) {
      hand.type = getRating(hand.cards);
    } else {
      if (!hand.cards.includes(11)) {
        hand.type = getRating(hand.cards);
        continue;
      }
      let Jcount = 0;
      Jcount = hand.cards.filter((e) => e === 11).length;
      const withoutCard = hand.cards.filter((e) => e !== 11);
      let maxRank = 0;
      for (let i = 0; i < withoutCard.length; i++) {
        let replacers = withoutCard.slice(i, i + Jcount);
        if (replacers.length === 1) {
          const myreplacers = [];
          for (let j = 0; j < Jcount; j++) {
            myreplacers.push(Math.max(...replacers));
          }
          replacers = myreplacers;
        }
        const currentRank = getRating([...withoutCard, ...replacers]);
        if (currentRank > maxRank) {
          maxRank = currentRank;
        }
      }
      if (Jcount === 4 || Jcount === 5) {
        maxRank = RANKS.FIVE;
      }
      hand.type = maxRank;
    }
  }
  hands = hands
    .toSorted((first, second) => {
      if (first.type > second.type) {
        return -1;
      }
      if (first.type < second.type) {
        return 1;
      }
      if (first.type === second.type) {
        return compareSame([first.cards, second.cards]);
      }
      return 0;
    })
    .toReversed();

  let result = 0;

  for (let i = 0; i < hands.length; i++) {
    result += hands[i].bid * (i + 1);
  }

  console.log(result);
})();
