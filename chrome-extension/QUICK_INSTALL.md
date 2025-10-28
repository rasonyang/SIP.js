# Quick Installation Guide

**Simple step-by-step guide to install the SIP.js Chrome Extension**

---

## Easiest Method: Chrome Web Store (Recommended)

### 🌐 One-Click Installation

1. Visit: **[Chrome Web Store](https://chrome.google.com/webstore)** _(Link will be updated once published)_
2. Click: **"Add to Chrome"**
3. Confirm: **"Add extension"**
4. Done! ✅

**Benefits:**
- ✅ No developer mode needed
- ✅ Automatic updates
- ✅ Takes only 30 seconds

---

## Alternative: Manual CRX Installation

If you have a `.crx` file, use this method:

### ⚠️ IMPORTANT: Do NOT Double-Click the CRX File!

### ❌ Wrong Method
```
Double-clicking sip-extension-v1.0.0.crx
→ Shows error or downloads again
→ Does NOT install the extension
```

### ✅ Correct Method
```
Drag and drop into chrome://extensions
→ Chrome shows "Add extension?" prompt
→ Extension installs successfully
```

**Why?** Chrome 99+ blocks double-click installation for security reasons.

---

## Installation Steps (3 minutes)

### Step 1: Open Chrome Extensions Page

**Option A: Via Address Bar**
```
Type in Chrome address bar: chrome://extensions
Press Enter
```

**Option B: Via Menu**
```
Chrome Menu (⋮) → Extensions → Manage Extensions
```

### Step 2: Enable Developer Mode

1. Look at the **top-right corner** of the extensions page
2. Find the **"Developer mode"** toggle switch
3. Click to turn it **ON** (switch turns blue)

```
┌─────────────────────────────────────────────┐
│ Extensions                    Developer mode │
│                               [ON] ←────────┐│
└─────────────────────────────────────────────┘│
                                               │
                    Turn this ON ──────────────┘
```

### Step 3: Drag and Drop the CRX File

1. Open Finder/File Explorer
2. Navigate to the folder containing `sip-extension-v1.0.0.crx`
3. **Drag** the `.crx` file with your mouse
4. **Drop** it anywhere on the Chrome extensions page

```
┌──────────────────┐
│ Finder           │
│ ┌──────────────┐ │          ┌─────────────────────┐
│ │ sip-ext...crx│ │───drag──→│ chrome://extensions │
│ └──────────────┘ │          │                     │
└──────────────────┘          │  Drop here!         │
                              └─────────────────────┘
```

**Alternative:** Drag into any Chrome window - Chrome will redirect to extensions page.

### Step 4: Confirm Installation

Chrome will show a dialog:

```
┌────────────────────────────────────────┐
│  Add "SIP.js Headless Chrome           │
│  Extension"?                           │
│                                        │
│  It can:                               │
│  • Read and modify data on wss://*    │
│  • Store data                          │
│                                        │
│  [Cancel]  [Add extension]  ←─── Click│
└────────────────────────────────────────┘
```

1. Review the permissions (storage, alarms, offscreen, wss access)
2. Click **"Add extension"**

### Step 5: Verify Installation

You should see the extension in your list:

```
┌────────────────────────────────────────────┐
│ ✓ SIP.js Headless Chrome Extension  [ON]  │
│   Version: 1.0.0                           │
│   [Details] [Remove]                       │
└────────────────────────────────────────────┘
```

**Success indicators:**
- Extension appears in the list
- Toggle is **ON** (blue)
- Version shows `1.0.0` (or your version)
- Options page opens automatically

---

## Next Steps

### Configure the Extension

The options page should open automatically. If not:

1. Click **"Details"** on the extension card
2. Scroll down to **"Extension options"**
3. Click to open

### Fill in Your SIP Credentials

```
SIP Username:          [your_username]
SIP Password:          [your_password]
WebSocket Server URL:  [wss://your-server.com:7443]
SIP Domain (optional): [leave blank or enter custom domain]
```

Click **"Save Configuration"**

### Reload the Extension

**Important:** After saving, you must reload the extension:

1. Go back to `chrome://extensions`
2. Find the extension
3. Click the **reload icon (↻)**

### Verify It's Working

1. Right-click anywhere in Chrome → **"Inspect"** (or press F12)
2. Click the **"Console"** tab
3. Look for: `[Offscreen UA] Registered successfully!`

If you see that message, you're all set! ✅

---

## Common Issues and Solutions

### Issue 1: Double-Clicked the CRX File

**Symptoms:**
- Error message appears
- File downloads again
- Nothing happens

**Solution:**
1. Close any error dialogs
2. Follow Step 3 above: **Drag and drop** instead
3. Do NOT double-click

### Issue 2: "Developer mode" Toggle is Missing

**Symptoms:**
- Cannot find "Developer mode" toggle
- Top-right corner is empty

**Solution:**
- Your organization may have disabled Developer mode
- Contact IT administrator
- Ask them to deploy via Chrome Enterprise Policy (see INSTALLATION.md)

### Issue 3: "This extension is not listed in the Chrome Web Store"

**Symptoms:**
- Warning message after drag-and-drop
- Chrome warns about extension source

**Solution:**
- This is **normal** for private extensions
- Click **"Add extension anyway"** or **"Add extension"**
- The extension is safe (verify SHA-256 hash with your IT admin)

### Issue 4: Extension Installs But Doesn't Work

**Symptoms:**
- Extension appears in list
- No console logs
- Configuration doesn't save

**Solution:**
1. Check if extension is **enabled** (toggle is ON)
2. Reload the extension: Click reload icon (↻)
3. Open DevTools console to see errors
4. Verify SIP server URL is correct

### Issue 5: Extension Disappears After Chrome Restart

**Symptoms:**
- Extension works after installation
- Gone after closing and reopening Chrome

**Solution:**
- Consumer Chrome disables sideloaded extensions by default
- **Option A:** Use Chrome Enterprise (for organizations)
- **Option B:** Re-enable manually after each restart (not ideal)
- **Option C:** Deploy via Chrome Enterprise Policy (see INSTALLATION.md)

### Issue 6: "CRX_REQUIRED_PROOF_MISSING" Error

**Symptoms:**
- Error during installation
- CRX signature issue

**Solution:**
1. Verify CRX file was built correctly
2. Check file integrity (SHA-256 hash)
3. Try rebuilding: `./scripts/build-crx.sh`
4. Contact IT admin for a fresh CRX file

---

## Video Tutorial (If Available)

[Link to video walkthrough - to be added]

---

## Need More Help?

### For End Users

- **Full Manual:** See [USER_MANUAL.md](./USER_MANUAL.md)
- **Detailed Installation:** See [INSTALLATION.md](./INSTALLATION.md)
- **FAQ:** See USER_MANUAL.md → Frequently Asked Questions
- **Contact IT:** Your IT administrator or helpdesk

### For IT Administrators

- **Enterprise Deployment:** See INSTALLATION.md → Method 3
- **Chrome Enterprise Policy:** https://support.google.com/chrome/a/answer/9296680
- **Troubleshooting:** See INSTALLATION.md → Troubleshooting Installation

---

## Quick Reference Card

**Print this and keep at your desk:**

```
┌──────────────────────────────────────────────────┐
│  SIP.js Chrome Extension - Quick Install         │
├──────────────────────────────────────────────────┤
│                                                  │
│  1. Open: chrome://extensions                   │
│  2. Enable: Developer mode (top-right)          │
│  3. Drag: sip-extension-v1.0.0.crx into window  │
│  4. Click: "Add extension"                      │
│  5. Configure: Fill in SIP credentials          │
│  6. Reload: Click reload icon (↻)               │
│                                                  │
│  ⚠️ DO NOT double-click the .crx file!          │
│                                                  │
│  Support: [IT Helpdesk Contact]                 │
└──────────────────────────────────────────────────┘
```

---

## SHA-256 Hash Verification

To verify file integrity (ask IT admin for expected hash):

**macOS/Linux:**
```bash
shasum -a 256 sip-extension-v1.0.0.crx
```

**Windows (PowerShell):**
```powershell
Get-FileHash sip-extension-v1.0.0.crx -Algorithm SHA256
```

**Current version hash:**
```
6134e9f75cd8666367e82dd4ed2a6aeb7715e264ba5fbc2020906bd9ff8b7140
```

---

**Installation complete!** You can now use the SIP.js Chrome Extension.

For configuration and usage, see [USER_MANUAL.md](./USER_MANUAL.md).
