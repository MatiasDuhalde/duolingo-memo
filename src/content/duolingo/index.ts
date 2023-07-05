import { SETTINGS_STORAGE_KEY } from '../../utils/constants';
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

let settings = await self.chrome.storage.sync.get(SETTINGS_STORAGE_KEY);

self.chrome.storage.sync.onChanged.addListener((changes) => {
  if (changes[SETTINGS_STORAGE_KEY]) {
    settings = changes[SETTINGS_STORAGE_KEY].newValue;
  }
});

const lessonObserverCallback = async () => {
  if (lessonState.currentChallenge !== null && !lessonState.currentChallenge.node.isConnected) {
    console.debug('Challenge node disconnected!');
    lessonState.currentChallenge = null;
  }
  if (lessonState.currentFeedback !== null && !lessonState.currentFeedback.node.isConnected) {
    console.debug('Feedback node disconnected!');
    lessonState.currentFeedback = null;
  }

  if (lessonState.currentChallenge === null) {
    // Find the challenge node
    console.debug('Searching possible challenge node...');
    const node = document.querySelector('[data-test^="challenge challenge"]');
    if (node) {
      const parsedChallenge = parseChallengeNode(node);
      console.debug(`Challenge node of type ${parsedChallenge.type} found!`);
      lessonState.currentChallenge = parsedChallenge;

      if (settings.autoFill) {
        console.debug(
          `Searching for existing answer for challenge: ${parsedChallenge.prompt.toString()}`,
        );
        const answer = await searchExistingAnswer(parsedChallenge);
        if (answer) {
          console.debug(`Found the answer: ${answer}`);
          autoFillAnswer(parsedChallenge, answer);
        } else {
          console.debug('No answer found!');
        }
      }
    }
  } else if (lessonState.currentFeedback === null) {
    // Find the feedback node in the mutation
    console.debug('Searching possible feedback node...');
    const node = document.querySelector('[data-test^="blame blame"]');
    if (node) {
      const parsedFeedback = parseFeedbackNode(node);
      if (parsedFeedback.correct) {
        console.debug('Correct answer node found!');
        if (settings.autoSave) {
          const inputtedAnswer = getChallengeInputtedAnswer(lessonState.currentChallenge);
          if (inputtedAnswer) {
            console.debug(`Inputted answer: ${inputtedAnswer}`);
            console.debug('Saving answer...');
            await saveAnswer(lessonState.currentChallenge, inputtedAnswer);
            console.debug('Answer saved!');
          }
        }
      } else {
        console.debug('Incorrect answer node found!');
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
    console.debug('Lesson detected!');
    lessonState.onLesson = true;
    clearLessonState();
    lessonObserver.observe(root, { childList: true, subtree: true });
  } else if (lessonState.onLesson) {
    console.debug('Lesson ended!');
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

console.debug('Duolingo Memo content script loaded!');
