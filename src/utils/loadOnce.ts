const pending = new Map<string, Promise<void>>();
const epochs = new Map<string, number>();

/**
 * Runs `load()` at most once per session for a given `key`: skips it once `isLoaded()` is true,
 * and dedupes concurrent callers into the same in-flight promise so a race doesn't trigger the
 * fetch twice. A failed load isn't remembered - it's safe to retry on the next call.
 */
export const loadOnce = async (key: string, isLoaded: () => boolean, load: () => Promise<void>): Promise<void> => {
    if (isLoaded()) return;

    if (!pending.has(key)) {
        pending.set(key, load().finally(() => pending.delete(key)));
    }
    await pending.get(key);
}

/** Current epoch for `key`. A `load()` callback should capture this before fetching and skip
 *  committing its result if it no longer matches once the fetch resolves. */
export const currentEpoch = (key: string): number => epochs.get(key) ?? 0;

/**
 * Bumps `key`'s epoch and drops any in-flight promise from the dedup map. Call this whenever the
 * store backing `key` is reset (login/logout): a slow request started before the reset can't be
 * cancelled, but it's no longer "the" in-flight load for `key`, and a `load()` callback that
 * checks currentEpoch(key) before committing will discard its now-stale result instead of
 * overwriting a store that may already belong to a different user.
 */
export const invalidateLoad = (key: string): void => {
    epochs.set(key, currentEpoch(key) + 1);
    pending.delete(key);
}
