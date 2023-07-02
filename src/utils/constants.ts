export const UNKNOWN_CHALLENGE_TYPE = 'UNKNOWN_CHALLENGE_TYPE';
export const UNKNOWN_CHALLENGE_HEADER = 'UNKNOWN_CHALLENGE_HEADER';

export const HASH_ALGORITH = 'SHA-256';

export const SETTINGS_STORAGE_KEY = 'settings';

export enum ChallengeType {
  TAP_COMPLETE = 'tapComplete',
  TRANSLATE = 'translate',
  DIALOGUE = 'dialogue',
  COMPLETE_REVERSE_TRANSLATION = 'completeReverseTranslation',
  LISTEN_COMPLETE = 'listenComplete',
  SPEAK = 'speak',
  UNKNOWN = UNKNOWN_CHALLENGE_TYPE,
}

export const supportedChallenges: ChallengeType[] = [
  ChallengeType.TRANSLATE,
  ChallengeType.TAP_COMPLETE,
];
