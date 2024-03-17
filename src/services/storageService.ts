const JWT = "jwt";

const deleteJwt = (): void => localStorage.removeItem(JWT);

const getJwt = (): string | null => localStorage.getItem(JWT) ?? "";

const storeJwt = (token: string): void => localStorage.setItem(JWT, token);

export default {
    deleteJwt,
    getJwt, 
    storeJwt
}