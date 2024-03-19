import { ENDPOINT } from "./constants";

const login = async (email: string, password: string) => {
    return fetch(`${ENDPOINT}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "email": email,
            "password": password
        })
    });
}

const register = async (email: string, password: string, confirm: string) => {
    return fetch(`${ENDPOINT}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "email": email,
            "password": password,
            "confirm": confirm
        })
    });
}

export default {
    login,
    register,
}