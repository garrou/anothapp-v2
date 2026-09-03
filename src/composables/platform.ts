import { useSnackbar } from "./snackbar";
import platformService from "@/services/platformService";
import { isError } from "@/utils/response";
import { useUserPlatformsStore } from "@/stores/userPlatforms";
import { currentEpoch, loadOnce } from "@/utils/loadOnce";

export function usePlatform() {

    const { showSuccess } = useSnackbar();
    const userPlatformsStore = useUserPlatformsStore();

    const ensureUserPlatformsLoaded = (): Promise<void> => loadOnce("userPlatforms", () => userPlatformsStore.loaded, async () => {
        const epoch = currentEpoch("userPlatforms");
        const resp = await platformService.getUserPlatforms();
        const data = await resp.json();

        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        if (currentEpoch("userPlatforms") === epoch) {
            userPlatformsStore.setAll(data);
        }
    });

    const getUserPlatforms = async (): Promise<number[]> => {
        await ensureUserPlatformsLoaded();
        return Array.from(userPlatformsStore.platformIds);
    }

    const getFriendPlatforms = async (friendId: string): Promise<number[]> => {
        const resp = await platformService.getFriendPlatforms(friendId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const updateUserPlatforms = async (platformId: number): Promise<void> => {
        const resp = await platformService.updateUserPlatforms(platformId);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        userPlatformsStore.add(platformId);
        showSuccess("Plateforme ajoutée aux abonnements");
    }

    const deleteUserPlatform = async (platformId: number): Promise<void> => {
        const resp = await platformService.deleteUserPlatform(platformId);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        userPlatformsStore.remove(platformId);
        showSuccess("Plateforme retirée des abonnements");
    }

    return {
        deleteUserPlatform,
        getFriendPlatforms,
        getUserPlatforms,
        updateUserPlatforms,
    }
}
