import {
  ChallengeType,
  HASH_ALGORITH,
  UNKNOWN_CHALLENGE_HEADER,
  validChallengeTypes,
} from './constants';
import type { Challenge, Feedback } from './interfaces';

const challengeTypeRegex = /^challenge challenge-(\w+)$/;
const feedbackCorrectnessRegex = /^blame blame-(\w+)$/;

/**
 * Scraps information about the challenge provided the parent node.
 *
 * @param node The parent node of the challenge
 * @returns An object representing the challenge
 */
export const parseChallengeNode = (node: Element): Challenge => {
  const dataTest = node.attributes.getNamedItem('data-test')?.value;
  const prompt = getChallengePrompt(node);
  console.log(prompt);
  return {
    node,
    type: (dataTest?.match(challengeTypeRegex)?.[1] ?? ChallengeType.UNKNOWN) as ChallengeType,
    header: getChallengeHeader(node),
    prompt,
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
export const getChallengeHeader = (node: Element): string => {
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
export const getChallengePrompt = (node: Element): string[] => {
  const uniqueParents = Array.from(node.querySelectorAll('[data-test="hint-token"]'))
    .map((el) => el.parentElement?.parentElement)
    .filter((el, i, arr) => arr.indexOf(el) === i && el !== null && el !== undefined) as Element[];

  return uniqueParents.map((parent) =>
    Array.from(parent.children).reduce(
      (el, child) => (child.tagName === 'SPAN' ? el + child.textContent : el + 'X'),
      '',
    ),
  );
};

/**
 * Searches an answer to a challenge in the extension storage.
 *
 * @param challenge Searches for an existing answer for the provided challenge
 * @returns The answer if found, null otherwise
 */
export const searchExistingAnswer = async (challenge: Challenge): Promise<string | null> => {
  const { type } = challenge;
  if (!validChallengeTypes.includes(type)) return null;

  const key = await getAnswerKey(challenge);
  // const result = await browser.storage.local.get(key);
  const result: Record<string, string> = {};

  return result[key] ?? null;
};

/**
 * Forms the key corresponding to the answer of the provided challenge
 *
 * @param challenge The challenge object
 * @returns The key used to store the answer
 */
export const getAnswerKey = async (challenge: Challenge): Promise<string> => {
  const { type, prompt } = challenge;
  return Array.prototype.map
    .call(
      new Uint8Array(
        await window.crypto.subtle.digest(
          HASH_ALGORITH,
          new TextEncoder().encode(`${type}///${prompt.toString()}`),
        ),
      ),
      (x) => ('00' + x.toString(16)).slice(-2),
    )
    .join('');
};
