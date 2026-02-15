# Read Me Later Chrome Extension

A Chrome extension that allows you to save tweets and links to read later.

## Features

- 🔖 Add a "Read Later" button to every tweet on Twitter/X
- 🖱️ Right-click any link on any website and select "Read Me Later" from context menu
- 📚 View all saved tweets and links in a unified popup
- ✅ Mark items as "Done" to remove them from your list
- 💾 All data stored locally in browser storage

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select this directory (`readmelater-extn`)
5. The extension should now appear in your extensions list

## Usage

### Saving Tweets
1. Navigate to twitter.com or x.com
2. You'll see a 🔖 icon next to each tweet's action buttons
3. Click the bookmark icon to save a tweet

### Saving Links from Any Website
1. Navigate to any website
2. Right-click on any link
3. Select "Read Me Later" from the context menu
4. The link will be saved with the page title and URL

### Viewing and Managing Saved Items
1. Click the extension icon in the Chrome toolbar to view your saved items
2. Both tweets and links are displayed in chronological order (newest first)
3. Tweets show the author and text
4. Links show the source page title and link text
5. Click "Done" next to any item to remove it from your list
6. Click "View Tweet" or "Open Link" to visit the original content

## Files Structure

```
readmelater-extn/
├── manifest.json              # Extension configuration
├── background.js              # Background service worker for context menu
├── content.js                 # Twitter page script (adds bookmark button)
├── content.css                # Styles for the bookmark button
├── context-menu-handler.js    # Context menu link capture handler
├── popup/
│   ├── popup.html            # Popup interface
│   ├── popup.js              # Popup logic
│   └── popup.css             # Popup styles
├── icons/
│   ├── icon.svg              # Source SVG icon
│   ├── icon16.png            # 16x16 icon
│   ├── icon48.png            # 48x48 icon
│   └── icon128.png           # 128x128 icon
├── support/
│   ├── create_icons.py       # Python script to generate icons
│   ├── create_icons.sh       # Shell script to generate icons
│   ├── create_simple_icons.sh # Generate placeholder icons
│   └── generate_icons_from_svg.sh # Generate PNGs from SVG
└── README.md                  # This file
```

## Permissions

This extension requires:
- `storage` - To save items to Chrome's local storage
- `contextMenus` - To add the right-click context menu option
- Access to twitter.com and x.com - To inject the bookmark buttons on Twitter

## Privacy

All data is stored locally in your browser. No data is sent to any external servers.

## Developer Notes

### Creating Icons

Icons are already included in the `icons/` directory. If you need to regenerate them:

```bash
# From the extension root directory
./support/generate_icons_from_svg.sh
```

Or create placeholder icons:
```bash
./support/create_simple_icons.sh
```

The icons are stored in the `icons/` directory:
- `icons/icon16.png` (16x16 pixels)
- `icons/icon48.png` (48x48 pixels)
- `icons/icon128.png` (128x128 pixels)
- `icons/icon.svg` (source SVG file)
  
### Data Storage

The extension uses **`chrome.storage.local`** API for storing saved tweets and links.

#### Storage Location

Data is stored locally on your computer in Chrome's profile directory:

- **Windows**: `C:\Users\[YourName]\AppData\Local\Google\Chrome\User Data\Default\Local Extension Settings\[extension-id]`
- **macOS**: `~/Library/Application Support/Google/Chrome/Default/Local Extension Settings/[extension-id]`
- **Linux**: `~/.config/google-chrome/Default/Local Extension Settings/[extension-id]`

#### Data Persistence

✅ **Data DOES persist after browser restarts**

The data will remain stored:
- ✅ When you close and reopen Chrome
- ✅ When you restart your computer
- ✅ When you disable the extension temporarily
- ❌ **BUT will be deleted** if you uninstall the extension

#### Storage Details

- **Storage API**: `chrome.storage.local`
- **Storage Key**: `readLaterTweets` (contains array of tweet and link objects)
- **Maximum Storage**: 10MB (chrome.storage.local limit)
- **Sync**: Data is NOT synced across devices (local only)
- **Backup**: Data is NOT backed up automatically

#### Checking Stored Data

To inspect what's currently stored:

1. Open the extension popup
2. Right-click anywhere in the popup → "Inspect"
3. In the Console tab, run:
   ```javascript
   chrome.storage.local.get(['readLaterTweets'], (result) => {
     console.log(result.readLaterTweets);
   });
   ```

#### Data Structure

Each saved item has the following structure:

**Tweet Object:**
```json
{
  "id": "string",
  "type": "tweet",
  "text": "Tweet content",
  "author": "Author name",
  "url": "https://twitter.com/...",
  "timestamp": 1234567890
}
```

**Link Object:**
```json
{
  "id": "string",
  "type": "link",
  "url": "https://example.com",
  "title": "Page Title",
  "timestamp": 1234567890
}
```
