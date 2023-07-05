import { SETTINGS_STORAGE_KEY } from './utils/constants';

self.chrome.runtime.onInstalled.addListener(async () => {
  console.debug('Installed!');
  const { settings } = await self.chrome.storage.sync.get(SETTINGS_STORAGE_KEY);
  if (settings) {
    console.debug('Found previous settings:', JSON.stringify(settings));
  } else {
    console.debug('No previous settings found, setting defaults.');
  }
  await self.chrome.storage.sync.set({
    settings: {
      autoFill: settings?.autoFill ?? true,
      saveAnswers: settings?.saveAnswers ?? true,
    },
  });
});

console.debug('Background script loaded!');
