// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import LoginView from "./LoginView.vue";
import { vuetify } from "@/test/vuetify";

const authComposableMocks = vi.hoisted(() => ({
    login: vi.fn(),
    confirmLogin: vi.fn(),
    cancelDeletion: vi.fn(),
}));

vi.mock("@/composables/auth", () => ({ useAuth: () => authComposableMocks }));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("LoginView", () => {
    it("logs in with the entered identifier and password", async () => {
        authComposableMocks.login.mockResolvedValue({ pendingApproval: true, approvalToken: "approval-abc" });
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

    it("shows the code confirmation screen after a successful password check", async () => {
        authComposableMocks.login.mockResolvedValue({ pendingApproval: true, approvalToken: "approval-abc" });
        const wrapper = mount(LoginView, { global: { plugins: [vuetify] } });
        const inputs = wrapper.findAll("input");
        await inputs[0].setValue("dexter");
        await inputs[1].setValue("s3cret-pass");
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        expect(wrapper.text()).toContain("Confirmez votre connexion");
    });

    it("confirms the login with the approval token and the entered code", async () => {
        authComposableMocks.login.mockResolvedValue({ pendingApproval: true, approvalToken: "approval-abc" });
        authComposableMocks.confirmLogin.mockResolvedValue(undefined);
        const wrapper = mount(LoginView, { global: { plugins: [vuetify] } });
        const loginInputs = wrapper.findAll("input");
        await loginInputs[0].setValue("dexter");
        await loginInputs[1].setValue("s3cret-pass");
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        await wrapper.find("input").setValue("123456");
        await wrapper.find("form").trigger("submit");

        expect(authComposableMocks.confirmLogin).toHaveBeenCalledWith("approval-abc", "123456");
    });

    it("returns to the login form when the user goes back from the code screen", async () => {
        authComposableMocks.login.mockResolvedValue({ pendingApproval: true, approvalToken: "approval-abc" });
        const wrapper = mount(LoginView, { global: { plugins: [vuetify] } });
        const inputs = wrapper.findAll("input");
        await inputs[0].setValue("dexter");
        await inputs[1].setValue("s3cret-pass");
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        const backBtn = wrapper.findAllComponents({ name: "VBtn" })
            .find((btn) => btn.text() === "Retour");
        await backBtn!.trigger("click");

        expect(wrapper.text()).toContain("Se connecter");
        expect(wrapper.text()).not.toContain("Confirmez votre connexion");
    });

    it("propagates a wrong-code error to the caller (shown via the global error handler)", async () => {
        authComposableMocks.login.mockResolvedValue({ pendingApproval: true, approvalToken: "approval-abc" });
        authComposableMocks.confirmLogin.mockRejectedValue(new Error("Session invalide"));
        const wrapper = mount(LoginView, { global: { plugins: [vuetify] } });
        wrapper.vm.$.appContext.app.config.errorHandler = () => {};
        const loginInputs = wrapper.findAll("input");
        await loginInputs[0].setValue("dexter");
        await loginInputs[1].setValue("s3cret-pass");
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        await wrapper.find("input").setValue("000000");
        await wrapper.find("form").trigger("submit");
        await flushPromises();

        expect(authComposableMocks.confirmLogin).toHaveBeenCalledWith("approval-abc", "000000");
        // still on the code screen - the error was surfaced globally, not swallowed here
        expect(wrapper.text()).toContain("Confirmez votre connexion");
    });
});
