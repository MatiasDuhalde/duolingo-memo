# Duolingo Memo Extension

Browser extension that remembers your answers on Duolingo.

This extension was originally conceived with the intention of addressing the tediousness of some Legendary Challenges. For each Legendary Challenge (and inside a same unit), the exercise pool is quite reduced, and you're only allowed two mistakes. This makes retrying a Legendary Challenge specially annoying, since you'll most likely have to retype the same answers over and over again. This extension aims to solve that problem by remembering your correct answers and automatically filling the input with the remembered answer.

Legendary challenges contain almost exclusively exercices of type "Translate" (see [Supported Types](#supported)), however, the extension has been expanded to support other types of exercises and it will continue to be expanded in the future.

## Disclaimer

**THIS PROJECT IS NOT AFFILIATED WITH DUOLINGO OR ANY OF ITS SUBSIDIARIES IN ANY WAY.**

This extension includes automatic scripts that interact in the background with Duolingo's interface. Duolingo does not officially support this extension, and it may break at any time due to changes in Duolingo's code or user interface. See the [Bugs](#bugs) section for more information.

### Trademarks

"Duolingo" and all other trademarks, service marks, graphics, and logos used in connection with the Duolingo Service (i.e. their web and mobile applications) are trademarks or service marks of Duolingo or their respective owners, and certain of them are registered with the United States Patent and Trademark Office or other trademark authorities. Access and use of the Duolingo Service (i.e. their web and mobile applications) does not grant or provide you with the right or license to reproduce or otherwise use the Duolingo name or any Duolingo or third-party trademarks, service marks, graphics, or logos.

## Installation

- TODO: Add badges

## Bugs

This extension is still in development. If you find a bug, please [open an issue](https://github.com/MatiasDuhalde/duolingo-memo/issues) and include the following information:

- Your browser and version
- Your operating system and version
- Steps to reproduce the bug
- Screenshots if possible

## Features

- [x] Remember your answers on Duolingo
- [ ] Automatically fill the answer input with the remembered answer
- [ ] Toggle remembering answers and autocomplete on/off
- [ ] Per-language settings
- [ ] Per-exercise settings
- [ ] Per-challenge settings

Would you like to see a feature added? [Open an issue](https://github.com/MatiasDuhalde/duolingo-memo/issues) and let me know!

## Exercises

### Supported

- [x] **Translate**: Translate the proposed sentence by typing the answer in the input.
- [x] **Translate Tap**: Same as before, but with a word bank. Some exercises may allow switching between this type and the previous one.
- [x] **Tap Complete**: Fill the missing words in the sentence by tapping on the word bank.
- [x] **Assist**: Multiple choice exercise. You must choose the correct answer from a list of options.

### Planned support

- [ ] **Dialogue**: You'll be presented with a conversation between two people. You must choose the correct answer from a list of options. Similar to the "Assist" exercise, but with a slightly different UI.
- [ ] **Complete Reverse Translation**: Similar to the "Translate" exercise, but you'll be presented with the translation of a sentence in your target language, and you must translate it back to your native language.
- [ ] **Complete Reverse Translation Tap**: Same as before, but with a word bank. Some exercises may allow switching between this type and the previous one.

**Note**: This list is not exhaustive. It was made based on the exercises I commonly encounter in the intermediate-advanced levels of the languages I'm learning. If you find an exercise that's not supported, please check the not planned exercises and the notes at the bottom of this section and [open an issue](https://github.com/MatiasDuhalde/duolingo-memo/issues) if it's still pending so I can take a look at it.

### Not supported (nor planned)

- [ ] **Speak**: Say the sentence out loud. Duolingo will check if you pronounced it correctly.
- [ ] **Listen Complete**: Listen to the sentence and type it in the input.

### Notes on supported exercises

The main objective of this tool is not to provide a way to easily advance through the levels or to grind XP. It's meant to be used as a way to avoid typing the same answers over and over again, which is specially annoying when you're doing a Legendary Challenge. For that reason, some exercise types may be set as "not supported" or "not planned" even if they're technically possible to implement. This, to maintain the spirit of the tool described above.

## Development

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v7 or higher)

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Build the extension:
    - Use `npm run build` to generate the production build of the extension once
    - Use `npm run dev` to generate a development build and watch for changes
4. Load the extension in your browser:
    - Chrome: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", and select the `dist` folder
    - Firefox: Go to `about:debugging`, click "This Firefox", click "Load Temporary Add-on...", and select the `manifest.json` file in the `dist` folder
