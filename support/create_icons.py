#!/usr/bin/env python3
"""
Simple script to create icon files for the Chrome extension.
Requires Pillow: pip install pillow
"""

import os

try:
    from PIL import Image, ImageDraw
except ImportError:
    print("Pillow is not installed. Install it with:")
    print("  pip install pillow")
    exit(1)

# Change to icons directory
script_dir = os.path.dirname(os.path.abspath(__file__))
icons_dir = os.path.join(script_dir, '..', 'icons')
os.chdir(icons_dir)

def create_bookmark_icon(size):
    """Create a simple bookmark icon"""
    # Create image with blue background
    img = Image.new('RGBA', (size, size), (29, 161, 242, 255))
    draw = ImageDraw.Draw(img)

    # Draw a white bookmark shape
    padding = size // 4
    bookmark_width = size - (padding * 2)
    bookmark_height = int(bookmark_width * 1.3)

    left = padding
    top = padding
    right = left + bookmark_width
    bottom = top + bookmark_height

    # Draw bookmark rectangle
    draw.rectangle([left, top, right, bottom], fill='white')

    # Draw triangle cutout at bottom (bookmark point)
    triangle_height = bookmark_width // 3
    center_x = left + bookmark_width // 2
    points = [
        (left, bottom - triangle_height),
        (center_x, bottom),
        (right, bottom - triangle_height)
    ]
    draw.polygon(points, fill=(29, 161, 242, 255))

    return img

# Create icons in different sizes
sizes = {
    'icon16.png': 16,
    'icon48.png': 48,
    'icon128.png': 128
}

for filename, size in sizes.items():
    icon = create_bookmark_icon(size)
    icon.save(filename)
    print(f"✓ Created {filename}")

print("\nIcons created successfully!")
