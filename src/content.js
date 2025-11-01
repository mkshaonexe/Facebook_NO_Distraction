// Facebook Reels Blocker (except /reels)
// MV3 content script

(function () {
  const DEFAULT_SETTINGS = {
    blockReels: true,
    blockStories: true,
    blockHomeFeed: true,
    hideNotificationBadge: true
  };

  let currentSettings = { ...DEFAULT_SETTINGS };

  function loadSettings() {
    return new Promise(resolve => {
      try {
        chrome.storage.sync.get(DEFAULT_SETTINGS, (res) => {
          resolve(res || DEFAULT_SETTINGS);
        });
      } catch {
        resolve(DEFAULT_SETTINGS);
      }
    });
  }
  const REELS_KEYWORDS = [
    'Reels',
    'Reel',
    '短片',
    'رييلز',
    'Reels y',
  ];

  function isOnReelsRoute() {
    // Allow reels watch page
    return /(^|\.)facebook\.com\/reels(\/|$|\?)/.test(location.href);
  }

  function isOnSingleReelRoute() {
    return /(^|\.)facebook\.com\/reel(\/|$)/.test(location.href);
  }

  function isOnHomeFeedRoute() {
    const { pathname, search } = location;
    if (!pathname || pathname === '/' || pathname === '/home.php') return true;

    try {
      const params = new URLSearchParams(search);
      const sk = params.get('sk');
      if (sk && /^h_/i.test(sk)) return true;
      // Some home variants include explicit "?home" or "/?ref=home"
      if (params.has('home')) return true;
    } catch {}

    return false;
  }

  function updateAllowFlag() {
    const html = document.documentElement;
    if (isOnReelsRoute()) {
      html.setAttribute('data-allow-reels', 'true');
    } else {
      html.removeAttribute('data-allow-reels');
    }
    if (currentSettings.blockStories) {
      html.removeAttribute('data-allow-stories');
    } else {
      html.setAttribute('data-allow-stories', 'true');
    }

    const shouldHideHome = !!currentSettings.blockHomeFeed && isOnHomeFeedRoute();
    if (shouldHideHome) {
      html.setAttribute('data-home-feed-hidden', 'true');
    } else {
      html.removeAttribute('data-home-feed-hidden');
    }

    // Always hide sidebars on the Home feed route per user requirement
    if (isOnHomeFeedRoute()) {
      html.setAttribute('data-home-sidebars-hidden', 'true');
    } else {
      html.removeAttribute('data-home-sidebars-hidden');
    }

    // Flag for hiding notification badge based on user setting
    html.toggleAttribute('data-hide-notification-badge', !!currentSettings.hideNotificationBadge);
  }

  function hideElement(el, type = 'reels') {
    if (!el) return;
    el.setAttribute(`data-blocked-${type}`, 'true');
    el.style.display = 'none';
    el.style.visibility = 'hidden';
    el.style.maxHeight = '0px';
    el.style.height = '0px';
    el.style.overflow = 'hidden';
  }

  function showElement(el) {
    if (!el) return;
    el.removeAttribute('data-blocked-reels');
    el.removeAttribute('data-blocked-stories');
    el.removeAttribute('data-blocked-notifications');
    el.style.display = '';
    el.style.visibility = '';
    el.style.maxHeight = '';
    el.style.height = '';
    el.style.overflow = '';
  }

  function restoreElements(type) {
    const selector = `[data-blocked-${type}="true"]`;
    document.querySelectorAll(selector).forEach(el => {
      showElement(el);
    });
  }

  function isLikelyReels(el) {
    if (!el) return false;

    // Attribute/class hints commonly used around reels surfaces (can change over time)
    const className = (el.className || '').toString();
    if (/reel|reels|x1i10hfl|x5yr21d/i.test(className)) return true;

    // aria-labels or role text
    const ariaLabel = (el.getAttribute && el.getAttribute('aria-label')) || '';
    if (/reel|reels/i.test(ariaLabel)) return true;

    // inner text keywords (cheap but helpful)
    const text = (el.innerText || '').slice(0, 400).toLowerCase();
    if (text && REELS_KEYWORDS.some(k => text.includes(k.toLowerCase()))) return true;

    return false;
  }

  function removeNotificationBadges(root) {
    if (!root) root = document;
    const header = document.querySelector('[role="banner"], header');
    const scope = header || root;

    const badgeSelectors = [
      '[aria-label*="Notifications" i] span',
      '[aria-label*="Messenger" i] span'
    ];

    scope.querySelectorAll(badgeSelectors.join(',')).forEach(el => {
      if (!(el instanceof HTMLElement)) return;
      if (el.getAttribute && el.getAttribute('data-blocked-notifications') === 'true') return;
      if (el.innerText && /\d+/.test(el.innerText.trim())) {
        hideElement(el, 'notifications');
        return;
      }
      const bg = (el.style && el.style.backgroundColor) || '';
      if (bg && bg.toLowerCase() !== 'transparent') {
        hideElement(el, 'notifications');
      }
      const className = el.className || '';
      if (typeof className === 'string' && className.includes('xtk6v10')) {
        hideElement(el, 'notifications');
      }
    });
  }

  function scanAndBlock(root) {
    if (isOnReelsRoute()) return; // do nothing on reels page

    // Only process if blocking is enabled
    if (currentSettings.blockReels) {
      const candidates = [];

      // Feed units, right rail modules, story-like carousels, video trays
      candidates.push(
        ...root.querySelectorAll([
          '[aria-label*="Reels" i]',
          '[aria-label*="Reel" i]',
          'a[href*="/reels/"]',
          'a[role="link"][href*="/reel/"]',
          'a[role="link"][href*="/reels/clip/"]',
          'div[role="article"]',
          'div[role="feed"] > div',
          'div[role="complementary"]',
          'div[id^="stories"][id*="reel" i]',
          'div[class*="reel" i]'
        ].join(','))
      );

      for (const el of candidates) {
        if (el.getAttribute && el.getAttribute('data-blocked-reels') === 'true') continue;
        if (isLikelyReels(el)) {
          hideElement(el.closest('[data-pagelet], [role="article"], div'), 'reels');
        }
      }
    }

    if (currentSettings.hideNotificationBadge) {
      removeNotificationBadges(root);
    }
  }

  function setupObserver() {
    const observer = new MutationObserver(mutations => {
      updateAllowFlag();
      if (isOnReelsRoute()) return;
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length) {
          m.addedNodes.forEach(node => {
            if (!(node instanceof HTMLElement)) return;
            scanAndBlock(node);
          });
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  function removeEntryPointsNav() {
    if (isOnReelsRoute()) return;

    // Handle reels links
    const reelsLinks = document.querySelectorAll('a[href*="/reels/"]');
    reelsLinks.forEach(link => {
      const container = link.closest('a, div, li');
      if (currentSettings.blockReels) {
        if (container && container.getAttribute('data-blocked-reels') !== 'true') {
          hideElement(container, 'reels');
        }
      } else {
        if (container && container.getAttribute('data-blocked-reels') === 'true') {
          showElement(container);
        }
      }
    });

    // Handle stories
    const storySelectors = [
      '[aria-label*="Stories" i]',
      'a[href*="/stories/"]',
      'div[id^="stories"]'
    ];
    document.querySelectorAll(storySelectors.join(',')).forEach(el => {
      const container = el.closest('div, li');
      if (currentSettings.blockStories) {
        if (container && container.getAttribute('data-blocked-stories') !== 'true') {
          hideElement(container, 'stories');
        }
      } else {
        if (container && container.getAttribute('data-blocked-stories') === 'true') {
          showElement(container);
        }
      }
    });
  }

  async function main() {
    currentSettings = await loadSettings();

    // If user wants to block single-reel pages, redirect to /reels
    if (currentSettings.blockReels && isOnSingleReelRoute()) {
      // Stop current load ASAP and jump to reels hub for a smoother UX
      try { window.stop(); } catch {}
      location.replace('https://www.facebook.com/reels');
      return;
    }

    updateAllowFlag();
    if (!isOnReelsRoute()) {
      const shouldHideHome = currentSettings.blockHomeFeed && isOnHomeFeedRoute();
      const hideDuringInit = currentSettings.blockStories || shouldHideHome;

      if (hideDuringInit) {
        document.documentElement.style.visibility = 'hidden';
      }

      if (!shouldHideHome) {
        scanAndBlock(document);
      }
      removeEntryPointsNav();
      if (currentSettings.hideNotificationBadge) {
        removeNotificationBadges(document);
      }

      if (hideDuringInit) {
        // Reveal page after initial sweep
        requestAnimationFrame(() => {
          document.documentElement.style.visibility = '';
        });
      }
    }
    setupObserver();

    // React to SPA URL changes
    let lastHref = location.href;
    setInterval(() => {
      if (location.href !== lastHref) {
        lastHref = location.href;
        updateAllowFlag();
        if (!isOnReelsRoute()) {
          if (!(currentSettings.blockHomeFeed && isOnHomeFeedRoute())) {
            scanAndBlock(document);
          }
          removeEntryPointsNav();
          if (currentSettings.hideNotificationBadge) {
            removeNotificationBadges(document);
          }
        }
      }
    }, 800);

    // Throttled scan on scroll to catch upcoming posts fast
    let scanQueued = false;
    const scheduleScan = () => {
      if (scanQueued) return;
      scanQueued = true;
      requestAnimationFrame(() => {
        scanQueued = false;
        if (!isOnReelsRoute()) {
          if (!(currentSettings.blockHomeFeed && isOnHomeFeedRoute())) {
            scanAndBlock(document);
          }
        }
      });
    };
    window.addEventListener('scroll', scheduleScan, { passive: true });

    // Listen to settings updates via storage changes (works without extra perms)
    try {
      chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'sync') return;
        let changed = false;
        // Store old values before updating
        const oldBlockReels = currentSettings.blockReels;
        const oldBlockStories = currentSettings.blockStories;
        const oldHideNotificationBadge = currentSettings.hideNotificationBadge;
        
        for (const key of ['blockReels', 'blockStories', 'blockHomeFeed', 'hideNotificationBadge']) {
          if (changes[key]) {
            currentSettings[key] = changes[key].newValue;
            changed = true;
          }
        }
        if (changed) {
          // Restore elements if features were turned off
          if (oldBlockReels && !currentSettings.blockReels) {
            restoreElements('reels');
          }
          if (oldBlockStories && !currentSettings.blockStories) {
            restoreElements('stories');
          }
          if (oldHideNotificationBadge && !currentSettings.hideNotificationBadge) {
            restoreElements('notifications');
          }
          
          updateAllowFlag();
          if (!isOnReelsRoute()) {
            scanAndBlock(document);
            removeEntryPointsNav();
            if (currentSettings.hideNotificationBadge) {
              removeNotificationBadges(document);
            }
          }
        }
      });
    } catch {}

    // Listen for direct messages from the popup for immediate updates
    try {
      chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (!message || message.type !== 'settings:update' || !message.payload) return;
        const payload = message.payload || {};
        // Store old values before updating
        const oldBlockReels = currentSettings.blockReels;
        const oldBlockStories = currentSettings.blockStories;
        const oldHideNotificationBadge = currentSettings.hideNotificationBadge;
        
        let changed = false;
        for (const key of ['blockReels', 'blockStories', 'blockHomeFeed', 'hideNotificationBadge']) {
          if (Object.prototype.hasOwnProperty.call(payload, key) && currentSettings[key] !== payload[key]) {
            currentSettings[key] = payload[key];
            changed = true;
          }
        }
        if (changed) {
          // Restore elements if features were turned off
          if (oldBlockReels && !currentSettings.blockReels) {
            restoreElements('reels');
          }
          if (oldBlockStories && !currentSettings.blockStories) {
            restoreElements('stories');
          }
          if (oldHideNotificationBadge && !currentSettings.hideNotificationBadge) {
            restoreElements('notifications');
          }
          
          updateAllowFlag();
          if (!isOnReelsRoute()) {
            scanAndBlock(document);
            removeEntryPointsNav();
            if (currentSettings.hideNotificationBadge) {
              removeNotificationBadges(document);
            }
          }
        }
      });
    } catch {}
  }

  // Run immediately at document_start for fastest redirects
  main();
})();


