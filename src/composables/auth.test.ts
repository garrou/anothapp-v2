import { describe, it, expect, vi, beforeEach } from "vitest";

const authServiceMocks = vi.hoisted(() => ({
    checkAuth: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
    cancelDeletion: vi.fn(),
    verifyEmail: vi.fn(),
    resendVerification: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));
const routerMocks = vi.hoisted(() => ({
    push: vi.fn(),
    replace: vi.fn(),
}));
const storeResetMocks = vi.hoisted(() => ({
    userSeries: vi.fn(),
    userList: vi.fn(),
    userPlatforms: vi.fn(),
    actor: vi.fn(),
    friends: vi.fn(),
    user: vi.fn(),
}));
const userStoreSetMock = vi.hoisted(() => vi.fn());
const invalidateLoadMock = vi.hoisted(() => vi.fn());

vi.mock("@/services/authService", () => ({ default: authServiceMocks }));
vi.mock("./snackbar", () => ({ useSnackbar: () => snackbarMocks }));
vi.mock("vue-router", () => ({ useRouter: () => routerMocks }));
vi.mock("@/stores/actor", () => ({ useActorStore: () => ({ reset: storeResetMocks.actor }) }));
vi.mock("@/stores/user", () => ({ useUserStore: () => ({ set: userStoreSetMock, reset: storeResetMocks.user }) }));
vi.mock("@/stores/userSeries", () => ({ useUserSeriesStore: () => ({ reset: storeResetMocks.userSeries }) }));
vi.mock("@/stores/userList", () => ({ useUserListStore: () => ({ reset: storeResetMocks.userList }) }));
vi.mock("@/stores/userPlatforms", () => ({ useUserPlatformsStore: () => ({ reset: storeResetMocks.userPlatforms }) }));
vi.mock("@/stores/friends", () => ({ useFriendsStore: () => ({ reset: storeResetMocks.friends }) }));
vi.mock("@/utils/loadOnce", () => ({ invalidateLoad: invalidateLoadMock }));

const jsonResponse = (status: number, body: unknown) => ({
    status,
    json: async () => body,
});

const freshUseAuth = async () => {
    vi.resetModules();
    const mod = await import("./auth");
    return mod.useAuth();
};

beforeEach(() => {
    vi.resetAllMocks();
    vi.useRealTimers();
});

describe("useAuth.checkAuth", () => {
    it("returns true when the server confirms auth", async () => {
        authServiceMocks.checkAuth.mockResolvedValue({ status: 200 });

        const result = await (await freshUseAuth()).checkAuth();

        expect(result).toBe(true);
    });

    it("returns false when the server rejects auth", async () => {
        authServiceMocks.checkAuth.mockResolvedValue({ status: 401 });

        const result = await (await freshUseAuth()).checkAuth();

        expect(result).toBe(false);
    });

    it("returns false without throwing when the request itself fails", async () => {
        authServiceMocks.checkAuth.mockRejectedValue(new Error("network down"));

        const result = await (await freshUseAuth()).checkAuth();

        expect(result).toBe(false);
    });

    it("caches the result and doesn't call the service again within the TTL", async () => {
        vi.useFakeTimers();
        authServiceMocks.checkAuth.mockResolvedValue({ status: 200 });

        const { checkAuth } = await freshUseAuth();
        await checkAuth();
        vi.advanceTimersByTime(29_000);
        const second = await checkAuth();

        expect(second).toBe(true);
        expect(authServiceMocks.checkAuth).toHaveBeenCalledTimes(1);
    });

    it("calls the service again once the TTL has elapsed", async () => {
        vi.useFakeTimers();
        authServiceMocks.checkAuth.mockResolvedValue({ status: 200 });

        const { checkAuth } = await freshUseAuth();
        await checkAuth();
        vi.advanceTimersByTime(30_001);
        await checkAuth();

        expect(authServiceMocks.checkAuth).toHaveBeenCalledTimes(2);
    });

    it("dedupes concurrent calls into a single request", async () => {
        let resolveCheck: (v: { status: number }) => void = () => {};
        authServiceMocks.checkAuth.mockImplementation(() => new Promise((resolve) => {
            resolveCheck = resolve;
        }));

        const { checkAuth } = await freshUseAuth();
        const first = checkAuth();
        const second = checkAuth();
        resolveCheck({ status: 200 });

        const [firstResult, secondResult] = await Promise.all([first, second]);

        expect(firstResult).toBe(true);
        expect(secondResult).toBe(true);
        expect(authServiceMocks.checkAuth).toHaveBeenCalledTimes(1);
    });
});

describe("useAuth.login", () => {
    it("stores the user, invalidates per-user caches, resets stores, and redirects on success", async () => {
        const profile = { id: "user-1", username: "garrou" };
        authServiceMocks.login.mockResolvedValue(jsonResponse(200, profile));

        await (await freshUseAuth()).login("garrou@example.com", "password");

        expect(userStoreSetMock).toHaveBeenCalledWith(profile);
        expect(storeResetMocks.userSeries).toHaveBeenCalled();
        expect(storeResetMocks.userList).toHaveBeenCalled();
        expect(storeResetMocks.userPlatforms).toHaveBeenCalled();
        expect(storeResetMocks.actor).toHaveBeenCalled();
        expect(storeResetMocks.friends).toHaveBeenCalled();
        expect(invalidateLoadMock).toHaveBeenCalled();
        expect(routerMocks.replace).toHaveBeenCalledWith("/series");
    });

    it("throws the server's message on failure without touching stores or navigating", async () => {
        authServiceMocks.login.mockResolvedValue(jsonResponse(400, { message: "Identifiants invalides" }));

        await expect((await freshUseAuth()).login("garrou@example.com", "wrong")).rejects.toThrow("Identifiants invalides");
        expect(userStoreSetMock).not.toHaveBeenCalled();
        expect(routerMocks.replace).not.toHaveBeenCalled();
    });

    it("makes checkAuth return true immediately after login, without a network call", async () => {
        authServiceMocks.login.mockResolvedValue(jsonResponse(200, { id: "user-1" }));
        const auth = await freshUseAuth();

        await auth.login("garrou@example.com", "password");
        const result = await auth.checkAuth();

        expect(result).toBe(true);
        expect(authServiceMocks.checkAuth).not.toHaveBeenCalled();
    });

    it("returns the pending-deletion info instead of opening a session when the account is scheduled for deletion", async () => {
        authServiceMocks.login.mockResolvedValue(
            jsonResponse(200, { pendingDeletion: true, cancellationToken: "token-abc" })
        );

        const result = await (await freshUseAuth()).login("garrou@example.com", "password");

        expect(result).toEqual({ pendingDeletion: true, cancellationToken: "token-abc" });
        expect(userStoreSetMock).not.toHaveBeenCalled();
        expect(routerMocks.replace).not.toHaveBeenCalled();
    });
});

describe("useAuth.cancelDeletion", () => {
    it("stores the user, resets stores, and redirects on success", async () => {
        const profile = { id: "user-1", username: "garrou" };
        authServiceMocks.cancelDeletion.mockResolvedValue(jsonResponse(200, profile));

        await (await freshUseAuth()).cancelDeletion("token-abc");

        expect(authServiceMocks.cancelDeletion).toHaveBeenCalledWith("token-abc");
        expect(userStoreSetMock).toHaveBeenCalledWith(profile);
        expect(routerMocks.replace).toHaveBeenCalledWith("/series");
    });

    it("throws the server's message on failure without touching stores or navigating", async () => {
        authServiceMocks.cancelDeletion.mockResolvedValue(jsonResponse(401, { message: "Session invalide" }));

        await expect((await freshUseAuth()).cancelDeletion("bad-token")).rejects.toThrow("Session invalide");
        expect(userStoreSetMock).not.toHaveBeenCalled();
        expect(routerMocks.replace).not.toHaveBeenCalled();
    });
});

describe("useAuth.logout", () => {
    it("resets every store and redirects to /login", async () => {
        authServiceMocks.logout.mockResolvedValue(jsonResponse(200, null));

        await (await freshUseAuth()).logout();

        expect(storeResetMocks.userSeries).toHaveBeenCalled();
        expect(storeResetMocks.user).toHaveBeenCalled();
        expect(storeResetMocks.userList).toHaveBeenCalled();
        expect(storeResetMocks.userPlatforms).toHaveBeenCalled();
        expect(storeResetMocks.actor).toHaveBeenCalled();
        expect(storeResetMocks.friends).toHaveBeenCalled();
        expect(invalidateLoadMock).toHaveBeenCalled();
        expect(routerMocks.replace).toHaveBeenCalledWith("/login");
    });

    it("makes checkAuth return false immediately after logout, without a network call", async () => {
        authServiceMocks.logout.mockResolvedValue(jsonResponse(200, null));
        const auth = await freshUseAuth();

        await auth.logout();
        const result = await auth.checkAuth();

        expect(result).toBe(false);
        expect(authServiceMocks.checkAuth).not.toHaveBeenCalled();
    });
});

describe("useAuth.register", () => {
    it("shows a success toast asking to confirm the email, and redirects to /login on success", async () => {
        authServiceMocks.register.mockResolvedValue(jsonResponse(200, null));

        await (await freshUseAuth()).register("garrou@example.com", "password", "password", "garrou");

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Compte créé, vérifiez vos emails pour confirmer votre adresse");
        expect(routerMocks.push).toHaveBeenCalledWith("/login");
    });

    it("throws the server's message on failure without navigating", async () => {
        authServiceMocks.register.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        await expect(
            (await freshUseAuth()).register("garrou@example.com", "password", "password", "garrou")
        ).rejects.toThrow("Requête invalide");
        expect(routerMocks.push).not.toHaveBeenCalled();
    });
});

describe("useAuth.verifyEmail", () => {
    it("redirects to /login when logged out, e.g. right after registering", async () => {
        authServiceMocks.verifyEmail.mockResolvedValue(jsonResponse(200, { message: "Email confirmé" }));
        authServiceMocks.checkAuth.mockResolvedValue({ status: 401 });

        await (await freshUseAuth()).verifyEmail("some-token");

        expect(authServiceMocks.verifyEmail).toHaveBeenCalledWith("some-token");
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Email confirmé, vous pouvez vous connecter");
        expect(routerMocks.push).toHaveBeenCalledWith("/login");
    });

    it("redirects to /series when already logged in, e.g. confirming a changed email", async () => {
        authServiceMocks.verifyEmail.mockResolvedValue(jsonResponse(200, { message: "Email confirmé" }));
        authServiceMocks.checkAuth.mockResolvedValue({ status: 200 });

        await (await freshUseAuth()).verifyEmail("some-token");

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Email confirmé");
        expect(routerMocks.push).toHaveBeenCalledWith("/series");
    });

    it("throws the server's message on failure, without redirecting", async () => {
        authServiceMocks.verifyEmail.mockResolvedValue(jsonResponse(401, { message: "Session invalide" }));

        await expect((await freshUseAuth()).verifyEmail("bad-token")).rejects.toThrow("Session invalide");
        expect(routerMocks.push).not.toHaveBeenCalled();
    });
});

describe("useAuth.resendVerification", () => {
    it("shows a success toast", async () => {
        authServiceMocks.resendVerification.mockResolvedValue(jsonResponse(200, { message: "ok" }));

        await (await freshUseAuth()).resendVerification("garrou@example.com");

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Email de confirmation envoyé");
    });

    it("throws the server's message on failure", async () => {
        authServiceMocks.resendVerification.mockResolvedValue(jsonResponse(400, { message: "Aucun compte associé à cet email" }));

        await expect((await freshUseAuth()).resendVerification("unknown@example.com"))
            .rejects.toThrow("Aucun compte associé à cet email");
    });
});

describe("useAuth.forgotPassword", () => {
    it("shows a success toast", async () => {
        authServiceMocks.forgotPassword.mockResolvedValue(jsonResponse(200, { message: "ok" }));

        await (await freshUseAuth()).forgotPassword("garrou@example.com");

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Email de réinitialisation envoyé");
    });

    it("throws the server's message on failure", async () => {
        authServiceMocks.forgotPassword.mockResolvedValue(jsonResponse(400, { message: "Aucun compte associé à cet email" }));

        await expect((await freshUseAuth()).forgotPassword("unknown@example.com"))
            .rejects.toThrow("Aucun compte associé à cet email");
    });
});

describe("useAuth.resetPassword", () => {
    it("shows a success toast and redirects to /login", async () => {
        authServiceMocks.resetPassword.mockResolvedValue(jsonResponse(200, { message: "ok" }));

        await (await freshUseAuth()).resetPassword("some-token", "NewPassword1", "NewPassword1");

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Mot de passe réinitialisé, vous pouvez vous connecter");
        expect(routerMocks.push).toHaveBeenCalledWith("/login");
    });

    it("throws the server's message on failure without navigating", async () => {
        authServiceMocks.resetPassword.mockResolvedValue(jsonResponse(400, { message: "Mot de passe incorrect" }));

        await expect((await freshUseAuth()).resetPassword("some-token", "bad", "bad"))
            .rejects.toThrow("Mot de passe incorrect");
        expect(routerMocks.push).not.toHaveBeenCalled();
    });
});
