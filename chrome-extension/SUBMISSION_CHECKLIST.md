# Chrome Web Store Submission Checklist

**Extension:** SIP.js Headless Chrome Extension
**Version:** 1.0.0
**Target:** Chrome Web Store Public Listing

Use this checklist to ensure nothing is missed during the Chrome Web Store submission process.

---

## Phase 1: Pre-Submission Preparation

### 1.1 Developer Account ✅

- [x] Chrome Web Store developer account registered
- [x] $5 registration fee paid
- [x] Developer Agreement accepted
- [x] Email verified
- [x] Publisher display name set

**Status:** ✅ Confirmed (User: "开发者账号已经注册")

---

### 1.2 Extension Package Files

#### Core Files

Check that these files exist and are correct:

**Manifest:**
- [ ] `src/manifest.json` exists
- [ ] Manifest version: 3
- [ ] Name: "SIP.js Headless Chrome Extension" (max 45 chars)
- [ ] Short name: "SIP.js Headless" (max 12 chars)
- [ ] Version: "1.0.0" (semantic versioning)
- [ ] Description: 132 characters or less ✅
- [ ] Icons: 16x16, 48x48, 128x128 all referenced ✅
- [ ] Permissions: Only necessary permissions listed
- [ ] Host permissions: Only `wss://*/*` (no broad `http` or `https`)

**Icons:**
- [ ] `src/assets/icon16.png` exists (866 bytes) ✅
- [ ] `src/assets/icon48.png` exists
- [ ] `src/assets/icon128.png` exists
- [ ] All icons are PNG format
- [ ] All icons have transparent backgrounds (if applicable)
- [ ] Icons are visually consistent

**Code Files:**
- [ ] `src/background.js` - Service Worker
- [ ] `src/offscreen-ua.js` - SIP UserAgent logic
- [ ] `src/offscreen.html` - Offscreen document
- [ ] `src/options.js` - Options page logic
- [ ] `src/options.html` - Options page HTML
- [ ] No console.log or debugging code in production files
- [ ] No hardcoded credentials or API keys
- [ ] All external resources loaded securely (https://)

**Dependencies:**
- [ ] `node_modules/` NOT included in build (dist should be clean)
- [ ] Only production dependencies bundled
- [ ] SIP.js library included and licensed properly

---

### 1.3 Visual Assets

#### Screenshots (5 required, 1280×800 or 640×400)

**Location:** `store-assets/screenshots/`

- [ ] Screenshot 1: `screenshot-01-options-page.png`
  - Shows options/configuration page
  - Contains example/dummy credentials (NOT real passwords)
  - Dimensions: 1280×800 pixels
  - Format: PNG
  - File size: < 5MB

- [ ] Screenshot 2: `screenshot-02-registration.png`
  - Shows DevTools console with successful registration
  - Message visible: "[Offscreen UA] Registered successfully!"
  - Dimensions: 1280×800 pixels
  - Format: PNG
  - File size: < 5MB

- [ ] Screenshot 3: `screenshot-03-incoming-call.png`
  - Shows DevTools console with incoming call logs
  - Message visible: "Incoming call from..."
  - Dimensions: 1280×800 pixels
  - Format: PNG
  - File size: < 5MB

- [ ] Screenshot 4: `screenshot-04-auto-answer.png`
  - Shows DevTools console with auto-answer sequence
  - Messages visible: "Call-Info header detected", "Auto-answering..."
  - Dimensions: 1280×800 pixels
  - Format: PNG
  - File size: < 5MB

- [ ] Screenshot 5: `screenshot-05-architecture.png`
  - Architecture diagram showing: Chrome → Extension → SIP Server
  - Clear visual representation of components
  - Dimensions: 1280×800 pixels
  - Format: PNG
  - File size: < 5MB

**Screenshot Quality Check:**
- [ ] All screenshots are clear and readable
- [ ] No personal information visible (real passwords, emails, phone numbers)
- [ ] Text is legible at full size
- [ ] Screenshots show actual functionality (not mockups)
- [ ] Consistent Chrome theme across all screenshots

**Verify Screenshot Dimensions:**
```bash
cd store-assets/screenshots
sips -g pixelWidth -g pixelHeight *.png
# All should show 1280×800 (or 640×400)
```

#### Promotional Image (1 required, 440×280)

**Location:** `store-assets/promotional/`

- [ ] File: `promo-small-440x280.png`
- [ ] Dimensions: Exactly 440×280 pixels
- [ ] Format: PNG or JPEG
- [ ] File size: < 1MB
- [ ] Contains extension name
- [ ] Contains tagline or key feature
- [ ] Professional design, high contrast
- [ ] Readable at thumbnail size
- [ ] No copyrighted material without permission

**Verify Promotional Image Dimensions:**
```bash
cd store-assets/promotional
sips -g pixelWidth -g pixelHeight promo-small-440x280.png
# Should show: pixelWidth: 440, pixelHeight: 280
```

---

### 1.4 Store Listing Content

**Location:** `store-assets/store-listing.txt`

- [ ] **Short Description** (max 132 characters):
  - Clear and concise
  - Describes main functionality
  - No special characters or emojis (unless intentional)
  - Currently: "Headless SIP/WebRTC client for automated calling. Auto-answer, remote control, BroadSoft support. Monitor via DevTools console." ✅

- [ ] **Detailed Description** (max 16,000 characters):
  - Introduction paragraph
  - Key features listed (bullet points or numbered)
  - Use cases explained
  - How to use (basic instructions)
  - Support/documentation links
  - No misleading claims
  - No promotional language ("best", "must-have", etc. - Chrome dislikes this)
  - Proper formatting (line breaks, bold, italics using markdown-like syntax)

- [ ] **Category**:
  - Selected: "Productivity" or "Developer Tools" (choose one)

- [ ] **Language**:
  - Primary language: English (en)
  - Additional languages: (if applicable)

---

### 1.5 Documentation and Policies

#### Privacy Policy ✅

- [x] Privacy policy created: `PRIVACY_POLICY.md` ✅
- [ ] Privacy policy publicly accessible:
  - [ ] Hosted on GitHub Pages, or
  - [ ] Hosted on project website, or
  - [ ] Included in extension and linked via manifest
- [ ] Privacy policy URL noted for submission:
  - Example: `https://github.com/onsip/SIP.js/blob/main/chrome-extension/PRIVACY_POLICY.md`

**Privacy Policy Requirements:**
- Explains what data is collected (SIP credentials, configuration)
- Explains where data is stored (chrome.storage.sync, local browser only)
- Explains how data is used (only for SIP server connection)
- Explains data sharing (data not shared with third parties except SIP server)
- User control over data (can delete via extension options or uninstall)

#### Support Resources

- [ ] **Homepage URL:**
  - Example: `https://github.com/onsip/SIP.js`

- [ ] **Support URL/Email:**
  - GitHub issues: `https://github.com/onsip/SIP.js/issues`
  - Or support email: (if available)

- [ ] User Manual available: `USER_MANUAL.md` ✅

- [ ] Installation Guide available: `INSTALLATION.md` ✅

---

### 1.6 Testing

#### Functionality Testing

- [ ] Extension loads without errors in Chrome
- [ ] Extension loads without errors in Microsoft Edge
- [ ] Options page opens and saves configuration correctly
- [ ] SIP registration works with valid credentials
- [ ] Incoming calls are detected and logged
- [ ] Auto-answer works (if Call-Info header present)
- [ ] Extension reconnects after network disruption
- [ ] Extension persists after browser restart
- [ ] No console errors during normal operation
- [ ] Performance: No excessive CPU or memory usage

#### Security Testing

- [ ] No credentials logged to console
- [ ] All network connections use WSS (secure WebSocket)
- [ ] Content Security Policy (CSP) is appropriate
- [ ] No eval() or unsafe-inline code
- [ ] No remote code execution vulnerabilities
- [ ] Permissions are minimal (principle of least privilege)

#### Compatibility Testing

Test on:
- [ ] Chrome 99+ (latest stable)
- [ ] Chrome Beta (if possible)
- [ ] Microsoft Edge 99+ (latest stable)

Test on operating systems:
- [ ] Windows 10/11
- [ ] macOS (latest)
- [ ] Linux (Ubuntu or similar)

---

## Phase 2: Building and Packaging

### 2.1 Production Build

**Build Steps:**

```bash
cd /Users/rasonyang/workspaces/SIP.js/chrome-extension

# Clean previous builds
rm -rf dist/

# Install dependencies (if needed)
npm install

# Run production build
npm run build

# Verify build output
ls -lh dist/
```

**Build Output Check:**
- [ ] `dist/` folder created
- [ ] `dist/manifest.json` exists
- [ ] All JavaScript files present in `dist/`
- [ ] All HTML files present in `dist/`
- [ ] `dist/assets/` folder with all icons
- [ ] No source maps (`.map` files) in production build
- [ ] No `node_modules/` in dist/
- [ ] File sizes are reasonable (total < 50MB, preferably < 10MB)

**Check File Sizes:**
```bash
du -sh dist/
# Should be reasonable (< 10MB ideal)
```

---

### 2.2 Create ZIP Package

**Packaging Steps:**

```bash
cd dist

# Create ZIP package (this is what you'll upload to Chrome Web Store)
zip -r ../sip-extension-v1.0.0.zip . -x "*.DS_Store" -x "__MACOSX/*"

cd ..

# Verify ZIP contents
unzip -l sip-extension-v1.0.0.zip
```

**ZIP Package Check:**
- [ ] ZIP file created: `sip-extension-v1.0.0.zip`
- [ ] ZIP contains `manifest.json` at root level (not in subfolder)
- [ ] All required files present in ZIP
- [ ] No unnecessary files (`.DS_Store`, `Thumbs.db`, `.git/`)
- [ ] ZIP file size: < 100MB (Chrome Web Store limit)

**Verify ZIP Structure:**
```bash
unzip -l sip-extension-v1.0.0.zip | head -20

# Should show:
# manifest.json
# background.js
# offscreen-ua.js
# offscreen.html
# options.html
# options.js
# assets/icon16.png
# assets/icon48.png
# assets/icon128.png
# (other files...)
```

**Calculate ZIP Hash (for verification):**
```bash
shasum -a 256 sip-extension-v1.0.0.zip
# Save this hash for future reference
```

---

### 2.3 Test ZIP Package Locally

Before submitting, test the ZIP package:

1. **Load Unpacked:**
   - Extract ZIP to temporary folder: `unzip sip-extension-v1.0.0.zip -d /tmp/test-extension`
   - Open Chrome: `chrome://extensions`
   - Enable Developer mode
   - Click "Load unpacked"
   - Select `/tmp/test-extension`
   - [ ] Extension loads successfully
   - [ ] No errors in console
   - [ ] Options page works
   - [ ] Can configure and test SIP registration

2. **Clean Up:**
   ```bash
   rm -rf /tmp/test-extension
   ```

---

## Phase 3: Chrome Web Store Submission

### 3.1 Access Developer Console

- [ ] Visit: https://chrome.google.com/webstore/devconsole
- [ ] Sign in with Google account (developer account)
- [ ] Developer console loads successfully

---

### 3.2 Create New Item

- [ ] Click "**New Item**" button (top-right)
- [ ] Upload ZIP file: `sip-extension-v1.0.0.zip`
- [ ] Wait for upload to complete (progress bar reaches 100%)
- [ ] Click "**Upload**" or "**Save Draft**"
- [ ] No upload errors (if errors, fix and re-upload)

**Common Upload Errors:**
- Manifest errors: Check manifest.json syntax
- Missing icons: Verify all icon files are in ZIP
- Excessive permissions: Review permissions in manifest.json
- CSP violations: Check Content-Security-Policy

---

### 3.3 Fill Store Listing

#### Product Details Tab

**Basic Information:**
- [ ] **Extension Name:** "SIP.js Headless Chrome Extension"
  - Matches manifest.json name
  - Clear and descriptive
  - No version number in name

- [ ] **Short Description:** (copy from `store-assets/store-listing.txt`)
  - 132 characters or less
  - Accurately describes functionality

- [ ] **Detailed Description:** (copy from `store-assets/store-listing.txt`)
  - Formatted with line breaks
  - Includes features, use cases, instructions
  - Links to documentation
  - No promotional language

- [ ] **Category:**
  - Select: **Productivity** (or **Developer Tools**)

- [ ] **Language:**
  - Primary: **English**

**Graphics:**
- [ ] **Icon:** (automatically pulled from manifest, verify it displays correctly)

- [ ] **Screenshots:** Upload all 5
  1. Upload `screenshot-01-options-page.png`
  2. Upload `screenshot-02-registration.png`
  3. Upload `screenshot-03-incoming-call.png`
  4. Upload `screenshot-04-auto-answer.png`
  5. Upload `screenshot-05-architecture.png`
  - [ ] All screenshots uploaded successfully
  - [ ] Screenshots display correctly in preview
  - [ ] Order is logical (options page first, then usage examples)

- [ ] **Promotional Images:**
  - Upload: `promo-small-440x280.png` (Small tile)
  - [ ] Image displays correctly in preview
  - [ ] Image is readable at thumbnail size

**Additional Information:**
- [ ] **Official URL:** (optional)
  - Example: `https://github.com/onsip/SIP.js`

- [ ] **Homepage URL:**
  - Example: `https://github.com/onsip/SIP.js`

- [ ] **Support URL:**
  - Example: `https://github.com/onsip/SIP.js/issues`

---

#### Privacy Tab

- [ ] **Single Purpose:** (select one)
  - Example: "Provide SIP/WebRTC calling functionality"
  - Be specific and honest

- [ ] **Permission Justifications:**

  For each permission in manifest.json, provide justification:

  - **storage:** "Store user's SIP configuration (username, password, server URL) locally in the browser."

  - **alarms:** "Keep Service Worker alive to maintain persistent SIP connection."

  - **offscreen:** "Create offscreen documents for WebRTC audio playback (required for headless audio handling)."

  - **Host permission (wss://*/*):** "Connect to user's SIP server via secure WebSocket (WSS) for SIP registration and call handling."

- [ ] **Data Usage:**
  - [ ] "This extension does NOT collect or transmit user data."
  - [ ] All data stored locally in browser (chrome.storage.sync)
  - [ ] Only communicates with user's specified SIP server
  - [ ] No analytics, no tracking, no third-party data sharing

- [ ] **Privacy Policy URL:**
  - Enter: `https://github.com/onsip/SIP.js/blob/main/chrome-extension/PRIVACY_POLICY.md`
  - [ ] URL is publicly accessible
  - [ ] Privacy policy is up-to-date

- [ ] **Remote Code:**
  - Select: **No** (extension does not load remote code)
  - All code is bundled in the extension package

---

#### Distribution Tab

- [ ] **Visibility:**
  - Select: **Public**
  - (User confirmed: public listing)

- [ ] **Regions:**
  - Select: **All regions** (or select specific countries if needed)

- [ ] **Pricing:**
  - Select: **Free** (no in-app purchases)

---

### 3.4 Preview and Save

- [ ] Click "**Preview**" button (top-right)
- [ ] Review extension listing as it will appear to users
- [ ] Check all text is formatted correctly
- [ ] Check all images display properly
- [ ] Check no typos or errors
- [ ] Click "**Save Draft**" to save changes

---

### 3.5 Submit for Review

- [ ] Click "**Submit for Review**" button
- [ ] Confirm submission in dialog
- [ ] Submission confirmation message appears
- [ ] Status changes to "**Pending Review**"

**Post-Submission:**
- [ ] Note submission date and time
- [ ] Check email for confirmation from Chrome Web Store
- [ ] Save extension ID (will be provided after submission)

**Expected Timeline:**
- Review time: 1-3 days (sometimes up to 5 days)
- Check status daily: Chrome Web Store Developer Console

---

## Phase 4: During Review

### 4.1 Monitor Status

- [ ] Check developer console daily: https://chrome.google.com/webstore/devconsole
- [ ] Check email for updates from `chromewebstore-noreply@google.com`
- [ ] Status will change from "Pending Review" to:
  - **Published** (approved), or
  - **Rejected** (requires changes)

---

### 4.2 If Rejected

If extension is rejected, reviewers will provide reasons:

**Common Rejection Reasons:**
1. **Misleading Description:** Description doesn't match functionality
2. **Excessive Permissions:** Requesting more permissions than needed
3. **Privacy Policy Issues:** Missing or incomplete privacy policy
4. **Functionality Issues:** Extension doesn't work as described
5. **Minimum Functionality:** Extension deemed too simple or not useful
6. **Spam/Keyword Stuffing:** Description contains excessive keywords

**Response Steps:**
- [ ] Read rejection email carefully
- [ ] Identify specific issues cited
- [ ] Fix issues in code, listing, or documentation
- [ ] Update ZIP package if code changes are needed
- [ ] Re-upload and re-submit
- [ ] Add notes for reviewer explaining changes made

---

### 4.3 Reviewer Questions

If reviewers have questions:

- [ ] Check email for messages from Chrome Web Store team
- [ ] Respond promptly (within 7 days)
- [ ] Provide clear, detailed explanations
- [ ] Provide demo credentials if needed (for testing SIP functionality)
- [ ] Provide screenshots or videos demonstrating functionality

**Prepared Responses:** (see `store-assets/store-listing.txt` → Reviewer Questions section)

---

## Phase 5: Post-Publication

### 5.1 Verify Publication

Once status changes to "Published":

- [ ] Extension appears in Chrome Web Store
- [ ] Extension URL: `https://chrome.google.com/webstore/detail/[EXTENSION_ID]`
- [ ] Extension can be installed via "Add to Chrome" button
- [ ] Extension listing displays correctly:
  - [ ] All screenshots visible
  - [ ] Promotional image displays
  - [ ] Description formatted correctly
  - [ ] Links work (homepage, support)

**Test Installation:**
- [ ] Click "Add to Chrome" from Web Store listing
- [ ] Extension installs successfully
- [ ] Options page opens automatically
- [ ] Can configure and use extension
- [ ] Automatic updates work (check chrome://extensions)

---

### 5.2 Save Extension Information

**Record for future reference:**

- [ ] **Extension ID:** (from Web Store URL)
  - Format: `abcdefghijklmnopqrstuvwxyzabcdef` (32 characters)
  - Save to: Project README.md or WEBSTORE_PUBLICATION_INFO.txt

- [ ] **Chrome Web Store URL:**
  - Example: `https://chrome.google.com/webstore/detail/sip-js-headless-chrome-ex/[EXTENSION_ID]`

- [ ] **Publication Date:** (note date extension went live)

- [ ] **Initial Version:** 1.0.0

---

### 5.3 Update Documentation

**Update these files with Chrome Web Store URL:**

**README.md:**
```markdown
## For End Users

### Installation Options

**Option 1: Chrome Web Store (Recommended)**

🌐 **[Install from Chrome Web Store](https://chrome.google.com/webstore/detail/[EXTENSION_ID])**
```

- [ ] Update README.md with Web Store URL
- [ ] Update INSTALLATION.md with Web Store URL
- [ ] Update USER_MANUAL.md with Web Store URL
- [ ] Update QUICK_INSTALL.md with Web Store URL

**Commit changes:**
```bash
git add README.md INSTALLATION.md USER_MANUAL.md QUICK_INSTALL.md
git commit -m "docs: add Chrome Web Store installation links"
git push origin main
```

---

### 5.4 Create GitHub Release

- [ ] Create GitHub release for v1.0.0
- [ ] Tag: `v1.0.0`
- [ ] Release title: "v1.0.0 - Initial Chrome Web Store Release"
- [ ] Release notes: (copy from CHANGELOG.md)
- [ ] Attach files:
  - [ ] `sip-extension-v1.0.0.zip` (for reference)
  - [ ] `sip-extension-v1.0.0.crx` (if available, for manual installation)

---

### 5.5 Announce Release

**Optional:**
- [ ] Post announcement on project website
- [ ] Share on social media (if applicable)
- [ ] Notify existing users (if mailing list exists)
- [ ] Update project documentation sites

---

## Phase 6: Post-Publication Monitoring

### 6.1 Monitor User Feedback

- [ ] Check Chrome Web Store reviews daily (first week)
- [ ] Respond to user reviews (especially negative ones)
- [ ] Track common issues or feature requests
- [ ] Update USER_MANUAL.md FAQ based on user questions

**Check Reviews:**
- Visit: `https://chrome.google.com/webstore/detail/[EXTENSION_ID]/reviews`
- Respond to reviews via Developer Console

---

### 6.2 Monitor Metrics

**Chrome Web Store Developer Console provides:**
- Install count
- Weekly active users
- Uninstall count
- Crash reports

- [ ] Check metrics weekly
- [ ] Track install/uninstall trends
- [ ] Investigate crashes or high uninstall rates

---

### 6.3 Plan Updates

**Future releases:**
- [ ] Set up automatic update mechanism (version bumps in manifest)
- [ ] Test updates thoroughly before publishing
- [ ] Update Chrome Web Store listing if features change
- [ ] Maintain CHANGELOG.md with version history

**Update Process:**
1. Increment version in `src/manifest.json` (e.g., 1.0.0 → 1.1.0)
2. Build and package new ZIP
3. Upload to Developer Console → Select existing extension → Upload updated package
4. Fill "What's new in this version" field
5. Submit for review (usually faster for updates: 1-2 days)

---

## Quick Reference

### Important URLs

- **Developer Console:** https://chrome.google.com/webstore/devconsole
- **Extension URL:** `https://chrome.google.com/webstore/detail/[EXTENSION_ID]` (fill after publication)
- **Privacy Policy:** https://github.com/onsip/SIP.js/blob/main/chrome-extension/PRIVACY_POLICY.md
- **Support:** https://github.com/onsip/SIP.js/issues

### File Locations

- **ZIP Package:** `sip-extension-v1.0.0.zip`
- **Screenshots:** `store-assets/screenshots/*.png` (5 files)
- **Promotional Image:** `store-assets/promotional/promo-small-440x280.png`
- **Store Listing Text:** `store-assets/store-listing.txt`

### Commands

**Build and Package:**
```bash
cd /Users/rasonyang/workspaces/SIP.js/chrome-extension
npm run build
cd dist && zip -r ../sip-extension-v1.0.0.zip . && cd ..
```

**Verify Assets:**
```bash
cd store-assets/screenshots
sips -g pixelWidth -g pixelHeight *.png

cd ../promotional
sips -g pixelWidth -g pixelHeight promo-small-440x280.png
```

**Check ZIP:**
```bash
unzip -l sip-extension-v1.0.0.zip | head -20
shasum -a 256 sip-extension-v1.0.0.zip
```

---

## Troubleshooting

### Submission Fails

**Error: "Manifest is invalid"**
- Check `src/manifest.json` syntax (use JSON validator)
- Ensure all required fields are present
- Verify icon file paths are correct

**Error: "Missing required icons"**
- Verify icon16.png, icon48.png, icon128.png exist in dist/assets/
- Check file names match manifest.json exactly (case-sensitive)

**Error: "Package is too large"**
- ZIP must be < 100MB
- Check for unnecessary files (node_modules, source maps)
- Compress assets if needed

### Review Takes Too Long

- Normal: 1-3 days
- If > 5 days: Check spam folder for emails from Chrome Web Store
- If > 7 days: Contact Chrome Web Store support

### Extension Rejected

- Read rejection email carefully
- Check "Common Rejection Reasons" above
- Fix issues and resubmit
- Provide detailed response to reviewers

---

## Completion Status

**Current Progress:** ⏳ Assets pending creation

### Completed ✅
- [x] Developer account registered
- [x] Manifest optimized
- [x] Icons generated (16x16, 48x48, 128x128)
- [x] Privacy policy created
- [x] Documentation updated
- [x] Store listing text prepared
- [x] Guides created (screenshot, promotional, publishing)

### Pending ⏳
- [ ] Create 5 screenshots (1-2 hours)
- [ ] Design promotional image (2-3 hours)
- [ ] Build production package (30 minutes)
- [ ] Submit to Chrome Web Store (1 hour)
- [ ] Wait for review (1-3 days)

---

**Ready to submit?** Follow Phase 3 steps after creating all required visual assets.

Good luck with your Chrome Web Store submission! 🚀
