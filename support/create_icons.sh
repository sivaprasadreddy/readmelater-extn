#!/bin/bash

# Script to create simple icon files for the Chrome extension
# Requires ImageMagick to be installed

if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it first:"
    echo "  macOS: brew install imagemagick"
    echo "  Ubuntu: sudo apt-get install imagemagick"
    echo "  Or create the icons manually using any image editor"
    exit 1
fi

# Create a simple bookmark icon
# Create temporary SVG
cat > temp_icon.svg << 'EOF'
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="#1DA1F2" rx="20"/>
  <path d="M 64 30 L 64 98 L 45 85 L 45 30 Z M 64 30 L 83 30 L 83 85 L 64 98 Z"
        fill="white" stroke="white" stroke-width="2"/>
</svg>
EOF

# Generate icons in different sizes
convert -background none temp_icon.svg -resize 16x16 icon16.png
convert -background none temp_icon.svg -resize 48x48 icon48.png
convert -background none temp_icon.svg -resize 128x128 icon128.png

# Clean up
rm temp_icon.svg

echo "✓ Icons created successfully!"
echo "  - icon16.png"
echo "  - icon48.png"
echo "  - icon128.png"
