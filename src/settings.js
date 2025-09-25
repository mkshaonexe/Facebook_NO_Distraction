const DEFAULT_SETTINGS = {
  blockReels: true,
  blockStories: true,
  blockAds: true,
  blockHomeFeed: true,
  hideNotificationBadge: true
};

export async function loadSettings() {
  return new Promise(resolve => {
    chrome.storage.sync.get(DEFAULT_SETTINGS, resolve);
  });
}

export async function saveSettings(newSettings) {
  return new Promise(resolve => {
    chrome.storage.sync.set(newSettings, resolve);
  });
}

export function onSettingsChanged(callback) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    const diff = {};
    for (const key of Object.keys(DEFAULT_SETTINGS)) {
      if (changes[key]) diff[key] = changes[key].newValue;
    }
    if (Object.keys(diff).length) callback({ ...DEFAULT_SETTINGS, ...diff });
  });
}


