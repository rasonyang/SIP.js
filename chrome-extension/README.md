# SIP.js Headless Chrome Extension (MV3)

A reference implementation of a headless Chrome extension using SIP.js with BroadSoft Access-Side extensions support.

## Features

- **Pure Headless Operation**: No notifications, badges, or popups - all state visible only in DevTools console
- **BroadSoft Support**: Auto-answer (`Call-Info; answer-after`) and remote control (`NOTIFY Event: talk`)
- **Direct Source Integration**: Uses Webpack alias to debug SIP.js source code directly
- **Exponential Backoff**: Automatic reconnection with exponential backoff (1s → 60s max)
- **Hot Reload**: Development workflow with automatic rebuilds
- **Manifest V3**: Modern Chrome extension architecture with Service Workers and offscreen documents

## Installation

### 1. Install Dependencies

```bash
cd chrome-extension
npm install
```

### 2. Build the Extension

**Development mode** (with hot reload):
```bash
npm run dev
```

**Production build**:
```bash
npm run build
```

### 3. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `chrome-extension/dist/` directory
5. The extension will open the options page automatically

## Configuration

### SIP Account Setup

Open the options page and configure:

- **SIP Username**: Your SIP account username (required)
- **SIP Password**: Your SIP account password (required)
- **WebSocket Server URL**: WSS endpoint (required)
- **SIP Domain**: Your SIP server domain (optional - auto-detected from WSS URL)

#### WebSocket URL Examples

- Local FreeSWITCH: `wss://127.0.0.1:5066`
- Remote server: `wss://sip.example.com:7443`
- Development (self-signed cert): Use `wss://` even with self-signed certificates in Chrome developer mode

#### SIP Domain (Optional Field)

The extension **automatically extracts the domain from your WebSocket URL**:
- `wss://127.0.0.1:5066` → domain: `127.0.0.1`
- `wss://sip.example.com:7443` → domain: `sip.example.com`

**Only specify a custom SIP Domain if** your SIP identity domain differs from the WebSocket server hostname. For example:
- WSS URL: `wss://gateway.provider.com:7443`
- SIP Domain: `customer.com` (custom domain for your SIP URI)

**Important**: After saving configuration, you must manually reload the extension:
1. Go to `chrome://extensions`
2. Find "SIP.js Headless Extension"
3. Click the "Reload" button

### FreeSWITCH Configuration

This extension is designed to work with FreeSWITCH with WebSocket support.

#### Basic WSS Setup

1. Enable WSS in FreeSWITCH configuration
2. Configure SIP user with appropriate permissions
3. Enable BroadSoft extensions (optional, for auto-answer and remote control)

For detailed FreeSWITCH setup, refer to:
- [FreeSWITCH WebRTC Documentation](https://freeswitch.org/confluence/display/FREESWITCH/WebRTC)
- [FreeSWITCH WebSocket Configuration](https://freeswitch.org/confluence/display/FREESWITCH/mod_verto)

#### BroadSoft Extension Activation

To enable auto-answer:
- FreeSWITCH should send `Call-Info: <uri>; answer-after=N` header in INVITE
- `answer-after=0` answers immediately
- `answer-after=N` answers after N seconds

To enable remote control:
- Use FreeSWITCH `uuid_phone_event` command
- Sends `NOTIFY` with `Event: talk` header
- Extension will automatically answer or resume from hold

## Development Workflow

### 1. Edit Source Files

Edit files in `chrome-extension/src/`:
- `background.js` - Service Worker
- `offscreen-ua.js` - SIP UserAgent logic
- `options.js` / `options.html` - Configuration UI

### 2. Webpack Rebuilds Automatically

When running `npm run dev`, Webpack watches for changes and rebuilds to `dist/`

### 3. Reload Extension

After changes:
1. Go to `chrome://extensions`
2. Click "Reload" on the extension

### 4. Monitor Console

**Offscreen Document Console**:
1. Go to `chrome://extensions`
2. Find "SIP.js Headless Extension"
3. Click "Inspect views: offscreen.html"
4. Console shows all SIP events, registration, calls, etc.

**Background Service Worker Console**:
1. Go to `chrome://extensions`
2. Click "Inspect views: service worker"
3. Console shows lifecycle events, keep-alive pings

## Pure Headless Operation

This extension is designed for automation and testing scenarios with **no visual UI**:

- ❌ No browser notifications for incoming calls
- ❌ No badge updates on extension icon
- ❌ No popup windows or dialogs
- ✅ All state changes logged to console
- ✅ Calls without auto-answer ring (Web Audio beep) and wait for remote control
- ✅ Audio playback through offscreen document `<audio>` element

## Testing

### Manual Testing Checklist

- [ ] Extension loads without errors
- [ ] Configuration saves and persists
- [ ] SIP registration succeeds (check offscreen console)
- [ ] Incoming call without `Call-Info` header plays ringtone, logs "waiting for remote control"
- [ ] Incoming call with `Call-Info; answer-after=0` auto-answers immediately
- [ ] Incoming call with `Call-Info; answer-after=1` auto-answers after 1 second
- [ ] `NOTIFY (Event: talk)` during ringing answers the call
- [ ] `NOTIFY (Event: talk)` during established call resumes from hold
- [ ] Audio plays through remote audio element
- [ ] Network interruption triggers exponential backoff reconnection (check logs for 1s, 2s, 4s... delays)
- [ ] Service Worker stays alive (check after 30+ seconds idle)
- [ ] Source maps work (set breakpoint in `../src/` SIP.js source, verify in DevTools)

### Debugging

**Set Breakpoints in SIP.js Source**:
1. Open offscreen document DevTools
2. Navigate to Sources tab
3. Find files under `webpack://` → `../src/`
4. Set breakpoints directly in SIP.js source code
5. Breakpoints work due to source maps

**Common Issues**:

- **Configuration not taking effect**: Reload the extension manually
- **WebSocket connection fails**: Check WSS URL format, FreeSWITCH status, firewall
- **Self-signed certificate errors**: Chrome developer mode should allow self-signed certs
- **Service Worker terminated**: Check keep-alive alarm in background console

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Chrome Extension                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐          ┌───────────────────┐  │
│  │ background.js    │          │ offscreen.html    │  │
│  │ (Service Worker) │          │ offscreen-ua.js   │  │
│  │                  │          │                   │  │
│  │ - Keep alive     │          │ - SIP UA (@sip)  │  │
│  │ - Create offscr. │          │ - WebRTC/audio   │  │
│  │ - Console logs   │          │ - BroadSoft      │  │
│  └──────────────────┘          └───────────────────┘  │
│         │                                  │           │
│         │ chrome.storage                   │ WSS      │
│         ▼                                  ▼           │
│  ┌──────────────────┐          ┌───────────────────┐  │
│  │ options.html     │          │ FreeSWITCH Server │  │
│  │ options.js       │          │ (BroadSoft ext.)  │  │
│  └──────────────────┘          └───────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Webpack alias: @sip → ../src
                         ▼
              ┌─────────────────────┐
              │ SIP.js/src/         │
              │ (library source)    │
              └─────────────────────┘
```

## Technical Details

### Ringtone Implementation

Uses Web Audio API to generate a 440Hz (A4 note) beep for 200ms:
```javascript
const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
oscillator.frequency.value = 440;
oscillator.start();
setTimeout(() => oscillator.stop(), 200);
```

### Reconnection Strategy

Exponential backoff with maximum 60-second delay:
```
Attempt 1: immediate
Attempt 2: wait 1s
Attempt 3: wait 2s
Attempt 4: wait 4s
Attempt 5: wait 8s
...
Attempt N: wait min(60s, 2^(N-2) seconds)
```

### Webpack Configuration

- **Dev**: `eval-source-map` for fast rebuilds
- **Production**: `source-map` for external .map files
- **Alias**: `@sip` resolves to `../src/` for live source debugging
- **TypeScript**: ts-loader transpiles SIP.js TypeScript source

## Requirements

- **Chrome**: Version 90+ (Manifest V3 support)
- **FreeSWITCH**: WebSocket-enabled SIP server
- **Node.js**: For build tools (development only)

## License

MIT (same as SIP.js)

## Contributing

This is a reference implementation. For SIP.js library contributions, see the main repository.

## Links

- [SIP.js Documentation](https://sipjs.com/)
- [BroadSoft Extensions README](../src/api/broadsoft/README.md)
- [FreeSWITCH](https://freeswitch.org/)
- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
