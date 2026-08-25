import { useSnackbar } from "./snackbar";
import cache from "@/cache";
import platformService from "@/services/platformService";
import { isError } from "@/utils/response";

export function usePlatform() {

    const { showSuccess } = useSnackbar();

    const getUserPlatforms = async (): Promise<number[]> => {
        return (await cache.userPlatforms.getPlatforms()).map((p) => p.platformId);
    }

    const getFriendPlatforms = async (friendId: string): Promise<number[]> => {
        const resp = await platformService.getFriendPlatforms(friendId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const updateUserPlatforms = async (platformId: number): Promise<void> => {
        await cache.userPlatforms.addPlatform(platformId);
        showSuccess("Plateforme ajoutée aux abonnements");
    }

    const deleteUserPlatform = async (platformId: number): Promise<void> => {
        await cache.userPlatforms.deletePlatform(platformId);
        showSuccess("Plateforme retirée des abonnements");
    }

    return {
        deleteUserPlatform,
        getFriendPlatforms,
        getUserPlatforms,
        updateUserPlatforms,
    }
}