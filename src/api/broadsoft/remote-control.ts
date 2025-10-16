/**
 * BroadSoft Remote Control Implementation
 *
 * Handles NOTIFY events for remote control operations (Event: talk, Event: hold).
 */

import { IncomingNotifyRequest } from "../../core/messages/methods/notify.js";
import { IncomingRequestMessage } from "../../core/messages/incoming-request-message.js";
import { Notification } from "../notification.js";
import { Session } from "../session.js";
import { SessionDescriptionHandler } from "../session-description-handler.js";
import {
  BroadSoftEvent,
  BroadSoftNotifyBody,
  HoldAction,
  HoldNotifyBody,
  RemoteControlOptions,
  TalkAction,
  TalkNotifyBody
} from "./types.js";

/**
 * Parse the Event header from a NOTIFY request
 *
 * @param request - Incoming NOTIFY request
 * @returns The event type, or undefined if not parseable
 */
export function parseEventHeader(request: IncomingNotifyRequest): BroadSoftEvent | undefined {
  try {
    const eventHeader = request.message.getHeader("event");
    if (!eventHeader) {
      return undefined;
    }

    // Event header format: "talk" or "hold" (may have parameters)
    const eventType = eventHeader.split(";")[0].trim().toLowerCase();

    if (eventType === BroadSoftEvent.Talk || eventType === BroadSoftEvent.Hold) {
      return eventType as BroadSoftEvent;
    }
  } catch (e) {
    return undefined;
  }

  return undefined;
}

/**
 * Parse the body of a NOTIFY request for BroadSoft events
 *
 * Expected body format:
 * - For talk events: "talk" or "mute"
 * - For hold events: "hold", "unhold", or "resume"
 *
 * @param request - Incoming NOTIFY request
 * @param eventType - The type of event (from Event header)
 * @returns Parsed notify body, or undefined if not parseable
 */
export function parseNotifyBody(
  request: IncomingNotifyRequest,
  eventType: BroadSoftEvent
): BroadSoftNotifyBody | undefined {
  try {
    const body = request.message.body;
    if (!body) {
      return undefined;
    }

    const action = body.trim().toLowerCase();

    if (eventType === BroadSoftEvent.Talk) {
      if (action === TalkAction.Talk || action === TalkAction.Mute) {
        return {
          event: BroadSoftEvent.Talk,
          action: action as TalkAction
        } as TalkNotifyBody;
      }
    } else if (eventType === BroadSoftEvent.Hold) {
      if (action === HoldAction.Hold || action === HoldAction.Unhold || action === HoldAction.Resume) {
        return {
          event: BroadSoftEvent.Hold,
          action: action as HoldAction
        } as HoldNotifyBody;
      }
    }
  } catch (e) {
    return undefined;
  }

  return undefined;
}

/**
 * Apply a talk action to a session
 *
 * @param session - The session to apply the action to
 * @param action - The talk action (talk or mute)
 */
export function applyTalkAction(session: Session, action: TalkAction): void {
  const sdh = session.sessionDescriptionHandler;
  if (!sdh) {
    throw new Error("Session does not have a session description handler");
  }

  // Check if the SDH has the necessary methods (Web platform SDH)
  if (typeof (sdh as any).enableSenderTracks === "function") {
    const webSDH = sdh as any;

    if (action === TalkAction.Talk) {
      // Unmute - enable sender tracks
      webSDH.enableSenderTracks(true);
    } else if (action === TalkAction.Mute) {
      // Mute - disable sender tracks
      webSDH.enableSenderTracks(false);
    }
  } else {
    throw new Error("Session description handler does not support track control");
  }
}

/**
 * Apply a hold action to a session
 *
 * @param session - The session to apply the action to
 * @param action - The hold action (hold, unhold, or resume)
 */
export async function applyHoldAction(session: Session, action: HoldAction): Promise<void> {
  if (action === HoldAction.Hold) {
    // Put the call on hold
    await session.invite({
      sessionDescriptionHandlerOptions: session.sessionDescriptionHandlerOptions,
      sessionDescriptionHandlerModifiers: [holdModifier]
    });
  } else if (action === HoldAction.Unhold || action === HoldAction.Resume) {
    // Resume the call from hold
    await session.invite({
      sessionDescriptionHandlerOptions: session.sessionDescriptionHandlerOptions,
      sessionDescriptionHandlerModifiers: []
    });
  }
}

/**
 * SDP modifier for putting a call on hold
 *
 * This modifier sets the media direction to "sendonly" or "inactive"
 */
function holdModifier(description: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
  if (!description.sdp) {
    return Promise.resolve(description);
  }

  let sdp = description.sdp;

  // Replace sendrecv with sendonly (or recvonly with inactive)
  sdp = sdp.replace(/a=sendrecv\r\n/g, "a=sendonly\r\n");
  sdp = sdp.replace(/a=recvonly\r\n/g, "a=inactive\r\n");

  return Promise.resolve({
    type: description.type,
    sdp: sdp
  });
}

/**
 * Handle a BroadSoft remote control NOTIFY request
 *
 * This function parses the NOTIFY request and applies the appropriate action
 * to the session if auto-apply is enabled.
 *
 * @param session - The session receiving the NOTIFY
 * @param request - The incoming NOTIFY request
 * @param options - Remote control configuration options
 * @returns True if the NOTIFY was handled as a BroadSoft remote control event
 */
export async function handleRemoteControlNotify(
  session: Session,
  request: IncomingNotifyRequest,
  options: RemoteControlOptions
): Promise<boolean> {
  if (!options.enabled) {
    return false;
  }

  const eventType = parseEventHeader(request);
  if (!eventType) {
    return false;
  }

  const notifyBody = parseNotifyBody(request, eventType);
  if (!notifyBody) {
    return false;
  }

  // Handle talk events
  if (notifyBody.event === BroadSoftEvent.Talk) {
    const talkBody = notifyBody as TalkNotifyBody;

    // Invoke callback
    if (options.onTalkEvent) {
      try {
        options.onTalkEvent(talkBody.action);
      } catch (e) {
        console.error("Error in onTalkEvent callback:", e);
      }
    }

    // Auto-apply action if enabled
    if (options.autoApply) {
      try {
        applyTalkAction(session, talkBody.action);
      } catch (e) {
        console.error("Error applying talk action:", e);
      }
    }

    return true;
  }

  // Handle hold events
  if (notifyBody.event === BroadSoftEvent.Hold) {
    const holdBody = notifyBody as HoldNotifyBody;

    // Invoke callback
    if (options.onHoldEvent) {
      try {
        options.onHoldEvent(holdBody.action);
      } catch (e) {
        console.error("Error in onHoldEvent callback:", e);
      }
    }

    // Auto-apply action if enabled
    if (options.autoApply) {
      try {
        await applyHoldAction(session, holdBody.action);
      } catch (e) {
        console.error("Error applying hold action:", e);
      }
    }

    return true;
  }

  return false;
}

/**
 * Check if a NOTIFY request is a BroadSoft remote control event
 *
 * @param request - The incoming NOTIFY request
 * @returns True if this is a BroadSoft remote control event
 */
export function isBroadSoftNotify(request: IncomingNotifyRequest): boolean {
  const eventType = parseEventHeader(request);
  return eventType === BroadSoftEvent.Talk || eventType === BroadSoftEvent.Hold;
}

/**
 * Parse the Event header from a Notification
 *
 * @param notification - The notification wrapper
 * @returns The event type, or undefined if not parseable
 */
export function parseEventHeaderFromNotification(notification: Notification): BroadSoftEvent | undefined {
  try {
    const eventHeader = notification.request.getHeader("event");
    if (!eventHeader) {
      return undefined;
    }

    const eventType = eventHeader.split(";")[0].trim().toLowerCase();

    if (eventType === BroadSoftEvent.Talk || eventType === BroadSoftEvent.Hold) {
      return eventType as BroadSoftEvent;
    }
  } catch (e) {
    return undefined;
  }

  return undefined;
}

/**
 * Parse the body of a Notification for BroadSoft events
 *
 * @param notification - The notification wrapper
 * @param eventType - The type of event (from Event header)
 * @returns Parsed notify body, or undefined if not parseable
 */
export function parseNotifyBodyFromNotification(
  notification: Notification,
  eventType: BroadSoftEvent
): BroadSoftNotifyBody | undefined {
  try {
    const body = notification.request.body;
    if (!body) {
      return undefined;
    }

    const action = body.trim().toLowerCase();

    if (eventType === BroadSoftEvent.Talk) {
      if (action === TalkAction.Talk || action === TalkAction.Mute) {
        return {
          event: BroadSoftEvent.Talk,
          action: action as TalkAction
        } as TalkNotifyBody;
      }
    } else if (eventType === BroadSoftEvent.Hold) {
      if (action === HoldAction.Hold || action === HoldAction.Unhold || action === HoldAction.Resume) {
        return {
          event: BroadSoftEvent.Hold,
          action: action as HoldAction
        } as HoldNotifyBody;
      }
    }
  } catch (e) {
    return undefined;
  }

  return undefined;
}

/**
 * Handle a BroadSoft remote control NOTIFY from a Notification wrapper
 *
 * This is a convenience function for use with SessionDelegate.onNotify callback.
 *
 * @param session - The session receiving the NOTIFY
 * @param notification - The notification wrapper from delegate
 * @param options - Remote control configuration options
 * @returns True if the NOTIFY was handled as a BroadSoft remote control event
 */
export async function handleRemoteControlNotification(
  session: Session,
  notification: Notification,
  options: RemoteControlOptions
): Promise<boolean> {
  if (!options.enabled) {
    return false;
  }

  const eventType = parseEventHeaderFromNotification(notification);
  if (!eventType) {
    return false;
  }

  const notifyBody = parseNotifyBodyFromNotification(notification, eventType);
  if (!notifyBody) {
    return false;
  }

  // Handle talk events
  if (notifyBody.event === BroadSoftEvent.Talk) {
    const talkBody = notifyBody as TalkNotifyBody;

    // Invoke callback
    if (options.onTalkEvent) {
      try {
        options.onTalkEvent(talkBody.action);
      } catch (e) {
        console.error("Error in onTalkEvent callback:", e);
      }
    }

    // Auto-apply action if enabled
    if (options.autoApply) {
      try {
        applyTalkAction(session, talkBody.action);
      } catch (e) {
        console.error("Error applying talk action:", e);
      }
    }

    return true;
  }

  // Handle hold events
  if (notifyBody.event === BroadSoftEvent.Hold) {
    const holdBody = notifyBody as HoldNotifyBody;

    // Invoke callback
    if (options.onHoldEvent) {
      try {
        options.onHoldEvent(holdBody.action);
      } catch (e) {
        console.error("Error in onHoldEvent callback:", e);
      }
    }

    // Auto-apply action if enabled
    if (options.autoApply) {
      try {
        await applyHoldAction(session, holdBody.action);
      } catch (e) {
        console.error("Error applying hold action:", e);
      }
    }

    return true;
  }

  return false;
}

/**
 * Check if a Notification is a BroadSoft remote control event
 *
 * @param notification - The notification wrapper
 * @returns True if this is a BroadSoft remote control event
 */
export function isBroadSoftNotification(notification: Notification): boolean {
  const eventType = parseEventHeaderFromNotification(notification);
  return eventType === BroadSoftEvent.Talk || eventType === BroadSoftEvent.Hold;
}
