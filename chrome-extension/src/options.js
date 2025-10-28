/**
 * Options Page Logic
 *
 * Handles SIP configuration management:
 * - Load configuration from chrome.storage.sync
 * - Validate user input
 * - Save configuration with reload instruction
 * - No runtime messaging (manual extension reload required)
 */

console.log('[Options] Page loaded');

const form = document.getElementById('optionsForm');
const messageEl = document.getElementById('message');
const testBtn = document.getElementById('testBtn');
let statusUpdateInterval = null;

/**
 * Load saved configuration and populate form
 */
async function loadOptions() {
  console.log('[Options] Loading configuration...');

  try {
    const config = await chrome.storage.sync.get(['username', 'password', 'domain', 'wssUrl']);

    if (config.username) {
      document.getElementById('username').value = config.username;
    }
    if (config.password) {
      document.getElementById('password').value = config.password;
    }
    if (config.domain) {
      document.getElementById('domain').value = config.domain;
    }
    if (config.wssUrl) {
      document.getElementById('wssUrl').value = config.wssUrl;
    }

    console.log('[Options] Configuration loaded');
  } catch (error) {
    console.error('[Options] Error loading configuration:', error);
    showMessage('Error loading configuration', 'error');
  }
}

/**
 * Validate configuration input
 * @param {Object} config - Configuration object
 * @returns {Object} { valid: boolean, error?: string }
 */
function validateConfig(config) {
  // Check required fields
  if (!config.username || !config.username.trim()) {
    return { valid: false, error: 'Username is required' };
  }

  if (!config.password || !config.password.trim()) {
    return { valid: false, error: 'Password is required' };
  }

  if (!config.wssUrl || !config.wssUrl.trim()) {
    return { valid: false, error: 'WebSocket URL is required' };
  }

  // Domain is now optional (will be auto-detected from WSS URL if not provided)

  // Validate WSS URL format
  if (!config.wssUrl.startsWith('wss://') && !config.wssUrl.startsWith('ws://')) {
    return { valid: false, error: 'WebSocket URL must start with wss:// or ws://' };
  }

  // Basic URL validation
  try {
    new URL(config.wssUrl);
  } catch (e) {
    return { valid: false, error: 'Invalid WebSocket URL format' };
  }

  return { valid: true };
}

/**
 * Save configuration to chrome.storage.sync
 * @param {Event} e - Form submit event
 */
async function saveOptions(e) {
  e.preventDefault();
  console.log('[Options] Saving configuration...');

  // Get form values
  const config = {
    username: document.getElementById('username').value.trim(),
    password: document.getElementById('password').value.trim(),
    wssUrl: document.getElementById('wssUrl').value.trim()
  };

  // Only include domain if user explicitly provided it
  const domainValue = document.getElementById('domain').value.trim();
  if (domainValue) {
    config.domain = domainValue;
  }

  // Validate
  const validation = validateConfig(config);
  if (!validation.valid) {
    console.error('[Options] Validation failed:', validation.error);
    showMessage(validation.error, 'error');
    return;
  }

  // Save to storage
  try {
    await chrome.storage.sync.set(config);
    console.log('[Options] Configuration saved successfully');

    // Request microphone permission
    console.log('[Options] Requesting microphone permission...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      console.log('[Options] Microphone permission granted');

      // Stop the stream immediately (we just needed to get permission)
      stream.getTracks().forEach(track => track.stop());

      // Trigger reconnect with new configuration
      console.log('[Options] Triggering automatic reconnect...');
      try {
        const reconnectResult = await chrome.runtime.sendMessage({ action: 'reconnect' });
        if (reconnectResult.success) {
          showMessage(
            "Configuration saved and applied! Check 'Connection Status' below for live updates.",
            'success'
          );
        } else {
          showMessage(
            'Configuration saved, but reconnection failed. Please reload the extension manually at chrome://extensions.',
            'error'
          );
        }
      } catch (reconnectError) {
        console.error('[Options] Reconnect failed:', reconnectError);
        showMessage(
          'Configuration saved, but automatic reconnection failed. Please reload the extension manually at chrome://extensions.',
          'error'
        );
      }

    } catch (micError) {
      console.error('[Options] Microphone permission denied:', micError);
      showMessage(
        'Configuration saved, but microphone access was denied. Please allow microphone access and try again.',
        'error'
      );
    }
  } catch (error) {
    console.error('[Options] Error saving configuration:', error);
    showMessage('Error saving configuration: ' + error.message, 'error');
  }
}

/**
 * Show message to user
 * @param {string} text - Message text
 * @param {string} type - Message type ('success' or 'error')
 */
function showMessage(text, type = 'success') {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  messageEl.style.display = 'block';

  // Auto-hide messages after a delay
  if (type === 'success') {
    // Success messages auto-hide after 3 seconds
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 3000);
  } else if (type === 'error') {
    // Error messages auto-hide after 10 seconds
    setTimeout(() => {
      messageEl.style.display = 'none';
    }, 10000);
  }
}

/**
 * Update status display
 */
async function updateStatus() {
  try {
    const status = await chrome.runtime.sendMessage({ action: 'getStatus' });

    // Update connection status
    const connectionEl = document.getElementById('connectionStatus');
    connectionEl.textContent = status.connectionState.charAt(0).toUpperCase() + status.connectionState.slice(1);
    connectionEl.className = `status-value ${status.connectionState}`;

    // Update registration status
    const registrationEl = document.getElementById('registrationStatus');
    registrationEl.textContent = status.registrationState.charAt(0).toUpperCase() + status.registrationState.slice(1);
    registrationEl.className = `status-value ${status.registrationState}`;

    // Update account info
    const accountEl = document.getElementById('accountInfo');
    if (status.username && status.domain) {
      accountEl.textContent = `${status.username}@${status.domain}`;
    } else {
      accountEl.textContent = '-';
    }

    // Update last update time
    const lastUpdateEl = document.getElementById('lastUpdate');
    if (status.timestamp) {
      const date = new Date(status.timestamp);
      lastUpdateEl.textContent = date.toLocaleTimeString();
    } else {
      lastUpdateEl.textContent = '-';
    }

    console.log('[Options] Status updated:', status);
  } catch (error) {
    console.error('[Options] Error updating status:', error);
  }
}

/**
 * Start periodic status updates
 */
function startStatusUpdates() {
  // Update immediately
  updateStatus();

  // Update every 2 seconds
  if (statusUpdateInterval) {
    clearInterval(statusUpdateInterval);
  }

  statusUpdateInterval = setInterval(updateStatus, 2000);
  console.log('[Options] Started status updates (2s interval)');
}

/**
 * Stop periodic status updates
 */
function stopStatusUpdates() {
  if (statusUpdateInterval) {
    clearInterval(statusUpdateInterval);
    statusUpdateInterval = null;
    console.log('[Options] Stopped status updates');
  }
}

/**
 * Test connection with current form values
 */
async function testConnection() {
  console.log('[Options] Testing connection...');

  // Disable test button
  testBtn.disabled = true;
  testBtn.textContent = 'Testing...';

  // Get form values
  const config = {
    username: document.getElementById('username').value.trim(),
    password: document.getElementById('password').value.trim(),
    wssUrl: document.getElementById('wssUrl').value.trim()
  };

  const domainValue = document.getElementById('domain').value.trim();
  if (domainValue) {
    config.domain = domainValue;
  }

  // Validate
  const validation = validateConfig(config);
  if (!validation.valid) {
    showMessage(`Test failed: ${validation.error}`, 'error');
    testBtn.disabled = false;
    testBtn.textContent = 'Test Connection';
    return;
  }

  try {
    // Send test request to background (which forwards to offscreen)
    const result = await chrome.runtime.sendMessage({
      action: 'testConnection',
      config: config
    });

    if (result.success) {
      // Show success message (could be from actual test or converted warning)
      const message = result.message || 'Connection test successful! Configuration is valid.';
      showMessage(message, 'success');
    } else {
      // Show error with friendly message
      showMessage(`${result.error}`, 'error');
    }
  } catch (error) {
    console.error('[Options] Test connection error:', error);
    showMessage(`Connection test failed: ${error.message}`, 'error');
  } finally {
    testBtn.disabled = false;
    testBtn.textContent = 'Test Connection';
  }
}

// Attach event listeners
form.addEventListener('submit', saveOptions);
testBtn.addEventListener('click', testConnection);

// Load configuration and start status updates on page load
document.addEventListener('DOMContentLoaded', () => {
  loadOptions();
  startStatusUpdates();
});

// Stop status updates when page unloads
window.addEventListener('beforeunload', stopStatusUpdates);

console.log('[Options] Event listeners attached');
