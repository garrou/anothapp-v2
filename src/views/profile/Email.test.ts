// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Email from "./Email.vue";
import { vuetify } from "@/test/vuetify";

const userComposableMocks = vi.hoisted(() => ({
    changeEmail: vi.fn(),
}));

vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));

const mountEmail = () => mount(Email, { global: { plugins: [vuetify] } });

beforeEach(() => {
    vi.resetAllMocks();
});

describe("Email", () => {
    it("updates the email with the entered new email, its confirmation and the password, and emits refresh", async () => {
        userComposableMocks.changeEmail.mockResolvedValue(undefined);
        const wrapper = mountEmail();
        const inputs = wrapper.findAll("input");

        await inputs[0].setValue("new@xyz.com");
        await inputs[1].setValue("new@xyz.com");
        await inputs[2].setValue("s3cret-pass");
        await flushPromises();
        await wrapper.find("form").trigger("submit");

        expect(userComposableMocks.changeEmail).toHaveBeenCalledWith("new@xyz.com", "new@xyz.com", "s3cret-pass");
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });

    it("blocks submission when the new email is invalid", async () => {
        const wrapper = mountEmail();
        const inputs = wrapper.findAll("input");

        await inputs[0].setValue("not-an-email");
        await inputs[1].setValue("not-an-email");
        await inputs[2].setValue("s3cret-pass");
        await flushPromises();
        await wrapper.find("form").trigger("submit");

        expect(userComposableMocks.changeEmail).not.toHaveBeenCalled();
    });

    it("blocks submission when the confirmation doesn't match the new email", async () => {
        const wrapper = mountEmail();
        const inputs = wrapper.findAll("input");

        await inputs[0].setValue("new@xyz.com");
        await inputs[1].setValue("different@xyz.com");
        await inputs[2].setValue("s3cret-pass");
        await flushPromises();
        await wrapper.find("form").trigger("submit");

        expect(userComposableMocks.changeEmail).not.toHaveBeenCalled();
    });
});
