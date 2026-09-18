// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ForgotPasswordView from "./ForgotPasswordView.vue";
import { vuetify } from "@/test/vuetify";

const authComposableMocks = vi.hoisted(() => ({
    forgotPassword: vi.fn(),
}));

vi.mock("@/composables/auth", () => ({ useAuth: () => authComposableMocks }));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("ForgotPasswordView", () => {
    it("sends the reset request for the entered email", async () => {
        authComposableMocks.forgotPassword.mockResolvedValue(undefined);
        const wrapper = mount(ForgotPasswordView, { global: { plugins: [vuetify] } });

        await wrapper.find("input").setValue("dexter@example.com");
        await flushPromises();
        await wrapper.find("form").trigger("submit");

        expect(authComposableMocks.forgotPassword).toHaveBeenCalledWith("dexter@example.com");
    });

    it("shows an inline error when the request fails", async () => {
        authComposableMocks.forgotPassword.mockRejectedValue(new Error("Aucun compte associé à cet email"));
        const wrapper = mount(ForgotPasswordView, { global: { plugins: [vuetify] } });

        await wrapper.find("input").setValue("unknown@example.com");
        await flushPromises();
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        expect(wrapper.text()).toContain("Aucun compte associé à cet email");
    });

    it("blocks submission when the email is invalid", async () => {
        const wrapper = mount(ForgotPasswordView, { global: { plugins: [vuetify] } });

        await wrapper.find("input").setValue("not-an-email");
        await flushPromises();
        await wrapper.find("form").trigger("submit");

        expect(authComposableMocks.forgotPassword).not.toHaveBeenCalled();
    });
});
