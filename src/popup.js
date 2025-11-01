import { loadSettings, saveSettings } from './settings.js';

async function init() {
  const settings = await loadSettings();
  const reels = document.getElementById('reels');
  const stories = document.getElementById('stories');
  const home = document.getElementById('home');
  const notifications = document.getElementById('notifications');
  const statusText = document.getElementById('statusText');

  reels.checked = !!settings.blockReels;
  stories.checked = !!settings.blockStories;
  home.checked = !!settings.blockHomeFeed;
  notifications.checked = !!settings.hideNotificationBadge;

  function update() {
    const newSettings = {
      blockReels: reels.checked,
      blockStories: stories.checked,
      blockHomeFeed: home.checked,
      hideNotificationBadge: notifications.checked
    };

    // Persist to storage (triggers storage listener too)
    saveSettings(newSettings);

    // Also send a direct message to the active tab(s) for instant effect
    try {
      chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!Array.isArray(tabs)) return;
        tabs.forEach(tab => {
          if (!tab || !tab.id) return;
          try {
            chrome.tabs.sendMessage(tab.id, { type: 'settings:update', payload: newSettings });
          } catch {}
        });
      });
    } catch {}

    if (statusText) {
      statusText.textContent = 'Changes saved';
      clearTimeout((statusText)._t);
      (statusText)._t = setTimeout(() => {
        statusText.textContent = 'Extension is enabled';
      }, 1200);
    }
  }

  reels.addEventListener('change', update);
  stories.addEventListener('change', update);
  home.addEventListener('change', update);
  notifications.addEventListener('change', update);
}

init();


