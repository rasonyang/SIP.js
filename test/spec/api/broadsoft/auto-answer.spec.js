/**
 * BroadSoft Auto-Answer Tests
 */
import { handleAutoAnswer, shouldAutoAnswer } from "../../../../lib/api/broadsoft/auto-answer.js";
describe("BroadSoft Auto-Answer", () => {
    describe("shouldAutoAnswer", () => {
        it("should return true when answer-after is present", () => {
            const mockInvitation = {
                request: {
                    getHeaders: (name) => {
                        if (name === "call-info") {
                            return ["<sip:example.com>; answer-after=1"];
                        }
                        return [];
                    }
                }
            };
            expect(shouldAutoAnswer(mockInvitation)).toBe(true);
        });
        it("should return false when answer-after is not present", () => {
            const mockInvitation = {
                request: {
                    getHeaders: (name) => {
                        if (name === "call-info") {
                            return ['<sip:example.com>; purpose="icon"'];
                        }
                        return [];
                    }
                }
            };
            expect(shouldAutoAnswer(mockInvitation)).toBe(false);
        });
        it("should return false when no Call-Info headers", () => {
            const mockInvitation = {
                request: {
                    getHeaders: () => []
                }
            };
            expect(shouldAutoAnswer(mockInvitation)).toBe(false);
        });
    });
    describe("handleAutoAnswer", () => {
        beforeEach(() => {
            jasmine.clock().install();
        });
        afterEach(() => {
            jasmine.clock().uninstall();
        });
        it("should return false when auto-answer is disabled", () => {
            const mockInvitation = {
                request: {
                    getHeaders: (name) => {
                        if (name === "call-info") {
                            return ["<sip:example.com>; answer-after=1"];
                        }
                        return [];
                    }
                }
            };
            const options = {
                enabled: false
            };
            const result = handleAutoAnswer(mockInvitation, options);
            expect(result).toBe(false);
        });
        it("should return false when no answer-after parameter", () => {
            const mockInvitation = {
                request: {
                    getHeaders: (name) => {
                        if (name === "call-info") {
                            return ['<sip:example.com>; purpose="icon"'];
                        }
                        return [];
                    }
                }
            };
            const options = {
                enabled: true
            };
            const result = handleAutoAnswer(mockInvitation, options);
            expect(result).toBe(false);
        });
        it("should schedule auto-answer with correct delay", (done) => {
            const acceptCalled = false;
            const mockInvitation = {
                request: {
                    getHeaders: (name) => {
                        if (name === "call-info") {
                            return ["<sip:example.com>; answer-after=2"];
                        }
                        return [];
                    }
                },
                state: "Initial",
                accept: jasmine.createSpy("accept").and.returnValue(Promise.resolve())
            };
            const options = {
                enabled: true
            };
            const result = handleAutoAnswer(mockInvitation, options);
            expect(result).toBe(true);
            expect(mockInvitation.accept).not.toHaveBeenCalled();
            // Advance time by 2 seconds
            jasmine.clock().tick(2000);
            // Tick once more to execute the promise microtask
            jasmine.clock().tick(1);
            // Wait for next tick to verify
            setTimeout(() => {
                expect(mockInvitation.accept).toHaveBeenCalled();
                done();
            }, 0);
            // Tick to execute the setTimeout
            jasmine.clock().tick(1);
        });
        it("should call onBeforeAutoAnswer callback", () => {
            const mockInvitation = {
                request: {
                    getHeaders: (name) => {
                        if (name === "call-info") {
                            return ["<sip:example.com>; answer-after=1"];
                        }
                        return [];
                    }
                },
                state: "Initial",
                accept: jasmine.createSpy("accept").and.returnValue(Promise.resolve())
            };
            const beforeCallback = jasmine.createSpy("beforeCallback");
            const options = {
                enabled: true,
                onBeforeAutoAnswer: beforeCallback
            };
            handleAutoAnswer(mockInvitation, options);
            expect(beforeCallback).toHaveBeenCalledWith(1);
        });
        it("should call onAfterAutoAnswer callback after accepting", (done) => {
            const mockInvitation = {
                request: {
                    getHeaders: (name) => {
                        if (name === "call-info") {
                            return ["<sip:example.com>; answer-after=0"];
                        }
                        return [];
                    }
                },
                state: "Initial",
                accept: jasmine.createSpy("accept").and.returnValue(Promise.resolve())
            };
            const afterCallback = jasmine.createSpy("afterCallback");
            const options = {
                enabled: true,
                onAfterAutoAnswer: afterCallback
            };
            handleAutoAnswer(mockInvitation, options);
            // Answer after=0 means immediate
            jasmine.clock().tick(0);
            // Use a microtask to wait for the promise chain to complete
            Promise.resolve()
                .then(() => Promise.resolve())
                .then(() => {
                expect(afterCallback).toHaveBeenCalled();
                done();
            });
            // Tick to execute promise microtasks
            jasmine.clock().tick(1);
        });
        it("should use delayOverride when provided", () => {
            const mockInvitation = {
                request: {
                    getHeaders: (name) => {
                        if (name === "call-info") {
                            return ["<sip:example.com>; answer-after=5"];
                        }
                        return [];
                    }
                },
                state: "Initial",
                accept: jasmine.createSpy("accept").and.returnValue(Promise.resolve())
            };
            const beforeCallback = jasmine.createSpy("beforeCallback");
            const options = {
                enabled: true,
                delayOverride: 0,
                onBeforeAutoAnswer: beforeCallback
            };
            handleAutoAnswer(mockInvitation, options);
            // Should use override delay of 0, not header value of 5
            expect(beforeCallback).toHaveBeenCalledWith(0);
        });
        it("should not accept if session is already terminated", (done) => {
            const mockInvitation = {
                request: {
                    getHeaders: (name) => {
                        if (name === "call-info") {
                            return ["<sip:example.com>; answer-after=0"];
                        }
                        return [];
                    }
                },
                state: "Terminated",
                accept: jasmine.createSpy("accept").and.returnValue(Promise.resolve())
            };
            const options = {
                enabled: true
            };
            handleAutoAnswer(mockInvitation, options);
            jasmine.clock().tick(0);
            // Tick once more to execute the promise microtask
            jasmine.clock().tick(1);
            setTimeout(() => {
                expect(mockInvitation.accept).not.toHaveBeenCalled();
                done();
            }, 10);
            // Tick to execute the setTimeout
            jasmine.clock().tick(11);
        });
    });
});
