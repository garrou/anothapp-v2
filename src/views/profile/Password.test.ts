// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Password from "./Password.vue";
import { vuetify } from "@/test/vuetify";

const userComposableMocks = vi.hoisted(() => ({
    changePassword: vi.fn(),
}));

vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));

const mountPassword = () => mount(Password, { global: { plugins: [vuetify] } });

beforeEach(() => {
    vi.resetAllMocks();
});

describe("Password", () => {
    it("updates the password with the entered current, new and confirm values, and emits refresh", async () => {
        userComposableMocks.changePassword.mockResolvedValue(undefined);
        const wrapper = mountPassword();
        const inputs = wrapper.findAll("input");

        await inputs[0].setValue("oldPassword1");
        await inputs[1].setValue("newPassword1");
        await inputs[2].setValue("newPassword1");
        await wrapper.find("form").trigger("submit");

        expect(userComposableMocks.changePassword).toHaveBeenCalledWith("oldPassword1", "newPassword1", "newPassword1");
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });
});
