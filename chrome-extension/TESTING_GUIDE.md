# Manual Testing Guide

Complete guide for testing the SIP.js Chrome Extension with FreeSWITCH.

## Prerequisites

- **Chrome Browser**: Version 90+ (for Manifest V3 support)
- **Node.js**: For building the extension
- **FreeSWITCH Server**: With WebSocket (WSS) support
- **SIP Account**: Username and password on FreeSWITCH

## Part 1: Build and Load Extension

### Step 1: Install Dependencies

```bash
cd /Users/rasonyang/workspaces/SIP.js/chrome-extension
npm install
```

This installs:
- Webpack and plugins
- TypeScript loader
- Copy webpack plugin

### Step 2: Build the Extension

**For development (with hot reload):**
```bash
npm run dev
```

**For production:**
```bash
npm run build
```

The build output will be in `chrome-extension/dist/`

### Step 3: Load Extension in Chrome

1. **Open Chrome Extensions Page**:
   - Navigate to `chrome://extensions`
   - Or: Menu → More Tools → Extensions

2. **Enable Developer Mode**:
   - Toggle "Developer mode" in the top-right corner

3. **Load Unpacked Extension**:
   - Click "Load unpacked" button
   - Navigate to and select: `/Users/rasonyang/workspaces/SIP.js/chrome-extension/dist/`
   - Click "Select"

4. **Verify Extension Loaded**:
   - You should see "SIP.js Headless Extension" in the extensions list
   - Status should be "Enabled"
   - Options page should open automatically on first install

### Step 4: Configure SIP Account

The options page opens automatically on first install, or you can open it:
- Click "Details" on the extension
- Click "Extension options"
- Or right-click extension icon → Options

**Fill in the form:**
- **SIP Username**: Your FreeSWITCH user (e.g., `1000`)
- **SIP Password**: Your password
- **WebSocket Server URL**: WSS endpoint (see FreeSWITCH section below)
- **SIP Domain**: (optional - leave empty for auto-detection)

Example (simplified):
```
Username: 1000
Password: 1234
WSS URL: wss://192.168.1.100:7443
SIP Domain: (leave empty - auto-detects to 192.168.1.100)
```

**Advanced Example** (custom domain):
```
Username: 1000
Password: 1234
WSS URL: wss://sip-gateway.example.com:7443
SIP Domain: pbx.example.com  (custom SIP identity domain)
```

**Note**: The SIP Domain field is now **optional**. The extension automatically extracts the hostname from your WebSocket URL. Only fill in the SIP Domain if your SIP identity domain differs from the WebSocket server hostname.

**Click "Save Configuration"**

### Step 5: Reload Extension

**Important**: Configuration only takes effect after reload!

1. Go back to `chrome://extensions`
2. Find "SIP.js Headless Extension"
3. Click the **Reload** button (circular arrow icon)

## Part 2: Monitor Extension Activity

### Open Offscreen Document Console

This is where all SIP activity is logged:

1. Go to `chrome://extensions`
2. Find "SIP.js Headless Extension"
3. Click **"Inspect views: offscreen.html"**
4. A DevTools window opens showing the offscreen document console

**You should see:**
```
[OffscreenUA] Module loading...
[OffscreenUA] Document loaded, initializing...
[OffscreenUA] Status: Loading...
[OffscreenUA] Loading configuration from storage...
[OffscreenUA] Configuration loaded: {username: "1000", domain: "192.168.1.100", ...}
[OffscreenUA] Creating UserAgent...
[OffscreenUA] Starting UserAgent...
[OffscreenUA] UserAgent started
[OffscreenUA] Registering...
[OffscreenUA] Transport connected
[OffscreenUA] Registration successful
[OffscreenUA] Status: Registered
```

### Open Background Service Worker Console

For lifecycle and keep-alive monitoring:

1. Go to `chrome://extensions`
2. Find "SIP.js Headless Extension"
3. Click **"Inspect views: service worker"**

**You should see:**
```
[Background] Service Worker starting...
[Background] Extension installed: install
[Background] Opened options page for first-time setup
[Background] Keep-alive alarm created (20s period)
[Background] Offscreen document created successfully
[Background] Service Worker initialized
[Background] Keep-alive alarm fired
```

## Part 3: FreeSWITCH Setup

### Option A: Using Existing FreeSWITCH

If you already have FreeSWITCH running with WebSocket support:

1. **Find your WSS URL**:
   - Usually `wss://<freeswitch-ip>:7443`
   - Or `wss://<freeswitch-ip>:5066` for ws-binding

2. **Verify SIP user exists**:
   ```bash
   fs_cli -x "list_users"
   ```

3. **Test WebSocket**:
   ```bash
   openssl s_client -connect <freeswitch-ip>:7443
   ```

### Option B: Docker FreeSWITCH (Quick Setup)

**Pull and run FreeSWITCH in Docker:**

```bash
# Pull FreeSWITCH image
docker pull drachtio/drachtio-freeswitch-mrf

# Run FreeSWITCH
docker run -d \
  --name freeswitch \
  -p 5060:5060/udp \
  -p 5060:5060/tcp \
  -p 7443:7443 \
  -p 16384-16394:16384-16394/udp \
  drachtio/drachtio-freeswitch-mrf

# Check logs
docker logs -f freeswitch
```

**Default credentials (if using standard image):**
- Username: `1000` to `1019`
- Password: `1234`
- Domain: `127.0.0.1` or container IP
- WSS URL: `wss://127.0.0.1:7443`

### Option C: Manual FreeSWITCH Configuration

If you need to set up FreeSWITCH from scratch:

#### 1. Enable WebSocket Transport

Edit `/etc/freeswitch/sip_profiles/internal.xml`:

```xml
<!-- Add WebSocket binding -->
<param name="ws-binding" value=":5066"/>
<param name="wss-binding" value=":7443"/>
```

Or create `/etc/freeswitch/sip_profiles/wss.xml`:

```xml
<profile name="wss">
  <settings>
    <param name="ws-binding" value=":5066"/>
    <param name="wss-binding" value=":7443"/>
    <param name="context" value="public"/>
    <param name="dialplan" value="XML"/>
    <param name="auth-calls" value="true"/>
  </settings>
</profile>
```

#### 2. Create SIP User

Edit `/etc/freeswitch/directory/default/1000.xml`:

```xml
<include>
  <user id="1000">
    <params>
      <param name="password" value="1234"/>
      <param name="vm-password" value="1000"/>
    </params>
    <variables>
      <variable name="toll_allow" value="domestic,international,local"/>
      <variable name="accountcode" value="1000"/>
      <variable name="user_context" value="default"/>
      <variable name="effective_caller_id_name" value="Extension 1000"/>
      <variable name="effective_caller_id_number" value="1000"/>
    </variables>
  </user>
</include>
```

#### 3. Restart FreeSWITCH

```bash
systemctl restart freeswitch
# Or
fs_cli -x "reloadxml"
fs_cli -x "sofia profile internal restart"
```

## Part 4: Test Scenarios

### Test 1: Basic Registration

**Expected Result**: Extension registers successfully

**Steps**:
1. Open offscreen console (chrome://extensions → Inspect views: offscreen.html)
2. Watch for registration logs

**Success Indicators**:
```
[OffscreenUA] Registration successful
[OffscreenUA] Status: Registered
```

**If Registration Fails**:
- Check WSS URL format (must start with `wss://` or `ws://`)
- Verify FreeSWITCH is running: `systemctl status freeswitch`
- Check FreeSWITCH logs: `tail -f /var/log/freeswitch/freeswitch.log`
- Test WebSocket manually: `wscat -c wss://127.0.0.1:7443`

### Test 2: Incoming Call (No Auto-Answer)

**Expected Result**: Call rings, extension waits for remote control

**Steps**:
1. From another SIP phone, call the extension (e.g., dial 1000)
2. Watch offscreen console

**Success Indicators**:
```
[OffscreenUA] Incoming call from: sip:caller@domain
[OffscreenUA] No auto-answer header - ringing, waiting for remote control
[OffscreenUA] Ringtone played (440Hz, 200ms)
[OffscreenUA] Status: Incoming call - waiting for remote control
```

**What You Should Hear**:
- A brief 440Hz beep (200ms) plays once

**What You Should NOT See**:
- ❌ No browser notifications
- ❌ No badge on extension icon
- ❌ No popup windows

### Test 3: Auto-Answer with Delay

**Expected Result**: Call auto-answers after specified delay

**Steps**:
1. **On FreeSWITCH**: Configure dialplan to add `Call-Info` header

   Edit `/etc/freeswitch/dialplan/default/01_example.xml`:
   ```xml
   <extension name="auto_answer_1000">
     <condition field="destination_number" expression="^1000$">
       <action application="export" data="sip_h_Call-Info=<sip:${domain_name}>;answer-after=1"/>
       <action application="bridge" data="user/1000"/>
     </condition>
   </extension>
   ```

   Reload: `fs_cli -x "reloadxml"`

2. **Call** the extension from another phone
3. **Watch** offscreen console

**Success Indicators**:
```
[OffscreenUA] Incoming call from: sip:caller@domain
[OffscreenUA] Auto-answer enabled, delay: 1s
[OffscreenUA] Auto-answering in 1s...
[OffscreenUA] Status: Auto-answering in 1s
[OffscreenUA] Call auto-answered
[OffscreenUA] Status: Call active (auto-answered)
[OffscreenUA] Remote audio bound to <audio> element
```

### Test 4: Immediate Auto-Answer

**Expected Result**: Call answers instantly (0 second delay)

**Steps**:
1. **On FreeSWITCH**: Change dialplan to `answer-after=0`:
   ```xml
   <action application="export" data="sip_h_Call-Info=<sip:${domain_name}>;answer-after=0"/>
   ```

2. **Call** the extension
3. **Verify** immediate answer in console

**Success Indicators**:
```
[OffscreenUA] Auto-answer enabled, delay: 0s
[OffscreenUA] Auto-answering in 0s...
[OffscreenUA] Call auto-answered
```

### Test 5: Remote Control (Answer via NOTIFY)

**Expected Result**: NOTIFY message answers ringing call

**Steps**:
1. **Place call** to extension (without auto-answer header)
2. **Call rings**, extension logs "waiting for remote control"
3. **On FreeSWITCH CLI**, send NOTIFY:
   ```bash
   fs_cli
   # Find the call UUID
   show channels

   # Send talk event to answer
   uuid_phone_event <uuid> talk
   ```

**Success Indicators**:
```
[OffscreenUA] Incoming call - waiting for remote control
[OffscreenUA] NOTIFY received, Event: talk
[OffscreenUA] BroadSoft remote control NOTIFY detected
[OffscreenUA] BroadSoft talk event: talk
[OffscreenUA] Status: Remote control: talk
[OffscreenUA] applyTalkAction: session.state = Initial
[OffscreenUA] applyTalkAction: Calling session.accept()
[OffscreenUA] applyTalkAction: session.accept() completed
[OffscreenUA] BroadSoft NOTIFY handled and accepted
```

### Test 6: Network Reconnection

**Expected Result**: Exponential backoff reconnection

**Steps**:
1. **While registered**, stop FreeSWITCH:
   ```bash
   systemctl stop freeswitch
   ```

2. **Watch** offscreen console for reconnection attempts

**Success Indicators**:
```
[OffscreenUA] Transport disconnected: [error details]
[OffscreenUA] Status: Disconnected
[OffscreenUA] Reconnecting in 1000ms (attempt 1)...
[OffscreenUA] Retry attempt 1
[Error: connection failed]
[OffscreenUA] Reconnecting in 2000ms (attempt 2)...
[OffscreenUA] Retry attempt 2
[Error: connection failed]
[OffscreenUA] Reconnecting in 4000ms (attempt 3)...
[OffscreenUA] Retry attempt 3
...
[OffscreenUA] Reconnecting in 60000ms (attempt 7)...
```

3. **Restart FreeSWITCH**:
   ```bash
   systemctl start freeswitch
   ```

4. **Verify** successful reconnection:
   ```
   [OffscreenUA] Transport connected
   [OffscreenUA] Registration successful
   [OffscreenUA] Status: Registered
   ```

### Test 7: Source Map Debugging

**Expected Result**: Breakpoints work in SIP.js source

**Steps**:
1. **Open** offscreen DevTools
2. **Go to** Sources tab
3. **Navigate** to `webpack://` → `../src/` → `api/` → `user-agent.ts`
4. **Set a breakpoint** in the UserAgent constructor or start() method
5. **Reload** the extension
6. **Verify** debugger pauses at your breakpoint
7. **Inspect** variables and step through TypeScript source code

**Success**: You can debug original TypeScript code, not transpiled JavaScript

## Part 5: Advanced Testing

### Test Call Audio

1. **Place a call** that gets answered (auto-answer or remote control)
2. **Speak** into the calling phone
3. **Verify** you hear audio through your computer speakers
4. **Check** offscreen console for:
   ```
   [OffscreenUA] Remote audio bound to <audio> element
   ```

### Test Service Worker Keep-Alive

1. **Open** background Service Worker console
2. **Wait** 30+ seconds without activity
3. **Verify** keep-alive logs every ~20 seconds:
   ```
   [Background] Keep-alive alarm fired
   ```
4. **Check** Service Worker status remains "Active" (not terminated)

### Test Configuration Changes

1. **Change** any config value in options page
2. **Save** configuration
3. **Verify** message: "Please reload the extension"
4. **WITHOUT reloading**, check offscreen console
5. **Verify** old configuration still in use
6. **Reload** extension
7. **Verify** new configuration loads and registers

## Troubleshooting

### Extension Won't Load

**Symptom**: "Load unpacked" fails or shows errors

**Solutions**:
- Verify you selected `chrome-extension/dist/` (not `chrome-extension/src/`)
- Run `npm run dev` first to build
- Check for syntax errors in console
- Try `npm run build` for production build

### Registration Fails

**Symptom**: Console shows connection errors

**Solutions**:
1. **Check FreeSWITCH is running**:
   ```bash
   systemctl status freeswitch
   # or
   ps aux | grep freeswitch
   ```

2. **Verify WebSocket port**:
   ```bash
   netstat -tulpn | grep 7443
   ```

3. **Test WSS connection**:
   ```bash
   openssl s_client -connect 127.0.0.1:7443
   # Should connect without errors
   ```

4. **Check FreeSWITCH logs**:
   ```bash
   tail -f /var/log/freeswitch/freeswitch.log
   ```

5. **Try ws:// instead of wss://** (for local testing):
   ```
   ws://127.0.0.1:5066
   ```

### Self-Signed Certificate Errors

**Symptom**: WSS connection fails with certificate error

**Solutions**:
1. **For local testing**, use `ws://` instead of `wss://`
2. **Or** accept certificate in browser:
   - Navigate to `https://127.0.0.1:7443` in Chrome
   - Click "Advanced" → "Proceed to 127.0.0.1 (unsafe)"
   - Go back to extension and try again

### No Audio

**Symptom**: Call connects but no audio heard

**Solutions**:
1. **Check audio element**:
   - Open offscreen DevTools
   - Console: `document.getElementById('remoteAudio').srcObject`
   - Should show MediaStream object

2. **Check system audio**:
   - Verify system volume not muted
   - Check Chrome has audio permission

3. **Check FreeSWITCH RTP**:
   ```bash
   fs_cli -x "show channels"
   # Verify RTP packets flowing
   ```

### Offscreen Console Not Accessible

**Symptom**: "Inspect views: offscreen.html" not shown

**Solutions**:
1. **Wait a few seconds** after extension loads
2. **Reload extension** (circular arrow in chrome://extensions)
3. **Check background console** for offscreen creation errors
4. **Verify** manifest.json has `offscreen` permission

## Next Steps

After successful manual testing:

1. **Document test results** in IMPLEMENTATION_STATUS.md
2. **Mark Section 9 tasks as complete** in tasks.md
3. **Consider creating** automated test scripts (optional)
4. **Update OpenSpec proposal** if any issues found

## Quick Reference

### Essential Commands

```bash
# Build extension
cd chrome-extension && npm run dev

# FreeSWITCH CLI
fs_cli

# List calls
show channels

# Send remote control
uuid_phone_event <uuid> talk

# Check registration
sofia status profile internal reg

# Restart profile
sofia profile internal restart

# Check logs
tail -f /var/log/freeswitch/freeswitch.log
```

### Essential Chrome URLs

- Extensions: `chrome://extensions`
- Inspect offscreen: Click "offscreen.html" link on extension
- Inspect background: Click "service worker" link on extension

### Test Checklist

- [ ] Extension loads without errors
- [ ] Configuration saves and persists
- [ ] Registration succeeds
- [ ] Incoming call rings (beep sound)
- [ ] Auto-answer with delay works
- [ ] Auto-answer immediate (0s) works
- [ ] Remote control (NOTIFY talk) answers call
- [ ] Audio plays through speakers
- [ ] Reconnection uses exponential backoff
- [ ] Service Worker stays alive (30s+)
- [ ] Source maps enable debugging
- [ ] No visual UI (notifications/badges)
- [ ] Console logs all events
