import { describe, it, expect } from "vitest";
import { nameRules, emailRules, passwordRules } from "./validator";
import { MAX_PASSWORD, MAX_USERNAME, MIN_PASSWORD, MIN_USERNAME } from "@/constants/auth";

describe("nameRules", () => {
    it("requires a value", () => {
        expect(nameRules[0]("")).toBe("Username requis");
        expect(nameRules[0]("x")).toBe(true);
    });

    it("rejects a username shorter than the minimum length", () => {
        const tooShort = "a".repeat(MIN_USERNAME - 1);
        expect(nameRules[1](tooShort)).not.toBe(true);
    });

    it("accepts a username at the boundaries", () => {
        expect(nameRules[1]("a".repeat(MIN_USERNAME))).toBe(true);
        expect(nameRules[1]("a".repeat(MAX_USERNAME))).toBe(true);
    });

    it("rejects a username longer than the maximum length", () => {
        expect(nameRules[1]("a".repeat(MAX_USERNAME + 1))).not.toBe(true);
    });
});

describe("emailRules", () => {
    it("requires a value", () => {
        expect(emailRules[0]("")).toBe("Email requis");
        expect(emailRules[0]("x@x.com")).toBe(true);
    });

    it("accepts a well-formed email", () => {
        expect(emailRules[1]("dexter@example.com")).toBe(true);
    });

    it("rejects a malformed email", () => {
        expect(emailRules[1]("not-an-email")).not.toBe(true);
        expect(emailRules[1]("missing@domain")).not.toBe(true);
    });
});

describe("passwordRules", () => {
    it("requires a value", () => {
        expect(passwordRules[0]("")).toBe("Un mot de passe est requis.");
        expect(passwordRules[0]("x")).toBe(true);
    });

    it("rejects a password shorter than the minimum length", () => {
        expect(passwordRules[1]("a".repeat(MIN_PASSWORD - 1))).not.toBe(true);
    });

    it("accepts a password at the boundaries", () => {
        expect(passwordRules[1]("a".repeat(MIN_PASSWORD))).toBe(true);
        expect(passwordRules[1]("a".repeat(MAX_PASSWORD))).toBe(true);
    });

    it("rejects a password longer than the maximum length", () => {
        expect(passwordRules[1]("a".repeat(MAX_PASSWORD + 1))).not.toBe(true);
    });
});
