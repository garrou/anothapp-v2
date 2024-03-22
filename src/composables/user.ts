import storageService from "@/services/storageService";
import userService from "@/services/userService"
import { isError, isSuccess } from "@/utils/response";
import { useRouter } from "vue-router";
import { useSnackbar } from "./snackbar";

export function useUser() {

    const router = useRouter();
    const { showSuccess } = useSnackbar();

    const checkAuth = async (): Promise<boolean> => {
        const resp = await userService.checkAuth();
        return isSuccess(resp.status);
    }

    const login = async (email: string, password: string): Promise<boolean> => {
        const resp = await userService.login(email, password);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        storageService.storeJwt(data.token);
        router.replace("/series");
        return true;
    }

    const register = async (email: string, password: string, confirm: string): Promise<void> => {

        const resp = await userService.register(email, password, confirm);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        showSuccess("Compte crée");
        router.push("/login");
    }

    return { checkAuth, login, register }
}