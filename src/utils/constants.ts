export const UNKNOWN_CHALLENGE_TYPE = 'UNKNOWN_CHALLENGE_TYPE';
export const UNKNOWN_CHALLENGE_HEADER = 'UNKNOWN_CHALLENGE_HEADER';

export const HASH_ALGORITH = 'SHA-256';

export enum ChallengeType {
  TAP_COMPLETE = 'tapComplete',
  TRANSLATE = 'translate',
  DIALOGUE = 'dialogue',
  COMPLETE_REVERSE_TRANSLATION = 'completeReverseTranslation',
  LISTEN_COMPLETE = 'listenComplete',
  SPEAK = 'speak',
  UNKNOWN = UNKNOWN_CHALLENGE_TYPE,
}

export const validChallengeTypes = Object.values(ChallengeType).filter(
  (type) => type !== ChallengeType.UNKNOWN && type !== ChallengeType.SPEAK,
);
