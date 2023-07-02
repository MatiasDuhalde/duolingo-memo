import { ChallengeType } from '../constants';
import type { Challenge, TapCompleteChallenge, TranslateChallenge } from '../interfaces';
import { isChallengeSupported } from './functions';

const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(
  HTMLTextAreaElement.prototype,
  'value',
)!.set!;

const inputEvent = new Event('input', { bubbles: true });

const autoFillTranslateChallenge = (challenge: TranslateChallenge, answer: string): void => {
  nativeTextAreaValueSetter.call(challenge.answerArea, answer);
  challenge.answerArea.dispatchEvent(inputEvent);
};

const autoFillTapCompleteChallenge = (challenge: TapCompleteChallenge, answer: string[]): void => {
  for (const word of answer) {
    challenge.tapTokens[word].click();
  }
};

/**
 * Auto-fills the answer to the challenge.
 *
 * @param challenge Challenge to auto-fill
 * @param answer String representing the answer to auto-fill
 */
export const autoFillAnswer = (challenge: Challenge, answer: string | string[]): void => {
  if (!isChallengeSupported(challenge)) {
    console.log('Unsupported challenge type. Will not auto-fill answer.');
    return;
  }

  if (challenge.type === ChallengeType.TRANSLATE) {
    autoFillTranslateChallenge(challenge as TranslateChallenge, answer as string);
  } else if (challenge.type === ChallengeType.TAP_COMPLETE) {
    autoFillTapCompleteChallenge(challenge as TapCompleteChallenge, answer as string[]);
  }
};
