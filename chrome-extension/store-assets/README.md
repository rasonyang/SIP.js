# Chrome Web Store Assets

This directory contains all assets required for the Chrome Web Store listing.

## Directory Structure

```
store-assets/
├── screenshots/        # Application screenshots
├── promotional/        # Promotional images
└── README.md          # This file
```

---

## Required Assets Checklist

### Screenshots (REQUIRED)

- [ ] **Screenshot 1**: Options page showing configuration form (1280x800 or 640x400)
- [ ] **Screenshot 2**: DevTools console showing SIP registration success (1280x800 or 640x400)
- [ ] **Screenshot 3**: DevTools console showing incoming call handling (1280x800 or 640x400)
- [ ] **Screenshot 4**: DevTools console showing auto-answer feature (1280x800 or 640x400)
- [ ] **Screenshot 5**: Architecture diagram or workflow visualization (1280x800 or 640x400)

**Specifications:**
- Format: PNG or JPEG
- Dimensions: 1280x800 pixels (recommended) or 640x400 pixels
- Minimum: 1 screenshot required
- Maximum: 5 screenshots recommended
- File naming: `screenshot-01.png`, `screenshot-02.png`, etc.

### Promotional Images (REQUIRED)

- [ ] **Small Tile**: 440x280 pixels (REQUIRED for visibility)
- [ ] **Large Tile**: 920x680 pixels (optional, for better visibility)
- [ ] **Marquee**: 1400x560 pixels (optional, for featured placement)

**Specifications:**
- Format: PNG or JPEG
- No transparency for promotional images
- File naming: `promo-small-440x280.png`, `promo-large-920x680.png`, `promo-marquee-1400x560.png`

---

## Screenshot Guidelines

### What to Capture

1. **Options Page**
   - Show the configuration form with fields labeled
   - Display example values (use placeholder or dummy data)
   - Highlight key features (SIP Username, WebSocket URL, etc.)

2. **DevTools Console - Registration**
   - Show successful SIP registration logs
   - Display `[Offscreen UA] Registered successfully!` message
   - Include timestamp and other relevant log entries

3. **DevTools Console - Incoming Call**
   - Show incoming call detection
   - Display caller information
   - Show ringtone playback message

4. **DevTools Console - Auto-Answer**
   - Show `Call-Info` header detection
   - Display auto-answer countdown
   - Show call answered message

5. **Architecture/Workflow**
   - Create diagram showing how the extension works
   - Show: Browser → Extension → SIP Server flow
   - Highlight key components (Background, Offscreen, WebRTC)

### How to Capture

**macOS:**
```bash
# Full screen
Cmd + Shift + 3

# Selected area
Cmd + Shift + 4 (then drag to select area)

# Window capture
Cmd + Shift + 4, then press Space, then click window
```

**Windows:**
```
# Snipping Tool
Windows key + Shift + S

# Or use built-in Snipping Tool app
```

**Linux:**
```bash
# GNOME Screenshot
gnome-screenshot

# Or use Shutter, Flameshot, etc.
```

### Screenshot Editing

Use any tool to:
- Resize to 1280x800 or 640x400
- Add annotations if needed (arrows, highlights)
- Ensure text is readable
- Hide sensitive information (real SIP credentials)

**Recommended Tools:**
- **macOS**: Preview, Pixelmator, GIMP
- **Windows**: Paint, Paint 3D, GIMP
- **Linux**: GIMP, Krita, Pinta
- **Online**: Figma, Canva (free)

---

## Promotional Image Guidelines

### Small Tile (440x280) - REQUIRED

**Content:**
- Extension name: "SIP.js Headless Chrome Extension"
- Tagline: "Automated SIP Calling for Chrome"
- Visual elements: SIP icon, phone icon, WebRTC logo
- Clean, professional design

**Template Suggestion:**
```
┌────────────────────────────────────────┐
│                                        │
│  📞  SIP.js Headless Extension        │
│                                        │
│     Automated SIP/WebRTC Calling      │
│     Monitor via DevTools Console      │
│                                        │
│  [WebRTC icon]  [SIP icon]            │
│                                        │
└────────────────────────────────────────┘
```

**Design Tools:**
- **Figma** (free, recommended): https://figma.com
- **Canva** (free templates): https://canva.com
- **Photoshop** (if you have license)
- **GIMP** (free, open source): https://gimp.org

**Color Scheme Suggestions:**
- Primary: #4285F4 (SIP.js blue)
- Secondary: #34A853 (Success green)
- Accent: #EA4335 (Alert red)
- Background: #FFFFFF (White) or #F5F5F5 (Light gray)

### Large Tile (920x680) - Optional

Similar content to small tile but with more space:
- Add more details about features
- Include sample console output
- Show more visual elements

### Marquee (1400x560) - Optional

Wide banner format:
- Show extension in action
- Add more descriptive text
- Include call-to-action

---

## Store Listing Text

### Short Description (132 characters max)

**Current:**
```
Headless SIP/WebRTC client for automated calling. Auto-answer, remote control, BroadSoft support. Monitor via DevTools console.
```

### Detailed Description

```markdown
Automated SIP/WebRTC calling extension for Chrome. Designed for developers, testers, and power users who need headless SIP functionality.

KEY FEATURES:
• Headless operation - monitor all activity via DevTools console
• Auto-answer support via BroadSoft Call-Info header
• Remote call control via BroadSoft NOTIFY events
• WebRTC audio with full-duplex communication
• Automatic reconnection with exponential backoff
• Compatible with FreeSWITCH, Asterisk, and BroadSoft servers

USE CASES:
- Automated phone system testing
- Contact center integrations
- SIP client development and debugging
- Remote call monitoring and control
- Integration with custom workflows

REQUIREMENTS:
- SIP account with WebSocket (WSS) support
- FreeSWITCH, Asterisk, or compatible SIP server
- Chrome 99+ or Edge 99+

CONFIGURATION:
Configure via Extension Options page:
- SIP username and password
- WebSocket Server URL (wss://)
- Optional SIP domain

PRIVACY & SECURITY:
- Credentials stored locally only (chrome.storage.sync)
- No data sent to third parties
- Open source - inspect code on GitHub
- MIT licensed

DOCUMENTATION:
Full user manual and troubleshooting guide available on GitHub.

SUPPORT:
GitHub: https://github.com/onsip/SIP.js
Issues: https://github.com/onsip/SIP.js/issues
```

---

## Verification Checklist

Before submission, verify:

- [ ] All screenshots are 1280x800 or 640x400 pixels
- [ ] Screenshots clearly show extension functionality
- [ ] Promotional image is 440x280 pixels
- [ ] All images are PNG or JPEG format
- [ ] No sensitive information (real credentials) visible
- [ ] Text in images is readable
- [ ] Professional appearance and design
- [ ] File sizes are reasonable (<5MB per file)

---

## Timeline

**Asset Creation Estimate:**
- Screenshots: 1-2 hours
- Promotional image design: 2-3 hours
- Review and refinement: 30-60 minutes

**Total:** 4-6 hours

---

## Resources

### Design Inspiration

Look at similar extensions for inspiration:
- Search Chrome Web Store for "SIP" or "WebRTC"
- Note how they present headless/technical extensions
- Adapt good practices to our extension

### Asset Templates

**Figma Community Templates:**
- Search for "Chrome extension" templates
- Many free templates available

**Canva Templates:**
- Chrome extension graphics templates
- Social media graphics (adapt dimensions)

### Icons and Graphics

**Free Icon Resources:**
- Material Icons: https://fonts.google.com/icons
- Font Awesome: https://fontawesome.com
- Flaticon: https://flaticon.com
- Icons8: https://icons8.com

**SIP/Phone Icons:**
- Use phone, calling, or communication icons
- WebRTC logo (if permitted)
- Network/connection icons

---

## Notes

- Keep designs simple and professional
- Avoid cluttered layouts
- Ensure good contrast for readability
- Test how images look on Chrome Web Store preview
- Screenshots should tell a story about the extension's purpose
- Promotional images should be eye-catching but not misleading

---

## Questions?

If you need help with asset creation:
1. Review examples on Chrome Web Store
2. Use templates from Figma/Canva
3. Consult design resources listed above
4. Test different approaches and iterate

Good luck with your Chrome Web Store submission!
