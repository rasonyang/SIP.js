/**
 * BroadSoft Remote Control Tests
 */
import { parseEventHeader, parseNotifyBody, isBroadSoftNotify } from "../../../../lib/api/broadsoft/remote-control.js";
import { BroadSoftEvent, TalkAction } from "../../../../lib/api/broadsoft/types.js";
describe("BroadSoft Remote Control", () => {
    describe("parseEventHeader", () => {
        it("should parse Event: talk header", () => {
            const mockRequest = {
                message: {
                    getHeader: (name) => {
                        if (name === "event") {
                            return "talk";
                        }
                        return undefined;
                    }
                }
            };
            const result = parseEventHeader(mockRequest);
            expect(result).toBe(BroadSoftEvent.Talk);
        });
        it("should handle Event header with parameters", () => {
            const mockRequest = {
                message: {
                    getHeader: (name) => {
                        if (name === "event") {
                            return "talk; id=123";
                        }
                        return undefined;
                    }
                }
            };
            const result = parseEventHeader(mockRequest);
            expect(result).toBe(BroadSoftEvent.Talk);
        });
        it("should return undefined for non-BroadSoft events", () => {
            const mockRequest = {
                message: {
                    getHeader: (name) => {
                        if (name === "event") {
                            return "presence";
                        }
                        return undefined;
                    }
                }
            };
            const result = parseEventHeader(mockRequest);
            expect(result).toBeUndefined();
        });
        it("should return undefined when Event header is missing", () => {
            const mockRequest = {
                message: {
                    getHeader: (name) => undefined
                }
            };
            const result = parseEventHeader(mockRequest);
            expect(result).toBeUndefined();
        });
        it("should handle case-insensitive event values", () => {
            const mockRequest = {
                message: {
                    getHeader: (name) => {
                        if (name === "event") {
                            return "TALK";
                        }
                        return undefined;
                    }
                }
            };
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
            };
            const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);
            expect(result).toBeDefined();
            expect(result === null || result === void 0 ? void 0 : result.event).toBe(BroadSoftEvent.Talk);
            expect(result === null || result === void 0 ? void 0 : result.action).toBe(TalkAction.Talk);
        });
        it("should parse mute action from body", () => {
            const mockRequest = {
                message: {
                    body: "mute"
                }
            };
            const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);
            expect(result).toBeDefined();
            expect(result === null || result === void 0 ? void 0 : result.event).toBe(BroadSoftEvent.Talk);
            expect(result === null || result === void 0 ? void 0 : result.action).toBe(TalkAction.Mute);
        });
        it("should handle case-insensitive body", () => {
            const mockRequest = {
                message: {
                    body: "MUTE"
                }
            };
            const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);
            expect(result).toBeDefined();
            expect(result === null || result === void 0 ? void 0 : result.action).toBe(TalkAction.Mute);
        });
        it("should handle body with whitespace", () => {
            const mockRequest = {
                message: {
                    body: "  talk  "
                }
            };
            const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);
            expect(result).toBeDefined();
            expect(result === null || result === void 0 ? void 0 : result.action).toBe(TalkAction.Talk);
        });
        it("should return undefined for invalid action", () => {
            const mockRequest = {
                message: {
                    body: "invalid-action"
                }
            };
            const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);
            expect(result).toBeUndefined();
        });
        it("should parse empty body for talk event as Talk action", () => {
            const mockRequest = {
                message: {
                    body: undefined
                }
            };
            const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);
            expect(result).toBeDefined();
            expect(result === null || result === void 0 ? void 0 : result.event).toBe(BroadSoftEvent.Talk);
            expect(result === null || result === void 0 ? void 0 : result.action).toBe(TalkAction.Talk);
        });
        it("should parse empty string body for talk event as Talk action", () => {
            const mockRequest = {
                message: {
                    body: ""
                }
            };
            const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);
            expect(result).toBeDefined();
            expect(result === null || result === void 0 ? void 0 : result.event).toBe(BroadSoftEvent.Talk);
            expect(result === null || result === void 0 ? void 0 : result.action).toBe(TalkAction.Talk);
        });
        it("should parse whitespace-only body for talk event as Talk action", () => {
            const mockRequest = {
                message: {
                    body: "   "
                }
            };
            const result = parseNotifyBody(mockRequest, BroadSoftEvent.Talk);
            expect(result).toBeDefined();
            expect(result === null || result === void 0 ? void 0 : result.event).toBe(BroadSoftEvent.Talk);
            expect(result === null || result === void 0 ? void 0 : result.action).toBe(TalkAction.Talk);
        });
    });
    describe("isBroadSoftNotify", () => {
        it("should return true for talk event", () => {
            const mockRequest = {
                message: {
                    getHeader: (name) => {
                        if (name === "event") {
                            return "talk";
                        }
                        return undefined;
                    }
                }
            };
            expect(isBroadSoftNotify(mockRequest)).toBe(true);
        });
        it("should return false for non-BroadSoft event", () => {
            const mockRequest = {
                message: {
                    getHeader: (name) => {
                        if (name === "event") {
                            return "presence";
                        }
                        return undefined;
                    }
                }
            };
            expect(isBroadSoftNotify(mockRequest)).toBe(false);
        });
        it("should return false when no Event header", () => {
            const mockRequest = {
                message: {
                    getHeader: (name) => undefined
                }
            };
            expect(isBroadSoftNotify(mockRequest)).toBe(false);
        });
    });
});
