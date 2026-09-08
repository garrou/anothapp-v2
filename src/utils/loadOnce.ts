const pending = new Map<string, Promise<void>>();
const epochs = new Map<string, number>();

export const loadOnce = async (key: string, isLoaded: () => boolean, load: () => Promise<void>): Promise<void> => {
    if (isLoaded()) return;

    if (!pending.has(key)) {
        pending.set(key, load().finally(() => pending.delete(key)));
    }
    await pending.get(key);
}

export const currentEpoch = (key: string): number => epochs.get(key) ?? 0;

export const invalidateLoad = (key: string): void => {
    epochs.set(key, currentEpoch(key) + 1);
    pending.delete(key);
}
