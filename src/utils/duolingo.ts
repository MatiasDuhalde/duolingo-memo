import { Challenge, Feedback } from '@app/utils/interfaces';

const challengeTypeRegex = /^challenge challenge-(\w+)$/;
const feedbackCorrectnessRegex = /^blame blame-(\w+)$/;

export const parseChallengeNode = (node: Element): Challenge => {
  const dataTest = node.attributes.getNamedItem('data-test')?.value;
  return {
    node,
    type: dataTest?.match(challengeTypeRegex)?.[1] ?? 'unknown',
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
