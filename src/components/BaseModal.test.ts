// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseModal from "./BaseModal.vue";
import { vuetify } from "@/test/vuetify";

const mountModal = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) => mount(BaseModal, {
    global: { plugins: [vuetify] },
    attachTo: document.body,
    props: { modelValue: true, ...props },
    slots,
});

describe("BaseModal", () => {
    it("renders nothing open when modelValue is false", () => {
        mountModal({ modelValue: false, title: "Titre" });

        expect(document.body.textContent).not.toContain("Titre");
    });

    it("shows the title and slot content when open", () => {
        mountModal({ title: "Ajouter à une playlist" }, { default: "<p>Contenu</p>" });

        expect(document.body.textContent).toContain("Ajouter à une playlist");
        expect(document.body.textContent).toContain("Contenu");
    });

    it("emits update:modelValue(false) when the close button is clicked", async () => {
        const wrapper = mountModal({ title: "Titre" });

        await wrapper.find('button[aria-label="Fermer"]').trigger("click");

        expect(wrapper.emitted("update:modelValue")).toContainEqual([false]);
    });

    it("emits update:modelValue when the dialog itself requests a close (e.g. escape/overlay)", async () => {
        const wrapper = mountModal({ title: "Titre" });

        await wrapper.findComponent({ name: "VDialog" }).vm.$emit("update:modelValue", false);

        expect(wrapper.emitted("update:modelValue")).toContainEqual([false]);
    });
});
