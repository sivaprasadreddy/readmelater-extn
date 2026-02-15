// Content script to add "Read Later" button to tweets

// Function to extract tweet data
function getTweetData(article) {
  const tweetTextElement = article.querySelector('[data-testid="tweetText"]');
  const tweetText = tweetTextElement ? tweetTextElement.innerText : 'Tweet text not available';

  const userNameElement = article.querySelector('[data-testid="User-Name"]');
  const userName = userNameElement ? userNameElement.innerText.split('\n')[0] : 'Unknown User';

  // Get tweet link
  const timeElement = article.querySelector('time');
  const tweetLink = timeElement ? timeElement.closest('a')?.href : '';

  return {
    id: tweetLink || Date.now().toString(),
    type: 'tweet',
    text: tweetText,
    author: userName,
    url: tweetLink,
    timestamp: Date.now()
  };
}

// Function to add "Read Later" button to a tweet
function addReadLaterButton(article) {
  // Check if button already exists
  if (article.querySelector('.read-later-btn')) {
    return;
  }

  // Find the action bar (where like, retweet buttons are)
  const actionBar = article.querySelector('[role="group"]');
  if (!actionBar) return;

  // Create the button container
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'read-later-btn-container';
  buttonContainer.style.display = 'inline-flex';
  buttonContainer.style.alignItems = 'center';
  buttonContainer.style.marginLeft = '8px';

  // Create the button
  const button = document.createElement('button');
  button.className = 'read-later-btn';
  button.innerHTML = '🔖';
  button.title = 'Save to Read Later';
  button.style.background = 'transparent';
  button.style.border = 'none';
  button.style.cursor = 'pointer';
  button.style.fontSize = '18px';
  button.style.padding = '8px';
  button.style.borderRadius = '50%';
  button.style.transition = 'background-color 0.2s';

  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = 'rgba(29, 155, 240, 0.1)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = 'transparent';
  });

  button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const tweetData = getTweetData(article);

    // Save to storage
    chrome.storage.local.get(['readLaterTweets'], (result) => {
      const tweets = result.readLaterTweets || [];

      // Check if tweet already exists
      const exists = tweets.some(t => t.id === tweetData.id);
      if (exists) {
        button.innerHTML = '✅';
        setTimeout(() => {
          button.innerHTML = '🔖';
        }, 1000);
        return;
      }

      tweets.push(tweetData);

      chrome.storage.local.set({ readLaterTweets: tweets }, () => {
        // Visual feedback
        button.innerHTML = '✅';
        setTimeout(() => {
          button.innerHTML = '🔖';
        }, 1000);
      });
    });
  });

  buttonContainer.appendChild(button);
  actionBar.appendChild(buttonContainer);
}

// Observer to watch for new tweets
const observer = new MutationObserver((mutations) => {
  const articles = document.querySelectorAll('article[data-testid="tweet"]');
  articles.forEach(article => {
    addReadLaterButton(article);
  });
});

// Start observing
function startObserving() {
  const targetNode = document.body;
  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });

  // Initial run for existing tweets
  const articles = document.querySelectorAll('article[data-testid="tweet"]');
  articles.forEach(article => {
    addReadLaterButton(article);
  });
}

// Wait for page to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startObserving);
} else {
  startObserving();
}
