import { loadSettings, saveSettings } from './settings.js';

// Check if user has premium access
function isPremiumUser() {
  // For now, return false to demonstrate premium lock
  // In a real implementation, this would check against a backend service
  return false;
}

async function init() {
  const settings = await loadSettings();
  const reels = document.getElementById('reels');
  const stories = document.getElementById('stories');
  const home = document.getElementById('home');
  const ads = document.getElementById('ads');
  const notifications = document.getElementById('notifications');
  const statusText = document.getElementById('statusText');
  const premiumModal = document.getElementById('premiumModal');
  const upgradeBtn = document.getElementById('upgradeBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');

  reels.checked = !!settings.blockReels;
  stories.checked = !!settings.blockStories;
  home.checked = !!settings.blockHomeFeed;
  ads.checked = !!settings.blockAds;
  notifications.checked = !!settings.hideNotificationBadge;

  // Disable ads toggle if user is not premium
  if (!isPremiumUser()) {
    ads.disabled = true;
    ads.style.opacity = '0.6';
  }

  function update() {
    const newSettings = {
      blockReels: reels.checked,
      blockStories: stories.checked,
      blockHomeFeed: home.checked,
      blockAds: ads.checked,
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
  
  // Handle ads toggle with premium check
  ads.addEventListener('change', (e) => {
    if (!isPremiumUser()) {
      e.preventDefault();
      ads.checked = false;
      premiumModal.hidden = false;
      return;
    }
    update();
  });
  
  notifications.addEventListener('change', update);

  // Modal event listeners
  upgradeBtn.addEventListener('click', () => {
    // In a real implementation, this would redirect to payment page
    alert('Premium upgrade coming soon!');
    premiumModal.hidden = true;
  });

  closeModalBtn.addEventListener('click', () => {
    premiumModal.hidden = true;
  });

  // Close modal when clicking outside
  premiumModal.addEventListener('click', (e) => {
    if (e.target === premiumModal) {
      premiumModal.hidden = true;
    }
  });
}

init();


