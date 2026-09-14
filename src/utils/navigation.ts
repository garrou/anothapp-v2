import type { Router } from "vue-router";

const stack: string[] = [];
let skipNextTrack = false;

export const trackNavigation = (fullPath: string): void => {
    if (skipNextTrack) {
        skipNextTrack = false;
        return;
    }
    stack.push(fullPath);
}

export const goBack = (router: Router, fallback: string): void => {
    skipNextTrack = true;

    // `replace`, not `push`: this isn't a new page visit, it's correcting the current
    // position back to where the user logically already was. Pushing here left a stray
    // forward entry in the browser's real history on every in-app "back", out of sync
    // with our own stack - so the actual browser back button needed an extra click to
    // get past the page the user had just left.
    if (stack.length > 1) {
        stack.pop();
        router.replace(stack[stack.length - 1]);
    } else {
        stack.length = 0;
        stack.push(fallback);
        router.replace(fallback);
    }
}
