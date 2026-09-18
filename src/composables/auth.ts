import authService from "@/services/authService";
import { isError, isSuccess } from "@/utils/response";
import { useSnackbar } from "./snackbar";
import { useRouter } from "vue-router";
import { useActorStore } from "@/stores/actor";
import { useUserStore } from "@/stores/user";
import { useUserSeriesStore } from "@/stores/userSeries";
import { useUserListStore } from "@/stores/userList";
import { useUserPlatformsStore } from "@/stores/userPlatforms";
import { useFriendsStore } from "@/stores/friends";
import { invalidateLoad } from "@/utils/loadOnce";
import type { User } from "@/models/user";

const PER_USER_LOAD_KEYS = ["userSeries", "userList", "userPlatforms", "profile", "favoriteActorIds", "friends"];

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

    const establishSession = (user: User) => {
        authEpoch++;
        lastCheckAuth = { result: true, at: Date.now() };
        PER_USER_LOAD_KEYS.forEach(invalidateLoad);
        useUserSeriesStore().reset();
        useUserListStore().reset();
        useUserPlatformsStore().reset();
        useActorStore().reset();
        useFriendsStore().reset();
        useUserStore().set(user);
        router.replace("/series");
    }

    const login = async (identifier: string, password: string): Promise<{ pendingDeletion: true, cancellationToken: string } | void> => {
        const resp = await authService.login(identifier, password);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        if (data.pendingDeletion) {
            return { pendingDeletion: true, cancellationToken: data.cancellationToken };
        }
        establishSession(data);
    }

    const cancelDeletion = async (cancellationToken: string): Promise<void> => {
        const resp = await authService.cancelDeletion(cancellationToken);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        establishSession(data);
    }

    const logout = async () => {
        authEpoch++;
        lastCheckAuth = { result: false, at: Date.now() };
        await authService.logout();
        PER_USER_LOAD_KEYS.forEach(invalidateLoad);
        useUserSeriesStore().reset();
        useUserStore().reset();
        useUserListStore().reset();
        useUserPlatformsStore().reset();
        useActorStore().reset();
        useFriendsStore().reset();
        router.replace("/login");
    }

    const register = async (email: string, password: string, confirm: string, username: string): Promise<void> => {
        const resp = await authService.register(email, password, confirm, username);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        showSuccess("Compte créé, vérifiez vos emails pour confirmer votre adresse");
        router.push("/login");
    }

    const verifyEmail = async (token: string): Promise<void> => {
        const resp = await authService.verifyEmail(token);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);
    }

    const resendVerification = async (email: string): Promise<void> => {
        const resp = await authService.resendVerification(email);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        showSuccess("Email de confirmation envoyé");
    }

    const forgotPassword = async (email: string): Promise<void> => {
        const resp = await authService.forgotPassword(email);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        showSuccess("Email de réinitialisation envoyé");
    }

    const resetPassword = async (token: string, password: string, confirm: string): Promise<void> => {
        const resp = await authService.resetPassword(token, password, confirm);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        showSuccess("Mot de passe réinitialisé, vous pouvez vous connecter");
        router.push("/login");
    }

    return {
        checkAuth, login, logout, register, cancelDeletion,
        verifyEmail, resendVerification, forgotPassword, resetPassword,
    }
}
