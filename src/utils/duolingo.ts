import {
  ChallengeType,
  HASH_ALGORITH,
  UNKNOWN_CHALLENGE_HEADER,
  validChallengeTypes,
} from '@app/utils/constants';
import { Challenge, Feedback } from '@app/utils/interfaces';
import 'webextension-polyfill';
import browser from 'webextension-polyfill';

const challengeTypeRegex = /^challenge challenge-(\w+)$/;
const feedbackCorrectnessRegex = /^blame blame-(\w+)$/;

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

export const parseFeedbackNode = (node: Element): Feedback => {
  const dataTest = node.attributes.getNamedItem('data-test')?.value;
  const blame = dataTest?.match(feedbackCorrectnessRegex)?.[1];
  return {
    node,
    correct: blame === 'correct',
  };
};

export const getChallengeHeader = (node: Element): string => {
  return (
    node.querySelector('[data-test="challenge-header"]')?.textContent ?? UNKNOWN_CHALLENGE_HEADER
  );
};

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

export const searchExistingAnswer = async (challenge: Challenge): Promise<string | null> => {
  const { type } = challenge;
  if (!validChallengeTypes.includes(type)) return null;

  const key = await getAnswerKey(challenge);
  const result = await browser.storage.local.get(key);

  return result[key] ?? null;
};

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
