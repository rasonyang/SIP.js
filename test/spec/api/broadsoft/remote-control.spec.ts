/**
 * BroadSoft Remote Control Tests
 */

import { IncomingNotifyRequest } from "../../../../lib/core/messages/methods/notify.js";
import { Session } from "../../../../lib/api/session.js";
import {
  parseEventHeader,
  parseNotifyBody,
  isBroadSoftNotify,
  BroadSoftEvent,
  TalkAction,
  HoldAction
} from "../../../../lib/api/broadsoft/remote-control.js";

describe("BroadSoft Remote Control", () => {
  describe("parseEventHeader", () => {
    it("should parse Event: talk header", () => {
      const mockRequest = {
        message: {
          getHeader: (name: string) => {
            if (name === "event") {
              return "talk";
            }
            return undefined;
          }
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseEventHeader(mockRequest);

      expect(result).toBe(BroadSoftEvent.Talk);
    });

    it("should parse Event: hold header", () => {
      const mockRequest = {
        message: {
          getHeader: (name: string) => {
            if (name === "event") {
              return "hold";
            }
            return undefined;
          }
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseEventHeader(mockRequest);

      expect(result).toBe(BroadSoftEvent.Hold);
    });

    it("should handle Event header with parameters", () => {
      const mockRequest = {
        message: {
          getHeader: (name: string) => {
            if (name === "event") {
              return "talk; id=123";
            }
            return undefined;
          }
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseEventHeader(mockRequest);

      expect(result).toBe(BroadSoftEvent.Talk);
    });

    it("should return undefined for non-BroadSoft events", () => {
      const mockRequest = {
        message: {
          getHeader: (name: string) => {
            if (name === "event") {
              return "presence";
            }
            return undefined;
          }
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseEventHeader(mockRequest);

      expect(result).toBeUndefined();
    });

    it("should return undefined when Event header is missing", () => {
      const mockRequest = {
        message: {
          getHeader: (name: string) => undefined
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseEventHeader(mockRequest);

      expect(result).toBeUndefined();
    });

    it("should handle case-insensitive event values", () => {
      const mockRequest = {
        message: {
          getHeader: (name: string) => {
            if (name === "event") {
              return "TALK";
            }
            return undefined;
          }
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseEventHeader(mockRequest);

      expect(result).toBe(BroadSoftEvent.Talk);
    });
  });

  describe("parseNotifyBody", () => {
    it("should parse talk action from body", () => {
      const mockRequest = {
        message: {
          body: "talk"
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);

      expect(result).toBeDefined();
      expect(result?.event).toBe(BroadSoftEvent.Talk);
      expect(result?.action).toBe(TalkAction.Talk);
    });

    it("should parse mute action from body", () => {
      const mockRequest = {
        message: {
          body: "mute"
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);

      expect(result).toBeDefined();
      expect(result?.event).toBe(BroadSoftEvent.Talk);
      expect(result?.action).toBe(TalkAction.Mute);
    });

    it("should parse hold action from body", () => {
      const mockRequest = {
        message: {
          body: "hold"
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseNotifyBody(mockRequest, BroadSoftEvent.Hold);

      expect(result).toBeDefined();
      expect(result?.event).toBe(BroadSoftEvent.Hold);
      expect(result?.action).toBe(HoldAction.Hold);
    });

    it("should parse unhold action from body", () => {
      const mockRequest = {
        message: {
          body: "unhold"
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseNotifyBody(mockRequest, BroadSoftEvent.Hold);

      expect(result).toBeDefined();
      expect(result?.event).toBe(BroadSoftEvent.Hold);
      expect(result?.action).toBe(HoldAction.Unhold);
    });

    it("should parse resume action from body", () => {
      const mockRequest = {
        message: {
          body: "resume"
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseNotifyBody(mockRequest, BroadSoftEvent.Hold);

      expect(result).toBeDefined();
      expect(result?.event).toBe(BroadSoftEvent.Hold);
      expect(result?.action).toBe(HoldAction.Resume);
    });

    it("should handle case-insensitive body", () => {
      const mockRequest = {
        message: {
          body: "MUTE"
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);

      expect(result).toBeDefined();
      expect(result?.action).toBe(TalkAction.Mute);
    });

    it("should handle body with whitespace", () => {
      const mockRequest = {
        message: {
          body: "  talk  "
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);

      expect(result).toBeDefined();
      expect(result?.action).toBe(TalkAction.Talk);
    });

    it("should return undefined for invalid action", () => {
      const mockRequest = {
        message: {
          body: "invalid-action"
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);

      expect(result).toBeUndefined();
    });

    it("should return undefined for missing body", () => {
      const mockRequest = {
        message: {
          body: undefined
        }
      } as unknown as IncomingNotifyRequest;

      const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);

      expect(result).toBeUndefined();
    });
  });

  describe("isBroadSoftNotify", () => {
    it("should return true for talk event", () => {
      const mockRequest = {
        message: {
          getHeader: (name: string) => {
            if (name === "event") {
              return "talk";
            }
            return undefined;
          }
        }
      } as unknown as IncomingNotifyRequest;

      expect(isBroadSoftNotify(mockRequest)).toBe(true);
    });

    it("should return true for hold event", () => {
      const mockRequest = {
        message: {
          getHeader: (name: string) => {
            if (name === "event") {
              return "hold";
            }
            return undefined;
          }
        }
      } as unknown as IncomingNotifyRequest;

      expect(isBroadSoftNotify(mockRequest)).toBe(true);
    });

    it("should return false for non-BroadSoft event", () => {
      const mockRequest = {
        message: {
          getHeader: (name: string) => {
            if (name === "event") {
              return "presence";
            }
            return undefined;
          }
        }
      } as unknown as IncomingNotifyRequest;

      expect(isBroadSoftNotify(mockRequest)).toBe(false);
    });

    it("should return false when no Event header", () => {
      const mockRequest = {
        message: {
          getHeader: (name: string) => undefined
        }
      } as unknown as IncomingNotifyRequest;

      expect(isBroadSoftNotify(mockRequest)).toBe(false);
    });
  });
});
