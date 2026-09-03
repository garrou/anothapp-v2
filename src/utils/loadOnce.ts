const pending = new Map<string, Promise<void>>();

export const loadOnce = async (key: string, isLoaded: () => boolean, load: () => Promise<void>): Promise<void> => {
    if (isLoaded()) return;

    if (!pending.has(key)) {
        pending.set(key, load().finally(() => pending.delete(key)));
    }
    await pending.get(key);
}
