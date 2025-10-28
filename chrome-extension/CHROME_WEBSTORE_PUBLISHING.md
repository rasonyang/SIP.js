# Chrome Web Store Publishing Guide

Complete step-by-step guide for publishing and maintaining the SIP.js Headless Chrome Extension on the Chrome Web Store.

**Version:** 1.0.0
**Last Updated:** October 28, 2024

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Asset Preparation](#asset-preparation)
4. [Developer Account Setup](#developer-account-setup)
5. [Building the Extension](#building-the-extension)
6. [Submission Process](#submission-process)
7. [Review Process](#review-process)
8. [Post-Publication](#post-publication)
9. [Updating the Extension](#updating-the-extension)
10. [Troubleshooting](#troubleshooting)

---

## Overview

### Why Publish to Chrome Web Store?

**Benefits:**
- ✅ Simplified installation (no Developer mode required)
- ✅ Automatic updates pushed to all users
- ✅ Increased credibility and discoverability
- ✅ Official Chrome Web Store badge
- ✅ Free hosting and distribution

**Considerations:**
- Review process takes 1-3 business days per submission
- Must maintain compliance with Chrome Web Store policies
- Updates require review before going live

### Current Status

**Completed:**
- ✅ Manifest V3 compliant
- ✅ Icons (16x16, 48x48, 128x128)
- ✅ Privacy policy
- ✅ User documentation
- ✅ Store listing text prepared

**Needed:**
- ⏳ Screenshots (5 images, 1280x800)
- ⏳ Promotional image (440x280)
- ⏳ Developer account registration
- ⏳ Final submission

---

## Prerequisites

### Requirements

1. **Google Account**
   - Personal or Google Workspace account
   - Will be used for developer console access

2. **Payment Method**
   - Credit or debit card
   - For $5 one-time registration fee

3. **Assets**
   - Screenshots (1-5 images)
   - Promotional image (440x280 minimum)
   - Extension package (ZIP file)

4. **Time**
   - Asset creation: 4-6 hours
   - Submission: 1-2 hours
   - Review wait: 1-3 business days

---

## Asset Preparation

### Icons (Already Complete ✅)

- 16x16: `src/assets/icon16.png` ✅
- 48x48: `src/assets/icon48.png` ✅
- 128x128: `src/assets/icon128.png` ✅

### Screenshots (To Create)

Create 5 screenshots (1280x800 or 640x400 pixels):

**1. Options Page Configuration**
```
What to show:
- Extension options page
- Configuration form with labeled fields
- Example values (use dummy data, not real credentials)
- Clean, professional appearance

How to capture:
1. Open extension: chrome://extensions → Details → Extension options
2. Fill in example values
3. Take screenshot: Cmd+Shift+4 (macOS) or Windows+Shift+S (Windows)
4. Save as: store-assets/screenshots/screenshot-01-options-page.png
```

**2. DevTools Console - Registration Success**
```
What to show:
- Chrome DevTools Console tab open
- Log message: "[Offscreen UA] Registered successfully!"
- Timestamp and other relevant SIP log entries
- Clean console without errors

How to capture:
1. Configure extension with valid SIP credentials
2. Open DevTools: Right-click → Inspect → Console tab
3. Wait for successful registration
4. Take screenshot of console
5. Save as: store-assets/screenshots/screenshot-02-registration.png
```

**3. DevTools Console - Incoming Call**
```
What to show:
- Console showing incoming call detection
- Caller information
- Ringtone playback message
- Call handling logs

How to capture:
1. Initiate an incoming call to the extension
2. Capture console logs showing call detection
3. Save as: store-assets/screenshots/screenshot-03-incoming-call.png
```

**4. DevTools Console - Auto-Answer**
```
What to show:
- Call-Info header detection log
- Auto-answer countdown message
- Call answered confirmation

How to capture:
1. Initiate call with Call-Info header
2. Capture auto-answer sequence in console
3. Save as: store-assets/screenshots/screenshot-04-auto-answer.png
```

**5. Architecture or Workflow Diagram**
```
What to show:
- Visual diagram of how the extension works
- Components: Browser → Extension → SIP Server
- Key features highlighted (WebRTC, Auto-answer, etc.)

How to create:
1. Use Figma, Draw.io, or similar tool
2. Create simple, clear diagram
3. Export as 1280x800 PNG
4. Save as: store-assets/screenshots/screenshot-05-architecture.png
```

**Screenshot Post-Processing:**
- Resize to exactly 1280x800 or 640x400 pixels
- Hide any real SIP credentials
- Ensure text is readable
- Save as PNG or JPEG

### Promotional Image (To Create)

**Small Tile - 440x280 pixels (REQUIRED)**

**Design Guidelines:**
- Include extension name: "SIP.js Headless Chrome Extension"
- Add tagline: "Automated SIP Calling for Chrome"
- Use relevant icons: phone, SIP, WebRTC
- Clean, professional design
- Brand colors: Use SIP.js blue (#4285F4)

**Recommended Tool:**
- **Figma** (free): https://figma.com
- **Canva** (free templates): https://canva.com
- **GIMP** (free): https://gimp.org

**Design Template:**
```
┌────────────────────────────────────────────────┐
│                                                │
│     📞  SIP.js Headless Extension             │
│                                                │
│        Automated SIP/WebRTC Calling           │
│        Monitor via DevTools Console           │
│                                                │
│    [WebRTC icon]  [Phone icon]  [SIP icon]   │
│                                                │
└────────────────────────────────────────────────┘
```

Save as: `store-assets/promotional/promo-small-440x280.png`

**Optional Larger Tiles:**
- Large tile: 920x680 pixels
- Marquee: 1400x560 pixels
- Not required but increases visibility

---

## Developer Account Setup

### Step 1: Register

1. **Visit Chrome Web Store Developer Dashboard:**
   ```
   https://chrome.google.com/webstore/devconsole
   ```

2. **Sign in with Google Account**

3. **Pay Registration Fee**
   - Cost: $5 USD (one-time, lifetime access)
   - Payment: Credit/debit card
   - Receipt: Save for records

4. **Accept Developer Agreement**
   - Read Chrome Web Store Developer Program Policies
   - Click "Accept"

### Step 2: Complete Developer Profile

1. **Email Address:**
   - Will be publicly visible
   - Use support email or noreply@yourdomain.com

2. **Publisher Name:**
   - Display name: "OnSIP / SIP.js Contributors"
   - Or: "SIP.js Project"

3. **Website URL:**
   - https://github.com/onsip/SIP.js

4. **Verified Publisher (Optional):**
   - Requires domain verification
   - Adds checkmark badge
   - Can be done later

---

## Building the Extension

### Step 1: Production Build

```bash
cd /Users/rasonyang/workspaces/SIP.js/chrome-extension

# Install dependencies (if not already)
npm install

# Run production build
npm run build

# Verify dist/ directory
ls -la dist/
```

**Expected output:**
```
dist/
├── manifest.json
├── background.js
├── background.js.map
├── offscreen-ua.js
├── offscreen-ua.js.map
├── offscreen.html
├── options.js
├── options.js.map
├── options.html
└── assets/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Step 2: Create ZIP Package

```bash
# Navigate to dist directory
cd dist

# Create ZIP file
zip -r ../sip-extension-v1.0.0.zip .

# Return to parent directory
cd ..

# Verify ZIP was created
ls -lh sip-extension-v1.0.0.zip
```

**Important:**
- Only include contents of `dist/` directory
- Do NOT include source files, node_modules, or .git
- ZIP should contain manifest.json at root level

### Step 3: Test ZIP Locally

```bash
# Load ZIP in Chrome to verify
# 1. Open chrome://extensions
# 2. Enable Developer mode
# 3. Click "Load unpacked"
# 4. Select dist/ folder (or drag ZIP)
# 5. Test all functionality
```

---

## Submission Process

### Step 1: Start New Submission

1. Navigate to: https://chrome.google.com/webstore/devconsole
2. Click **"New Item"** button
3. Upload `sip-extension-v1.0.0.zip`
4. Wait for upload to complete and initial validation

### Step 2: Fill Store Listing

**Product Details Tab:**

**Name:**
```
SIP.js Headless Chrome Extension
```

**Summary (132 characters max):**
```
Headless SIP/WebRTC client for automated calling. Auto-answer, remote control, BroadSoft support. Monitor via DevTools console.
```

**Description:**
```
(Copy from store-assets/store-listing.txt - Detailed Description section)
```

**Category:**
```
Productivity
```

**Language:**
```
English (United States)
```

**Graphic Assets Tab:**

**Icon:**
- Automatically detected from manifest.json ✅

**Screenshots:**
1. Upload `store-assets/screenshots/screenshot-01-options-page.png`
2. Upload `store-assets/screenshots/screenshot-02-registration.png`
3. Upload `store-assets/screenshots/screenshot-03-incoming-call.png`
4. Upload `store-assets/screenshots/screenshot-04-auto-answer.png`
5. Upload `store-assets/screenshots/screenshot-05-architecture.png`

**Promotional Images:**
- Small tile: Upload `store-assets/promotional/promo-small-440x280.png`
- Large tile: (Optional) Skip for now
- Marquee: (Optional) Skip for now

**Additional Fields Tab:**

**Homepage URL:**
```
https://github.com/onsip/SIP.js
```

**Support URL:**
```
https://github.com/onsip/SIP.js/issues
```

**Privacy Policy:**
```
https://github.com/onsip/SIP.js/blob/main/chrome-extension/PRIVACY_POLICY.md
```

### Step 3: Distribution Settings

**Visibility:**
```
☑ Public
```
(Anyone can search and install)

**Regions:**
```
☑ All regions
```
(Or select specific countries if preferred)

**Pricing:**
```
☐ This item uses payment
```
(Extension is free)

### Step 4: Review and Submit

1. **Preview Store Listing:**
   - Click "Preview" to see how it looks
   - Check all images display correctly
   - Verify description formatting

2. **Submit for Review:**
   - Click "Submit for Review" button
   - Confirmation dialog appears
   - Click "Submit" to confirm

3. **Save Confirmation:**
   - Save confirmation email
   - Note submission date/time
   - Extension ID will be generated

---

## Review Process

### What Happens During Review

**Timeline:** 1-3 business days (sometimes faster)

**Google Reviews:**
1. Automated checks (malware, policy violations)
2. Manual review of functionality
3. Verification of permissions usage
4. Privacy policy compliance check

### Common Reviewer Questions

**Q: Why wildcard WebSocket permissions?**
```
Response Template:
"This extension allows users to configure their own SIP servers
which can be on any domain or IP address. Users explicitly enter
their server URL before any connections are made. The extension
supports any SIP provider (FreeSWITCH, Asterisk, BroadSoft, etc.)."
```

**Q: No visible UI?**
```
Response Template:
"This is a headless extension by design, intended for developers
and technical users. Configuration is done via the Extension Options
page. Activity is monitored via Chrome DevTools console, which is
documented in the store listing and user manual."
```

**Q: Data collection?**
```
Response Template:
"The extension only stores user-provided SIP credentials locally
using chrome.storage.sync. No data is sent to third parties or
developers. All communication is between the user's browser and
their configured SIP server. See our privacy policy for details."
```

### Monitoring Review Status

1. **Check Email:**
   - Google sends updates to registered email
   - Monitor for requests or questions

2. **Dashboard:**
   - Check https://chrome.google.com/webstore/devconsole
   - Status shows: "Pending review" → "Published" or "Rejected"

3. **Respond Promptly:**
   - If reviewers have questions, respond within 24 hours
   - Provide clear, detailed answers

---

## Post-Publication

### Immediate Actions

**1. Save Extension Information:**
```bash
# Create file to save details
cat > WEBSTORE_INFO.txt << EOF
Chrome Web Store URL: https://chrome.google.com/webstore/detail/[EXTENSION_ID]
Extension ID: [EXTENSION_ID]
Publication Date: [DATE]
Version: 1.0.0
EOF
```

**2. Update Documentation:**
- Add Chrome Web Store badge to README.md
- Update INSTALLATION.md with store link
- Update USER_MANUAL.md

**3. Announce:**
- GitHub Release
- Project website
- Social media (if applicable)
- Email existing users

### Monitor Performance

**1. Developer Dashboard:**
- View installation statistics
- Monitor user reviews
- Check crash reports

**2. User Feedback:**
- Respond to Chrome Web Store reviews
- Monitor GitHub Issues
- Address user questions promptly

**3. Analytics (Optional):**
- Chrome Web Store provides basic stats
- Weekly active users
- Installation/uninstallation rates

---

## Updating the Extension

### Update Process

**1. Make Changes:**
```bash
# Update code
# Increment version in package.json and manifest.json
```

**2. Update Version:**
```json
// src/manifest.json
{
  "version": "1.0.1",  // Increment
  "version_name": "1.0.1"
}
```

**3. Build and Package:**
```bash
npm run build
cd dist
zip -r ../sip-extension-v1.0.1.zip .
cd ..
```

**4. Submit Update:**
1. Go to Developer Dashboard
2. Click on your extension
3. Click "Upload Updated Package"
4. Upload new ZIP
5. Update "What's new in this version"
6. Submit for review

**5. Review Wait:**
- Updates also require review (1-3 days)
- Current version remains live during review
- New version goes live after approval

### Version Numbering

Use semantic versioning:
```
MAJOR.MINOR.PATCH

1.0.0 → Initial release
1.0.1 → Bug fixes
1.1.0 → New features (backward compatible)
2.0.0 → Breaking changes
```

---

## Troubleshooting

### Issue: Upload Failed

**Symptoms:**
- ZIP upload fails
- Error: "Package is invalid"

**Solutions:**
1. Verify ZIP contains manifest.json at root
2. Check manifest.json syntax (valid JSON)
3. Ensure all required fields present
4. Try rebuilding: `npm run build && cd dist && zip -r ../package.zip . && cd ..`

### Issue: Review Rejected

**Common Reasons:**
1. **Misleading description:** Update to be more accurate
2. **Permission concerns:** Add justification in response
3. **Privacy policy issues:** Ensure policy is accessible and complete
4. **Functionality doesn't match description:** Clarify in response

**Action:**
1. Read rejection reason carefully
2. Address specific concerns
3. Resubmit with explanation
4. Most rejections can be resolved

### Issue: Extension Disabled After Publication

**Symptoms:**
- Extension published but shows as disabled
- Users can't install

**Solutions:**
1. Check payment status (ensure $5 fee paid)
2. Verify email address
3. Check for policy violations
4. Contact Chrome Web Store support

### Issue: Low Installation Rate

**Possible Causes:**
1. Poor search ranking
2. Unclear description
3. Missing/bad screenshots
4. No promotional images

**Solutions:**
1. Improve store listing description
2. Add better screenshots
3. Create promotional images
4. Use relevant keywords
5. Encourage users to leave reviews

---

## Best Practices

### Store Listing

- ✅ Use clear, concise language
- ✅ Highlight key features early
- ✅ Include use cases
- ✅ Professional screenshots
- ✅ Eye-catching promotional image

### User Support

- ✅ Respond to reviews within 48 hours
- ✅ Provide clear documentation
- ✅ Monitor GitHub Issues
- ✅ Update regularly

### Updates

- ✅ Test thoroughly before submission
- ✅ Provide clear "What's new" notes
- ✅ Maintain backward compatibility
- ✅ Follow semantic versioning

### Compliance

- ✅ Keep privacy policy updated
- ✅ Follow Chrome Web Store policies
- ✅ Request only necessary permissions
- ✅ Be transparent about data usage

---

## Resources

### Official Documentation

- **Developer Dashboard:** https://chrome.google.com/webstore/devconsole
- **Developer Program Policies:** https://developer.chrome.com/docs/webstore/program-policies/
- **Best Practices:** https://developer.chrome.com/docs/webstore/best_practices/
- **Review Guidelines:** https://developer.chrome.com/docs/webstore/review-process/

### Support

- **Chrome Web Store Help:** https://support.google.com/chrome_webstore
- **Developer Forum:** https://groups.google.com/a/chromium.org/g/chromium-extensions
- **Stack Overflow:** Tag: `google-chrome-extension`

### Our Resources

- **README.md:** Technical documentation
- **USER_MANUAL.md:** End-user guide
- **INSTALLATION.md:** Installation instructions
- **store-assets/:** All store listing assets
- **store-assets/store-listing.txt:** Ready-to-copy listing text

---

## Checklist

### Pre-Submission

- [ ] Created all 5 screenshots (1280x800)
- [ ] Designed promotional image (440x280)
- [ ] Registered developer account ($5 paid)
- [ ] Built production package (ZIP file)
- [ ] Tested package locally
- [ ] Prepared store listing text
- [ ] Privacy policy accessible online

### During Submission

- [ ] Uploaded package successfully
- [ ] Filled all required fields
- [ ] Uploaded all graphics
- [ ] Set distribution to Public
- [ ] Reviewed preview
- [ ] Submitted for review
- [ ] Saved confirmation email

### Post-Publication

- [ ] Saved extension ID and URL
- [ ] Updated project documentation
- [ ] Announced on GitHub
- [ ] Set up review monitoring
- [ ] Prepared support workflow

---

## Timeline

**Realistic Timeline from Today:**

- **Day 1-2:** Create screenshots and promotional image (4-6 hours)
- **Day 3:** Register account, prepare package, submit (2-3 hours)
- **Day 4-7:** Wait for review (1-3 business days)
- **Day 8:** Published! Post-publication tasks (1 hour)

**Total:** 7-10 days from start to published

---

## Questions?

If you encounter issues:

1. Check this guide's [Troubleshooting](#troubleshooting) section
2. Review [Official Documentation](#official-documentation)
3. Search [Chrome Web Store Help](https://support.google.com/chrome_webstore)
4. Ask on [Developer Forum](https://groups.google.com/a/chromium.org/g/chromium-extensions)

Good luck with your Chrome Web Store submission! 🚀
