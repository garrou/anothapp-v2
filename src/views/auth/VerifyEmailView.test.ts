// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import VerifyEmailView from "./VerifyEmailView.vue";
import { vuetify } from "@/test/vuetify";

const authComposableMocks = vi.hoisted(() => ({
    verifyEmail: vi.fn(),
}));

vi.mock("@/composables/auth", () => ({ useAuth: () => authComposableMocks }));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("VerifyEmailView", () => {
    it("verifies the token from the route on mount - the redirect and success toast are useAuth.verifyEmail's job", async () => {
        authComposableMocks.verifyEmail.mockResolvedValue(undefined);
        const wrapper = mount(VerifyEmailView, { props: { token: "some-token" }, global: { plugins: [vuetify] } });
        await flushPromises();

        expect(authComposableMocks.verifyEmail).toHaveBeenCalledWith("some-token");
        expect(wrapper.text()).not.toContain("Échec de la confirmation");
    });

    it("shows the error when the token is invalid or expired", async () => {
        authComposableMocks.verifyEmail.mockRejectedValue(new Error("Session expirée"));
        const wrapper = mount(VerifyEmailView, { props: { token: "expired-token" }, global: { plugins: [vuetify] } });
        await flushPromises();

        expect(wrapper.text()).toContain("Échec de la confirmation");
        expect(wrapper.text()).toContain("Session expirée");
    });
});
