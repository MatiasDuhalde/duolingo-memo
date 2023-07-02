import { ChallengeType } from '../constants';
import type { Challenge, TranslateChallenge } from '../interfaces';
import { isChallengeSupported } from './functions';

const autoFillTranslateChallenge = (challenge: TranslateChallenge, answer: string): void => {
  challenge.answerArea.value = answer;
};

/**
 * Auto-fills the answer to the challenge.
 *
 * @param challenge Challenge to auto-fill
 * @param answer String representing the answer to auto-fill
 */
export const autoFillAnswer = (challenge: Challenge, answer: string): void => {
  if (!isChallengeSupported(challenge)) {
    console.log('Unsupported challenge type. Will not auto-fill answer.');
    return;
  }

  if (challenge.type === ChallengeType.TRANSLATE) {
    autoFillTranslateChallenge(challenge as TranslateChallenge, answer);
  }
};
