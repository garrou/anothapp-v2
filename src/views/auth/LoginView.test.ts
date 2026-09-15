// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import LoginView from "./LoginView.vue";
import { vuetify } from "@/test/vuetify";

const authComposableMocks = vi.hoisted(() => ({
    login: vi.fn(),
    cancelDeletion: vi.fn(),
}));

vi.mock("@/composables/auth", () => ({ useAuth: () => authComposableMocks }));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("LoginView", () => {
    it("logs in with the entered identifier and password", async () => {
        authComposableMocks.login.mockResolvedValue(undefined);
        const wrapper = mount(LoginView, { global: { plugins: [vuetify] } });
        const inputs = wrapper.findAll("input");

        await inputs[0].setValue("dexter");
        await inputs[1].setValue("s3cret-pass");
        await wrapper.find("form").trigger("submit");

        expect(authComposableMocks.login).toHaveBeenCalledWith("dexter", "s3cret-pass");
    });

    it("shows the pending-deletion confirmation screen instead of the form when the account is scheduled for deletion", async () => {
        authComposableMocks.login.mockResolvedValue({ pendingDeletion: true, cancellationToken: "token-abc" });
        const wrapper = mount(LoginView, { global: { plugins: [vuetify] } });
        const inputs = wrapper.findAll("input");

        await inputs[0].setValue("dexter");
        await inputs[1].setValue("s3cret-pass");
        await wrapper.find("form").trigger("submit");

        expect(wrapper.text()).toContain("Suppression en cours");
    });

    it("cancels the deletion when the user confirms on the pending-deletion screen", async () => {
        authComposableMocks.login.mockResolvedValue({ pendingDeletion: true, cancellationToken: "token-abc" });
        authComposableMocks.cancelDeletion.mockResolvedValue(undefined);
        const wrapper = mount(LoginView, { global: { plugins: [vuetify] } });
        const inputs = wrapper.findAll("input");
        await inputs[0].setValue("dexter");
        await inputs[1].setValue("s3cret-pass");
        await wrapper.find("form").trigger("submit");

        const confirmBtn = wrapper.findAllComponents({ name: "VBtn" })
            .find((btn) => btn.text() === "Annuler la suppression et se connecter");
        await confirmBtn!.trigger("click");

        expect(authComposableMocks.cancelDeletion).toHaveBeenCalledWith("token-abc");
    });

    it("returns to the login form when the user declines to cancel the deletion", async () => {
        authComposableMocks.login.mockResolvedValue({ pendingDeletion: true, cancellationToken: "token-abc" });
        const wrapper = mount(LoginView, { global: { plugins: [vuetify] } });
        const inputs = wrapper.findAll("input");
        await inputs[0].setValue("dexter");
        await inputs[1].setValue("s3cret-pass");
        await wrapper.find("form").trigger("submit");

        const declineBtn = wrapper.findAllComponents({ name: "VBtn" })
            .find((btn) => btn.text() === "Non, laisser mon compte être supprimé");
        await declineBtn!.trigger("click");

        expect(wrapper.text()).toContain("Se connecter");
        expect(authComposableMocks.cancelDeletion).not.toHaveBeenCalled();
    });
});
