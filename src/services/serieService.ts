import storageService from "./storageService";

const getSeries = async (title: string = "", kind: string = ""): Promise<Response> => {
    const url = `${import.meta.env.VITE_SERVER}/shows`;
    return fetch(url, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        }
    });
}

const updateFavorite = async (serieId: number): Promise<Response> => {
    return fetch(`${import.meta.env.VITE_SERVER}/shows/${serieId}/favorite`, {
        headers: {
            "Authorization": `Bearer ${storageService.getJwt()}`
        },
        method: "PATCH"
    });
}

export default {
    getSeries,
    updateFavorite
}
