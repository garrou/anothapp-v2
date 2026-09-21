// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Username from "./Username.vue";
import { vuetify } from "@/test/vuetify";

const userComposableMocks = vi.hoisted(() => ({
    changeUsername: vi.fn(),
}));

vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));

const mountUsername = () => mount(Username, { global: { plugins: [vuetify] } });

beforeEach(() => {
    vi.resetAllMocks();
});

describe("Username", () => {
    it("updates the username with the entered new username, its confirmation and the password, and emits refresh", async () => {
        userComposableMocks.changeUsername.mockResolvedValue(undefined);
        const wrapper = mountUsername();
        const inputs = wrapper.findAll("input");

        await inputs[0].setValue("newname");
        await inputs[1].setValue("newname");
        await inputs[2].setValue("s3cret-pass");
        await flushPromises();
        await wrapper.find("form").trigger("submit");

        expect(userComposableMocks.changeUsername).toHaveBeenCalledWith("newname", "newname", "s3cret-pass");
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });

    it("blocks submission when the new username is invalid", async () => {
        const wrapper = mountUsername();
        const inputs = wrapper.findAll("input");

        await inputs[0].setValue("ab");
        await inputs[1].setValue("ab");
        await inputs[2].setValue("s3cret-pass");
        await flushPromises();
        await wrapper.find("form").trigger("submit");

        expect(userComposableMocks.changeUsername).not.toHaveBeenCalled();
    });

    it("blocks submission when the confirmation doesn't match the new username", async () => {
        const wrapper = mountUsername();
        const inputs = wrapper.findAll("input");

        await inputs[0].setValue("newname");
        await inputs[1].setValue("differentname");
        await inputs[2].setValue("s3cret-pass");
        await flushPromises();
        await wrapper.find("form").trigger("submit");

        expect(userComposableMocks.changeUsername).not.toHaveBeenCalled();
    });
});
