// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import HomeAppBar from "./HomeAppBar.vue";
import { vuetify } from "@/test/vuetify";

const routerMocks = vi.hoisted(() => ({ push: vi.fn() }));
const routeMock = vi.hoisted(() => ({ name: "home" }));

vi.mock("vue-router", () => ({ useRoute: () => routeMock, useRouter: () => routerMocks }));

const mountAppBar = () => mount(HomeAppBar, {
    global: { plugins: [vuetify], mocks: { $router: routerMocks } },
});

beforeEach(() => {
    vi.resetAllMocks();
    routeMock.name = "home";
});

describe("HomeAppBar", () => {
    it("shows itself only on pages without the bottom navbar (home, login, register)", () => {
        expect(mountAppBar().findComponent({ name: "VAppBar" }).exists()).toBe(true);

        routeMock.name = "series";
        expect(mountAppBar().findComponent({ name: "VAppBar" }).exists()).toBe(false);
    });

    it("shows the login/register buttons only on the home page", () => {
        expect(mountAppBar().findAllComponents({ name: "VBtn" })).toHaveLength(2);

        routeMock.name = "login";
        expect(mountAppBar().findAllComponents({ name: "VBtn" })).toHaveLength(0);
    });

    it("navigates to /login and /register when the respective buttons are clicked", async () => {
        const wrapper = mountAppBar();
        const buttons = wrapper.findAllComponents({ name: "VBtn" });

        await buttons[0].trigger("click");
        expect(routerMocks.push).toHaveBeenCalledWith("/login");

        await buttons[1].trigger("click");
        expect(routerMocks.push).toHaveBeenCalledWith("/register");
    });
});
