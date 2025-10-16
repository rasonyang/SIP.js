/**
 * BroadSoft Auto-Answer Implementation
 *
 * Handles automatic answering of calls based on Call-Info header with answer-after parameter.
 */

import { Invitation } from "../invitation.js";
import { InvitationAcceptOptions } from "../invitation-accept-options.js";
import { AutoAnswerOptions } from "./types.js";
import { getAutoAnswerDelay, hasAutoAnswer } from "./call-info-parser.js";

/**
 * Handle auto-answer for an incoming invitation
 *
 * This function checks if the invitation has an answer-after parameter in the Call-Info header.
 * If present, it will automatically accept the invitation after the specified delay.
 *
 * @param invitation - The incoming invitation to potentially auto-answer
 * @param options - Auto-answer configuration options
 * @param acceptOptions - Options to pass to invitation.accept()
 * @returns True if auto-answer was triggered, false otherwise
 */
export function handleAutoAnswer(
  invitation: Invitation,
  options: AutoAnswerOptions,
  acceptOptions?: InvitationAcceptOptions
): boolean {
  if (!options.enabled) {
    return false;
  }

  // Check for auto-answer in Call-Info header
  const autoAnswerDelay = getAutoAnswerDelay(invitation.request);

  if (autoAnswerDelay === undefined) {
    return false;
  }

  // Use override delay if specified
  const delaySeconds = options.delayOverride !== undefined ? options.delayOverride : autoAnswerDelay;
  const delayMs = delaySeconds * 1000;

  // Invoke pre-answer callback
  if (options.onBeforeAutoAnswer) {
    try {
      options.onBeforeAutoAnswer(delaySeconds);
    } catch (e) {
      console.error("Error in onBeforeAutoAnswer callback:", e);
    }
  }

  // Schedule auto-answer
  setTimeout(() => {
    // Check if invitation is still in a state that can be accepted
    if (invitation.state === "Initial" || invitation.state === "Establishing") {
      invitation.accept(acceptOptions)
        .then(() => {
          // Invoke post-answer callback
          if (options.onAfterAutoAnswer) {
            try {
              options.onAfterAutoAnswer();
            } catch (e) {
              console.error("Error in onAfterAutoAnswer callback:", e);
            }
          }
        })
        .catch((error) => {
          console.error("Auto-answer failed:", error);
        });
    }
  }, delayMs);

  return true;
}

/**
 * Check if an invitation should be auto-answered
 *
 * @param invitation - The incoming invitation to check
 * @returns True if the invitation has auto-answer enabled
 */
export function shouldAutoAnswer(invitation: Invitation): boolean {
  return hasAutoAnswer(invitation.request);
}
