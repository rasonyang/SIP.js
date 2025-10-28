#!/bin/bash

################################################################################
# Chrome Web Store Build and Package Script
################################################################################
#
# This script builds the extension and creates a ZIP package ready for
# Chrome Web Store submission.
#
# Usage:
#   ./scripts/build-webstore.sh [version]
#
# Example:
#   ./scripts/build-webstore.sh 1.0.0
#
# If no version is provided, it reads from src/manifest.json
#
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Icons
CHECK="${GREEN}✓${NC}"
CROSS="${RED}✗${NC}"
ARROW="${BLUE}→${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Chrome Web Store Build & Package Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

################################################################################
# 1. Check prerequisites
################################################################################

echo "📋 Checking prerequisites..."
echo ""

# Check if we're in the right directory
if [ ! -f "src/manifest.json" ]; then
    echo -e "${CROSS} Error: src/manifest.json not found"
    echo "   Please run this script from the chrome-extension directory"
    exit 1
fi
echo -e "${CHECK} Found src/manifest.json"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${CROSS} Error: npm is not installed"
    echo "   Please install Node.js and npm first"
    exit 1
fi
echo -e "${CHECK} npm is installed ($(npm --version))"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠${NC}  node_modules not found, running npm install..."
    npm install
    echo -e "${CHECK} Dependencies installed"
else
    echo -e "${CHECK} node_modules exists"
fi

# Check if zip is installed
if ! command -v zip &> /dev/null; then
    echo -e "${CROSS} Error: zip command not found"
    echo "   Please install zip utility"
    exit 1
fi
echo -e "${CHECK} zip utility is installed"

echo ""

################################################################################
# 2. Get version number
################################################################################

echo "🔢 Determining version..."
echo ""

if [ -n "$1" ]; then
    VERSION="$1"
    echo -e "${ARROW} Version provided via argument: ${BLUE}$VERSION${NC}"
else
    # Extract version from manifest.json
    VERSION=$(grep -o '"version": "[^"]*' src/manifest.json | grep -o '[^"]*$')
    if [ -z "$VERSION" ]; then
        echo -e "${CROSS} Error: Could not read version from src/manifest.json"
        exit 1
    fi
    echo -e "${ARROW} Version from manifest.json: ${BLUE}$VERSION${NC}"
fi

PACKAGE_NAME="sip-extension-v${VERSION}.zip"
echo -e "${ARROW} Package name: ${BLUE}$PACKAGE_NAME${NC}"

echo ""

################################################################################
# 3. Clean previous builds
################################################################################

echo "🧹 Cleaning previous builds..."
echo ""

if [ -d "dist" ]; then
    echo -e "${ARROW} Removing dist/ directory..."
    rm -rf dist/
    echo -e "${CHECK} dist/ removed"
fi

if [ -f "$PACKAGE_NAME" ]; then
    echo -e "${ARROW} Removing existing $PACKAGE_NAME..."
    rm -f "$PACKAGE_NAME"
    echo -e "${CHECK} $PACKAGE_NAME removed"
fi

# Remove any other zip files (old versions)
if ls sip-extension-v*.zip 1> /dev/null 2>&1; then
    echo -e "${ARROW} Removing old zip packages..."
    rm -f sip-extension-v*.zip
    echo -e "${CHECK} Old packages removed"
fi

echo ""

################################################################################
# 4. Run production build
################################################################################

echo "🔨 Building extension..."
echo ""

echo -e "${ARROW} Running: ${BLUE}npm run build${NC}"
echo ""

if npm run build; then
    echo ""
    echo -e "${CHECK} Build completed successfully"
else
    echo ""
    echo -e "${CROSS} Build failed"
    exit 1
fi

echo ""

################################################################################
# 5. Verify build output
################################################################################

echo "🔍 Verifying build output..."
echo ""

# Check if dist/ was created
if [ ! -d "dist" ]; then
    echo -e "${CROSS} Error: dist/ directory not created"
    exit 1
fi
echo -e "${CHECK} dist/ directory exists"

# Check for required files
REQUIRED_FILES=(
    "dist/manifest.json"
    "dist/background.js"
    "dist/offscreen-ua.js"
    "dist/offscreen.html"
    "dist/options.html"
    "dist/options.js"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${CROSS} Error: Required file missing: $file"
        exit 1
    fi
done
echo -e "${CHECK} All required files present"

# Check for icons
REQUIRED_ICONS=(
    "dist/assets/icon16.png"
    "dist/assets/icon48.png"
    "dist/assets/icon128.png"
)

for icon in "${REQUIRED_ICONS[@]}"; do
    if [ ! -f "$icon" ]; then
        echo -e "${CROSS} Error: Required icon missing: $icon"
        exit 1
    fi
done
echo -e "${CHECK} All required icons present"

# Check dist/ size
DIST_SIZE=$(du -sh dist/ | cut -f1)
echo -e "${ARROW} Build size: ${BLUE}$DIST_SIZE${NC}"

echo ""

################################################################################
# 6. Create ZIP package
################################################################################

echo "📦 Creating ZIP package..."
echo ""

echo -e "${ARROW} Creating: ${BLUE}$PACKAGE_NAME${NC}"
echo ""

# Create ZIP from dist/ contents (not including dist/ folder itself)
cd dist
if zip -r ../"$PACKAGE_NAME" . -x "*.DS_Store" -x "__MACOSX/*" -x "*.map"; then
    cd ..
    echo ""
    echo -e "${CHECK} ZIP package created successfully"
else
    cd ..
    echo ""
    echo -e "${CROSS} Failed to create ZIP package"
    exit 1
fi

echo ""

################################################################################
# 7. Verify ZIP package
################################################################################

echo "✅ Verifying ZIP package..."
echo ""

# Check if ZIP was created
if [ ! -f "$PACKAGE_NAME" ]; then
    echo -e "${CROSS} Error: ZIP file not created"
    exit 1
fi
echo -e "${CHECK} ZIP file exists: $PACKAGE_NAME"

# Get ZIP file size
ZIP_SIZE=$(du -h "$PACKAGE_NAME" | cut -f1)
ZIP_SIZE_BYTES=$(stat -f%z "$PACKAGE_NAME" 2>/dev/null || stat -c%s "$PACKAGE_NAME" 2>/dev/null)
ZIP_SIZE_MB=$(echo "scale=2; $ZIP_SIZE_BYTES / 1024 / 1024" | bc)

echo -e "${ARROW} ZIP file size: ${BLUE}${ZIP_SIZE} (${ZIP_SIZE_MB} MB)${NC}"

# Check if size is reasonable (< 100MB is Chrome Web Store limit)
if (( $(echo "$ZIP_SIZE_MB > 100" | bc -l) )); then
    echo -e "${YELLOW}⚠${NC}  Warning: ZIP file is larger than 100MB (Chrome Web Store limit)"
    echo "   You may need to optimize your package"
fi

# List ZIP contents (first 20 files)
echo ""
echo -e "${ARROW} ZIP contents (first 20 files):"
echo ""
unzip -l "$PACKAGE_NAME" | head -25

# Check if manifest.json is at root level (not in subfolder)
if unzip -l "$PACKAGE_NAME" | grep -q "^.*manifest.json$"; then
    if unzip -l "$PACKAGE_NAME" | grep -q "^[^/]*manifest.json$"; then
        echo ""
        echo -e "${CHECK} manifest.json is at root level (correct)"
    else
        echo ""
        echo -e "${CROSS} Error: manifest.json is in a subdirectory"
        echo "   Chrome Web Store requires manifest.json at root level"
        exit 1
    fi
else
    echo ""
    echo -e "${CROSS} Error: manifest.json not found in ZIP"
    exit 1
fi

echo ""

################################################################################
# 8. Calculate checksums
################################################################################

echo "🔐 Calculating checksums..."
echo ""

# SHA-256 checksum
if command -v shasum &> /dev/null; then
    SHA256=$(shasum -a 256 "$PACKAGE_NAME" | cut -d' ' -f1)
    echo -e "${ARROW} SHA-256: ${BLUE}$SHA256${NC}"
elif command -v sha256sum &> /dev/null; then
    SHA256=$(sha256sum "$PACKAGE_NAME" | cut -d' ' -f1)
    echo -e "${ARROW} SHA-256: ${BLUE}$SHA256${NC}"
else
    echo -e "${YELLOW}⚠${NC}  shasum/sha256sum not found, skipping checksum"
fi

# MD5 checksum (optional)
if command -v md5 &> /dev/null; then
    MD5=$(md5 -q "$PACKAGE_NAME")
    echo -e "${ARROW} MD5:     ${BLUE}$MD5${NC}"
elif command -v md5sum &> /dev/null; then
    MD5=$(md5sum "$PACKAGE_NAME" | cut -d' ' -f1)
    echo -e "${ARROW} MD5:     ${BLUE}$MD5${NC}"
fi

echo ""

################################################################################
# 9. Summary
################################################################################

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Package Ready for Chrome Web Store Submission"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "📁 Package:     ${GREEN}$PACKAGE_NAME${NC}"
echo -e "📊 Size:        ${GREEN}$ZIP_SIZE (${ZIP_SIZE_MB} MB)${NC}"
echo -e "🏷️  Version:     ${GREEN}$VERSION${NC}"
if [ -n "$SHA256" ]; then
    echo -e "🔐 SHA-256:     ${GREEN}${SHA256:0:16}...${NC}"
fi
echo ""

################################################################################
# 10. Next steps
################################################################################

echo "📝 Next Steps:"
echo ""
echo "1. Verify package contents:"
echo -e "   ${BLUE}unzip -l $PACKAGE_NAME${NC}"
echo ""
echo "2. Test package locally (optional):"
echo -e "   ${BLUE}unzip $PACKAGE_NAME -d /tmp/test-extension${NC}"
echo "   Then load /tmp/test-extension in chrome://extensions"
echo ""
echo "3. Submit to Chrome Web Store:"
echo "   a. Visit: https://chrome.google.com/webstore/devconsole"
echo "   b. Click: \"New Item\""
echo -e "   c. Upload: ${GREEN}$PACKAGE_NAME${NC}"
echo "   d. Fill store listing (use store-assets/store-listing.txt)"
echo "   e. Upload screenshots and promotional image"
echo "   f. Submit for review"
echo ""
echo "4. For detailed submission steps, see:"
echo -e "   ${BLUE}CHROME_WEBSTORE_PUBLISHING.md${NC}"
echo -e "   ${BLUE}SUBMISSION_CHECKLIST.md${NC}"
echo ""

################################################################################
# 11. Asset reminders
################################################################################

# Check if screenshots exist
SCREENSHOTS_EXIST=true
for i in {1..5}; do
    SCREENSHOT_FILE="store-assets/screenshots/screenshot-0${i}-*.png"
    if ! ls $SCREENSHOT_FILE 1> /dev/null 2>&1; then
        SCREENSHOTS_EXIST=false
        break
    fi
done

# Check if promotional image exists
PROMO_EXIST=false
if [ -f "store-assets/promotional/promo-small-440x280.png" ]; then
    PROMO_EXIST=true
fi

if [ "$SCREENSHOTS_EXIST" = false ] || [ "$PROMO_EXIST" = false ]; then
    echo "⚠️  Asset Reminders:"
    echo ""

    if [ "$SCREENSHOTS_EXIST" = false ]; then
        echo -e "${YELLOW}⚠${NC}  Screenshots not found in store-assets/screenshots/"
        echo "   You need 5 screenshots (1280×800) for Chrome Web Store"
        echo -e "   See: ${BLUE}store-assets/SCREENSHOT_GUIDE.md${NC}"
        echo ""
    fi

    if [ "$PROMO_EXIST" = false ]; then
        echo -e "${YELLOW}⚠${NC}  Promotional image not found: store-assets/promotional/promo-small-440x280.png"
        echo "   You need 1 promotional image (440×280) for Chrome Web Store"
        echo -e "   See: ${BLUE}store-assets/PROMOTIONAL_IMAGE_GUIDE.md${NC}"
        echo ""
    fi
else
    echo "🎨 Assets Status:"
    echo ""
    echo -e "${CHECK} Screenshots ready (5 found)"
    echo -e "${CHECK} Promotional image ready"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "✨ ${GREEN}Build completed successfully!${NC} Package is ready for submission."
echo ""
