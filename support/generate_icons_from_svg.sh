#!/bin/bash

echo "Converting SVG to PNG icons..."

# Change to icons directory
cd "$(dirname "$0")/../icons" || exit 1

# Check if we have the required tools
if command -v rsvg-convert &> /dev/null; then
    # Using rsvg-convert (from librsvg)
    rsvg-convert -w 16 -h 16 icon.svg -o icon16.png
    rsvg-convert -w 48 -h 48 icon.svg -o icon48.png
    rsvg-convert -w 128 -h 128 icon.svg -o icon128.png
    echo "✓ Icons generated using rsvg-convert"
elif command -v convert &> /dev/null; then
    # Using ImageMagick
    convert -background none -resize 16x16 icon.svg icon16.png
    convert -background none -resize 48x48 icon.svg icon48.png
    convert -background none -resize 128x128 icon.svg icon128.png
    echo "✓ Icons generated using ImageMagick"
elif command -v qlmanage &> /dev/null; then
    # macOS Quick Look (less ideal but available)
    echo "Using macOS Quick Look thumbnail generation..."

    # Create temporary larger PNG first
    qlmanage -t -s 1024 -o . icon.svg 2>/dev/null

    if [ -f "icon.svg.png" ]; then
        sips -z 16 16 icon.svg.png --out icon16.png >/dev/null 2>&1
        sips -z 48 48 icon.svg.png --out icon48.png >/dev/null 2>&1
        sips -z 128 128 icon.svg.png --out icon128.png >/dev/null 2>&1
        rm icon.svg.png
        echo "✓ Icons generated using macOS tools"
    else
        echo "✗ Could not generate thumbnails"
        exit 1
    fi
else
    echo "✗ No suitable image conversion tool found."
    echo ""
    echo "Please install one of the following:"
    echo "  - librsvg: brew install librsvg"
    echo "  - ImageMagick: brew install imagemagick"
    echo ""
    echo "Or open icon.svg in a browser and take screenshots at different sizes."
    exit 1
fi

echo ""
echo "Generated files:"
ls -lh icon16.png icon48.png icon128.png
