// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Email from "./Email.vue";
import { vuetify } from "@/test/vuetify";

const userComposableMocks = vi.hoisted(() => ({
    changeEmail: vi.fn(),
}));

vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));

const mountEmail = () => mount(Email, { global: { plugins: [vuetify] } });

beforeEach(() => {
    vi.resetAllMocks();
});

describe("Email", () => {
    it("updates the email with the entered current and new values, and emits refresh", async () => {
        userComposableMocks.changeEmail.mockResolvedValue(undefined);
        const wrapper = mountEmail();
        const inputs = wrapper.findAll("input");

        await inputs[0].setValue("old@xyz.com");
        await inputs[1].setValue("new@xyz.com");
        await wrapper.find("form").trigger("submit");

        expect(userComposableMocks.changeEmail).toHaveBeenCalledWith("old@xyz.com", "new@xyz.com");
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });
});
