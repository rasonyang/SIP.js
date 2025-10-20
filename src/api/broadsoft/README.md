# BroadSoft Access-Side Extensions

This module provides support for two common BroadSoft Access-Side SIP extensions in SIP.js:

1. **Call-Info with answer-after parameter** - Auto-Answer
2. **NOTIFY (Event: talk)** - Remote Control for answering/resuming calls

## Features

### 1. Auto-Answer (Call-Info Header)

Automatically answer incoming calls when the `answer-after` parameter is present in the Call-Info header.

**SIP Header Example:**
```
Call-Info: <sip:example.com>; answer-after=1
```

**Usage:**
```typescript
import { BroadSoft, Invitation } from "sip.js";

const autoAnswerOptions: BroadSoft.AutoAnswerOptions = {
  enabled: true,
  onBeforeAutoAnswer: (delaySeconds) => {
    console.log(`Auto-answering in ${delaySeconds}s`);
  },
  onAfterAutoAnswer: () => {
    console.log("Auto-answered");
  }
};

// In your onInvite handler:
userAgent.delegate = {
  onInvite: (invitation: Invitation) => {
    if (BroadSoft.shouldAutoAnswer(invitation)) {
      BroadSoft.handleAutoAnswer(invitation, autoAnswerOptions);
    }
  }
};
```

### 2. Remote Control - Talk Events (NOTIFY with Event: talk)

Handle remote control of microphone state via NOTIFY messages.

**SIP Message Example:**
```
NOTIFY sip:alice@example.com SIP/2.0
Event: talk
Content-Type: text/plain

mute
```

**Actions:**
- `talk` - Unmute microphone
- `mute` - Mute microphone

**Usage:**
```typescript
import { BroadSoft } from "sip.js";

const remoteControlOptions: BroadSoft.RemoteControlOptions = {
  enabled: true,
  autoApply: true, // Automatically apply the action
  onTalkEvent: (action) => {
    console.log(`Talk event: ${action}`);
  }
};

// In your session delegate:
invitation.delegate = {
  onNotify: (notification) => {
    if (BroadSoft.isBroadSoftNotification(notification)) {
      await BroadSoft.handleRemoteControlNotification(
        invitation,
        notification,
        remoteControlOptions
      );
      notification.accept();
    }
  }
};
```

## API Reference

### Types

#### `AutoAnswerOptions`
```typescript
interface AutoAnswerOptions {
  enabled: boolean;
  onBeforeAutoAnswer?: (answerAfter: number) => void;
  onAfterAutoAnswer?: () => void;
  delayOverride?: number; // Override header delay
}
```

#### `RemoteControlOptions`
```typescript
interface RemoteControlOptions {
  enabled: boolean;
  onTalkEvent?: (action: TalkAction) => void;
  autoApply: boolean; // Auto-apply actions to session
}
```

#### `TalkAction`
```typescript
enum TalkAction {
  Talk = "talk",   // Unmute
  Mute = "mute"    // Mute
}
```

### Functions

#### Auto-Answer Functions

- `shouldAutoAnswer(invitation: Invitation): boolean`
  - Check if invitation has auto-answer enabled

- `getAutoAnswerDelay(request: IncomingRequestMessage): number | undefined`
  - Get the answer-after delay in seconds

- `handleAutoAnswer(invitation: Invitation, options: AutoAnswerOptions): boolean`
  - Handle auto-answering an invitation

- `extractCallInfoHeaders(request: IncomingRequestMessage): CallInfoHeader[]`
  - Parse all Call-Info headers from a request

#### Remote Control Functions

**High-level API (recommended - works with SessionDelegate):**

- `isBroadSoftNotification(notification: Notification): boolean`
  - Check if a Notification is a BroadSoft remote control event

- `handleRemoteControlNotification(session: Session, notification: Notification, options: RemoteControlOptions): Promise<boolean>`
  - Handle a BroadSoft remote control NOTIFY from SessionDelegate

- `parseEventHeaderFromNotification(notification: Notification): BroadSoftEvent | undefined`
  - Parse Event header from a Notification

- `parseNotifyBodyFromNotification(notification: Notification, eventType: BroadSoftEvent): BroadSoftNotifyBody | undefined`
  - Parse the body of a Notification

**Low-level API (for advanced use cases):**

- `isBroadSoftNotify(request: IncomingNotifyRequest): boolean`
  - Check if NOTIFY is a BroadSoft remote control event

- `handleRemoteControlNotify(session: Session, request: IncomingNotifyRequest, options: RemoteControlOptions): Promise<boolean>`
  - Handle a BroadSoft remote control NOTIFY

- `parseEventHeader(request: IncomingNotifyRequest): BroadSoftEvent | undefined`
  - Parse Event header from an IncomingNotifyRequest

- `parseNotifyBody(request: IncomingNotifyRequest, eventType: BroadSoftEvent): BroadSoftNotifyBody | undefined`
  - Parse the body of an IncomingNotifyRequest

**Manual control functions:**

- `applyTalkAction(session: Session, action: TalkAction): void`
  - Manually apply a talk action to a session

## Complete Example

See [examples/broadsoft-extensions.ts](../../../examples/broadsoft-extensions.ts) for a complete working example.

## Protocol Details

### Call-Info Header Format

```
Call-Info: <URI>; answer-after=<seconds>[; other-params]
```

- `answer-after=0` - Answer immediately
- `answer-after=1` - Answer after 1 second delay
- `answer-after=N` - Answer after N seconds delay

### NOTIFY Event Format

**Talk Event:**
```
NOTIFY sip:user@domain SIP/2.0
Event: talk
Content-Type: text/plain
Content-Length: 4

mute
```

## Browser Compatibility

The remote control features require WebRTC support and work with the Web platform `SessionDescriptionHandler`. They have been tested with:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Notes

- Auto-answer respects the session state and will only answer if the session is in `Initial` or `Establishing` state
- Remote control actions are only applied if `autoApply: true` is set, otherwise only callbacks are invoked
- All callbacks are wrapped in try-catch to prevent errors from breaking the control flow

## References

- BroadSoft/Cisco BroadWorks Interface Specifications
- RFC 3261 - SIP: Session Initiation Protocol
- RFC 3264 - An Offer/Answer Model with SDP
- RFC 3515 - The Session Initiation Protocol (SIP) Refer Method
