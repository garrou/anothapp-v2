import storageService from "@/services/storageService";
import userService from "@/services/userService"
import { isError, isSuccess } from "@/utils/response";
import { useRouter } from "vue-router";
import { useSnackbar } from "./snackbar";
import type { User } from "@/models/user";
import cache from "@/cache";

export function useUser() {

    const router = useRouter();
    const { showSuccess } = useSnackbar();

    const changeEmail = async (oldEmail: string, newEmail: string): Promise<void> => {
        const resp = await userService.updateLogin(oldEmail, newEmail);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        const user = await cache.users.getProfile();
        await cache.users.addUser({
            ...user,
            email: newEmail
        });
        showSuccess("Email modifié");
    }

    const changeImage = async (image: string): Promise<void> => {
        const resp = await userService.updateImage(image);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        const user = await cache.users.getProfile();
        await cache.users.addUser({
            ...user,
            picture: image
        });
        showSuccess("Image de profil modifiée");
    }

    const changePassword = async (currentPass: string, newPass: string, confPass: string): Promise<void> => {
        const resp = await userService.updatePassword(currentPass, newPass, confPass);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        showSuccess("Mot de passe modifié");
    }

    const checkAuth = async (): Promise<boolean> => {
        const resp = await userService.checkAuth();
        return isSuccess(resp.status);
    }

    const getUsers = async (username: string): Promise<User[]> => {
        const resp = await userService.getUser(username);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getProfile = async (): Promise<User> => {
        return cache.users.getProfile();
    }

    const login = async (identifier: string, password: string): Promise<void> => {
        const resp = await userService.login(identifier, password);
        const data = await resp.json();

        if (isError(resp.status) || !data.token)
            throw new Error(data.message);

        storageService.storeJwt(data.token);
        delete data.token;
        await cache.users.addUser(data);
        router.replace("/series");
    }

    const logout = async () => {
        storageService.deleteJwt();
        await cache.userSeries.clearCache();
        await cache.users.clearCache();
        router.replace("/login");
    }

    const register = async (email: string, password: string, confirm: string, username: string): Promise<void> => {

        const resp = await userService.register(email, password, confirm, username);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        showSuccess("Compte créé");
        router.push("/login");
    }

    return { changeEmail, changeImage, changePassword, checkAuth, getUsers, getProfile, login, logout, register }
}