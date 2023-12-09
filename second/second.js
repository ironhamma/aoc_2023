const { readFileSync } = require('fs');

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

const task = 2;

const checkGameIsValid = (game) => {
  const cubes = { red: 0, blue: 0, green: 0 };
  for (const round of game) {
    if (cubes.red < round.red) {
      cubes.red = round.red;
    }
    if (cubes.blue < round.blue) {
      cubes.blue = round.blue;
    }
    if (cubes.green < round.green) {
      cubes.green = round.green;
    }
  }

  return {
    validity:
      cubes.red <= MAX_RED
      && cubes.blue <= MAX_BLUE
      && cubes.green <= MAX_GREEN,
    cubes,
  };
};

(async () => {
  const input = await readFileSync('./input.txt', 'utf-8');

  const gamesData = input
    .trim()
    .split('\n')
    .map((row) => row.split(':')[1]);

  const games = {};

  gamesData.forEach((game, index) => {
    const rounds = game.split(';').map((round) => round.trim());

    const gameObj = [];

    rounds.forEach((round) => {
      const colors = { blue: 0, red: 0, green: 0 };
      const colorData = round
        .split(',')
        .map((color) => color.trim().split(' '));

      colorData.forEach(([count, color]) => {
        colors[color] = parseInt(count, 10);
      });

      gameObj.push(colors);
    });

    games[index] = gameObj;
  });

  let result = 0;
  let result2 = 0;

  for (const game of Object.entries(games)) {
    const gameId = game[0];
    const gameInfo = game[1];
    const validation = checkGameIsValid(gameInfo);
    if (validation.validity) {
      result += parseInt(gameId, 10) + 1;
    }
    if (task === 2) {
      const product = validation.cubes.red * validation.cubes.green * validation.cubes.blue;
      result2 += product;
    }
  }
  console.log(task === 1 ? result : result2);
})();
