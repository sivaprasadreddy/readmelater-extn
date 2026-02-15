// Popup script to display and manage saved items (tweets and links)

// Load and display items
function loadTweets() {
  chrome.storage.local.get(['readLaterTweets'], (result) => {
    const items = result.readLaterTweets || [];
    displayTweets(items);
  });
}

// Display items in the popup
function displayTweets(items) {
  const tweetList = document.getElementById('tweetList');
  const emptyState = document.getElementById('emptyState');
  const tweetCount = document.getElementById('tweetCount');

  // Update counter
  tweetCount.textContent = items.length;

  // Show/hide empty state
  if (items.length === 0) {
    emptyState.style.display = 'block';
    tweetList.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  tweetList.style.display = 'block';

  // Clear existing list
  tweetList.innerHTML = '';

  // Sort items by timestamp (most recent first)
  const sortedItems = items.sort((a, b) => b.timestamp - a.timestamp);

  // Create list items
  sortedItems.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.className = 'tweet-item';

    // Check if it's a tweet or a regular link
    if (item.type === 'link') {
      // Display link item
      const source = document.createElement('div');
      source.className = 'tweet-author';
      source.innerHTML = `🔗 Link`;

      const text = document.createElement('div');
      text.className = 'tweet-text';
      text.textContent = item.title || item.url;

      const actions = document.createElement('div');
      actions.className = 'tweet-actions';

      const link = document.createElement('a');
      link.className = 'tweet-link';
      link.href = item.url;
      link.textContent = 'Open Link';
      link.target = '_blank';
      actions.appendChild(link);

      const doneBtn = document.createElement('button');
      doneBtn.className = 'done-btn';
      doneBtn.textContent = 'Done';
      doneBtn.addEventListener('click', () => {
        removeTweet(item.id);
      });
      actions.appendChild(doneBtn);

      itemElement.appendChild(source);
      itemElement.appendChild(text);
      itemElement.appendChild(actions);
    } else {
      // Display tweet item (original behavior)
      const author = document.createElement('div');
      author.className = 'tweet-author';
      author.textContent = item.author || 'Unknown User';

      const text = document.createElement('div');
      text.className = 'tweet-text';
      text.textContent = item.text || 'Tweet text not available';

      const actions = document.createElement('div');
      actions.className = 'tweet-actions';

      if (item.url) {
        const link = document.createElement('a');
        link.className = 'tweet-link';
        link.href = item.url;
        link.textContent = 'View Tweet';
        link.target = '_blank';
        actions.appendChild(link);
      }

      const doneBtn = document.createElement('button');
      doneBtn.className = 'done-btn';
      doneBtn.textContent = 'Done';
      doneBtn.addEventListener('click', () => {
        removeTweet(item.id);
      });
      actions.appendChild(doneBtn);

      itemElement.appendChild(author);
      itemElement.appendChild(text);
      itemElement.appendChild(actions);
    }

    tweetList.appendChild(itemElement);
  });
}

// Remove an item from the list
function removeTweet(itemId) {
  chrome.storage.local.get(['readLaterTweets'], (result) => {
    const items = result.readLaterTweets || [];
    const updatedItems = items.filter(t => t.id !== itemId);

    chrome.storage.local.set({ readLaterTweets: updatedItems }, () => {
      loadTweets();
    });
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', loadTweets);

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.readLaterTweets) {
    loadTweets();
  }
});
