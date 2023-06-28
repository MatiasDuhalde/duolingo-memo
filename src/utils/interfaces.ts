import { ChallengeType } from '@app/utils/constants';

export interface LessonState {
  // Whether the user is on a lesson page
  onLesson: boolean;
  // Information about the current challenge
  currentChallenge: Challenge | null;
  // Information about the current feedback
  currentFeedback: Feedback | null;
}

export interface Challenge {
  // The node linked to this challenge
  node: Element;
  // The challenge type
  type: ChallengeType;
  // The challenge header
  header: string;
  // The challenge prompt
  prompt: string[];
}

export interface Feedback {
  // The node linked to this feedback
  node: Element;
  // Whether the feedback is correct or incorrect
  correct: boolean;
}
