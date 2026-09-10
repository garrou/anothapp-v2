// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import PlaylistFormModal from "./PlaylistFormModal.vue";
import { vuetify } from "@/test/vuetify";

const mountModal = (props: Record<string, unknown> = {}) => mount(PlaylistFormModal, {
    global: { plugins: [vuetify] },
    props: { modelValue: true, ...props },
});

describe("PlaylistFormModal", () => {
    it("starts empty and private with the save button disabled in create mode", () => {
        const wrapper = mountModal();

        expect(wrapper.findComponent({ name: "VTextField" }).props("modelValue")).toBe("");
        expect(wrapper.text()).toContain("Privée");
        expect(wrapper.findAll("button").at(-1)?.attributes("disabled")).toBeDefined();
    });

    it("pre-fills name and visibility from the playlist prop in edit mode", () => {
        const wrapper = mountModal({ playlist: { id: "p1", name: "Animes", visible: true } });

        expect(wrapper.findComponent({ name: "VTextField" }).props("modelValue")).toBe("Animes");
        expect(wrapper.text()).toContain("Visible par vos amis");
    });

    it("resets the fields when the playlist prop changes", async () => {
        const wrapper = mountModal({ playlist: { id: "p1", name: "Animes", visible: true } });

        await wrapper.setProps({ playlist: undefined });

        expect(wrapper.findComponent({ name: "VTextField" }).props("modelValue")).toBe("");
    });

    it("enables save once a non-blank name is entered, and emits the trimmed name", async () => {
        const wrapper = mountModal();

        await wrapper.findComponent({ name: "VTextField" }).setValue("  Mes séries  ");
        const saveBtn = wrapper.findAll("button").at(-1);
        expect(saveBtn?.attributes("disabled")).toBeUndefined();

        await saveBtn?.trigger("click");

        expect(wrapper.emitted("save")).toEqual([["Mes séries", false]]);
    });

    it("keeps save disabled for a whitespace-only name", async () => {
        const wrapper = mountModal();

        await wrapper.findComponent({ name: "VTextField" }).setValue("   ");

        expect(wrapper.findAll("button").at(-1)?.attributes("disabled")).toBeDefined();
    });

    it("includes the visible flag when the switch is toggled on", async () => {
        const wrapper = mountModal();

        await wrapper.findComponent({ name: "VTextField" }).setValue("Animes");
        await wrapper.findComponent({ name: "VSwitch" }).setValue(true);
        await wrapper.findAll("button").at(-1)?.trigger("click");

        expect(wrapper.emitted("save")).toEqual([["Animes", true]]);
    });

    it("emits cancel when the cancel button is clicked", async () => {
        const wrapper = mountModal();

        await wrapper.findAll("button")[0].trigger("click");

        expect(wrapper.emitted("cancel")).toHaveLength(1);
    });
});
