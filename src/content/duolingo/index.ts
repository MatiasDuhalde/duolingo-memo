import {
  getChallengeInputtedAnswer,
  parseChallengeNode,
  parseFeedbackNode,
  saveAnswer,
  searchExistingAnswer,
} from '../../utils/duolingo';
import { autoFillAnswer } from '../../utils/duolingo/auto-fill';
import type { LessonState } from '../../utils/interfaces';

const root = document.getElementById('root');
if (!root) throw new Error('root not found');

const lessonState: LessonState = {
  onLesson: false,
  currentChallenge: null,
  currentFeedback: null,
};

const clearLessonState = () => {
  lessonState.currentChallenge = null;
  lessonState.currentFeedback = null;
};

const lessonUrlStringMatch = 'duolingo.com/lesson/';

const lessonObserverCallback = async () => {
  if (lessonState.currentChallenge !== null && !lessonState.currentChallenge.node.isConnected) {
    console.log('Challenge node disconnected!');
    lessonState.currentChallenge = null;
  }
  if (lessonState.currentFeedback !== null && !lessonState.currentFeedback.node.isConnected) {
    console.log('Feedback node disconnected!');
    lessonState.currentFeedback = null;
  }

  if (lessonState.currentChallenge === null) {
    // Find the challenge node
    console.log('Searching possible challenge node...');
    const node = document.querySelector('[data-test^="challenge challenge"]');
    if (node) {
      const parsedChallenge = parseChallengeNode(node);
      console.log(`Challenge node of type ${parsedChallenge.type} found!`);
      lessonState.currentChallenge = parsedChallenge;

      console.log(
        `Searching for existing answer for challenge: ${parsedChallenge.prompt.toString()}`,
      );
      const answer = await searchExistingAnswer(parsedChallenge);
      if (answer) {
        console.log(`Found the answer: ${answer}`);
        autoFillAnswer(parsedChallenge, answer);
      } else {
        console.log('No answer found!');
      }
    }
  } else if (lessonState.currentFeedback === null) {
    // Find the feedback node in the mutation
    console.log('Searching possible feedback node...');
    const node = document.querySelector('[data-test^="blame blame"]');
    if (node) {
      const parsedFeedback = parseFeedbackNode(node);
      if (parsedFeedback.correct) {
        console.log('Correct answer node found!');
        const inputtedAnswer = getChallengeInputtedAnswer(lessonState.currentChallenge);
        if (inputtedAnswer) {
          console.log(`Inputted answer: ${inputtedAnswer}`);
          console.log('Saving answer...');
          await saveAnswer(lessonState.currentChallenge, inputtedAnswer);
          console.log('Answer saved!');
        }
      } else {
        console.log('Incorrect answer node found!');
      }
      lessonState.currentFeedback = parsedFeedback;
    }
  }
};

const lessonObserver = new MutationObserver(lessonObserverCallback);

let oldHref = document.location.href;

/**
 * Main functionality should only execute when the user is on a lesson page.
 * This is determined by checking if the URL contains the string 'duolingo.com/lesson/'.
 * This cannot be implemented into the manifest.json since the Duolingo web app
 * is a single page application and the page does not reload when navigating.
 * This function observes the URL and checks if the user is on a lesson page.
 *
 * TODO: This may cause performance issues since the observer is always running.
 */
const toggleObservers = (currentHref: string) => {
  if (currentHref.includes(lessonUrlStringMatch) && !lessonState.onLesson) {
    console.log('Lesson detected!');
    lessonState.onLesson = true;
    clearLessonState();
    lessonObserver.observe(root, { childList: true, subtree: true });
  } else if (lessonState.onLesson) {
    console.log('Lesson ended!');
    lessonState.onLesson = false;
    clearLessonState();
    lessonObserver.disconnect();
  }
};

const urlObserverCallback = () => {
  const currentHref = document.location.href;
  if (oldHref !== currentHref) {
    oldHref = currentHref;
    toggleObservers(currentHref);
  }
};

const urlObserver = new MutationObserver(urlObserverCallback);

urlObserver.observe(root, { childList: true, subtree: true });

// Handle the case where the user navigates to a lesson directly
toggleObservers(document.location.href);

console.log('Duolingo Memo content script loaded!');
