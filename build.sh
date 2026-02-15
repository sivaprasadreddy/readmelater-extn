#!/bin/bash

set -e

echo "Building Read Me Later Extension..."

# Get version from manifest.json
VERSION=$(grep -o '"version": *"[^"]*"' manifest.json | grep -o '[0-9.]*')
echo "Version: $VERSION"

# Create build directory
BUILD_DIR="extension-package"
rm -rf "$BUILD_DIR"
mkdir -p "$BUILD_DIR"

echo "Copying extension files..."

# Copy core files
cp manifest.json "$BUILD_DIR/"
cp background.js "$BUILD_DIR/"
cp content.js "$BUILD_DIR/"
cp content.css "$BUILD_DIR/"
cp context-menu-handler.js "$BUILD_DIR/"

# Copy directories
cp -r popup "$BUILD_DIR/"
cp -r icons "$BUILD_DIR/"

# Create zip file
OUTPUT_FILE="readmelater-extension-v${VERSION}.zip"
rm -f "$OUTPUT_FILE"

echo "Creating zip package..."
cd "$BUILD_DIR"
zip -r ../"$OUTPUT_FILE" . -x "*.DS_Store"
cd ..

# Generate checksum
echo "Generating SHA256 checksum..."
shasum -a 256 "$OUTPUT_FILE" > "${OUTPUT_FILE%.zip}-checksum.txt"

echo ""
echo "✓ Build complete!"
echo "  Package: $OUTPUT_FILE"
echo "  Size: $(ls -lh "$OUTPUT_FILE" | awk '{print $5}')"
echo "  Checksum: ${OUTPUT_FILE%.zip}-checksum.txt"
echo ""
cat "${OUTPUT_FILE%.zip}-checksum.txt"

# Cleanup
rm -rf "$BUILD_DIR"

echo ""
echo "To test the extension:"
echo "1. Go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Drag and drop $OUTPUT_FILE onto the page"
