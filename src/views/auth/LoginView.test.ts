// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import LoginView from "./LoginView.vue";
import { vuetify } from "@/test/vuetify";

const authComposableMocks = vi.hoisted(() => ({
    login: vi.fn(),
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
});
