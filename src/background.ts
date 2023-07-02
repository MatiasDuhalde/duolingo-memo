import { SETTINGS_STORAGE_KEY } from './utils/constants';

self.chrome.runtime.onInstalled.addListener(async () => {
  console.log('Installed!');
  const { settings } = await self.chrome.storage.sync.get(SETTINGS_STORAGE_KEY);
  if (settings) {
    console.log('Found previous settings:', JSON.stringify(settings));
  } else {
    console.log('No previous settings found, setting defaults.');
  }
  await self.chrome.storage.sync.set({
    settings: {
      autoFill: settings?.autoFill ?? true,
      saveAnswers: settings?.saveAnswers ?? true,
    },
  });
});

console.log('Background script loaded!');
