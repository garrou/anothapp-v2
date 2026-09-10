// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import ImagesRow from "./ImagesRow.vue";
import { vuetify } from "@/test/vuetify";

const userComposableMocks = vi.hoisted(() => ({
    changeImage: vi.fn(),
}));

vi.mock("@/composables/user", () => ({ useUser: () => userComposableMocks }));

const mountRow = (images: string[], loading = false) => mount(ImagesRow, {
    global: { plugins: [vuetify] },
    props: { images, loading },
});

beforeEach(() => {
    vi.resetAllMocks();
});

describe("ImagesRow", () => {
    it("renders a card per image", () => {
        const wrapper = mountRow(["a.jpg", "b.jpg"]);

        expect(wrapper.findAllComponents({ name: "PosterCard" })).toHaveLength(2);
    });

    it("changes the profile image and emits refresh when an image's add button is clicked", async () => {
        userComposableMocks.changeImage.mockResolvedValue(undefined);
        const wrapper = mountRow(["a.jpg", "b.jpg"]);

        await wrapper.findAllComponents({ name: "VBtn" })[1].trigger("click");

        expect(userComposableMocks.changeImage).toHaveBeenCalledWith("b.jpg");
        expect(wrapper.emitted("refresh")).toHaveLength(1);
    });
});
