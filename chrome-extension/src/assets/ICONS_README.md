# Icon Assets

This directory should contain the following icon files:

- `icon48.png` - 48x48 pixel icon for Chrome extension
- `icon128.png` - 128x128 pixel icon for Chrome extension

## Creating Icons

You can create simple placeholder icons using:

1. **Online tools**:
   - https://www.favicon-generator.org/
   - https://icon.kitchen/

2. **Design tools**:
   - Figma, Sketch, or Adobe Illustrator
   - Export as PNG at required sizes

3. **Command line** (ImageMagick):
   ```bash
   convert -size 48x48 xc:#4285F4 -fill white -draw "circle 24,24 20,20" icon48.png
   convert -size 128x128 xc:#4285F4 -fill white -draw "circle 64,64 54,54" icon128.png
   ```

## Temporary Solution

For development/testing, you can use any 48x48 and 128x128 PNG files.
Chrome will accept any valid PNG format.
