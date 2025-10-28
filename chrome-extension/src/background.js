/**
 * Background Service Worker for SIP.js Chrome Extension
 *
 * Responsibilities:
 * - Keep Service Worker alive with periodic alarms
 * - Create and manage offscreen document for SIP/WebRTC
 * - Open options page on first install
 * - Pure headless operation (no notifications/badges)
 */

console.log('[Background] Service Worker starting...');

// Store latest status from offscreen document
let latestStatus = {
  connectionState: 'unknown',
  registrationState: 'unknown',
  username: null,
  domain: null,
  timestamp: null
};

// Open options page on first install
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[Background] Extension installed:', details.reason);

  if (details.reason === 'install') {
    // Open options page for initial configuration
    chrome.runtime.openOptionsPage();
    console.log('[Background] Opened options page for first-time setup');
  }
});

/**
 * Set up periodic alarm to keep Service Worker alive
 * Chrome terminates idle Service Workers after ~30 seconds
 * Periodic alarms prevent termination
 */
function setupKeepAlive() {
  chrome.alarms.create('keepAlive', {
    periodInMinutes: 1/3  // Every 20 seconds
  });
  console.log('[Background] Keep-alive alarm created (20s period)');
}

/**
 * Handle alarm events
 * The alarm firing itself keeps the Service Worker alive
 */
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'keepAlive') {
    console.log('[Background] Keep-alive alarm fired');
    // No action needed - the event itself prevents termination
  }
});

/**
 * Create offscreen document if it doesn't exist
 * Offscreen document hosts the SIP UserAgent and WebRTC
 */
async function ensureOffscreenDocument() {
  try {
    // Check if offscreen document already exists
    const existingContexts = await chrome.runtime.getContexts({
      contextTypes: ['OFFSCREEN_DOCUMENT']
    });

    if (existingContexts.length > 0) {
      console.log('[Background] Offscreen document already exists');
      return;
    }

    // Create new offscreen document
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK', 'USER_MEDIA'],
      justification: 'SIP call audio playback, microphone input, and WebRTC media handling'
    });

    console.log('[Background] Offscreen document created successfully');
  } catch (error) {
    console.error('[Background] Error creating offscreen document:', error);
  }
}

/**
 * Handle messages from offscreen document and options page
 * Provides config access and status storage
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getConfig') {
    console.log('[Background] Config requested by offscreen document');

    // Read config from storage and send to offscreen
    chrome.storage.sync.get(['username', 'password', 'domain', 'wssUrl'])
      .then(config => {
        console.log('[Background] Sending config to offscreen');
        sendResponse(config);
      })
      .catch(error => {
        console.error('[Background] Error reading config:', error);
        sendResponse(null);
      });

    return true; // Async response
  }

  if (message.action === 'statusUpdate') {
    // Store status update from offscreen document
    console.log('[Background] Status update received:', message.status);
    latestStatus = message.status;
    sendResponse({ success: true });
    return false;
  }

  if (message.action === 'getStatus') {
    // Options page requesting current status
    console.log('[Background] Status requested');
    sendResponse(latestStatus);
    return false;
  }

  if (message.action === 'reconnect') {
    // Forward reconnect request to offscreen document
    console.log('[Background] Forwarding reconnect request to offscreen');

    chrome.runtime.sendMessage({ action: 'reconnect' })
      .then(response => {
        sendResponse(response);
      })
      .catch(error => {
        console.error('[Background] Error forwarding reconnect:', error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // Async response
  }

  if (message.action === 'testConnection') {
    // Forward test connection request to offscreen document
    console.log('[Background] Forwarding test connection request to offscreen');

    chrome.runtime.sendMessage({
      action: 'testConnection',
      config: message.config
    })
      .then(response => {
        sendResponse(response);
      })
      .catch(error => {
        console.error('[Background] Error forwarding test connection:', error);
        sendResponse({ success: false, error: error.message });
      });

    return true; // Async response
  }
});

console.log('[Background] Service Worker initialized');

// Ensure offscreen document is created on Service Worker startup
// This handles both first install and reload scenarios
setupKeepAlive();
ensureOffscreenDocument();
