import userService from "@/services/userService"
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import type { User } from "@/models/user";
import cache from "@/cache";

export function useUser() {

    const { showSuccess } = useSnackbar();

    const changeImage = async (image: string): Promise<void> => {
        const resp = await userService.updateImage(image);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        const user = await cache.users.getProfile();
        await cache.users.addUser({
            ...user,
            picture: image
        });
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
        const user = await cache.users.getProfile();
        await cache.users.addUser({
            ...user,
            email: newEmail
        });
        showSuccess("Email modifié");
    }

    const getUsers = async (username: string): Promise<User[]> => {
        const resp = await userService.getUsers(username);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getProfile = async (): Promise<User> => {
        return cache.users.getProfile();
    }

    return { changeEmail, changePassword, changeImage, getUsers, getProfile }
}