import { ChallengeType, UNKNOWN_CHALLENGE_HEADER } from '../constants';
import type {
  AssistChallenge,
  Challenge,
  Feedback,
  TapCompleteChallenge,
  TranslateChallenge,
  TranslateTapChallenge,
} from '../interfaces';

const challengeTypeRegex = /^challenge challenge-(\w+)$/;
const feedbackCorrectnessRegex = /^blame blame-(\w+)$/;

const parseTranslateChallenge = (node: Element): TranslateChallenge => {
  const answerArea = node.querySelector(
    '[data-test="challenge-translate-input"]',
  ) as HTMLTextAreaElement;
  return {
    node,
    type: ChallengeType.TRANSLATE,
    header: getChallengeHeader(node),
    prompt: getChallengePrompt(node),
    answerArea,
  };
};

const parseTranslateTapChallenge = (node: Element): TranslateTapChallenge => {
  const wordBank = node.querySelector('[data-test="word-bank"]') as HTMLDivElement;
  const tapTokenElements = wordBank.querySelectorAll(
    '[data-test="challenge-tap-token-text"]',
  ) as NodeListOf<HTMLSpanElement>;
  const tapTokens: Record<string, HTMLSpanElement> = {};
  for (const tapTokenElement of tapTokenElements) {
    const tapTokenText = tapTokenElement.textContent as string;
    tapTokens[tapTokenText] = tapTokenElement;
  }

  return {
    node,
    type: ChallengeType.TRANSLATE_TAP,
    header: getChallengeHeader(node),
    prompt: getChallengePrompt(node),
    wordBank,
    tapTokens,
  };
};

const parseTapCompleteChallenge = (node: Element): TapCompleteChallenge => {
  const wordBank = node.querySelector('[data-test="word-bank"]') as HTMLDivElement;
  const tapTokenElements = wordBank.querySelectorAll(
    '[data-test="challenge-tap-token-text"]',
  ) as NodeListOf<HTMLSpanElement>;
  const tapTokens: Record<string, HTMLSpanElement> = {};
  for (const tapTokenElement of tapTokenElements) {
    const tapTokenText = tapTokenElement.textContent as string;
    tapTokens[tapTokenText] = tapTokenElement;
  }

  return {
    node,
    type: ChallengeType.TAP_COMPLETE,
    header: getChallengeHeader(node),
    prompt: getChallengePrompt(node),
    wordBank,
    tapTokens,
  };
};

const parseAssistChallenge = (node: Element): AssistChallenge => {
  const header = getChallengeHeader(node);

  const options = Array.from(
    node.querySelectorAll('[data-test="challenge-choice"]'),
  ) as HTMLDivElement[];

  return {
    node,
    type: ChallengeType.ASSIST,
    header,
    prompt: [header],
    options,
  };
};

/**
 * Scraps information about the challenge provided the parent node.
 *
 * @param node The parent node of the challenge
 * @returns An object representing the challenge
 */
export const parseChallengeNode = (node: Element): Challenge => {
  const dataTest = node.attributes.getNamedItem('data-test')?.value;
  let type = (dataTest?.match(challengeTypeRegex)?.[1] ?? ChallengeType.UNKNOWN) as ChallengeType;

  // special case for translate type
  if (type === ChallengeType.TRANSLATE) {
    const translateInput = node.querySelector('[data-test="challenge-translate-input"]');
    if (!translateInput) {
      type = ChallengeType.TRANSLATE_TAP;
    }
  }

  if (type === ChallengeType.TRANSLATE) {
    return parseTranslateChallenge(node);
  } else if (type === ChallengeType.TRANSLATE_TAP) {
    return parseTranslateTapChallenge(node);
  } else if (type === ChallengeType.TAP_COMPLETE) {
    return parseTapCompleteChallenge(node);
  } else if (type === ChallengeType.ASSIST) {
    return parseAssistChallenge(node);
  }
  return {
    node,
    type,
    header: getChallengeHeader(node),
    prompt: getChallengePrompt(node),
  };
};

/**
 * Scraps information about the feedback (answer result) provided the parent node.
 *
 * @param node The parent node of the feedback
 * @returns An object representing the feedback
 */
export const parseFeedbackNode = (node: Element): Feedback => {
  const dataTest = node.attributes.getNamedItem('data-test')?.value;
  const blame = dataTest?.match(feedbackCorrectnessRegex)?.[1];
  return {
    node,
    correct: blame === 'correct',
  };
};

/**
 * Scraps the challenge header provided the parent node.
 *
 * @param node The parent node of the challenge
 * @returns The challenge header
 */
const getChallengeHeader = (node: Element): string => {
  return (
    node.querySelector('[data-test="challenge-header"]')?.textContent ?? UNKNOWN_CHALLENGE_HEADER
  );
};

/**
 * Scraps the challenge prompt provided the parent node.
 *
 * @param node The parent node of the challenge
 * @returns The challenge prompt
 */
const getChallengePrompt = (node: Element): string[] => {
  const uniqueParents = Array.from(node.querySelectorAll('[data-test="hint-token"]'))
    .map((el) => el.parentElement?.parentElement)
    .filter((el, i, arr) => arr.indexOf(el) === i && el !== null && el !== undefined) as Element[];

  return uniqueParents.map((parent) =>
    Array.from(parent.children).reduce(
      (el, child) => (child.tagName === 'SPAN' ? el + child.textContent : el + '<TAP_TOKEN>'),
      '',
    ),
  );
};
