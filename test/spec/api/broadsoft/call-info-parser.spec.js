/**
 * BroadSoft Call-Info Parser Tests
 */
import { parseCallInfoHeader, extractCallInfoHeaders, getAutoAnswerDelay, hasAutoAnswer } from "../../../../lib/api/broadsoft/call-info-parser.js";
describe("BroadSoft Call-Info Parser", () => {
    describe("parseCallInfoHeader", () => {
        it("should parse Call-Info header with answer-after parameter", () => {
            const header = "<sip:example.com>; answer-after=1";
            const result = parseCallInfoHeader(header);
            expect(result).toBeDefined();
            expect(result === null || result === void 0 ? void 0 : result.uri).toBe("sip:example.com");
            expect(result === null || result === void 0 ? void 0 : result.params.answerAfter).toBe(1);
        });
        it("should parse Call-Info header with answer-after=0", () => {
            const header = "<sip:example.com>; answer-after=0";
            const result = parseCallInfoHeader(header);
            expect(result).toBeDefined();
            expect(result === null || result === void 0 ? void 0 : result.params.answerAfter).toBe(0);
        });
        it("should parse Call-Info header with multiple parameters", () => {
            const header = '<sip:example.com>; answer-after=2; purpose="info"';
            const result = parseCallInfoHeader(header);
            expect(result).toBeDefined();
            expect(result === null || result === void 0 ? void 0 : result.uri).toBe("sip:example.com");
            expect(result === null || result === void 0 ? void 0 : result.params.answerAfter).toBe(2);
            expect(result === null || result === void 0 ? void 0 : result.params.purpose).toBe("info");
        });
        it("should handle Call-Info header without answer-after", () => {
            const header = '<sip:example.com>; purpose="icon"';
            const result = parseCallInfoHeader(header);
            expect(result).toBeDefined();
            expect(result === null || result === void 0 ? void 0 : result.uri).toBe("sip:example.com");
            expect(result === null || result === void 0 ? void 0 : result.params.answerAfter).toBeUndefined();
            expect(result === null || result === void 0 ? void 0 : result.params.purpose).toBe("icon");
        });
        it("should return undefined for invalid header format", () => {
            const header = "invalid-header-format";
            const result = parseCallInfoHeader(header);
            expect(result).toBeUndefined();
        });
        it("should return undefined for empty header", () => {
            const header = "";
            const result = parseCallInfoHeader(header);
            expect(result).toBeUndefined();
        });
        it("should handle spaces in parameter values", () => {
            const header = "<sip:example.com>; answer-after = 3 ";
            const result = parseCallInfoHeader(header);
            expect(result).toBeDefined();
            expect(result === null || result === void 0 ? void 0 : result.params.answerAfter).toBe(3);
        });
    });
    describe("extractCallInfoHeaders", () => {
        it("should extract Call-Info headers from request", () => {
            const mockRequest = {
                getHeaders: (name) => {
                    if (name === "call-info") {
                        return ["<sip:example.com>; answer-after=1", '<sip:example2.com>; purpose="icon"'];
                    }
                    return [];
                }
            };
            const result = extractCallInfoHeaders(mockRequest);
            expect(result.length).toBe(2);
            expect(result[0].params.answerAfter).toBe(1);
            expect(result[1].params.purpose).toBe("icon");
        });
        it("should return empty array when no Call-Info headers present", () => {
            const mockRequest = {
                getHeaders: () => []
            };
            const result = extractCallInfoHeaders(mockRequest);
            expect(result.length).toBe(0);
        });
    });
    describe("getAutoAnswerDelay", () => {
        it("should return delay from Call-Info header", () => {
            const mockRequest = {
                getHeaders: (name) => {
                    if (name === "call-info") {
                        return ["<sip:example.com>; answer-after=5"];
                    }
                    return [];
                }
            };
            const delay = getAutoAnswerDelay(mockRequest);
            expect(delay).toBe(5);
        });
        it("should return undefined when no answer-after parameter", () => {
            const mockRequest = {
                getHeaders: (name) => {
                    if (name === "call-info") {
                        return ['<sip:example.com>; purpose="icon"'];
                    }
                    return [];
                }
            };
            const delay = getAutoAnswerDelay(mockRequest);
            expect(delay).toBeUndefined();
        });
        it("should return first answer-after when multiple headers present", () => {
            const mockRequest = {
                getHeaders: (name) => {
                    if (name === "call-info") {
                        return ["<sip:example.com>; answer-after=2", "<sip:example2.com>; answer-after=5"];
                    }
                    return [];
                }
            };
            const delay = getAutoAnswerDelay(mockRequest);
            expect(delay).toBe(2);
        });
    });
    describe("hasAutoAnswer", () => {
        it("should return true when answer-after is present", () => {
            const mockRequest = {
                getHeaders: (name) => {
                    if (name === "call-info") {
                        return ["<sip:example.com>; answer-after=0"];
                    }
                    return [];
                }
            };
            expect(hasAutoAnswer(mockRequest)).toBe(true);
        });
        it("should return false when answer-after is not present", () => {
            const mockRequest = {
                getHeaders: (name) => {
                    if (name === "call-info") {
                        return ['<sip:example.com>; purpose="icon"'];
                    }
                    return [];
                }
            };
            expect(hasAutoAnswer(mockRequest)).toBe(false);
        });
        it("should return false when no Call-Info headers", () => {
            const mockRequest = {
                getHeaders: () => []
            };
            expect(hasAutoAnswer(mockRequest)).toBe(false);
        });
    });
});
