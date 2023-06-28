# Duolingo Memo Extension

Browser extension that remembers your answers on Duolingo.

## Installation

- TODO: Add badges

## Bugs

This extension is still in development. If you find a bug, please [open an issue](https://github.com/MatiasDuhalde/duolingo-memo/issues) and include the following information:

- Your browser and version
- Your operating system and version
- Steps to reproduce the bug
- Screenshots if possible

## Features

- [ ] Remember your answers on Duolingo
- [ ] Automatically fill the answer input with the remembered answer
- [ ] Toggle remembering answers and autocomplete on/off
- [ ] Per-language settings

Would you like to see a feature added? [Open an issue](https://github.com/MatiasDuhalde/duolingo-memo/issues) and let me know!

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
