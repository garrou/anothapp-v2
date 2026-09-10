import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useState } from "./state";

beforeEach(() => {
    setActivePinia(createPinia());
});

describe("useState", () => {
    it("defaults confirmModal to false", () => {
        expect(useState().confirmModal.value).toBe(false);
    });

    it("setConfirmModal updates the store's confirmModal state", () => {
        const { confirmModal, setConfirmModal } = useState();

        setConfirmModal(true);
        expect(confirmModal.value).toBe(true);

        setConfirmModal(false);
        expect(confirmModal.value).toBe(false);
    });

    it("shares state across separate useState() calls", () => {
        const first = useState();
        const second = useState();

        first.setConfirmModal(true);

        expect(second.confirmModal.value).toBe(true);
    });
});
