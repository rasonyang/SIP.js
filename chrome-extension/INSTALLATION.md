# Installation Guide - SIP.js Headless Chrome Extension

**Version:** 1.0.0
**Last Updated:** October 28, 2024

This guide provides detailed instructions for installing the SIP.js Headless Chrome Extension in various deployment scenarios.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Methods](#installation-methods)
   - [Method 1: Chrome Web Store (Recommended)](#method-1-chrome-web-store-recommended)
   - [Method 2: CRX File Installation](#method-2-crx-file-installation)
   - [Method 3: Load Unpacked (Developer Mode)](#method-3-load-unpacked-developer-mode)
   - [Method 4: Chrome Enterprise Policy](#method-4-chrome-enterprise-policy)
3. [Post-Installation Configuration](#post-installation-configuration)
4. [Troubleshooting Installation](#troubleshooting-installation)
5. [Updating the Extension](#updating-the-extension)
6. [Uninstalling the Extension](#uninstalling-the-extension)

---

## Prerequisites

### System Requirements

- **Browser:** Google Chrome 99+ or Microsoft Edge 99+
- **Operating System:** Windows, macOS, or Linux
- **Network:** Access to your SIP server (WebSocket Secure - WSS)

### What You'll Need

- Extension package (`.crx` file) or unpacked distribution folder
- SIP account credentials:
  - SIP Username
  - SIP Password
  - WebSocket Server URL (wss://)
  - SIP Domain (optional)

---

## Installation Methods

### Method 1: Chrome Web Store (Recommended)

This is the easiest and most convenient installation method.

#### Advantages

- ✅ One-click installation
- ✅ Automatic updates
- ✅ No developer mode required
- ✅ Works on all platforms (Windows, macOS, Linux)
- ✅ Official Chrome Web Store listing

#### Installation Steps

1. **Visit Chrome Web Store:**
   ```
   🌐 https://chrome.google.com/webstore
   ```

   > **Note:** The extension is currently under review. Once published, the direct link will be added here.

2. **Click "Add to Chrome"**
   - Blue button on the extension's store page
   - May show as "Add extension" depending on your Chrome version

3. **Review Permissions**
   - Chrome shows permissions requested:
     - Storage (save SIP configuration)
     - Alarms (keep connection alive)
     - Offscreen (WebRTC audio handling)
     - Access to `wss://*/*` (connect to SIP servers)

4. **Click "Add extension"**
   - Confirms installation
   - Extension installs immediately

5. **Configure Extension**
   - Options page opens automatically
   - See [Post-Installation Configuration](#post-installation-configuration) below

#### Updates

- **Automatic:** Chrome automatically updates extensions from the store
- **Check manually:** `chrome://extensions` → **Update** button

---

### Method 2: CRX File Installation

This method is for users who received a pre-packaged `.crx` file.

#### Step 1: Obtain the CRX File

You should have received a file named `sip-extension-v1.0.0.crx` (or similar) from your IT administrator or distribution source.

#### Step 2: Enable Developer Mode

1. Open Chrome or Edge
2. Navigate to `chrome://extensions` (or `edge://extensions`)
3. In the top-right corner, toggle **Developer mode** to **ON**

> **Note:** Developer mode is required to install extensions not from the Chrome Web Store. This is a Chrome/Edge security feature.

#### Step 3: Install via Drag and Drop

> **⚠️ IMPORTANT: Do NOT double-click the CRX file!**
>
> Double-clicking a `.crx` file will show an error or download it again. Chrome 99+ does not allow direct installation by double-clicking for security reasons.
>
> **Correct method:** Drag and drop the file into the Chrome extensions page (see below).

1. Open the folder containing the `.crx` file
2. **Drag the `.crx` file** into the browser window showing `chrome://extensions`
   - You can also drag it into any Chrome window, and Chrome will redirect to the extensions page
3. Chrome will prompt: **"Add 'SIP.js Headless Chrome Extension'?"**
4. Review the permissions requested:
   - Storage (save SIP configuration)
   - Alarms (keep connection alive)
   - Offscreen (WebRTC audio handling)
   - Access to `wss://*/*` (connect to SIP servers)
5. Click **Add extension**

#### Step 4: Verify Installation

- You should see "SIP.js Headless Chrome Extension" in your extensions list
- Status: **Enabled** (toggle should be blue/on)
- Version: Should match the version you received (e.g., 1.0.0)

#### Step 5: Configure Extension

The Options page opens automatically on first install. If it doesn't:

1. Click **Details** on the extension card
2. Scroll down and click **Extension options**
3. Fill in your SIP credentials (see [Post-Installation Configuration](#post-installation-configuration))

---

### Method 3: Load Unpacked (Developer Mode)

This method is for developers or users who received the extension as a folder (not a `.crx` file).

#### Step 1: Extract Distribution Files

If you received a zip file, extract it to a permanent location (e.g., `C:\Extensions\sip-extension\` or `~/Extensions/sip-extension/`).

> **Important:** Do NOT delete or move this folder after installation - Chrome loads the extension from this location.

#### Step 2: Identify the Distribution Folder

Locate the `dist/` folder inside the extension directory. It should contain:
```
dist/
├── manifest.json
├── background.js
├── offscreen-ua.js
├── offscreen.html
├── options.js
├── options.html
└── assets/
    ├── icon48.png
    └── icon128.png
```

#### Step 3: Load Unpacked Extension

1. Navigate to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Navigate to and select the `dist/` folder (NOT the parent folder)
5. Click **Select Folder** (or **Open** on macOS)

#### Step 4: Verify Installation

The extension should appear in your extensions list with:
- Name: "SIP.js Headless Chrome Extension"
- Status: Enabled
- Source: Shows the path to your `dist/` folder

#### Step 5: Configure Extension

Follow the configuration steps in [Post-Installation Configuration](#post-installation-configuration).

---

### Method 4: Chrome Enterprise Policy

For IT administrators deploying to managed Chrome browsers in an organizational environment.

#### Prerequisites

- Chrome Enterprise or Chrome Browser Cloud Management
- Admin access to Google Admin console or Group Policy
- Signed CRX file or hosted extension package

#### Option A: Force Install via Policy

**Using Google Admin Console:**

1. Sign in to [Google Admin console](https://admin.google.com)
2. Navigate to: **Devices** → **Chrome** → **Apps & extensions**
3. Select the organizational unit (OU)
4. Click **Add Chrome app or extension** → **Add from URL**
5. Enter the extension ID and update URL (if hosting updates)
6. Set install policy to **Force install**
7. Save and apply

**Using Windows Group Policy:**

1. Download Chrome Enterprise Policy templates
2. Open Group Policy Editor (`gpedit.msc`)
3. Navigate to: **Computer Configuration** → **Administrative Templates** → **Google Chrome** → **Extensions**
4. Configure **Configure the list of force-installed apps and extensions**
5. Add entry: `[EXTENSION_ID];https://your-update-server.com/updates.xml`
6. Apply policy

**Policy JSON Example:**
```json
{
  "ExtensionInstallForcelist": [
    "YOUR_EXTENSION_ID;https://your-update-server.com/updates.xml"
  ]
}
```

#### Option B: Whitelist Installation

To allow users to install the extension without it being force-installed:

**Google Admin Console:**
1. Navigate to: **Devices** → **Chrome** → **Apps & extensions**
2. Add extension to **Allow list**
3. Users can now install from the provided `.crx` file

**Group Policy:**
1. Configure **Configure extension installation whitelist**
2. Add extension ID
3. Users can install via `.crx` file

#### Pre-Configure Extension Settings

To pre-populate SIP credentials (not recommended due to security concerns):

1. Use **ExtensionSettings** policy
2. Provide managed storage values
3. Users cannot modify managed settings

**Example Policy (NOT recommended for passwords):**
```json
{
  "ExtensionSettings": {
    "YOUR_EXTENSION_ID": {
      "installation_mode": "force_installed",
      "update_url": "https://your-update-server.com/updates.xml",
      "managed_configuration": {
        "sipUsername": "default_user",
        "websocketServerURL": "wss://sip.company.com:7443"
      }
    }
  }
}
```

> **Security Warning:** Do NOT distribute passwords via enterprise policy. Users should configure credentials individually.

---

## Post-Installation Configuration

### Access Configuration Page

1. Navigate to `chrome://extensions`
2. Find "SIP.js Headless Chrome Extension"
3. Click **Details**
4. Scroll down and click **Extension options**

**Or:** Right-click the extension icon (if visible) → **Options**

### Configure SIP Credentials

Fill in the following fields:

| Field | Description | Example |
|-------|-------------|---------|
| **SIP Username** | Your SIP account username | `1000` or `user@domain.com` |
| **SIP Password** | Your SIP account password | `your-secure-password` |
| **WebSocket Server URL** | WSS URL of your SIP server | `wss://sip.example.com:7443` |
| **SIP Domain** | SIP domain/realm (optional, auto-detected) | `sip.example.com` |

### Example Configuration

```
SIP Username:          1000
SIP Password:          mySecurePassword123
WebSocket Server URL:  wss://pbx.company.com:7443
SIP Domain:            pbx.company.com (leave blank for auto-detect)
```

### Save and Activate

1. Click **Save Configuration**
2. Confirmation message: "Configuration saved successfully!"
3. **IMPORTANT:** Reload the extension for changes to take effect:
   - Go to `chrome://extensions`
   - Find the extension
   - Click the reload icon (↻)

### Verify Connection

1. Open browser DevTools (F12 or right-click → Inspect)
2. Click the **Console** tab
3. Look for registration confirmation:
   ```
   [Offscreen UA] Registered successfully!
   ```

If you see errors, check [Troubleshooting Installation](#troubleshooting-installation).

---

## Troubleshooting Installation

### Issue: "This extension is not listed in the Chrome Web Store"

**Cause:** Chrome displays this warning for all extensions not installed from the Chrome Web Store.

**Solution:**
- This is expected behavior for privately distributed extensions
- Click **Add extension** to proceed
- For enterprise deployments, use Chrome Enterprise Policy to suppress this warning

### Issue: "Package is invalid: CRX_REQUIRED_PROOF_MISSING"

**Cause:** Chrome 99+ requires CRX3 format with proper signatures.

**Solution:**
- Ensure the `.crx` file was built with Chrome's `--pack-extension` command
- Verify the `.pem` private key was used during packaging
- For developers: Use the build script provided in this repository

### Issue: Extension Doesn't Appear After Installation

**Symptoms:**
- No extension card in `chrome://extensions`
- No Options page opens

**Solutions:**
1. Check that you selected the correct folder (should be `dist/`, not the parent)
2. Verify `manifest.json` exists in the folder
3. Check console for errors: `chrome://extensions` → **Developer mode** → **Errors** button
4. Try reloading: Click the reload icon (↻)

### Issue: "Manifest file is missing or unreadable"

**Cause:** Incorrect folder selected or corrupted files.

**Solutions:**
1. Verify you selected the `dist/` folder containing `manifest.json`
2. Check file permissions (must be readable)
3. Re-extract the extension files if using a zip

### Issue: Extension Installs but Options Page Crashes

**Symptoms:**
- Extension appears in list
- Clicking "Extension options" shows blank page or error

**Solutions:**
1. Check browser console (F12) for JavaScript errors
2. Verify all required files are present in `dist/`:
   - `options.html`
   - `options.js`
   - `manifest.json`
3. Reload the extension
4. Try restarting the browser

### Issue: "Developer mode" Toggle Greyed Out

**Cause:** Enterprise policy may disable developer mode.

**Solutions:**
- Contact your IT administrator
- Request extension be added to enterprise force-install or whitelist
- Use Chrome Enterprise Policy for deployment (see Method 3)

### Issue: Extension Disabled on Startup

**Symptoms:**
- Extension works after install
- Disabled when Chrome restarts
- Message: "This extension is not from the Chrome Web Store"

**Cause:** Chrome disables sideloaded extensions by default (consumer versions).

**Solutions:**
- **For Users:** Re-enable manually or use Chrome Enterprise edition
- **For Admins:** Deploy via Chrome Enterprise Policy (force-install)
- **For Developers:** Keep developer mode enabled

---

## Updating the Extension

### Manual Update (CRX File)

1. Obtain the new `.crx` file (e.g., `sip-extension-v1.1.0.crx`)
2. Navigate to `chrome://extensions`
3. **Remove** the old version:
   - Find the extension
   - Click **Remove** → **Remove** (confirm)
4. Install the new version:
   - Drag the new `.crx` file into the extensions page
   - Click **Add extension**
5. Re-configure if needed (settings may be lost)

> **Note:** Extension data is cleared when removing the extension. Save your configuration settings before updating.

### Manual Update (Unpacked)

1. Navigate to `chrome://extensions`
2. Find the extension
3. Click the **reload icon (↻)** to reload from disk
4. Verify new version number appears

### Automatic Updates (Enterprise)

If your IT administrator configured automatic updates:

1. Chrome checks for updates automatically
2. Updates install in the background
3. No user action required
4. Configuration settings are preserved

To check for updates manually:
1. Navigate to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Update** (top-left corner)

---

## Uninstalling the Extension

### Complete Removal

1. Navigate to `chrome://extensions`
2. Find "SIP.js Headless Chrome Extension"
3. Click **Remove**
4. Confirm: **Remove**

### What Gets Deleted

- Extension files (if installed from `.crx`)
- Configuration data (SIP credentials stored in chrome.storage.sync)
- Console logs and browsing data related to the extension

### What Remains

- If installed via "Load unpacked", the source folder remains on disk
- Chrome may retain sync data if Chrome Sync is enabled (can be cleared via Settings)

### Clear Synced Data

If you use Chrome Sync and want to remove configuration from all devices:

1. Navigate to `chrome://settings/syncSetup/advanced`
2. Click **Clear data** next to "Extensions"
3. Confirm data removal

---

## Security Considerations

### Permissions Explained

The extension requests the following permissions:

- **storage:** Store SIP configuration locally (encrypted by Chrome)
- **alarms:** Keep Service Worker alive for persistent SIP connection
- **offscreen:** Create offscreen documents for WebRTC audio playback
- **wss://*/*:** Connect to any WebSocket Secure (WSS) SIP server

All permissions are necessary for core functionality. See [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) for details.

### Best Practices

1. **Verify Source:** Only install `.crx` files from trusted sources (your IT department)
2. **Check Permissions:** Review permissions before clicking "Add extension"
3. **Secure Credentials:** Use strong passwords and change them regularly
4. **Network Security:** Ensure SIP server connections use WSS (not WS) for encryption
5. **Keep Updated:** Install updates promptly when provided by your administrator

---

## Enterprise Deployment Checklist

For IT administrators preparing to deploy this extension:

- [ ] Test extension on pilot group of users
- [ ] Verify SIP server compatibility (WebSocket support)
- [ ] Prepare SIP credentials for users
- [ ] Build and sign `.crx` file with consistent private key
- [ ] (Optional) Set up update server with `updates.xml`
- [ ] Configure Chrome Enterprise Policy (force-install or whitelist)
- [ ] Prepare user documentation (distribute USER_MANUAL.md)
- [ ] Set up support channel for troubleshooting
- [ ] Test installation on all target OS platforms (Windows, macOS, Linux)
- [ ] Verify network/firewall rules allow WSS connections

---

## Additional Resources

- **User Manual:** [USER_MANUAL.md](./USER_MANUAL.md) - Usage instructions and FAQ
- **Testing Guide:** [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Manual testing procedures
- **Developer README:** [README.md](./README.md) - Technical documentation
- **Privacy Policy:** [PRIVACY_POLICY.md](./PRIVACY_POLICY.md) - Data handling practices
- **Changelog:** [CHANGELOG.md](./CHANGELOG.md) - Version history

---

## Support

For installation issues:

1. Check this guide's [Troubleshooting Installation](#troubleshooting-installation) section
2. Review browser console for error messages (F12 → Console tab)
3. Contact your IT administrator (for enterprise deployments)
4. Report bugs: https://github.com/onsip/SIP.js/issues

---

**Need Help?** See [USER_MANUAL.md](./USER_MANUAL.md) for troubleshooting and FAQ.
