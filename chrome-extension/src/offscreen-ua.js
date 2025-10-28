/**
 * Offscreen SIP UserAgent Implementation
 *
 * This module runs in the offscreen document and handles:
 * - SIP registration and call signaling
 * - WebRTC media (audio playback)
 * - BroadSoft Access-Side extensions (auto-answer, remote control)
 * - Exponential backoff reconnection
 * - Pure headless operation (console logs only)
 */

import { UserAgent, Registerer, Inviter, Messager } from '@sip/api/index';
import { SessionState } from '@sip/api/session-state';
import { defaultSessionDescriptionHandlerFactory } from '@sip/platform/web/index';
import * as BroadSoft from '@sip/api/broadsoft/index';

console.log('[OffscreenUA] Module loading...');

// Global state
let userAgent = null;
let registerer = null;
let currentSession = null;
let retryAttempt = 0;
let retryTimer = null;
let audioContext = null;
let mediaStream = null; // Store media stream for reuse
let currentConfig = null; // Store current configuration
let connectionState = 'disconnected'; // disconnected, connecting, connected, error
let registrationState = 'unregistered'; // unregistered, registering, registered
let keepAliveTimer = null; // SIP OPTIONS keep-alive timer

// Update status in HTML
function updateStatus(message) {
  const statusEl = document.getElementById('status');
  if (statusEl) {
    statusEl.textContent = message;
  }
  console.log(`[OffscreenUA] Status: ${message}`);
}

/**
 * Send status update to background
 */
function sendStatusUpdate() {
  const status = {
    connectionState,
    registrationState,
    username: currentConfig?.username || null,
    domain: currentConfig?.domain || (currentConfig?.wssUrl ? extractDomainFromWssUrl(currentConfig.wssUrl) : null),
    timestamp: new Date().toISOString()
  };

  chrome.runtime.sendMessage({
    action: 'statusUpdate',
    status
  }).catch(error => {
    console.error('[OffscreenUA] Error sending status update:', error);
  });
}

/**
 * Update connection state and notify background
 */
function setConnectionState(state) {
  if (connectionState !== state) {
    connectionState = state;
    console.log(`[OffscreenUA] Connection state changed to: ${state}`);
    sendStatusUpdate();
  }
}

/**
 * Update registration state and notify background
 */
function setRegistrationState(state) {
  if (registrationState !== state) {
    registrationState = state;
    console.log(`[OffscreenUA] Registration state changed to: ${state}`);
    sendStatusUpdate();
  }
}

/**
 * Load SIP configuration from background via message passing
 * (Offscreen documents cannot access chrome.storage directly in MV3)
 */
async function loadConfig() {
  console.log('[OffscreenUA] Requesting configuration from background...');

  try {
    const config = await chrome.runtime.sendMessage({ action: 'getConfig' });

    if (!config || !config.username || !config.password || !config.wssUrl) {
      console.warn('[OffscreenUA] Incomplete configuration:', config);
      updateStatus('Not configured - please open options page');
      return null;
    }

    console.log('[OffscreenUA] Configuration received:', {
      username: config.username,
      domain: config.domain || '(auto-detect from WSS URL)',
      wssUrl: config.wssUrl
    });

    currentConfig = config; // Store configuration
    return config;
  } catch (error) {
    console.error('[OffscreenUA] Error loading configuration:', error);
    updateStatus('Configuration error');
    return null;
  }
}

/**
 * Play ringtone using Web Audio API
 * Generates simple 440Hz beep (A4 note) for 200ms
 */
function playRingtone() {
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 440; // A4 note
    gainNode.gain.value = 0.3; // 30% volume

    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 200); // 200ms beep

    console.log('[OffscreenUA] Ringtone played (440Hz, 200ms)');
  } catch (error) {
    console.error('[OffscreenUA] Error playing ringtone:', error);
  }
}

/**
 * Handle incoming INVITE (call)
 */
function handleInvite(invitation) {
  console.log('[OffscreenUA] Incoming call from:', invitation.remoteIdentity.uri.toString());

  currentSession = invitation;

  // Set up session delegate
  invitation.delegate = {
    onBye: () => {
      console.log('[OffscreenUA] Call ended (BYE received)');
      updateStatus('Call ended');
      currentSession = null;
    },
    onSessionDescriptionHandler: (sdh) => {
      console.log('[OffscreenUA] Session description handler ready');
      // Bind remote media to audio element
      const audio = document.getElementById('remoteAudio');
      if (audio && sdh.remoteMediaStream) {
        audio.srcObject = sdh.remoteMediaStream;
        console.log('[OffscreenUA] Remote audio bound to <audio> element');
      }
    },
    onNotify: async (notification) => {
      console.log('[OffscreenUA] NOTIFY received, Event:', notification.request.getHeader('event'));

      // Handle BroadSoft remote control
      if (BroadSoft.isBroadSoftNotification(notification)) {
        console.log('[OffscreenUA] BroadSoft remote control NOTIFY detected');
        try {
          const handled = await BroadSoft.handleRemoteControlNotification(
            invitation,
            notification,
            {
              enabled: true,
              onTalkEvent: (action) => {
                console.log(`[OffscreenUA] BroadSoft talk event: ${action}`);
                updateStatus(`Remote control: ${action}`);
              }
            }
          );

          if (handled) {
            notification.accept();
            console.log('[OffscreenUA] BroadSoft NOTIFY handled and accepted');
          }
        } catch (error) {
          console.error('[OffscreenUA] Error handling BroadSoft NOTIFY:', error);
        }
      }
    }
  };

  // Check for auto-answer
  if (BroadSoft.shouldAutoAnswer(invitation)) {
    const delay = BroadSoft.getAutoAnswerDelay(invitation.request);
    console.log(`[OffscreenUA] Auto-answer enabled, delay: ${delay}s`);

    BroadSoft.handleAutoAnswer(invitation, {
      enabled: true,
      onBeforeAutoAnswer: (delaySeconds) => {
        console.log(`[OffscreenUA] Auto-answering in ${delaySeconds}s...`);
        updateStatus(`Auto-answering in ${delaySeconds}s`);
      },
      onAfterAutoAnswer: () => {
        console.log('[OffscreenUA] Call auto-answered');
        updateStatus('Call active (auto-answered)');
      }
    });
  } else {
    // No auto-answer - ring and wait for remote control
    console.log('[OffscreenUA] No auto-answer header - ringing, waiting for remote control');
    playRingtone();
    updateStatus('Incoming call - waiting for remote control');
  }
}

/**
 * Calculate exponential backoff delay
 * @param {number} attempt - Retry attempt number (1-based)
 * @returns {number} Delay in milliseconds
 */
function calculateBackoffDelay(attempt) {
  // Base delay: 1s, backoff factor: 2x, max: 30s
  // 1s → 2s → 4s → 8s → 16s → 30s (capped)
  const baseDelay = 1000;
  const maxDelay = 30000; // Reduced from 60s to 30s for faster recovery
  const delay = Math.min(maxDelay, baseDelay * Math.pow(2, attempt - 1));
  return delay;
}

/**
 * Extract domain from WebSocket URL
 * @param {string} wssUrl - WebSocket URL (e.g., wss://example.com:7443)
 * @returns {string} Extracted domain/host
 */
function extractDomainFromWssUrl(wssUrl) {
  try {
    const url = new URL(wssUrl);
    return url.hostname; // Returns hostname without port
  } catch (error) {
    console.error('[OffscreenUA] Error extracting domain from WSS URL:', error);
    return null;
  }
}

/**
 * Initialize and connect UserAgent
 */
async function initUserAgent() {
  const config = await loadConfig();

  if (!config) {
    console.warn('[OffscreenUA] Cannot initialize UA without configuration');
    return;
  }

  // Clean up old state before reinitializing (important for reconnection)
  try {
    console.log('[OffscreenUA] Cleaning up old UserAgent state before initialization...');

    if (registerer) {
      try {
        await registerer.dispose();
        console.log('[OffscreenUA] Old registerer disposed');
      } catch (err) {
        console.warn('[OffscreenUA] Error disposing registerer:', err);
      }
      registerer = null;
    }

    if (userAgent) {
      try {
        await userAgent.stop();
        console.log('[OffscreenUA] Old UserAgent stopped');
      } catch (err) {
        console.warn('[OffscreenUA] Error stopping UserAgent:', err);
      }
      userAgent = null;
    }

    console.log('[OffscreenUA] Cleanup complete');
  } catch (cleanupError) {
    console.error('[OffscreenUA] Error during cleanup:', cleanupError);
    // Continue anyway
  }

  try {
    console.log('[OffscreenUA] Creating new UserAgent...');
    updateStatus('Initializing...');
    setConnectionState('connecting');

    // Use explicit domain if provided, otherwise extract from WSS URL
    const domain = config.domain || extractDomainFromWssUrl(config.wssUrl);

    if (!domain) {
      console.error('[OffscreenUA] Cannot determine SIP domain');
      updateStatus('Configuration error: no domain');
      setConnectionState('error');
      return;
    }

    console.log('[OffscreenUA] Using SIP domain:', domain);
    const uri = `sip:${config.username}@${domain}`;

    userAgent = new UserAgent({
      uri: UserAgent.makeURI(uri),
      authorizationUsername: config.username,
      authorizationPassword: config.password,
      transportOptions: {
        server: config.wssUrl
      },
      sessionDescriptionHandlerFactory: defaultSessionDescriptionHandlerFactory(customMediaStreamFactory()),
      logLevel: 'debug', // Enable detailed logging for WebSocket messages
      logConnector: (level, category, label, content) => {
        console.log(`[SIP.js ${level}] ${category} | ${label}:`, content);
      },
      delegate: {
        onInvite: handleInvite,
        onConnect: () => {
          console.log('[OffscreenUA] Transport connected');
          updateStatus('Connected');
          setConnectionState('connected');
          retryAttempt = 0; // Reset retry counter on successful connection

          // Log WebSocket messages
          setupTransportLogging();

          // Start SIP OPTIONS keep-alive
          startKeepAlive();
        },
        onDisconnect: (error) => {
          console.error('[OffscreenUA] Transport disconnected:', error);
          updateStatus('Disconnected');
          setConnectionState('disconnected');
          setRegistrationState('unregistered');

          // Stop keep-alive timer
          stopKeepAlive();

          // Exponential backoff reconnection with full re-initialization
          retryAttempt++;
          const delay = calculateBackoffDelay(retryAttempt);
          console.log(`[OffscreenUA] Will reconnect in ${delay}ms (attempt ${retryAttempt})...`);
          console.log(`[OffscreenUA] Retry schedule: attempt ${retryAttempt}, delay ${delay}ms`);

          if (retryTimer) {
            clearTimeout(retryTimer);
          }

          retryTimer = setTimeout(() => {
            console.log(`[OffscreenUA] Executing retry attempt ${retryAttempt} - calling initUserAgent()...`);
            // Call full initialization to properly re-register
            initUserAgent();
          }, delay);
        }
      }
    });

    // Start the UserAgent
    console.log('[OffscreenUA] Starting UserAgent...');
    await userAgent.start();
    console.log('[OffscreenUA] UserAgent started');

    // Create and start registerer
    registerer = new Registerer(userAgent);
    console.log('[OffscreenUA] Registering...');
    setRegistrationState('registering');
    await registerer.register();
    console.log('[OffscreenUA] Registration successful');
    updateStatus('Registered');
    setRegistrationState('registered');

  } catch (error) {
    console.error('[OffscreenUA] Error initializing UserAgent:', error);
    updateStatus('Initialization error');
    setConnectionState('error');

    // Retry with exponential backoff
    retryAttempt++;
    const delay = calculateBackoffDelay(retryAttempt);
    console.log(`[OffscreenUA] Retrying in ${delay}ms (attempt ${retryAttempt})...`);

    if (retryTimer) {
      clearTimeout(retryTimer);
    }

    retryTimer = setTimeout(() => {
      initUserAgent();
    }, delay);
  }
}

/**
 * Set up WebSocket transport message logging
 * Intercepts send/receive to log all SIP messages
 */
function setupTransportLogging() {
  if (!userAgent || !userAgent.transport) {
    console.warn('[OffscreenUA] Cannot setup transport logging: transport not available');
    return;
  }

  console.log('[OffscreenUA] Setting up WebSocket message logging...');

  try {
    // Save original onMessage handler (if any)
    const originalOnMessage = userAgent.transport.onMessage;

    // Intercept incoming messages via onMessage callback
    userAgent.transport.onMessage = (message) => {
      console.log('[WebSocket ←] 接收:', message);
      // Call original handler if it exists
      if (originalOnMessage) {
        originalOnMessage(message);
      }
    };

    // Intercept outgoing messages via send method
    const originalSend = userAgent.transport.send.bind(userAgent.transport);
    userAgent.transport.send = function(message) {
      console.log('[WebSocket →] 发送:', message);
      return originalSend(message);
    };

    console.log('[OffscreenUA] WebSocket message logging enabled');
  } catch (error) {
    console.error('[OffscreenUA] Error setting up transport logging:', error);
  }
}

/**
 * Custom media stream factory
 * Note: Microphone permission must be granted in options page first
 */
function customMediaStreamFactory() {
  return async (constraints, sessionDescriptionHandler) => {
    console.log('[OffscreenUA] Media stream requested with constraints:', constraints);

    // If we already have a media stream, return it
    if (mediaStream && mediaStream.active) {
      console.log('[OffscreenUA] Reusing existing media stream');
      return mediaStream;
    }

    // Otherwise request new stream
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('[OffscreenUA] New media stream created');
      return mediaStream;
    } catch (error) {
      console.error('[OffscreenUA] Failed to get media stream:', error);
      console.error('[OffscreenUA] Make sure you granted microphone access in options page!');
      throw error;
    }
  };
}

/**
 * Stop and cleanup UserAgent
 */
async function stopUserAgent() {
  console.log('[OffscreenUA] Stopping UserAgent...');

  try {
    // Clear retry timer
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }

    // Stop keep-alive timer
    stopKeepAlive();

    // Unregister
    if (registerer) {
      try {
        await registerer.unregister();
        console.log('[OffscreenUA] Unregistered successfully');
      } catch (error) {
        console.error('[OffscreenUA] Error during unregister:', error);
      }
      registerer = null;
    }

    // Stop UserAgent
    if (userAgent) {
      try {
        await userAgent.stop();
        console.log('[OffscreenUA] UserAgent stopped');
      } catch (error) {
        console.error('[OffscreenUA] Error stopping UserAgent:', error);
      }
      userAgent = null;
    }

    setConnectionState('disconnected');
    setRegistrationState('unregistered');
    updateStatus('Stopped');
  } catch (error) {
    console.error('[OffscreenUA] Error stopping UserAgent:', error);
  }
}

/**
 * Send SIP OPTIONS keep-alive message
 * Sends OPTIONS to the SIP server to keep the connection alive
 */
async function sendOptionsKeepAlive() {
  if (!userAgent || connectionState !== 'connected') {
    console.warn('[OffscreenUA] Cannot send keep-alive: not connected');
    return;
  }

  try {
    const target = userAgent.configuration.uri;
    if (!target) {
      console.warn('[OffscreenUA] Cannot send keep-alive: no target URI');
      return;
    }

    console.log(`[OffscreenUA] Sending OPTIONS keep-alive to ${target.toString()}`);

    // Send OPTIONS request using SIP.js Messager
    const messager = new Messager(userAgent, target, 'OPTIONS');
    await messager.message();

    console.log('[OffscreenUA] Keep-alive OPTIONS sent successfully');
  } catch (error) {
    console.error('[OffscreenUA] Error sending keep-alive OPTIONS:', error);
    // Don't throw - keep-alive failures shouldn't crash the app
  }
}

/**
 * Start SIP OPTIONS keep-alive timer
 * Sends OPTIONS every 15 seconds to keep NAT bindings and connection alive
 */
function startKeepAlive() {
  console.log('[OffscreenUA] Starting keep-alive timer (15s interval)');

  // Clear any existing timer
  stopKeepAlive();

  // Send first OPTIONS immediately
  sendOptionsKeepAlive();

  // Set up periodic keep-alive
  keepAliveTimer = setInterval(() => {
    sendOptionsKeepAlive();
  }, 15000); // 15 seconds

  console.log('[OffscreenUA] Keep-alive timer started');
}

/**
 * Stop SIP OPTIONS keep-alive timer
 */
function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
    console.log('[OffscreenUA] Keep-alive timer stopped');
  }
}

/**
 * Convert technical error messages to user-friendly messages
 * @param {Error} error - The error object
 * @returns {Object} Friendly error message and success flag
 */
function convertTestError(error) {
  const errorMsg = error.message || error.toString();

  // REGISTER request already in progress - need to check actual state
  if (errorMsg.includes('REGISTER request already in progress') ||
      errorMsg.includes('waiting for final response')) {
    return {
      needsStateCheck: true, // Special flag to trigger state check
      message: 'Registration in progress, checking actual state...'
    };
  }

  // Connection timeout
  if (errorMsg.includes('Connection timeout') || errorMsg.includes('timeout')) {
    return {
      success: false,
      error: 'Connection timeout - please check your WebSocket server URL and network connection.'
    };
  }

  // Authentication failures (401, 403, auth failed, etc)
  if (errorMsg.includes('401') || errorMsg.includes('403') ||
      errorMsg.includes('Authentication') || errorMsg.includes('Unauthorized') ||
      errorMsg.includes('auth')) {
    return {
      success: false,
      error: 'Authentication failed - please verify your username and password.'
    };
  }

  // Network/WebSocket connection errors
  if (errorMsg.includes('WebSocket') || errorMsg.includes('network') ||
      errorMsg.includes('ECONNREFUSED') || errorMsg.includes('connection') ||
      errorMsg.includes('connect')) {
    return {
      success: false,
      error: 'Cannot connect to server - please check the WebSocket URL and ensure the server is running.'
    };
  }

  // Registration timeout specifically
  if (errorMsg.includes('Registration timeout')) {
    return {
      success: false,
      error: 'Registration timeout - server is not responding to registration request. Please check your configuration.'
    };
  }

  // Generic error - return original message
  return {
    success: false,
    error: errorMsg
  };
}

/**
 * Test connection with provided config
 * @param {Object} config - Configuration to test
 * @returns {Promise<Object>} Test result
 */
async function testConnection(config) {
  console.log('[OffscreenUA] Testing connection with config:', {
    username: config.username,
    wssUrl: config.wssUrl
  });

  let testUA = null;
  let testRegisterer = null;

  try {
    const domain = config.domain || extractDomainFromWssUrl(config.wssUrl);
    if (!domain) {
      return { success: false, error: 'Cannot determine SIP domain from configuration' };
    }

    const uri = `sip:${config.username}@${domain}`;

    // Create test UserAgent with short timeout
    testUA = new UserAgent({
      uri: UserAgent.makeURI(uri),
      authorizationUsername: config.username,
      authorizationPassword: config.password,
      transportOptions: {
        server: config.wssUrl
      },
      sessionDescriptionHandlerFactory: defaultSessionDescriptionHandlerFactory(customMediaStreamFactory())
    });

    // Start with timeout
    const connectPromise = testUA.start();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timeout (5s)')), 5000)
    );

    await Promise.race([connectPromise, timeoutPromise]);
    console.log('[OffscreenUA] Test connection established');

    // Try to register with timeout
    testRegisterer = new Registerer(testUA);
    const registerPromise = testRegisterer.register();
    const registerTimeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Registration timeout (5s)')), 5000)
    );

    await Promise.race([registerPromise, registerTimeoutPromise]);
    console.log('[OffscreenUA] Test registration successful');

    // Cleanup
    await testRegisterer.unregister();
    await testUA.stop();

    return { success: true, message: 'Connection test successful' };

  } catch (error) {
    console.error('[OffscreenUA] Test connection failed:', error);

    // Cleanup on error
    try {
      if (testRegisterer) await testRegisterer.unregister();
      if (testUA) await testUA.stop();
    } catch (cleanupError) {
      console.error('[OffscreenUA] Error during test cleanup:', cleanupError);
    }

    // Convert technical error to user-friendly message
    const convertedError = convertTestError(error);

    // Special case: REGISTER in progress - check actual state after delay
    if (convertedError.needsStateCheck) {
      console.log('[OffscreenUA] REGISTER in progress detected, waiting 3s to check actual state...');

      // Wait 3 seconds for server to process registration
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Check current actual state
      console.log('[OffscreenUA] Checking current state:', {
        connection: connectionState,
        registration: registrationState
      });

      if (connectionState === 'connected' && registrationState === 'registered') {
        return {
          success: true,
          message: 'Account verified successfully! Currently connected and registered.'
        };
      } else if (connectionState === 'connected' && registrationState === 'registering') {
        return {
          success: true,
          message: 'Connected to server, registration in progress. Configuration appears valid.'
        };
      } else if (connectionState === 'connected') {
        return {
          success: false,
          error: `Connected but not registered. Current registration state: ${registrationState}`
        };
      } else {
        return {
          success: false,
          error: `Configuration test inconclusive. Current state: ${connectionState} / ${registrationState}`
        };
      }
    }

    return convertedError;
  }
}

/**
 * Handle messages from options page or background
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[OffscreenUA] Message received:', message.action);

  if (message.action === 'reconnect') {
    // Reconnect with new configuration
    console.log('[OffscreenUA] Reconnecting with new configuration...');

    stopUserAgent().then(() => {
      return initUserAgent();
    }).then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      console.error('[OffscreenUA] Reconnection failed:', error);
      sendResponse({ success: false, error: error.message });
    });

    return true; // Async response

  } else if (message.action === 'testConnection') {
    // Test connection with provided config
    console.log('[OffscreenUA] Testing connection...');

    testConnection(message.config).then(result => {
      sendResponse(result);
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });

    return true; // Async response

  } else if (message.action === 'getStatus') {
    // Return current status
    sendResponse({
      connectionState,
      registrationState,
      username: currentConfig?.username || null,
      domain: currentConfig?.domain || (currentConfig?.wssUrl ? extractDomainFromWssUrl(currentConfig.wssUrl) : null),
      timestamp: new Date().toISOString()
    });
    return true;
  }
});

// Initialize on load
console.log('[OffscreenUA] Document loaded, initializing...');
updateStatus('Loading...');
initUserAgent();
