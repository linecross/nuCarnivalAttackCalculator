import {expect} from '@jest/globals';
import type {MatcherFunction} from 'expect';
import {type MatcherHintOptions, printExpected, printReceived, stringify, EXPECTED_COLOR, RECEIVED_COLOR} from 'jest-matcher-utils';

// Copy and modified from toBeCloseTo
// toBeAround: compare integer, diff by percentage first (may change later)
export const toBeAround: MatcherFunction<[expected: unknown, diffPercent: unknown]> = 
    function(received: number, expected: number, diffPercent: number = 0.1) {
        const matcherName = 'toBeAround';
        const secondArgument = arguments.length === 3 ? 'precision' : null;
        const isNot = this.isNot;
        const options: MatcherHintOptions = {
          isNot,
          promise: this.promise,
          secondArgument,
          secondArgumentColor: (arg: string) => arg,
        };

        if (typeof expected !== 'number') {
          throw new Error(
            this.utils.matcherErrorMessage(
              this.utils.matcherHint(matcherName, undefined, undefined, options),
              `${this.utils.EXPECTED_COLOR('expected')} value must be a number`,
              this.utils.printWithType('Expected', expected, printExpected),
            ),
          );
        }

        if (typeof received !== 'number') {
          throw new Error(
            this.utils.matcherErrorMessage(
              this.utils.matcherHint(matcherName, undefined, undefined, options),
              `${this.utils.RECEIVED_COLOR('received')} value must be a number`,
              this.utils.printWithType('Received', received, printReceived),
            ),
          );
        }

        let pass = false;
        let expectedDiff = 0;
        let receivedDiff = 0;

        if (received === Infinity && expected === Infinity) {
          pass = true; // Infinity - Infinity is NaN
        } else if (received === -Infinity && expected === -Infinity) {
          pass = true; // -Infinity - -Infinity is NaN
        } else {
          expectedDiff = expected * (diffPercent / 100);
          receivedDiff = Math.abs(expected - received);
          pass = receivedDiff < expectedDiff;
        }

        const message = pass
        ? () =>
            // eslint-disable-next-line prefer-template
            this.utils.matcherHint(matcherName, undefined, undefined, options) +
            '\n\n' +
            `Expected: not ${this.utils.printExpected(expected)}\n`
        : () =>
            // eslint-disable-next-line prefer-template
            this.utils.matcherHint(matcherName, undefined, undefined, options) +
            '\n\n' +
            `Expected: ${this.utils.printExpected(expected)}\n` +
            `Received: ${this.utils.printReceived(received)}\n` +
            '\n' +
            `Expected precision:  ${isNot ? '    ' : ''}  ${stringify(diffPercent)}%\n` +
            `Expected difference: ${isNot ? 'not ' : ''}< ${EXPECTED_COLOR(expectedDiff)}\n` +
            `Received difference: ${isNot ? '    ' : ''}  ${RECEIVED_COLOR(receivedDiff)}`
            ;

        return {message, pass};
    };


expect.extend({
  toBeAround,
});

declare global {
  namespace jest {
    interface AsymmetricMatchers {
      toBeAround(floor: number, diffPercent?: number): void;
    }
    interface Matchers<R> {
      toBeAround(floor: number, diffPercent?: number): R;
    }
  }
}