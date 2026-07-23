import { useSnackbar } from "./snackbar";
import cache from "@/cache";

export function usePlatform() {

    const { showSuccess } = useSnackbar();

    const getUserPlatforms = async (): Promise<number[]> => {
        return (await cache.userPlatforms.getPlatforms()).map((p) => p.platformId);
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
        getUserPlatforms,
        updateUserPlatforms,
    }
}