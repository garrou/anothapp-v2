// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import LoginView from "./LoginView.vue";
import { vuetify } from "@/test/vuetify";

const authComposableMocks = vi.hoisted(() => ({
    login: vi.fn(),
    cancelDeletion: vi.fn(),
    resendVerification: vi.fn(),
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

    it("shows an inline error when cancelling the deletion fails", async () => {
        authComposableMocks.login.mockResolvedValue({ pendingDeletion: true, cancellationToken: "token-abc" });
        authComposableMocks.cancelDeletion.mockRejectedValue(new Error("Session expirée"));
        const wrapper = mount(LoginView, { global: { plugins: [vuetify] } });
        const inputs = wrapper.findAll("input");
        await inputs[0].setValue("dexter");
        await inputs[1].setValue("s3cret-pass");
        await wrapper.find("form").trigger("submit");

        const confirmBtn = wrapper.findAllComponents({ name: "VBtn" })
            .find((btn) => btn.text() === "Annuler la suppression et se connecter");
        await confirmBtn!.trigger("click");
        await flushPromises();

        expect(wrapper.text()).toContain("Session expirée");
    });

    it("always offers to resend the confirmation email after a failed login, prefilled when the identifier looks like an email", async () => {
        // the backend deliberately never distinguishes "wrong password" from "correct password,
        // unverified account" (that distinction would let login be used to confirm a guessed
        // password), so the UI offers the resend option after any failure rather than trying to
        // detect the specific reason from the error message
        authComposableMocks.login.mockRejectedValue(new Error("Identifiant ou mot de passe incorrect"));
        const wrapper = mount(LoginView, { global: { plugins: [vuetify] } });
        wrapper.vm.$.appContext.app.config.errorHandler = () => {};
        const inputs = wrapper.findAll("input");
        await inputs[0].setValue("dexter@example.com");
        await inputs[1].setValue("s3cret-pass");
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        const resendBtn = wrapper.findAllComponents({ name: "VBtn" })
            .find((btn) => btn.text() === "Renvoyer l'email de confirmation");
        expect(resendBtn).toBeDefined();

        await resendBtn!.trigger("click");

        expect(authComposableMocks.resendVerification).toHaveBeenCalledWith("dexter@example.com");
    });

    it("leaves the resend email blank when the identifier used to log in wasn't an email", async () => {
        authComposableMocks.login.mockRejectedValue(new Error("Identifiant ou mot de passe incorrect"));
        const wrapper = mount(LoginView, { global: { plugins: [vuetify] } });
        wrapper.vm.$.appContext.app.config.errorHandler = () => {};
        const inputs = wrapper.findAll("input");
        await inputs[0].setValue("dexter");
        await inputs[1].setValue("wrong");
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        const resendInputs = wrapper.findAll("input");
        // 3rd input: identifier, password, then the resend section's own email field
        expect(resendInputs[2].element.value).toBe("");
        const resendBtn = wrapper.findAllComponents({ name: "VBtn" })
            .find((btn) => btn.text() === "Renvoyer l'email de confirmation");
        expect(resendBtn!.props("disabled")).toBe(true);
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
