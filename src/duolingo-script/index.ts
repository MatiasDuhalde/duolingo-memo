import { parseChallengeNode, parseFeedbackNode } from '@app/utils/duolingo';
import { LessonState } from '@app/utils/interfaces';

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

const lessonObserver = new MutationObserver(() => {
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
    }
  } else if (lessonState.currentFeedback === null) {
    // Find the feedback node in the mutation
    console.log('Searching possible feedback node...');
    const node = document.querySelector('[data-test^="blame blame"]');
    if (node) {
      const parsedFeedback = parseFeedbackNode(node);
      if (parsedFeedback.correct) {
        console.log('Correct answer node found!');
      } else {
        console.log('Incorrect answer node found!');
      }
      lessonState.currentFeedback = parsedFeedback;
    }
  }
});

/**
 * Main functionality should only execute when the user is on a lesson page.
 * This is determined by checking if the URL contains the string 'duolingo.com/lesson/'.
 * This cannot be implemented into the manifest.json since the Duolingo web app
 * is a single page application and the page does not reload when navigating.
 *
 * This function observes the URL and checks if the user is on a lesson page.
 */
const observeUrlChange = () => {
  let oldHref = document.location.href;

  const observer = new MutationObserver(() => {
    const currentHref = document.location.href;
    if (oldHref !== currentHref) {
      oldHref = currentHref;

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
    }
  });
  observer.observe(root, { childList: true, subtree: true });
};

// Handle the case where the user navigates to a lesson directly
if (document.location.href.includes(lessonUrlStringMatch)) {
  console.log('Lesson detected!');
  lessonState.onLesson = true;
  clearLessonState();
  lessonObserver.observe(root, { childList: true, subtree: true });
}

window.addEventListener('load', observeUrlChange);

console.log('Duolingo Memo content script loaded!');
