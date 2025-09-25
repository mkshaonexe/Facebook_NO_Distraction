// Facebook Reels Blocker (except /reels)
// MV3 content script

(function () {
  const DEFAULT_SETTINGS = {
    blockReels: true,
    blockStories: true,
    blockAds: true,
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
    html.toggleAttribute('data-block-ads', !!currentSettings.blockAds);
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

  function hideElement(el) {
    if (!el) return;
    el.setAttribute('data-reels-blocked', 'true');
    el.style.display = 'none';
    el.style.visibility = 'hidden';
    el.style.maxHeight = '0px';
    el.style.height = '0px';
    el.style.overflow = 'hidden';
  }

  function findPostContainer(fromEl) {
    if (!fromEl) return null;
    return (
      fromEl.closest('[data-pagelet*="FeedUnit"], [role="article"], [aria-posinset], [data-ad-comet-preview]') ||
      fromEl.closest('div')
    );
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
      if (el.innerText && /\d+/.test(el.innerText.trim())) {
        hideElement(el);
        return;
      }
      const bg = (el.style && el.style.backgroundColor) || '';
      if (bg && bg.toLowerCase() !== 'transparent') {
        hideElement(el);
      }
      const className = el.className || '';
      if (typeof className === 'string' && className.includes('xtk6v10')) {
        hideElement(el);
      }
    });
  }

  function scanAndBlock(root) {
    if (isOnReelsRoute()) return; // do nothing on reels page

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
      if (el.getAttribute && el.getAttribute('data-reels-blocked') === 'true') continue;
      if (currentSettings.blockReels && isLikelyReels(el)) hideElement(el.closest('[data-pagelet], [role="article"], div'));
    }

    if (currentSettings.blockAds) {
      // Strategy A: catch the transparency link first; it's most reliable
      const aboutLinks = root.querySelectorAll('a[href*="/ads/about" i], a[href*="/ad_preferences" i], a[href*="/ads/activity" i], a[href*="/business/help" i]');
      aboutLinks.forEach(a => {
        const post = findPostContainer(a);
        if (post && post.getAttribute('data-ads-blocked') !== 'true') {
          post.setAttribute('data-ads-blocked', 'true');
          hideElement(post);
        }
      });

      // Strategy B: per-post text/aria signals as fallback
      const sponsoredKeywords = [
        'Sponsored', 'Publicidad', 'Gesponsert', 'Sponsorizzato', 'Sponsorisé', 'Sponsorisée', 'Sponsorizat',
        'Спонсируемая', 'реклама', 'реклам', '赞助', '赞助内容', '広告', 'বিজ্ঞাপন', 'স্পনসরড', 'مُموَّل', 'إعلان',
        'Được tài trợ', 'Patrocinado', 'Patrocinada', 'Sponsrad', 'Sponzorované', 'Propaganda', 'Reklam'
      ];

      const posts = root.querySelectorAll('[role="article"], [data-pagelet^="FeedUnit"], [aria-posinset], [data-pagelet*="RightRail"], [role="complementary"] div');
      posts.forEach(post => {
        if (!post || post.getAttribute('data-ads-blocked') === 'true') return;
        const text = (post.innerText || '').slice(0, 800);
        const hasAriaSponsored = !!post.querySelector('[aria-label*="Sponsored" i], [aria-labelledby*="sponsored" i], [aria-label*="Publicidad" i]');
        const hasKeyword = text && sponsoredKeywords.some(k => text.indexOf(k) !== -1);
        // Some modules have an inline transparent clickable area that opens ad details
        const hasAdLink = !!post.querySelector('a[href*="/ads/about" i], a[href*="/ad_preferences" i], a[href*="/ads/activity" i]');
        if (hasAriaSponsored || hasKeyword) {
          post.setAttribute('data-ads-blocked', 'true');
          hideElement(post.closest('[data-pagelet], [role="article"], div'));
        } else if (hasAdLink) {
          post.setAttribute('data-ads-blocked', 'true');
          hideElement(post.closest('[data-pagelet], [role="article"], div'));
        }
      });
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

    if (currentSettings.blockReels) {
      const links = document.querySelectorAll('a[href*="/reels/"]');
      links.forEach(link => hideElement(link.closest('a, div, li')));
    }

    if (currentSettings.blockStories) {
      const storySelectors = [
        '[aria-label*="Stories" i]',
        'a[href*="/stories/"]',
        'div[id^="stories"]'
      ];
      document.querySelectorAll(storySelectors.join(',')).forEach(el => hideElement(el.closest('div, li')));
    }
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
        for (const key of ['blockReels', 'blockStories', 'blockAds', 'blockHomeFeed', 'hideNotificationBadge']) {
          if (changes[key]) {
            currentSettings[key] = changes[key].newValue;
            changed = true;
          }
        }
        if (changed) {
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
        let changed = false;
        for (const key of ['blockReels', 'blockStories', 'blockAds', 'blockHomeFeed', 'hideNotificationBadge']) {
          if (Object.prototype.hasOwnProperty.call(payload, key) && currentSettings[key] !== payload[key]) {
            currentSettings[key] = payload[key];
            changed = true;
          }
        }
        if (changed) {
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


