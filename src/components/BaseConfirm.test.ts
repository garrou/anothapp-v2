// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import BaseConfirm from "./BaseConfirm.vue";
import { vuetify } from "@/test/vuetify";

const mountConfirm = (props: Record<string, unknown> = {}) => mount(BaseConfirm, {
    global: { plugins: [vuetify] },
    props: { modelValue: true, title: "Supprimer", text: "Confirmez-vous ?", ...props },
});

describe("BaseConfirm", () => {
    it("shows the title and text when open (v-model falls through to v-dialog)", () => {
        const wrapper = mountConfirm();

        expect(wrapper.findComponent({ name: "VDialog" }).props("modelValue")).toBe(true);
        expect(wrapper.text()).toContain("Supprimer");
        expect(wrapper.text()).toContain("Confirmez-vous ?");
    });

    it("emits cancel when the cancel button is clicked", async () => {
        const wrapper = mountConfirm();

        await wrapper.findAll("button")[0].trigger("click");

        expect(wrapper.emitted("cancel")).toHaveLength(1);
        expect(wrapper.emitted("confirm")).toBeUndefined();
    });

    it("emits confirm when the confirm button is clicked", async () => {
        const wrapper = mountConfirm();

        await wrapper.findAll("button")[1].trigger("click");

        expect(wrapper.emitted("confirm")).toHaveLength(1);
        expect(wrapper.emitted("cancel")).toBeUndefined();
    });

    it("uses the custom button texts when given", () => {
        const wrapper = mountConfirm({ cancelText: "Non", confirmText: "Oui, supprimer" });

        expect(wrapper.text()).toContain("Non");
        expect(wrapper.text()).toContain("Oui, supprimer");
    });
});
