import { ChallengeType } from '../constants';
import type { Challenge, TapCompleteChallenge, TranslateChallenge } from '../interfaces';
import { isChallengeSupported } from './functions';

const getTranslateChallengeInputtedAnswer = (challenge: TranslateChallenge): string => {
  return challenge.answerArea.value;
};

const getTapCompleteChallengeInputtedAnswer = (challenge: TapCompleteChallenge): string[] => {
  const promptParentNodes = Array.from(challenge.node.querySelectorAll('[data-test="hint-token"]'))
    .map((el) => el.parentElement?.parentElement)
    .filter((el, i, arr) => arr.indexOf(el) === i && el !== null && el !== undefined) as Element[];

  // find children of type div
  const answerSlots: HTMLDivElement[] = [];
  promptParentNodes.forEach((parentNode) => {
    answerSlots.push(
      ...(Array.from(parentNode.querySelectorAll(':scope > div')) as HTMLDivElement[]),
    );
  });

  const inputOrder: string[] = [];
  for (const answerSlot of answerSlots) {
    const parentSpans: HTMLSpanElement[] = Array.from(
      answerSlot.querySelectorAll('[data-test$="challenge-tap-token"]'),
    ).map((el) => el.parentElement as HTMLSpanElement);
    // get the span with the least number of classes
    const span = parentSpans.reduce((prev, curr) =>
      prev.classList.length < curr.classList.length ? prev : curr,
    );
    inputOrder.push(span.textContent as string);
  }

  return inputOrder;
};

/**
 * Retrieves the user-inputted answer to the challenge.
 *
 * @param challenge Challenge to get inputted answer from
 * @returns The inputted answer to the challenge
 */
export const getChallengeInputtedAnswer = (challenge: Challenge): string | string[] | null => {
  if (!isChallengeSupported(challenge)) {
    console.log('Unsupported challenge type. Will not parse inputted answer.');
    return null;
  }

  if (challenge.type === ChallengeType.TRANSLATE) {
    return getTranslateChallengeInputtedAnswer(challenge as TranslateChallenge);
  } else if (challenge.type === ChallengeType.TAP_COMPLETE) {
    return getTapCompleteChallengeInputtedAnswer(challenge as TapCompleteChallenge);
  }

  return null;
};
