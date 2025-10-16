/**
 * BroadSoft Access-Side Extensions for SIP.js
 *
 * This module provides support for three common BroadSoft Access-Side extensions:
 *
 * 1. Call-Info: ...; answer-after=1 - Auto-Answer
 *    Automatically answers incoming calls when the answer-after parameter is present
 *    in the Call-Info header.
 *
 * 2. NOTIFY (Event: talk) - Remote Control Event
 *    Handles remote control of microphone state (mute/unmute) via NOTIFY messages
 *    with Event: talk header.
 *
 * 3. NOTIFY (Event: hold) - Remote Control Event
 *    Handles remote control of call hold state via NOTIFY messages with Event: hold header.
 *
 * @example
 * ```typescript
 * import { BroadSoft } from "sip.js/lib/api/broadsoft";
 *
 * // Configure auto-answer
 * const autoAnswerOptions: BroadSoft.AutoAnswerOptions = {
 *   enabled: true,
 *   onBeforeAutoAnswer: (delay) => console.log(`Auto-answering in ${delay}s`),
 *   onAfterAutoAnswer: () => console.log("Auto-answered")
 * };
 *
 * // Configure remote control
 * const remoteControlOptions: BroadSoft.RemoteControlOptions = {
 *   enabled: true,
 *   autoApply: true,
 *   onTalkEvent: (action) => console.log(`Talk event: ${action}`),
 *   onHoldEvent: (action) => console.log(`Hold event: ${action}`)
 * };
 *
 * // Handle incoming invitation
 * userAgent.delegate = {
 *   onInvite: (invitation) => {
 *     // Check for auto-answer
 *     if (BroadSoft.shouldAutoAnswer(invitation)) {
 *       BroadSoft.handleAutoAnswer(invitation, autoAnswerOptions);
 *     }
 *
 *     // Set up remote control handling
 *     invitation.delegate = {
 *       onNotifyRequest: (request) => {
 *         BroadSoft.handleRemoteControlNotify(invitation, request, remoteControlOptions);
 *       }
 *     };
 *   }
 * };
 * ```
 */

// Export all types
export * from "./types.js";

// Export Call-Info parsing utilities
export {
  parseCallInfoHeader,
  extractCallInfoHeaders,
  getAutoAnswerDelay,
  hasAutoAnswer
} from "./call-info-parser.js";

// Export auto-answer utilities
export {
  handleAutoAnswer,
  shouldAutoAnswer
} from "./auto-answer.js";

// Export remote control utilities
export {
  parseEventHeader,
  parseNotifyBody,
  applyTalkAction,
  applyHoldAction,
  handleRemoteControlNotify,
  isBroadSoftNotify,
  parseEventHeaderFromNotification,
  parseNotifyBodyFromNotification,
  handleRemoteControlNotification,
  isBroadSoftNotification
} from "./remote-control.js";
