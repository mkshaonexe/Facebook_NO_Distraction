import { loadSettings, saveSettings } from './settings.js';

async function init() {
  const settings = await loadSettings();
  const reels = document.getElementById('reels');
  const stories = document.getElementById('stories');
  const home = document.getElementById('home');
  const ads = document.getElementById('ads');
  const notifications = document.getElementById('notifications');

  reels.checked = !!settings.blockReels;
  stories.checked = !!settings.blockStories;
  home.checked = !!settings.blockHomeFeed;
  ads.checked = !!settings.blockAds;
  notifications.checked = !!settings.hideNotificationBadge;

  function update() {
    saveSettings({
      blockReels: reels.checked,
      blockStories: stories.checked,
      blockHomeFeed: home.checked,
      blockAds: ads.checked,
      hideNotificationBadge: notifications.checked
    });
  }

  reels.addEventListener('change', update);
  stories.addEventListener('change', update);
  home.addEventListener('change', update);
  ads.addEventListener('change', update);
  notifications.addEventListener('change', update);
}

init();


