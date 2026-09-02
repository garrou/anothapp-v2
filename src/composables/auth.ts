import authService from "@/services/authService";
import { isError, isSuccess } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import { useRouter } from "vue-router";
import cache from "@/cache";
import { useActorStore } from "@/stores/actor";

let pendingCheckAuth: Promise<boolean> | null = null;
let lastCheckAuth: { result: boolean, at: number } | null = null;
let authEpoch = 0;
const CHECK_AUTH_TTL_MS = 30_000;

export function useAuth() {

    const router = useRouter();
    const { showSuccess } = useSnackbar();

    const checkAuth = async (): Promise<boolean> => {
        if (lastCheckAuth && Date.now() - lastCheckAuth.at < CHECK_AUTH_TTL_MS) {
            return lastCheckAuth.result;
        }
        if (pendingCheckAuth) {
            return pendingCheckAuth;
        }

        const epoch = authEpoch;
        pendingCheckAuth = (async () => {
            try {
                const resp = await authService.checkAuth();
                const result = isSuccess(resp.status);
                if (epoch === authEpoch) {
                    lastCheckAuth = { result, at: Date.now() };
                }
                return result;
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

        authEpoch++;
        lastCheckAuth = { result: true, at: Date.now() };
        await cache.users.addUser(data);
        router.replace("/series");
    }

    const logout = async () => {
        authEpoch++;
        lastCheckAuth = { result: false, at: Date.now() };
        await authService.logout();
        await cache.userSeries.clearCache();
        await cache.users.clearCache();
        await cache.userList.clearCache();
        await cache.userPlatforms.clearCache();
        useActorStore().reset();
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
