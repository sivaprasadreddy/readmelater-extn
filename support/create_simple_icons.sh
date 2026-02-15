#!/bin/bash

# Create simple blue square icons as placeholders
# These are base64-encoded minimal PNG files

# Change to icons directory
cd "$(dirname "$0")/../icons" || exit 1

# 16x16 blue square
echo "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAFklEQVR42mNk+M9QzzCKBlAAjKMBAH4eAxFMxmS8AAAAAElFTkSuQmCC" | base64 -d > icon16.png

# 48x48 blue square
echo "iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGElEQVRoge3BAQ0AAADCIPunfg5qGAAADwYhOAABoNnp0gAAAABJRU5ErkJggg==" | base64 -d > icon48.png

# 128x128 blue square
echo "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAALElEQVR42u3BAQEAAACCIP+vbkhAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQL9AgwAAQGjGI0GAAAAAElFTkSuQmCC" | base64 -d > icon128.png

echo "✓ Created placeholder icons (simple blue squares)"
echo "  - icons/icon16.png"
echo "  - icons/icon48.png"
echo "  - icons/icon128.png"
echo ""
echo "Note: These are simple placeholders. You can replace them with custom icons later."
echo "To create better icons, install Pillow and run: python3 support/create_icons.py"
