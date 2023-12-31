const { readFileSync } = require('fs');

const tasknum = parseInt(process.argv.slice(3), 10);
const TASK = !isNaN(tasknum) ? tasknum : 1;

const OPTIONS = {
  CONTINUE: 'CONTINUE',
  REJECT: 'REJECT',
  ACCEPT: 'ACCEPT',
};

class RulePipe {
  constructor(name, rules) {
    this.name = name;
    this.rules = [];

    rules.forEach((rule) => {
      const r = rule.split(':')[0];
      if (rule.split(':').length === 1) {
        const simpleRuleFn = () => {
          const destination = r;
          if (destination === 'R') {
            return OPTIONS.REJECT;
          }
          if (destination === 'A') {
            return OPTIONS.ACCEPT;
          }
          return destination;
        };
        this.rules.push(simpleRuleFn);
        return;
      }
      const toCheck = r[0];
      const relation = r[1];
      const amount = parseInt(r.slice(2, r.length), 10);
      let dest = rule.split(':')[1];

      if (dest === 'R') {
        dest = OPTIONS.REJECT;
      } else if (dest === 'A') {
        dest = OPTIONS.ACCEPT;
      }

      const ruleFn = (part) => {
        const check = part[toCheck];
        if (relation === '<' && check < amount) {
          return dest;
        } if (relation === '>' && check > amount) {
          return dest;
        }
        return OPTIONS.CONTINUE;
      };
      this.rules.push(ruleFn);
    });
  }

  runRules = (part) => {
    let result = OPTIONS.CONTINUE;
    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];
      const ruleResult = rule(part);
      if (ruleResult !== OPTIONS.CONTINUE) {
        result = ruleResult;
        break;
      }
    }
    return result;
  };
}

class Part {
  constructor(params) {
    this.x = params.x;
    this.m = params.m;
    this.a = params.a;
    this.s = params.s;
  }

  getSum = () => this.x + this.m + this.a + this.s;
}

(async () => {
  const input = await readFileSync('./input.txt', 'utf-8').split('\n\n');
  const rules = input[0].split('\n').map((rule) => {
    const name = rule.split('{')[0];
    const r = rule.split('{')[1].slice(0, -1).split(',');
    return new RulePipe(name, r);
  });
  const rulesObj = {};
  rules.forEach((rule) => {
    rulesObj[rule.name] = rule;
  });
  const parts = input[1].split('\n').map((part) => {
    const params = part.slice(1, part.length - 1).split(',').map((param) => parseInt(param.slice(2, param.length), 10));
    return new Part({
      x: params[0],
      m: params[1],
      a: params[2],
      s: params[3],
    });
  });

  let result = 0;

  for (const part of parts) {
    let currentDecision = rulesObj.in.runRules(part);
    while (![OPTIONS.REJECT, OPTIONS.ACCEPT].includes(currentDecision)) {
      currentDecision = rulesObj[currentDecision].runRules(part);
    }
    if (currentDecision === OPTIONS.ACCEPT) {
      result += part.getSum();
    }
  }

  console.log(`TASK ${TASK}: ${result}`);
})();
