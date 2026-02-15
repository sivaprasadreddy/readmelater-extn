// Content script to handle context menu clicks and capture link data

let lastClickedLink = null;

// Capture the link element when right-clicked
document.addEventListener('contextmenu', (e) => {
  // Find the closest link element
  const link = e.target.closest('a');

  if (link && link.href) {
    // Store link information
    lastClickedLink = {
      url: link.href,
      text: link.textContent.trim() || link.innerText.trim() || extractTitleFromUrl(link.href),
      title: link.title || link.getAttribute('aria-label') || '',
      sourcePage: document.title,
      sourceUrl: window.location.href
    };
  }
}, true);

// Listen for requests from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getLinkData') {
    sendResponse(lastClickedLink);
    lastClickedLink = null; // Clear after sending
  }
});

// Helper function to extract a readable title from URL
function extractTitleFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Get the last part of the path or domain
    const parts = pathname.split('/').filter(p => p.length > 0);
    if (parts.length > 0) {
      const lastPart = parts[parts.length - 1];
      // Remove file extensions and clean up
      return decodeURIComponent(lastPart.replace(/\.[^.]*$/, '').replace(/[-_]/g, ' '));
    }

    return urlObj.hostname;
  } catch (e) {
    return url;
  }
}
