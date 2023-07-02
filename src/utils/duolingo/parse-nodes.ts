import { ChallengeType, UNKNOWN_CHALLENGE_HEADER } from '../constants';
import type { Challenge, Feedback, TapCompleteChallenge, TranslateChallenge } from '../interfaces';

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

const parseTapCompleteChallenge = (node: Element): TapCompleteChallenge => {
  const wordBank = node.querySelector('[data-test="word-bank"]') as HTMLDivElement;
  const tapTokenTextElements = wordBank.querySelectorAll('[data-test="challenge-tap-token-text"]');
  const tapTokens: Record<string, HTMLButtonElement> = {};
  for (const tapTokenTextElement of tapTokenTextElements) {
    const tapToken = tapTokenTextElement.parentNode as HTMLButtonElement;
    const tapTokenText = tapTokenTextElement.textContent as string;
    tapTokens[tapTokenText] = tapToken;
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

/**
 * Scraps information about the challenge provided the parent node.
 *
 * @param node The parent node of the challenge
 * @returns An object representing the challenge
 */
export const parseChallengeNode = (node: Element): Challenge => {
  const dataTest = node.attributes.getNamedItem('data-test')?.value;
  const type = (dataTest?.match(challengeTypeRegex)?.[1] ?? ChallengeType.UNKNOWN) as ChallengeType;
  if (type === ChallengeType.TRANSLATE) {
    return parseTranslateChallenge(node);
  } else if (type === ChallengeType.TAP_COMPLETE) {
    return parseTapCompleteChallenge(node);
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
