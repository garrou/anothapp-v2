import type { Playlist, PlaylistDetail } from "@/models/playlist";
import playlistService from "@/services/playlistService";
import { isError } from "@/utils/response";
import { useSnackbar } from "./snackbar";

export function usePlaylist() {

    const { showSuccess } = useSnackbar();

    const getPlaylists = async (friendId?: string): Promise<Playlist[]> => {
        const resp = await playlistService.getPlaylists(friendId);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const getPlaylist = async (id: string): Promise<PlaylistDetail> => {
        const resp = await playlistService.getPlaylist(id);
        const data = await resp.json();

        if (isError(resp.status))
            throw new Error(data.message);

        return data;
    }

    const createPlaylist = async (name: string, visible: boolean): Promise<Playlist> => {
        const resp = await playlistService.createPlaylist(name, visible);
        const data = await resp.json();

        if (isError(resp.status)) {
            throw new Error(data.message);
        }
        showSuccess(`Playlist "${name}" créée`);
        return data;
    }

    const updatePlaylist = async (id: string, fields: { name?: string; visible?: boolean }): Promise<void> => {
        const resp = await playlistService.updatePlaylist(id, fields);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        showSuccess("Playlist mise à jour");
    }

    const deletePlaylist = async (id: string, name: string): Promise<void> => {
        const resp = await playlistService.deletePlaylist(id);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        showSuccess(`Playlist "${name}" supprimée`);
    }

    const addShowToPlaylist = async (id: string, showId: number): Promise<void> => {
        const resp = await playlistService.addShowToPlaylist(id, showId);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        showSuccess("Série ajoutée à la playlist");
    }

    const removeShowFromPlaylist = async (id: string, showId: number): Promise<void> => {
        const resp = await playlistService.removeShowFromPlaylist(id, showId);

        if (isError(resp.status)) {
            const data = await resp.json();
            throw new Error(data.message);
        }
        showSuccess("Série retirée de la playlist");
    }

    return {
        getPlaylists,
        getPlaylist,
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        addShowToPlaylist,
        removeShowFromPlaylist
    }
}
