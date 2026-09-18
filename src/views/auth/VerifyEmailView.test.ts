// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import VerifyEmailView from "./VerifyEmailView.vue";
import { vuetify } from "@/test/vuetify";

const authComposableMocks = vi.hoisted(() => ({
    verifyEmail: vi.fn(),
    resendVerification: vi.fn(),
}));

vi.mock("@/composables/auth", () => ({ useAuth: () => authComposableMocks }));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("VerifyEmailView", () => {
    it("verifies the token from the route on mount and shows a success message", async () => {
        authComposableMocks.verifyEmail.mockResolvedValue(undefined);
        const wrapper = mount(VerifyEmailView, { props: { token: "some-token" }, global: { plugins: [vuetify] } });
        await flushPromises();

        expect(authComposableMocks.verifyEmail).toHaveBeenCalledWith("some-token");
        expect(wrapper.text()).toContain("Email confirmé");
    });

    it("shows the error and a resend option when the token is invalid or expired", async () => {
        authComposableMocks.verifyEmail.mockRejectedValue(new Error("Session expirée"));
        const wrapper = mount(VerifyEmailView, { props: { token: "expired-token" }, global: { plugins: [vuetify] } });
        await flushPromises();

        expect(wrapper.text()).toContain("Session expirée");
        const resendBtn = wrapper.findAllComponents({ name: "VBtn" })
            .find((btn) => btn.text() === "Renvoyer l'email de confirmation");
        expect(resendBtn).toBeDefined();
    });

    it("resends the verification email for the entered address", async () => {
        authComposableMocks.verifyEmail.mockRejectedValue(new Error("Session expirée"));
        authComposableMocks.resendVerification.mockResolvedValue(undefined);
        const wrapper = mount(VerifyEmailView, { props: { token: "expired-token" }, global: { plugins: [vuetify] } });
        await flushPromises();

        await wrapper.find("input").setValue("dexter@example.com");
        const resendBtn = wrapper.findAllComponents({ name: "VBtn" })
            .find((btn) => btn.text() === "Renvoyer l'email de confirmation");
        await resendBtn!.trigger("click");

        expect(authComposableMocks.resendVerification).toHaveBeenCalledWith("dexter@example.com");
    });
});
