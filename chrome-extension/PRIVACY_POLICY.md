# Privacy Policy

**Last Updated:** October 28, 2024
**Version:** 1.0.0

## Overview

The SIP.js Headless Chrome Extension ("the Extension") is a reference implementation designed to demonstrate SIP.js integration with Chrome Extension Manifest V3 APIs. This privacy policy explains how the Extension handles user data.

## Data Collection and Storage

### What Data We Collect

The Extension collects and stores the following configuration data locally:

1. **SIP Account Credentials:**
   - SIP Username
   - SIP Password
   - WebSocket Server URL (WSS)
   - SIP Domain (optional)

### How Data is Stored

- All configuration data is stored using **Chrome's `chrome.storage.sync` API**
- Data is encrypted and synchronized across the user's Chrome browsers (when Chrome Sync is enabled)
- Credentials are stored locally on the user's device and are **never transmitted to third parties**
- No data is collected, stored, or transmitted to the Extension developers or any external analytics services

### How Data is Used

Configuration data is used exclusively for:
- Establishing SIP connections to the user-specified WebSocket server
- Authenticating with the user's SIP server (FreeSWITCH, Asterisk, etc.)
- Processing incoming and outgoing SIP calls

## Network Communication

### External Connections

The Extension establishes network connections only to:
- **User-configured WebSocket Server:** The Extension connects to the WSS URL specified by the user in the configuration
- No connections are made to any third-party servers, analytics services, or the Extension developers' servers

### WebRTC Communication

- The Extension uses WebRTC for real-time audio communication
- Media streams (audio) are transmitted directly between the user's browser and the SIP server
- WebRTC may establish peer-to-peer connections or relay through STUN/TURN servers configured by the SIP server

## Data Sharing

**The Extension does NOT share, sell, rent, or transmit user data to any third parties.**

- No user data is sent to the Extension developers
- No analytics, tracking, or telemetry data is collected
- No advertising networks or third-party services are integrated

## Data Security

- Credentials are stored using Chrome's secure storage API
- WebSocket connections use secure WSS (WebSocket Secure) protocol with TLS encryption
- SIP credentials are transmitted only to the user-specified SIP server over encrypted connections

## User Rights

Users have full control over their data:

- **Access:** View stored credentials in the Extension's Options page (`chrome-extension://[extension-id]/options.html`)
- **Modify:** Update configuration at any time through the Options page
- **Delete:** Clear all stored data by:
  1. Clearing the configuration fields in the Options page, or
  2. Uninstalling the Extension (removes all local data)

## Permissions Explained

The Extension requests the following Chrome permissions:

| Permission | Purpose |
|------------|---------|
| `storage` | Store SIP account configuration securely using `chrome.storage.sync` |
| `alarms` | Keep the Service Worker alive to maintain SIP connection |
| `offscreen` | Create offscreen documents for WebRTC audio handling |
| `wss://*/*` | Connect to any user-specified WebSocket Secure (WSS) SIP server |

All permissions are used solely for the core functionality of SIP communication.

## Third-Party Services

The Extension does not integrate any third-party services, libraries, or APIs for:
- Analytics
- Advertising
- Crash reporting
- User tracking

The Extension uses the **SIP.js library** (bundled locally) for SIP protocol implementation. SIP.js is an open-source library and does not collect user data.

## Children's Privacy

The Extension is not directed at children under the age of 13 and does not knowingly collect data from children.

## Changes to This Policy

We may update this Privacy Policy from time to time. Changes will be indicated by updating the "Last Updated" date at the top of this document. Continued use of the Extension after changes constitutes acceptance of the updated policy.

## Open Source

This Extension is open source. Users can inspect the source code to verify privacy practices:
- **Repository:** https://github.com/onsip/SIP.js (chrome-extension directory)
- **License:** MIT

## Contact

For questions or concerns about this Privacy Policy, please:
- Open an issue on the GitHub repository: https://github.com/onsip/SIP.js/issues
- Review the source code to verify data handling practices

## Compliance

This Extension complies with:
- Chrome Web Store Developer Program Policies (if published)
- General Data Protection Regulation (GDPR) principles
- California Consumer Privacy Act (CCPA) principles

**Key Compliance Points:**
- **Data Minimization:** Only collects data necessary for core functionality
- **Purpose Limitation:** Data used only for SIP communication
- **Transparency:** Clear disclosure of all data practices
- **User Control:** Full user access, modification, and deletion rights
- **Security:** Secure storage and encrypted transmission

---

## Summary (TL;DR)

- The Extension stores SIP credentials locally using Chrome's secure storage
- No data is sent to third parties, developers, or analytics services
- Network connections are made only to your configured SIP server
- You have full control to view, modify, or delete your data
- The Extension is open source and can be audited for privacy compliance
