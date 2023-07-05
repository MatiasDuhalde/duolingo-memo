import { ChallengeType } from '../constants';
import type {
  AssistChallenge,
  Challenge,
  TapCompleteChallenge,
  TranslateChallenge,
  TranslateTapChallenge,
} from '../interfaces';
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

const autoFillTranslateTapChallenge = (
  challenge: TranslateTapChallenge,
  answer: string[],
): void => {
  for (const word of answer) {
    challenge.tapTokens[word].click();
  }
};

const autoFillTapCompleteChallenge = (challenge: TapCompleteChallenge, answer: string[]): void => {
  for (const word of answer) {
    challenge.tapTokens[word].click();
  }
};

const autoFillAssistChallenge = (challenge: AssistChallenge, answer: string): void => {
  (
    Array.from(
      challenge.node.querySelectorAll('[data-test="challenge-judge-text"]'),
    ) as HTMLDivElement[]
  )
    .find((el) => el.textContent === answer)
    ?.click();
};

/**
 * Auto-fills the answer to the challenge.
 *
 * @param challenge Challenge to auto-fill
 * @param answer String representing the answer to auto-fill
 */
export const autoFillAnswer = (challenge: Challenge, answer: string | string[]): void => {
  if (!isChallengeSupported(challenge)) {
    console.debug('Unsupported challenge type. Will not auto-fill answer.');
    return;
  }

  const { type } = challenge;
  if (type === ChallengeType.TRANSLATE) {
    autoFillTranslateChallenge(challenge as TranslateChallenge, answer as string);
  } else if (type === ChallengeType.TRANSLATE_TAP) {
    autoFillTranslateTapChallenge(challenge as TranslateTapChallenge, answer as string[]);
  } else if (type === ChallengeType.TAP_COMPLETE) {
    autoFillTapCompleteChallenge(challenge as TapCompleteChallenge, answer as string[]);
  } else if (type === ChallengeType.ASSIST) {
    autoFillAssistChallenge(challenge as AssistChallenge, answer as string);
  }
};
