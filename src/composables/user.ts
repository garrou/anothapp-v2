import userService from "@/services/userService"
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import type { User } from "@/models/user";
import { useUserStore } from "@/stores/user";
import { currentEpoch, loadOnce } from "@/utils/loadOnce";

export function useUser() {

    const { showSuccess } = useSnackbar();
    const userStore = useUserStore();

    const ensureProfileLoaded = (): Promise<void> => loadOnce("profile", () => userStore.loaded, async () => {
        const epoch = currentEpoch("profile");
        const resp = await userService.getProfile();
        const data = await resp.json();

        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        if (currentEpoch("profile") === epoch) {
            userStore.set(data);
        }
    });

    const changeImage = async (image: string): Promise<void> => {
        const resp = await userService.updateImage(image);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        await ensureProfileLoaded();
        userStore.patch({ picture: image });
        showSuccess("Image de profil modifiée");
    }

    const changePassword = async (currentPass: string, newPass: string, confPass: string): Promise<void> => {
        const resp = await userService.updatePassword(currentPass, newPass, confPass);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        showSuccess("Mot de passe modifié");
    }

    const changeEmail = async (oldEmail: string, newEmail: string): Promise<void> => {
        const resp = await userService.updateLogin(oldEmail, newEmail);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        await ensureProfileLoaded();
        userStore.patch({ email: newEmail });
        showSuccess("Email modifié");
    }

    const updateEpisodeTracking = async (enabled: boolean): Promise<void> => {
        const resp = await userService.updateEpisodeTracking(enabled);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        await ensureProfileLoaded();
        userStore.patch({ episodeTrackingEnabled: enabled });
        showSuccess(enabled ? "Suivi des épisodes activé" : "Suivi des épisodes désactivé");
    }

    const getUsers = async (username: string): Promise<User[]> => {
        const resp = await userService.getUsers(username);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getProfile = async (): Promise<User> => {
        await ensureProfileLoaded();
        return userStore.profile as User;
    }

    return { changeEmail, changePassword, changeImage, getUsers, getProfile, updateEpisodeTracking }
}
