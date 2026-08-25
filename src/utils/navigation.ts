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

    if (stack.length > 1) {
        stack.pop();
        router.push(stack[stack.length - 1]);
    } else {
        stack.length = 0;
        stack.push(fallback);
        router.push(fallback);
    }
}
