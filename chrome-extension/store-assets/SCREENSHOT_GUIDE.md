# Screenshot Capture Guide - Step by Step

This guide provides detailed, copy-paste ready instructions for capturing all 5 required screenshots for the Chrome Web Store listing.

---

## Prerequisites

### Before You Start

1. **Extension Installed:**
   ```bash
   cd /Users/rasonyang/workspaces/SIP.js/chrome-extension
   npm run build
   # Then load chrome-extension/dist/ as unpacked extension
   ```

2. **SIP Server Access:**
   - Have valid SIP credentials ready
   - Ensure FreeSWITCH/Asterisk server is accessible
   - Test server is working

3. **Screenshot Tool Ready:**
   - **macOS:** Cmd+Shift+4 (built-in)
   - **Windows:** Windows+Shift+S (Snipping Tool)
   - **Linux:** gnome-screenshot or Flameshot

4. **Clean Browser Environment:**
   - Close unnecessary tabs
   - Clear console logs (if needed)
   - Use incognito mode for clean screenshots

---

## Screenshot 1: Options Page Configuration

**Filename:** `screenshot-01-options-page.png`
**Dimensions:** 1280x800 pixels
**Estimated Time:** 5-10 minutes

### Step-by-Step Instructions

1. **Open Extension Options:**
   ```
   1. Navigate to: chrome://extensions
   2. Find: "SIP.js Headless Chrome Extension"
   3. Click: "Details"
   4. Scroll down and click: "Extension options"
   ```

2. **Fill in Example Configuration:**
   ```
   SIP Username:          demo-user
   SIP Password:          ••••••••••••
   WebSocket Server URL:  wss://demo.example.com:7443
   SIP Domain:            (leave blank or: demo.example.com)
   ```

   **Important:** Use example/dummy credentials, NOT real ones!

3. **Prepare the Page:**
   - Make sure form is cleanly visible
   - All fields are properly labeled
   - No errors showing
   - "Save Configuration" button visible

4. **Capture Screenshot:**
   - **macOS:**
     ```
     Cmd + Shift + 4
     Drag to select the entire options page
     ```
   - **Windows:**
     ```
     Windows + Shift + S
     Click "Rectangular snip"
     Drag to select the options page
     ```

5. **Resize to 1280x800:**
   - Open in Preview (macOS) or Paint (Windows)
   - Tools → Adjust Size / Resize
   - Width: 1280, Height: 800
   - Keep aspect ratio: OFF
   - Save as PNG

6. **Save File:**
   ```bash
   # Save as:
   /Users/rasonyang/workspaces/SIP.js/chrome-extension/store-assets/screenshots/screenshot-01-options-page.png
   ```

7. **Verify:**
   ```bash
   ls -lh store-assets/screenshots/screenshot-01-options-page.png
   # Should show file size and confirm it exists
   ```

---

## Screenshot 2: DevTools Console - Registration Success

**Filename:** `screenshot-02-registration.png`
**Dimensions:** 1280x800 pixels
**Estimated Time:** 10-15 minutes

### Step-by-Step Instructions

1. **Configure Extension with Real Credentials:**
   ```
   1. Open extension options
   2. Enter REAL SIP credentials (valid server)
   3. Click "Save Configuration"
   4. Close options tab
   ```

2. **Reload Extension:**
   ```
   1. Go to: chrome://extensions
   2. Find extension
   3. Click reload icon (↻)
   ```

3. **Open DevTools Console:**
   ```
   Method A: Right-click anywhere → Inspect → Console tab
   Method B: Press F12 → Console tab
   Method C: View → Developer → JavaScript Console
   ```

4. **Wait for Registration:**
   - Watch console output
   - Wait for: `[Offscreen UA] Registered successfully!`
   - This usually takes 2-5 seconds

5. **Clean Up Console:**
   - If there's too much output, clear it:
     ```
     Click the 🚫 icon in console (Clear console)
     Reload extension
     Wait for registration message again
     ```

6. **Capture Screenshot:**
   - Ensure visible:
     - `[Offscreen UA] Registered successfully!` message
     - Timestamp
     - Other relevant SIP logs
     - Console tab is selected

   - **macOS:** Cmd + Shift + 4, drag to select
   - **Windows:** Windows + Shift + S, select area

7. **Resize to 1280x800 and Save:**
   ```bash
   # Save as:
   store-assets/screenshots/screenshot-02-registration.png
   ```

**Troubleshooting:**
- If registration fails: Check SIP credentials
- If no logs appear: Check extension is loaded correctly
- If console shows errors: Fix configuration first

---

## Screenshot 3: DevTools Console - Incoming Call

**Filename:** `screenshot-03-incoming-call.png`
**Dimensions:** 1280x800 pixels
**Estimated Time:** 10-15 minutes

### Step-by-Step Instructions

1. **Ensure Extension is Registered:**
   - From Screenshot 2, you should have successful registration
   - Console should show: `[Offscreen UA] Registered successfully!`

2. **Prepare to Receive Call:**
   - Keep DevTools Console open
   - Have another SIP client ready to make a call
   - Or use FreeSWITCH CLI to initiate call

3. **Initiate Incoming Call:**

   **Option A: Using another SIP client:**
   ```
   1. Register another SIP extension on same server
   2. Call the extension's SIP username
   ```

   **Option B: Using FreeSWITCH CLI:**
   ```bash
   fs_cli
   originate sofia/external/1000@domain.com &bridge(sofia/external/target@domain.com)
   ```

4. **Watch Console Output:**
   - You should see:
     ```
     [offscreen-ua.js] Incoming call from sip:caller@domain.com
     [offscreen-ua.js] Playing ringtone...
     ```

5. **Capture Screenshot:**
   - Capture when ringtone message is visible
   - Include caller information
   - Show call handling logs
   - Console tab selected

6. **Resize to 1280x800 and Save:**
   ```bash
   store-assets/screenshots/screenshot-03-incoming-call.png
   ```

**Tips:**
- Multiple attempts OK - pick the cleanest output
- Can answer or reject call after screenshot
- If ringtone doesn't play, check audio permissions

---

## Screenshot 4: DevTools Console - Auto-Answer

**Filename:** `screenshot-04-auto-answer.png`
**Dimensions:** 1280x800 pixels
**Estimated Time:** 15-20 minutes

### Step-by-Step Instructions

1. **Configure FreeSWITCH for Auto-Answer:**

   You need to send `Call-Info` header with the call.

   **FreeSWITCH Dialplan Example:**
   ```xml
   <action application="export" data="sip_h_Call-Info=<sip:${domain_name}>;answer-after=2"/>
   <action application="bridge" data="sofia/external/1000@domain.com"/>
   ```

2. **Keep Console Open:**
   - DevTools → Console tab
   - Clear previous logs if needed (🚫 icon)

3. **Initiate Call with Call-Info Header:**
   - Make call from FreeSWITCH with above dialplan
   - Or use SIP client that supports Call-Info header

4. **Watch for Auto-Answer Sequence:**
   ```
   [offscreen-ua.js] Incoming call from sip:caller@domain.com
   [offscreen-ua.js] Call-Info header detected: answer-after=2
   [offscreen-ua.js] Auto-answering call in 2 seconds...
   [offscreen-ua.js] Call answered automatically
   ```

5. **Capture Screenshot:**
   - Capture showing all 4 messages above
   - Show countdown (2 seconds)
   - Show successful auto-answer
   - Include timestamp

6. **Resize to 1280x800 and Save:**
   ```bash
   store-assets/screenshots/screenshot-04-auto-answer.png
   ```

**Troubleshooting:**
- If auto-answer doesn't work: Check Call-Info header is being sent
- If header not detected: Check FreeSWITCH logs
- Try answer-after=1 or answer-after=0 for faster capture

---

## Screenshot 5: Architecture Diagram

**Filename:** `screenshot-05-architecture.png`
**Dimensions:** 1280x800 pixels
**Estimated Time:** 30-60 minutes

### Option A: Create Diagram in Figma (Recommended)

1. **Sign up for Figma:**
   - Visit: https://figma.com
   - Sign up (free account)

2. **Create New Design:**
   - New design file
   - Frame: Desktop (1280 x 800)

3. **Design Architecture:**

   **Components to Include:**
   ```
   ┌─────────────────────────────────────────────┐
   │           Chrome Browser                    │
   │  ┌────────────────────────────────────┐    │
   │  │  SIP.js Headless Extension         │    │
   │  │                                     │    │
   │  │  ┌──────────┐    ┌──────────┐    │    │
   │  │  │Background│    │ Offscreen│    │    │
   │  │  │  Worker  │◄──►│ Document │    │    │
   │  │  │          │    │          │    │    │
   │  │  │Keep-Alive│    │SIP UA    │    │    │
   │  │  └──────────┘    │WebRTC    │    │    │
   │  │                   └────┬─────┘    │    │
   │  └────────────────────────┼──────────┘    │
   └───────────────────────────┼────────────────┘
                               │ WSS
                               ▼
                    ┌────────────────────┐
                    │  SIP Server        │
                    │  (FreeSWITCH)      │
                    │                    │
                    │  • Registration    │
                    │  • Call Handling   │
                    │  • WebRTC Media    │
                    └────────────────────┘
   ```

4. **Add Labels and Arrows:**
   - Use text tool (T) for labels
   - Use line tool (L) for arrows
   - Color code components (blue for extension, green for server)

5. **Export as PNG:**
   - File → Export
   - Format: PNG
   - Size: 1x (1280x800)
   - Export

6. **Save:**
   ```bash
   # Download and move to:
   store-assets/screenshots/screenshot-05-architecture.png
   ```

### Option B: Use Draw.io (Free, No Account Needed)

1. **Visit Draw.io:**
   - Go to: https://app.diagrams.net/
   - Click "Create New Diagram"
   - Choose "Blank Diagram"

2. **Set Canvas Size:**
   - File → Page Setup
   - Width: 1280 px
   - Height: 800 px

3. **Create Diagram:**
   - Drag shapes from left panel
   - Use rectangles for components
   - Use arrows for connections
   - Add text labels

4. **Export:**
   - File → Export as → PNG
   - Zoom: 100%
   - Transparent: No
   - Export

5. **Save:**
   ```bash
   store-assets/screenshots/screenshot-05-architecture.png
   ```

### Option C: Use Existing README Diagram

If the project already has an architecture diagram in README.md:

1. **Locate Diagram:**
   - Check README.md for ASCII or image diagram

2. **If ASCII, Convert to Image:**
   - Use: https://asciiflow.com/
   - Or screenshot the ASCII art from README
   - Clean up and enhance

3. **Resize to 1280x800**

---

## Post-Capture Checklist

After capturing all 5 screenshots:

- [ ] All files are 1280x800 pixels (or 640x400)
- [ ] All files are PNG or JPEG format
- [ ] No real credentials visible in screenshots
- [ ] Text is readable and clear
- [ ] File sizes are reasonable (<5MB each)
- [ ] Filenames match exactly:
  - [ ] `screenshot-01-options-page.png`
  - [ ] `screenshot-02-registration.png`
  - [ ] `screenshot-03-incoming-call.png`
  - [ ] `screenshot-04-auto-answer.png`
  - [ ] `screenshot-05-architecture.png`

### Verify Files:

```bash
cd /Users/rasonyang/workspaces/SIP.js/chrome-extension/store-assets/screenshots

# Check all files exist
ls -lh

# Should show 5 files:
# screenshot-01-options-page.png
# screenshot-02-registration.png
# screenshot-03-incoming-call.png
# screenshot-04-auto-answer.png
# screenshot-05-architecture.png

# Check dimensions (macOS)
sips -g pixelWidth -g pixelHeight *.png

# Should show 1280x800 for each file
```

---

## Tips for Better Screenshots

### General Tips

1. **Clean Environment:**
   - Close unnecessary browser tabs
   - Clear desktop if visible
   - Use consistent Chrome theme

2. **Good Contrast:**
   - Light theme for options page
   - Dark theme for DevTools console (optional)
   - Ensure text is readable

3. **Timing:**
   - Wait for complete messages
   - Don't capture mid-animation
   - Multiple attempts are OK

4. **Quality:**
   - Use PNG format (not JPEG) for sharp text
   - Avoid compression artifacts
   - Ensure file size is reasonable

### DevTools Console Tips

1. **Font Size:**
   - Increase console font size for readability
   - Settings → Preferences → Appearance → Font size: Large

2. **Timestamps:**
   - Enable timestamps: Console settings (⚙️) → Show timestamps

3. **Filtering:**
   - Filter by "Offscreen UA" or "offscreen-ua.js"
   - Hide irrelevant messages

### Screenshot Tool Tips

**macOS:**
```bash
# Capture to clipboard instead of file
Cmd + Shift + Ctrl + 4

# Then paste into image editor
Cmd + V
```

**Windows:**
```
# Use Snipping Tool with delay
Snipping Tool → Delay → 5 seconds
# Gives time to set up the screen
```

---

## Troubleshooting

### Issue: Can't capture console logs

**Solution:**
- Ensure extension is loaded
- Check extension is enabled
- Reload extension
- Look in correct console (offscreen document, not background)

### Issue: Registration fails

**Solution:**
- Verify SIP credentials
- Check WebSocket URL format (wss://)
- Test server connectivity
- Check firewall

### Issue: No incoming calls

**Solution:**
- Verify extension is registered
- Check SIP server allows incoming calls
- Try calling from different client
- Check NAT/firewall settings

### Issue: Auto-answer not working

**Solution:**
- Verify Call-Info header is sent
- Check FreeSWITCH dialplan
- Look for header detection in console
- Try answer-after=0 for immediate answer

### Issue: Screenshot wrong size

**Solution:**
- Resize after capture
- Use image editor (Preview, Paint, GIMP)
- Maintain aspect ratio OFF
- Force to 1280x800 or 640x400

---

## Quick Reference

**Screenshot Sizes:** 1280x800 or 640x400 pixels
**Format:** PNG (preferred) or JPEG
**Quantity:** 5 screenshots required
**Location:** `store-assets/screenshots/`

**Keyboard Shortcuts:**
- **macOS:** Cmd+Shift+4 (area), Cmd+Shift+3 (full screen)
- **Windows:** Windows+Shift+S (Snipping Tool)
- **Linux:** Print Screen or Shift+Print Screen

**Verification Command:**
```bash
cd store-assets/screenshots && ls -lh && sips -g pixelWidth -g pixelHeight *.png
```

---

## Need Help?

If you encounter issues:
1. Check console for error messages
2. Verify SIP server is accessible
3. Test with simpler configuration first
4. Take multiple screenshots and pick best ones
5. Screenshots don't need to be perfect - readable is enough!

**Remember:** The goal is to show how the extension works, not to create perfect screenshots. Multiple attempts are normal and expected!

---

Good luck with your screenshots! 📸
