import storageService from "./storageService";

const getSeries = async (title: string = "", kind: string = ""): Promise<Response> => {
    const url = `${import.meta.env.VITE_SERVER}/shows`;
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

export default {
    getSeries
}
