# SIP.js Headless Chrome Extension - User Manual

**Version:** 1.0.0
**Last Updated:** October 28, 2024

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Using the Extension](#using-the-extension)
5. [Troubleshooting](#troubleshooting)
6. [Frequently Asked Questions](#frequently-asked-questions)
7. [Support](#support)

---

## Introduction

The SIP.js Headless Chrome Extension is a browser extension that enables SIP (Session Initiation Protocol) calling directly from Google Chrome or Microsoft Edge. This extension operates in "headless" mode, meaning it has no visible user interface - all activity is logged to the browser's Developer Tools console.

### Key Features

- **Automatic Call Answering:** Supports BroadSoft `Call-Info; answer-after` header for auto-answer functionality
- **Remote Call Control:** Responds to BroadSoft `NOTIFY (Event: talk)` for remote-initiated calls
- **Pure Headless Operation:** No popups, notifications, or badges - monitor via DevTools console
- **Automatic Reconnection:** Reconnects to SIP server automatically if connection is lost
- **WebRTC Audio:** Full-duplex audio communication using WebRTC

### What You'll Need

- Google Chrome (version 99+) or Microsoft Edge (version 99+)
- A SIP account with WebSocket (WSS) support
- Access to a SIP server (FreeSWITCH, Asterisk, or similar)

---

## Installation

### Recommended: Chrome Web Store

The easiest way to install the extension is from the Chrome Web Store:

1. **Visit Chrome Web Store:**
   - 🌐 [Chrome Web Store Listing](https://chrome.google.com/webstore) _(Link will be updated once published)_

2. **Click "Add to Chrome"**
   - One-click installation
   - Automatic updates

3. **Confirm Installation**
   - Review permissions
   - Click "Add extension"

4. **Configure**
   - Options page opens automatically
   - See [Configuration](#configuration) section below

### Alternative: Manual Installation

If you have a `.crx` file or unpacked folder:

> **⚠️ IMPORTANT: Do NOT double-click the `.crx` file!**
>
> Chrome will show an error. This is a security feature in Chrome 99+.
>
> **Always use drag-and-drop** to install.

**Option A: CRX File (Drag and Drop)**

1. Open Chrome: `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. **Drag the `.crx` file** into the Chrome window
4. Click **Add extension**

**Option B: Unpacked Folder**

1. Open Chrome: `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `dist/` folder

### Verify Installation

After installation:
- "SIP.js Headless Chrome Extension" appears in extensions list
- Status shows as **Enabled**
- Options page opens automatically

For detailed installation instructions, see [INSTALLATION.md](./INSTALLATION.md).

---

## Configuration

### Initial Setup

When you first install the extension, the configuration page opens automatically. If you need to access it later:

1. Navigate to `chrome://extensions`
2. Find "SIP.js Headless Chrome Extension"
3. Click **Details** → **Extension options**

### Configuration Fields

Fill in the following required fields:

| Field | Description | Example |
|-------|-------------|---------|
| **SIP Username** | Your SIP account username | `1000`, `user@domain.com` |
| **SIP Password** | Your SIP account password | `your-secure-password` |
| **WebSocket Server URL** | WSS URL of your SIP server | `wss://sip.example.com:7443` |
| **SIP Domain** (optional) | SIP domain/realm (auto-detected if not provided) | `sip.example.com` |

### Example Configuration

```
SIP Username:          1000
SIP Password:          mySecurePassword123
WebSocket Server URL:  wss://pbx.company.com:7443
SIP Domain:            pbx.company.com (optional)
```

### Save and Activate

1. Click **Save Configuration**
2. You'll see a confirmation message: "Configuration saved successfully!"
3. **Important:** You must manually reload the extension for changes to take effect:
   - Go to `chrome://extensions`
   - Click the reload icon (↻) on the extension card

---

## Using the Extension

### Monitoring Extension Activity

Since this is a headless extension, all activity is logged to the browser console:

1. Right-click anywhere in Chrome and select **Inspect** (or press `F12`)
2. Click the **Console** tab
3. Look for logs prefixed with:
   - `[Background]` - Service Worker lifecycle events
   - `[Offscreen UA]` - SIP UserAgent activity
   - `[offscreen-ua.js]` - Call events, registration status

### Understanding Console Logs

**Successful Registration:**
```
[Offscreen UA] Registered successfully!
```

**Incoming Call:**
```
[offscreen-ua.js] Incoming call from sip:2000@pbx.company.com
[offscreen-ua.js] Playing ringtone...
```

**Auto-Answer (BroadSoft):**
```
[offscreen-ua.js] Call-Info header detected: answer-after=2
[offscreen-ua.js] Auto-answering call in 2 seconds...
[offscreen-ua.js] Call answered automatically
```

**Remote Control Call (BroadSoft):**
```
[offscreen-ua.js] Received NOTIFY with Event: talk
[offscreen-ua.js] Initiating call to sip:3000@pbx.company.com
```

### Making Calls

This extension does not provide a dialing interface. Calls are initiated:
- **Remotely:** Via BroadSoft remote control (`NOTIFY Event: talk`)
- **Programmatically:** By extending the extension code (developer feature)

### Receiving Calls

The extension automatically:
1. Registers with the SIP server on startup
2. Listens for incoming calls
3. Plays a ringtone (440Hz beep) for incoming calls
4. Auto-answers if `Call-Info; answer-after` header is present (BroadSoft)

### Hanging Up

Currently, the extension supports single-call scenarios. To end a call:
- The remote party hangs up, or
- You can reload the extension (not recommended for production use)

---

## Troubleshooting

### Extension Not Registering

**Symptom:** Console shows registration errors

**Solutions:**
1. Verify SIP credentials in Options page
2. Check WebSocket Server URL format (must start with `wss://`)
3. Ensure your SIP server supports WebSocket transport
4. Check firewall/network connectivity to SIP server
5. Verify SIP server logs for authentication failures

**Console Error Examples:**
```
[Offscreen UA] Registration failed: 403 Forbidden
→ Check username/password

[Offscreen UA] WebSocket connection failed
→ Check WSS URL and network connectivity
```

### No Audio During Calls

**Symptom:** Call connects but no audio is heard

**Solutions:**
1. Check browser audio permissions (not usually required for extensions)
2. Verify your SIP server's WebRTC/media configuration
3. Check firewall rules for RTP/SRTP ports
4. Ensure STUN/TURN servers are configured on your SIP server
5. Check console for WebRTC errors

### Auto-Answer Not Working

**Symptom:** Calls are not answered automatically

**Solutions:**
1. Verify your SIP server supports `Call-Info` header with `answer-after` parameter
2. Check console logs to confirm header detection
3. Ensure BroadSoft extensions are enabled on your server

**Expected Console Log:**
```
[offscreen-ua.js] Call-Info header detected: answer-after=2
```

### Configuration Changes Not Applied

**Symptom:** Changed settings but extension uses old configuration

**Solution:**
- You must manually **reload the extension** after saving configuration:
  1. Navigate to `chrome://extensions`
  2. Find the extension
  3. Click the reload icon (↻)

### Extension Crashes or Stops Working

**Symptom:** Extension becomes unresponsive, console logs stop

**Solutions:**
1. Reload the extension: `chrome://extensions` → Reload icon
2. Check for Chrome/Edge updates
3. Review console for JavaScript errors
4. Re-install the extension if problem persists

---

## Frequently Asked Questions

### Q: Why don't I see a call button or dialer?

**A:** This is a "headless" extension - it has no visual UI by design. It's intended for automated call handling scenarios (auto-answer, remote control) rather than manual dialing.

### Q: Can I use this on Firefox?

**A:** No, this extension uses Chrome Manifest V3 APIs and is only compatible with Chrome and Edge browsers.

### Q: How do I make outbound calls?

**A:** The extension doesn't provide a dialer UI. Outbound calls are initiated via:
- BroadSoft remote control (`NOTIFY Event: talk`)
- Custom code modifications (developer feature)

### Q: Is my password stored securely?

**A:** Yes, credentials are stored using Chrome's `chrome.storage.sync` API, which is encrypted. Data never leaves your browser except to connect to your configured SIP server. See [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) for details.

### Q: Can I use multiple SIP accounts?

**A:** No, the extension currently supports one SIP account at a time. You would need to change the configuration and reload the extension to switch accounts.

### Q: Does the extension support video calls?

**A:** No, only audio calls are supported in the current version.

### Q: How do I uninstall the extension?

**A:** Navigate to `chrome://extensions`, find "SIP.js Headless Chrome Extension", and click **Remove**. All stored configuration will be deleted.

### Q: Can I transfer or hold calls?

**A:** No, the extension currently supports single call scenarios without transfer or hold features.

### Q: Does it work with Asterisk or 3CX?

**A:** The extension is designed for SIP servers with WebSocket support. It's been tested with FreeSWITCH and should work with Asterisk (with `res_http_websocket`) or 3CX. BroadSoft-specific features require BroadSoft Access-Side extensions.

---

## Support

### Getting Help

1. **Console Logs:** Check browser console (F12 → Console tab) for detailed error messages
2. **Testing Guide:** See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing scenarios
3. **GitHub Issues:** Report bugs at https://github.com/onsip/SIP.js/issues
4. **Source Code:** Review implementation at https://github.com/onsip/SIP.js (chrome-extension directory)

### Reporting Issues

When reporting issues, please include:
- Chrome/Edge version
- Extension version
- Console logs (copy from DevTools console)
- SIP server type (FreeSWITCH, Asterisk, etc.)
- Anonymized configuration (hide passwords!)

### Documentation

- **Developer README:** [README.md](./README.md) - Technical documentation
- **Installation Guide:** [INSTALLATION.md](./INSTALLATION.md) - Detailed installation instructions
- **Testing Guide:** [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Manual testing procedures
- **Privacy Policy:** [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) - Data handling practices
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md) - Version history

---

## Version History

- **v1.0.0** (October 27, 2024) - Initial release
  - Core SIP calling functionality
  - BroadSoft auto-answer and remote control support
  - Automatic reconnection with exponential backoff
  - WebRTC audio handling

---

**Thank you for using the SIP.js Headless Chrome Extension!**

For technical details and development information, see the [README.md](./README.md) file.
