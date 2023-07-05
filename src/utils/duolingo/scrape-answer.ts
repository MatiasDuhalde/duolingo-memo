import { ChallengeType } from '../constants';
import type {
  AssistChallenge,
  Challenge,
  TapCompleteChallenge,
  TranslateChallenge,
  TranslateTapChallenge,
} from '../interfaces';
import { isChallengeSupported } from './functions';

const getTranslateChallengeInputtedAnswer = (challenge: TranslateChallenge): string => {
  return challenge.answerArea.value;
};

const getTranslateTapChallengeInputtedAnswer = (challenge: TranslateTapChallenge): string[] => {
  const allTokenNodes = Array.from(
    challenge.node.querySelectorAll('[data-test="challenge-tap-token-text"]'),
  ) as HTMLSpanElement[];
  const tapTokensArray = Object.values(challenge.tapTokens);

  return allTokenNodes
    .filter((el) => !tapTokensArray.includes(el))
    .map((el) => el.textContent as string);
};

const getAssistChallengeInputtedAnswer = (challenge: AssistChallenge): string => {
  const selectedOption = challenge.options.find((option) => option.ariaChecked === 'true');
  return selectedOption?.querySelector('[data-test="challenge-judge-text"]')?.textContent as string;
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
    const parentSpans: HTMLSpanElement[] = Array.from(answerSlot.querySelectorAll('button')).map(
      (el) => el.parentElement as HTMLSpanElement,
    );
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
    console.debug('Unsupported challenge type. Will not parse inputted answer.');
    return null;
  }

  const { type } = challenge;
  if (type === ChallengeType.TRANSLATE) {
    return getTranslateChallengeInputtedAnswer(challenge as TranslateChallenge);
  } else if (type === ChallengeType.TRANSLATE_TAP) {
    return getTranslateTapChallengeInputtedAnswer(challenge as TranslateTapChallenge);
  } else if (type === ChallengeType.TAP_COMPLETE) {
    return getTapCompleteChallengeInputtedAnswer(challenge as TapCompleteChallenge);
  } else if (type === ChallengeType.ASSIST) {
    return getAssistChallengeInputtedAnswer(challenge as AssistChallenge);
  }

  return null;
};
