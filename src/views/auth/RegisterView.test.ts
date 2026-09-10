// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import RegisterView from "./RegisterView.vue";
import { vuetify } from "@/test/vuetify";

const authComposableMocks = vi.hoisted(() => ({
    register: vi.fn(),
}));

vi.mock("@/composables/auth", () => ({ useAuth: () => authComposableMocks }));

beforeEach(() => {
    vi.resetAllMocks();
});

describe("RegisterView", () => {
    it("registers with the entered username, email and password", async () => {
        authComposableMocks.register.mockResolvedValue(undefined);
        const wrapper = mount(RegisterView, { global: { plugins: [vuetify] } });
        const inputs = wrapper.findAll("input");

        await inputs[0].setValue("dexter");
        await inputs[1].setValue("dexter@example.com");
        await inputs[2].setValue("s3cret-pass");
        await inputs[3].setValue("s3cret-pass");
        await wrapper.find("form").trigger("submit");

        expect(authComposableMocks.register).toHaveBeenCalledWith("dexter@example.com", "s3cret-pass", "s3cret-pass", "dexter");
    });
});
