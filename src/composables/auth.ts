import authService from "@/services/authService";
import { isError, isSuccess } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import { useRouter } from "vue-router";
import cache from "@/cache";
import storageService from "@/services/storageService";

let pendingCheckAuth: Promise<boolean> | null = null;

export function useAuth() {

    const router = useRouter();
    const { showSuccess } = useSnackbar();

    const checkAuth = (): Promise<boolean> => {
        if (pendingCheckAuth) {
            return pendingCheckAuth;
        }

        pendingCheckAuth = (async () => {
            try {
                const resp = await authService.checkAuth();
                return isSuccess(resp.status);
            } catch (e) {
                return false;
            } finally {
                pendingCheckAuth = null;
            }
        })();

        return pendingCheckAuth;
    }

    const login = async (identifier: string, password: string): Promise<void> => {
        const resp = await authService.login(identifier, password);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        await cache.users.addUser(data);
        router.replace("/series");
    }

    const logout = async () => {
        await authService.logout();
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