// Background script for context menu and other background tasks

// Create context menu on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'readLater',
    title: 'Read Me Later',
    contexts: ['link']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'readLater' && info.linkUrl) {
    saveLink(info.linkUrl);
  }
});

// Fetch the title from the target URL
async function fetchPageTitle(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      cache: 'default'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch page');
    }

    const html = await response.text();

    // Extract title from HTML
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      // Decode HTML entities
      const title = titleMatch[1].trim();
      return decodeHtmlEntities(title);
    }

    // Try og:title meta tag as fallback
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
    if (ogTitleMatch && ogTitleMatch[1]) {
      return decodeHtmlEntities(ogTitleMatch[1].trim());
    }

    return null;
  } catch (error) {
    console.log('Error fetching page title:', error);
    return null;
  }
}

// Decode HTML entities
function decodeHtmlEntities(text) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&nbsp;': ' '
  };

  return text.replace(/&[^;]+;/g, (match) => entities[match] || match);
}

// Save a link - fetch the title first
async function saveLink(url) {
  // Show immediate feedback
  showNotification('Fetching...');

  // Fetch the page title
  const title = await fetchPageTitle(url);

  const item = {
    id: url + '_' + Date.now(),
    type: 'link',
    url: url,
    title: title || extractTitleFromUrl(url),
    timestamp: Date.now()
  };

  saveItemToStorage(item);
}

// Helper function to extract title from URL
function extractTitleFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Get the last part of the path or domain
    const parts = pathname.split('/').filter(p => p.length > 0);
    if (parts.length > 0) {
      const lastPart = parts[parts.length - 1];
      return decodeURIComponent(lastPart.replace(/\.[^.]*$/, '').replace(/[-_]/g, ' '));
    }

    return urlObj.hostname;
  } catch (e) {
    return url;
  }
}

// Save item to storage
function saveItemToStorage(item) {
  chrome.storage.local.get(['readLaterTweets'], (result) => {
    const items = result.readLaterTweets || [];

    // Check if URL already exists
    const exists = items.some(existingItem => existingItem.url === item.url && existingItem.type === 'link');
    if (exists) {
      showNotification('Link already saved!');
      return;
    }

    items.push(item);
    chrome.storage.local.set({ readLaterTweets: items }, () => {
      showNotification('Link saved to Read Me Later!');
    });
  });
}

// Show a notification
function showNotification(message) {
  // For Manifest V3, we can use chrome.notifications or just badge
  chrome.action.setBadgeText({ text: '✓' });
  chrome.action.setBadgeBackgroundColor({ color: '#1DA1F2' });

  // Clear badge after 2 seconds
  setTimeout(() => {
    chrome.action.setBadgeText({ text: '' });
  }, 2000);
}
