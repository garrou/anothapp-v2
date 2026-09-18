// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ResetPasswordView from "./ResetPasswordView.vue";
import { vuetify } from "@/test/vuetify";

const authComposableMocks = vi.hoisted(() => ({
    resetPassword: vi.fn(),
}));

vi.mock("@/composables/auth", () => ({ useAuth: () => authComposableMocks }));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("ResetPasswordView", () => {
    it("resets the password with the token from the route and the entered password", async () => {
        authComposableMocks.resetPassword.mockResolvedValue(undefined);
        const wrapper = mount(ResetPasswordView, { props: { token: "some-token" }, global: { plugins: [vuetify] } });
        const inputs = wrapper.findAll("input");

        await inputs[0].setValue("NewPassword1");
        await inputs[1].setValue("NewPassword1");
        await wrapper.find("form").trigger("submit");

        expect(authComposableMocks.resetPassword).toHaveBeenCalledWith("some-token", "NewPassword1", "NewPassword1");
    });

    it("shows an inline error when the token is invalid or expired", async () => {
        authComposableMocks.resetPassword.mockRejectedValue(new Error("Session expirée"));
        const wrapper = mount(ResetPasswordView, { props: { token: "expired-token" }, global: { plugins: [vuetify] } });
        const inputs = wrapper.findAll("input");

        await inputs[0].setValue("NewPassword1");
        await inputs[1].setValue("NewPassword1");
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        expect(wrapper.text()).toContain("Session expirée");
    });
});
