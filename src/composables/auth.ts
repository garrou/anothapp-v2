import authService from "@/services/authService";
import { isError, isSuccess } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import { useRouter } from "vue-router";
import cache from "@/cache";
import storageService from "@/services/storageService";

export function useAuth() {

    const router = useRouter();
    const { showSuccess } = useSnackbar();

    const checkAuth = async (): Promise<boolean> => {
        try {
            const resp = await authService.checkAuth();
            return isSuccess(resp.status);
        } catch (e) {
            return false;
        }
    }

    const login = async (identifier: string, password: string): Promise<void> => {
        const resp = await authService.login(identifier, password);
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
        await cache.userList.clearCache();
        router.replace("/login");
    }

    const register = async (email: string, password: string, confirm: string, username: string): Promise<void> => {
        const resp = await authService.register(email, password, confirm, username);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        showSuccess("Compte créé");
        router.push("/login");
    }

    return { checkAuth, login, logout, register }
}