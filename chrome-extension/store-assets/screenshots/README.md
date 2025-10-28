# Screenshots Directory

This directory contains the 5 required screenshots for the Chrome Web Store listing.

---

## Required Screenshots

All screenshots must be **1280×800 pixels** (or 640×400) in PNG or JPEG format.

### Screenshot 1: Options Page Configuration
**Filename:** `screenshot-01-options-page.png`

**What to capture:**
```
┌────────────────────────────────────────────────────────────┐
│  SIP.js Headless Chrome Extension - Options                │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  SIP Configuration                                         │
│  ─────────────────────────────────────────────────────     │
│                                                            │
│  SIP Username:     [demo-user                    ]         │
│                                                            │
│  SIP Password:     [••••••••••••                 ]         │
│                                                            │
│  WebSocket Server URL:                                     │
│                    [wss://demo.example.com:7443  ]         │
│                                                            │
│  SIP Domain (optional):                                    │
│                    [                             ]         │
│                                                            │
│  [ Save Configuration ]                                    │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key elements to show:**
- Extension options page header
- All 4 configuration fields clearly visible
- Example values filled in (use dummy credentials, NOT real ones!)
- "Save Configuration" button visible
- Clean, uncluttered appearance

**Example values:**
- SIP Username: `demo-user` or `1000`
- SIP Password: `••••••••••••` (masked)
- WebSocket Server URL: `wss://demo.example.com:7443`
- SIP Domain: (leave blank or `demo.example.com`)

**Tips:**
- Use a clean Chrome window (no other tabs visible)
- Ensure good contrast and readability
- No real credentials should be visible
- Capture the full options page including header

---

### Screenshot 2: DevTools Console - Registration Success
**Filename:** `screenshot-02-registration.png`

**What to capture:**
```
┌────────────────────────────────────────────────────────────┐
│  Developer Tools - Console                                 │
├────────────────────────────────────────────────────────────┤
│  Console   Elements   Network   Sources   ...              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [12:34:56.789] [Background] Service Worker started       │
│  [12:34:56.890] [Offscreen UA] Creating UserAgent...      │
│  [12:34:57.123] [Offscreen UA] Connecting to               │
│                 wss://sip.example.com:7443                 │
│  [12:34:57.456] [Offscreen UA] WebSocket connected         │
│  [12:34:57.789] [Offscreen UA] Sending REGISTER...         │
│  [12:34:58.012] [Offscreen UA] Registered successfully!    │ ← KEY MESSAGE
│  [12:34:58.234] [Offscreen UA] Registration refresh in     │
│                 600 seconds                                │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key elements to show:**
- Chrome DevTools Console tab open
- Console logs showing SIP registration sequence
- **Most important:** `[Offscreen UA] Registered successfully!` message clearly visible
- Timestamps visible (optional, but helpful)
- Other relevant logs showing connection flow
- Console tab is selected/active

**Tips:**
- Use "Filter" to show only `[Offscreen UA]` logs for clarity
- Enable timestamps: Console settings ⚙️ → Show timestamps
- Clear console first (🚫 button) to remove clutter
- Capture after successful registration
- Ensure text is readable (increase font size if needed)

---

### Screenshot 3: DevTools Console - Incoming Call
**Filename:** `screenshot-03-incoming-call.png`

**What to capture:**
```
┌────────────────────────────────────────────────────────────┐
│  Developer Tools - Console                                 │
├────────────────────────────────────────────────────────────┤
│  Console   Elements   Network   Sources   ...              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [12:35:23.456] [Offscreen UA] Registered successfully!    │
│  [12:36:45.789] [offscreen-ua.js] Incoming call from       │ ← KEY
│                 sip:2000@sip.example.com                   │   MESSAGE
│  [12:36:45.890] [offscreen-ua.js] Remote tag: as7d9f8     │
│  [12:36:45.912] [offscreen-ua.js] Call-ID: abc123...      │
│  [12:36:46.001] [offscreen-ua.js] Playing ringtone...     │ ← KEY
│  [12:36:46.123] [offscreen-ua.js] Ringtone started        │   MESSAGE
│  [12:36:46.234] [offscreen-ua.js] Waiting for answer      │
│                 or reject...                               │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key elements to show:**
- Console showing incoming call detection
- **Most important:**
  - `Incoming call from sip:...` message
  - `Playing ringtone...` message
- Caller information (SIP URI)
- Call handling flow
- Timestamps showing call sequence

**Tips:**
- Initiate a real incoming call to capture authentic logs
- Filter by `[offscreen-ua.js]` to focus on call events
- Capture at the moment ringtone starts playing
- Multiple attempts OK - pick the cleanest output
- Can answer or reject call after screenshot (doesn't matter)

---

### Screenshot 4: DevTools Console - Auto-Answer
**Filename:** `screenshot-04-auto-answer.png`

**What to capture:**
```
┌────────────────────────────────────────────────────────────┐
│  Developer Tools - Console                                 │
├────────────────────────────────────────────────────────────┤
│  Console   Elements   Network   Sources   ...              │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [12:37:12.345] [offscreen-ua.js] Incoming call from       │
│                 sip:3000@sip.example.com                   │
│  [12:37:12.456] [offscreen-ua.js] Call-Info header         │ ← KEY
│                 detected: answer-after=2                   │   MESSAGE
│  [12:37:12.567] [offscreen-ua.js] Auto-answering call      │ ← KEY
│                 in 2 seconds...                            │   MESSAGE
│  [12:37:14.578] [offscreen-ua.js] Accepting call...        │
│  [12:37:14.689] [offscreen-ua.js] Call answered            │ ← KEY
│                 automatically                              │   MESSAGE
│  [12:37:14.790] [offscreen-ua.js] Media session            │
│                 established                                │
│  [12:37:14.891] [offscreen-ua.js] Call in progress         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key elements to show:**
- Console showing auto-answer sequence
- **Most important messages:**
  - `Call-Info header detected: answer-after=X`
  - `Auto-answering call in X seconds...`
  - `Call answered automatically`
- Complete auto-answer flow from detection to establishment
- Countdown/delay visible (e.g., 2 seconds)

**Tips:**
- Requires SIP server to send `Call-Info` header with `answer-after` parameter
- Use FreeSWITCH dialplan to add header:
  ```xml
  <action application="export" data="sip_h_Call-Info=<sip:${domain_name}>;answer-after=2"/>
  ```
- Try `answer-after=1` or `answer-after=0` for faster capture
- Filter by `[offscreen-ua.js]` to focus on auto-answer logs
- Capture showing all 3 key messages above

---

### Screenshot 5: Architecture Diagram
**Filename:** `screenshot-05-architecture.png`

**What to capture:**

This is a visual diagram showing the extension's architecture. Create using Figma, Draw.io, or similar tool.

**Example diagram structure:**
```
┌─────────────────────────────────────────────────────────────┐
│                      Chrome Browser                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  SIP.js Headless Chrome Extension                     │  │
│  │                                                        │  │
│  │  ┌──────────────┐         ┌──────────────────┐       │  │
│  │  │  Background  │────────▶│  Offscreen       │       │  │
│  │  │  Service     │  msgs   │  Document        │       │  │
│  │  │  Worker      │◀────────│                  │       │  │
│  │  │              │         │  • SIP UserAgent │       │  │
│  │  │  • Keep-Alive│         │  • WebRTC Audio  │       │  │
│  │  │  • Config    │         │  • Call Handling │       │  │
│  │  └──────────────┘         └─────────┬────────┘       │  │
│  │                                      │                │  │
│  └──────────────────────────────────────┼────────────────┘  │
│                                         │ WebSocket          │
│                                         │ Secure (WSS)       │
└─────────────────────────────────────────┼────────────────────┘
                                          │
                                          ▼
                   ┌───────────────────────────────────┐
                   │      SIP Server                   │
                   │      (FreeSWITCH/Asterisk)       │
                   │                                   │
                   │  • SIP Registration               │
                   │  • Call Routing                   │
                   │  • WebRTC Media Gateway           │
                   │  • BroadSoft Extensions           │
                   └───────────────────────────────────┘
```

**Key elements to show:**
1. **Chrome Browser** container showing extension lives inside browser
2. **Background Service Worker** component with:
   - Keep-alive functionality
   - Configuration management
3. **Offscreen Document** component with:
   - SIP UserAgent
   - WebRTC audio handling
   - Call logic
4. **Communication** between components (arrows/lines)
5. **WebSocket connection** to SIP Server (WSS protocol)
6. **SIP Server** showing:
   - Server type (FreeSWITCH/Asterisk/BroadSoft)
   - Key functions (registration, routing, media, extensions)

**Design Tips:**
- Use rectangles for components
- Use arrows for data flow/communication
- Color coding:
  - Blue/teal for extension components
  - Green for SIP server
  - Gray for browser container
- Label all arrows (e.g., "messages", "WSS", "audio")
- Keep it clean and simple
- Ensure text is readable at 1280×800

**Tools to use:**
- **Figma:** https://figma.com (recommended, free)
- **Draw.io:** https://app.diagrams.net/ (free, no account)
- **Lucidchart:** https://lucidchart.com (free tier)
- **PowerPoint/Keynote:** Can also be used for simple diagrams

**Export:**
- Export as PNG at 1280×800 pixels
- Use high quality/resolution
- Ensure transparent background or solid color background

---

## Screenshot Quality Guidelines

### Resolution
- **Required:** 1280×800 pixels (or 640×400)
- Recommended: 1280×800 for best quality
- All screenshots should be same size

### Format
- **Preferred:** PNG (better for text/UI screenshots)
- Acceptable: JPEG (ensure high quality, > 90%)
- File size: < 5MB each

### Content
- **Readable text:** All text should be clear and legible
- **Good contrast:** Ensure text is visible against background
- **No personal info:** Hide real passwords, phone numbers, emails
- **Clean UI:** Close unnecessary tabs/windows
- **Consistent theme:** Use same Chrome theme for all screenshots

### Verification Commands

**Check dimensions (macOS):**
```bash
cd store-assets/screenshots
sips -g pixelWidth -g pixelHeight *.png
# All should show: pixelWidth: 1280, pixelHeight: 800
```

**Check file sizes:**
```bash
ls -lh *.png
# All should be < 5MB
```

**Check file count:**
```bash
ls -1 screenshot-*.png | wc -l
# Should show: 5
```

---

## Naming Convention

**Strict naming required:**
- `screenshot-01-options-page.png` ← Options configuration page
- `screenshot-02-registration.png` ← Registration success
- `screenshot-03-incoming-call.png` ← Incoming call detection
- `screenshot-04-auto-answer.png` ← Auto-answer sequence
- `screenshot-05-architecture.png` ← Architecture diagram

**Important:**
- Use leading zero (01, 02, ..., not 1, 2, ...)
- Use lowercase
- Use hyphens (not underscores or spaces)
- Use `.png` extension (not `.PNG` or `.jpg`)

---

## Capture Tools

### macOS
- **Built-in:** Cmd+Shift+4 (select area)
- **Built-in:** Cmd+Shift+3 (full screen)
- **Preview:** For resizing and editing

### Windows
- **Snipping Tool:** Windows+Shift+S
- **Snip & Sketch:** Built into Windows 10/11
- **Paint:** For resizing

### Linux
- **gnome-screenshot:** Built into GNOME
- **Flameshot:** Advanced screenshot tool
- **Spectacle:** KDE screenshot utility

---

## Post-Capture Editing

### Resize to 1280×800

**macOS (Preview):**
1. Open image in Preview
2. Tools → Adjust Size
3. Width: 1280, Height: 800
4. Uncheck "Scale proportionally"
5. Click OK
6. File → Export → PNG

**Windows (Paint):**
1. Open image in Paint
2. Home → Resize
3. Uncheck "Maintain aspect ratio"
4. Set Width: 1280, Height: 800
5. Click OK
6. File → Save As → PNG

**Command line (ImageMagick):**
```bash
convert original.png -resize 1280x800! screenshot-01-options-page.png
```

### Crop to Focus Area

If you captured more than needed, crop to focus on the important area:

**macOS (Preview):**
1. Select area with Rectangle Select tool
2. Tools → Crop
3. Tools → Adjust Size (resize to 1280×800)

**GIMP:**
1. Select Crop tool
2. Drag to select area
3. Press Enter to crop
4. Image → Scale Image → 1280×800

---

## Common Mistakes to Avoid

1. **Wrong dimensions:** Not exactly 1280×800 pixels
   - Solution: Always resize after capture

2. **Real credentials visible:** Actual passwords or personal info shown
   - Solution: Use dummy/example credentials in screenshots

3. **Blurry text:** Text is not readable
   - Solution: Capture at higher resolution, then resize

4. **Wrong file names:** Not following naming convention
   - Solution: Rename files to match exactly: `screenshot-01-options-page.png`

5. **File size too large:** Screenshot > 5MB
   - Solution: Use PNG compression or reduce quality slightly

6. **Missing timestamps:** Console screenshots without timestamps
   - Solution: Enable timestamps in DevTools settings

7. **Cluttered background:** Too many tabs/windows visible
   - Solution: Close unnecessary UI elements before capture

---

## Testing Checklist

Before submitting screenshots, verify:

- [ ] All 5 files exist with correct names
- [ ] All files are exactly 1280×800 (or 640×400)
- [ ] All files are PNG or JPEG format
- [ ] All file sizes are < 5MB
- [ ] Text is readable in all screenshots
- [ ] No real credentials visible
- [ ] Console timestamps enabled (screenshots 2-4)
- [ ] Key messages visible (see "Key elements to show" above)
- [ ] Architecture diagram is clear and professional

---

## Need Help?

- **Detailed guide:** See `store-assets/SCREENSHOT_GUIDE.md` for step-by-step instructions
- **Troubleshooting:** See SCREENSHOT_GUIDE.md → Troubleshooting section
- **Examples:** Browse Chrome Web Store for similar extensions

---

**Ready to capture?** Follow the descriptions above and use the detailed guide in `SCREENSHOT_GUIDE.md` for step-by-step instructions.

Good luck! 📸
