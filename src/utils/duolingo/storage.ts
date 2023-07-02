import browser from 'webextension-polyfill';
import { HASH_ALGORITH } from '../constants';
import type { Challenge } from '../interfaces';
import { isChallengeSupported } from './functions';

/**
 * Searches an answer to a challenge in the extension storage.
 *
 * @param challenge Searches for an existing answer for the provided challenge
 * @returns The answer if found, null otherwise
 */
export const searchExistingAnswer = async (challenge: Challenge): Promise<string | null> => {
  if (!isChallengeSupported(challenge)) {
    console.log('Unsupported challenge type. Cannot search for existing answer.');
    return null;
  }

  const key = await getAnswerKey(challenge);
  const result = await browser.storage.local.get(key);

  return result[key] ?? null;
};

/**
 * Saves an answer to a challenge in the extension storage.
 *
 * @param challenge Searches for an existing answer for the provided challenge
 * @param answer The answer to save
 */
export const saveAnswer = async (challenge: Challenge, answer: string): Promise<void> => {
  if (!isChallengeSupported(challenge)) {
    console.log('Unsupported challenge type. Will not save answer.');
    return;
  }

  const key = await getAnswerKey(challenge);
  await browser.storage.local.set({ [key]: answer });
};

/**
 * Forms the key corresponding to the answer of the provided challenge
 *
 * @param challenge The challenge object
 * @returns The key used to store the answer
 */
const getAnswerKey = async (challenge: Challenge): Promise<string> => {
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
