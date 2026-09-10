import { config } from "@vue/test-utils";

// Components that mount <router-link>/<router-view> without a real Vue
// Router instance (most component tests don't need actual navigation,
// just the ability to render) would otherwise fail to resolve these tags.
// Stubbing them globally avoids repeating this in every test file.
config.global.stubs = {
    ...config.global.stubs,
    RouterLink: true,
    RouterView: true,
};

// Polyfills Vuetify needs when mounting components under jsdom, which
// doesn't implement these browser APIs. No-ops under the "node" test
// environment (nothing calls them there), so this file is safe to load
// for every test regardless of environment.
if (typeof window !== "undefined") {
    if (!("ResizeObserver" in window)) {
        class ResizeObserverStub {
            observe() {}
            unobserve() {}
            disconnect() {}
        }
        // @ts-expect-error minimal stub, not a full ResizeObserver implementation
        window.ResizeObserver = ResizeObserverStub;
    }

    if (!("IntersectionObserver" in window)) {
        class IntersectionObserverStub {
            observe() {}
            unobserve() {}
            disconnect() {}
            takeRecords() { return []; }
        }
        // @ts-expect-error minimal stub, not a full IntersectionObserver implementation
        window.IntersectionObserver = IntersectionObserverStub;
    }

    if (!window.visualViewport) {
        const visualViewportStub = {
            width: window.innerWidth,
            height: window.innerHeight,
            offsetLeft: 0,
            offsetTop: 0,
            pageLeft: 0,
            pageTop: 0,
            scale: 1,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        };
        // @ts-expect-error minimal stub, not a full VisualViewport implementation
        window.visualViewport = visualViewportStub;
        // Vuetify's box/location-strategy code reads `visualViewport` as a bare
        // global (matching real browsers, where window === globalThis), which
        // some vitest/jsdom setups don't propagate from a window.* assignment.
        // @ts-expect-error same stub, exposed as a bare global too
        globalThis.visualViewport = visualViewportStub;
    }

    if (!window.matchMedia) {
        window.matchMedia = (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }) as MediaQueryList;
    }
}
