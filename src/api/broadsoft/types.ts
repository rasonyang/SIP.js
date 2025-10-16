/**
 * BroadSoft Access-Side Extension Types
 *
 * This module provides type definitions for BroadSoft-specific SIP extensions.
 */

/**
 * Call-Info header parameters for BroadSoft extensions
 */
export interface CallInfoHeader {
  /** The URI part of the Call-Info header */
  uri: string;
  /** Parameters extracted from the Call-Info header */
  params: {
    /** Auto-answer delay in seconds (0 = immediate, > 0 = delayed) */
    answerAfter?: number;
    /** Additional parameters */
    [key: string]: string | number | undefined;
  };
}

/**
 * BroadSoft Event types for NOTIFY messages
 */
export enum BroadSoftEvent {
  /** Remote control event for talk/mute operations */
  Talk = "talk",
  /** Remote control event for hold operations */
  Hold = "hold"
}

/**
 * Talk event actions
 */
export enum TalkAction {
  /** Unmute the microphone */
  Talk = "talk",
  /** Mute the microphone */
  Mute = "mute"
}

/**
 * Hold event actions
 */
export enum HoldAction {
  /** Put the call on hold */
  Hold = "hold",
  /** Resume the call from hold */
  Unhold = "unhold",
  /** Alternative term for resume */
  Resume = "resume"
}

/**
 * Parsed NOTIFY body for talk events
 */
export interface TalkNotifyBody {
  event: BroadSoftEvent.Talk;
  action: TalkAction;
}

/**
 * Parsed NOTIFY body for hold events
 */
export interface HoldNotifyBody {
  event: BroadSoftEvent.Hold;
  action: HoldAction;
}

/**
 * Union type for all BroadSoft NOTIFY body types
 */
export type BroadSoftNotifyBody = TalkNotifyBody | HoldNotifyBody;

/**
 * Options for auto-answer behavior
 */
export interface AutoAnswerOptions {
  /** Whether to enable auto-answer feature */
  enabled: boolean;
  /** Callback invoked before auto-answering */
  onBeforeAutoAnswer?: (answerAfter: number) => void;
  /** Callback invoked after auto-answering */
  onAfterAutoAnswer?: () => void;
  /** Override delay (in seconds) regardless of header value */
  delayOverride?: number;
}

/**
 * Options for BroadSoft remote control handling
 */
export interface RemoteControlOptions {
  /** Whether to enable remote control features */
  enabled: boolean;
  /** Callback for talk events */
  onTalkEvent?: (action: TalkAction) => void;
  /** Callback for hold events */
  onHoldEvent?: (action: HoldAction) => void;
  /** Whether to automatically apply remote control actions */
  autoApply: boolean;
}

/**
 * Complete BroadSoft extension options
 */
export interface BroadSoftOptions {
  /** Auto-answer configuration */
  autoAnswer?: AutoAnswerOptions;
  /** Remote control configuration */
  remoteControl?: RemoteControlOptions;
}
