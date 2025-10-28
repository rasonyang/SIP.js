# Changelog

## [1.0.0] - 2024-10-27

### Initial Release
- Complete Chrome Manifest V3 extension implementation
- Pure headless operation (console logs only)
- BroadSoft Access-Side extensions support
- Direct SIP.js source integration via Webpack alias
- Exponential backoff reconnection
- Web Audio API ringtone

### Improved
- **SIP Domain is now optional** (auto-detected from WebSocket URL)
  - Simplifies configuration for most use cases
  - Automatically extracts hostname from WSS URL
  - Still allows manual override for advanced scenarios
  - Example: `wss://192.168.1.100:7443` → domain: `192.168.1.100`

### Configuration Fields

**Required:**
- SIP Username
- SIP Password
- WebSocket Server URL

**Optional:**
- SIP Domain (auto-detected if not provided)

### Features

✅ **Pure Headless Operation**
- No notifications
- No badge updates
- No popup windows
- Console-only logging

✅ **BroadSoft Support**
- Auto-answer via `Call-Info; answer-after`
- Remote control via `NOTIFY (Event: talk)`

✅ **Developer Experience**
- Hot reload with `npm run dev`
- Source maps for debugging SIP.js source
- Comprehensive console logging
- Manual extension reload workflow

✅ **Reconnection**
- Exponential backoff (1s → 60s max)
- Automatic retry on disconnect

✅ **Audio**
- Web Audio API ringtone (440Hz, 200ms)
- Remote audio playback via `<audio>` element

### Technical Details

- **Chrome**: Version 90+ required (Manifest V3)
- **Permissions**: `storage`, `alarms`, `offscreen`, `wss://*/*`
- **Architecture**: Service Worker + Offscreen Document
- **Build**: Webpack with TypeScript support
- **Source Integration**: Direct alias to `../src/`

### Documentation

- README.md: Complete user guide
- TESTING_GUIDE.md: Manual testing instructions
- IMPLEMENTATION_STATUS.md: Development status
- CHANGELOG.md: This file

### Known Limitations

- Manual extension reload required after configuration changes (by design)
- Chrome/Edge only (no Firefox - Manifest V3 specific)
- Single call only (no call waiting/transfer)
- FreeSWITCH focused (tested with FreeSWITCH only)

### Testing

See TESTING_GUIDE.md for complete manual testing procedures with FreeSWITCH.

Quick start:
```bash
cd chrome-extension
npm install
npm run dev
# Load chrome-extension/dist/ in chrome://extensions
# Configure and test
```
