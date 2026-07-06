import platformService from "@/services/platformService";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";

export function usePlatform() {

    const { showSuccess } = useSnackbar();

    const getUserPlatforms = async (): Promise<number[]> => {
        const resp = await platformService.getUserPlatforms();
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const updateUserPlatforms = async (platformId: number): Promise<void> => {
        const resp = await platformService.updateUserPlatforms(platformId);
        const data = await resp.json();


        if (isError(resp.status))
            throw new Error(data.message);
        
        showSuccess(data.message);
    }

    const deleteUserPlatform = async (platformId: number): Promise<void> => {
        const resp = await platformService.deleteUserPlatform(platformId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        showSuccess(data.message);
    }

    return {
        deleteUserPlatform,
        getUserPlatforms,
        updateUserPlatforms,
    }
}