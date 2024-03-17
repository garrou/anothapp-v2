const endpoint = import.meta.env.VITE_SERVER;

const login = async (email: string, password: string) => {
    return fetch(`${endpoint}/users/login`, {
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
    return fetch(`${endpoint}/users/register`, {
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