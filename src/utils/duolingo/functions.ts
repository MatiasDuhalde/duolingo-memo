import { supportedChallenges } from '../constants';
import type { Challenge } from '../interfaces';

/**
 * Returns false if the challenge is not supported by the extension.
 *
 * @param challenge The challenge to check
 * @returns Whether the challenge is supported by the extension
 */
export const isChallengeSupported = (challenge: Challenge): boolean => {
  return supportedChallenges.includes(challenge.type);
};
