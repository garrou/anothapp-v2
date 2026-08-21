import type { Router } from "vue-router";

/** Navigates to the previous route by pushing its path instead of calling
 * router.back()/go(-1): Vuetify overlays (v-menu, v-dialog, v-tooltip) close
 * on the browser "back" popstate by default and can swallow it instead of
 * letting the app actually navigate, requiring several clicks in a row. */
export const goBack = (router: Router, fallback: string): void => {
    const back = router.options.history.state.back as string | null;
    router.push(back ?? fallback);
}
