import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePlaylist } from "./playlist";

const playlistServiceMocks = vi.hoisted(() => ({
    getPlaylists: vi.fn(),
    getPlaylist: vi.fn(),
    createPlaylist: vi.fn(),
    updatePlaylist: vi.fn(),
    deletePlaylist: vi.fn(),
    addShowToPlaylist: vi.fn(),
    removeShowFromPlaylist: vi.fn(),
}));
const snackbarMocks = vi.hoisted(() => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
    showInfo: vi.fn(),
}));

vi.mock("@/services/playlistService", () => ({
    default: playlistServiceMocks,
}));
vi.mock("./snackbar", () => ({
    useSnackbar: () => snackbarMocks,
}));

const jsonResponse = (status: number, body: unknown) => ({
    status,
    json: async () => body,
});

const ownedPlaylist = { id: "p1", userId: "user-1", name: "Mes séries", visible: false };

describe("usePlaylist.getPlaylists", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns the playlists on success", async () => {
        playlistServiceMocks.getPlaylists.mockResolvedValue(jsonResponse(200, [ownedPlaylist]));

        const { getPlaylists } = usePlaylist();
        const result = await getPlaylists();

        expect(result).toEqual([ownedPlaylist]);
        expect(playlistServiceMocks.getPlaylists).toHaveBeenCalledWith(undefined);
    });

    it("passes the friendId through and throws the server's message on failure", async () => {
        playlistServiceMocks.getPlaylists.mockResolvedValue(
            jsonResponse(400, { message: "Vous n'êtes pas en relation avec cette personne" })
        );

        const { getPlaylists } = usePlaylist();

        await expect(getPlaylists("friend-1")).rejects.toThrow("Vous n'êtes pas en relation avec cette personne");
        expect(playlistServiceMocks.getPlaylists).toHaveBeenCalledWith("friend-1");
    });
});

describe("usePlaylist.getPlaylist", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns the playlist detail on success", async () => {
        const detail = { playlist: ownedPlaylist, shows: [] };
        playlistServiceMocks.getPlaylist.mockResolvedValue(jsonResponse(200, detail));

        const { getPlaylist } = usePlaylist();
        const result = await getPlaylist("p1");

        expect(result).toEqual(detail);
    });

    it("throws the server's message on failure", async () => {
        playlistServiceMocks.getPlaylist.mockResolvedValue(jsonResponse(400, { message: "Playlist introuvable" }));

        const { getPlaylist } = usePlaylist();

        await expect(getPlaylist("missing")).rejects.toThrow("Playlist introuvable");
    });
});

describe("usePlaylist.createPlaylist", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("returns the created playlist and shows a success message naming it", async () => {
        playlistServiceMocks.createPlaylist.mockResolvedValue(jsonResponse(201, ownedPlaylist));

        const { createPlaylist } = usePlaylist();
        const result = await createPlaylist("Mes séries", false);

        expect(result).toEqual(ownedPlaylist);
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith('Playlist "Mes séries" créée');
    });

    it("throws on failure without showing a success message", async () => {
        playlistServiceMocks.createPlaylist.mockResolvedValue(jsonResponse(400, { message: "Requête invalide" }));

        const { createPlaylist } = usePlaylist();

        await expect(createPlaylist("", false)).rejects.toThrow("Requête invalide");
        expect(snackbarMocks.showSuccess).not.toHaveBeenCalled();
    });
});

describe("usePlaylist.updatePlaylist", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows a success message on success", async () => {
        playlistServiceMocks.updatePlaylist.mockResolvedValue(jsonResponse(204, null));

        const { updatePlaylist } = usePlaylist();
        await updatePlaylist("p1", { name: "Nouveau nom" });

        expect(playlistServiceMocks.updatePlaylist).toHaveBeenCalledWith("p1", { name: "Nouveau nom" });
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Playlist mise à jour");
    });

    it("throws on failure without showing a success message", async () => {
        playlistServiceMocks.updatePlaylist.mockResolvedValue(jsonResponse(400, { message: "Playlist introuvable" }));

        const { updatePlaylist } = usePlaylist();

        await expect(updatePlaylist("p1", { name: "x" })).rejects.toThrow("Playlist introuvable");
        expect(snackbarMocks.showSuccess).not.toHaveBeenCalled();
    });
});

describe("usePlaylist.deletePlaylist", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows a success message naming the deleted playlist", async () => {
        playlistServiceMocks.deletePlaylist.mockResolvedValue(jsonResponse(204, null));

        const { deletePlaylist } = usePlaylist();
        await deletePlaylist("p1", "Mes séries");

        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith('Playlist "Mes séries" supprimée');
    });

    it("throws on failure without showing a success message", async () => {
        playlistServiceMocks.deletePlaylist.mockResolvedValue(jsonResponse(400, { message: "Playlist introuvable" }));

        const { deletePlaylist } = usePlaylist();

        await expect(deletePlaylist("p1", "Mes séries")).rejects.toThrow("Playlist introuvable");
        expect(snackbarMocks.showSuccess).not.toHaveBeenCalled();
    });
});

describe("usePlaylist.addShowToPlaylist", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("adds the show and shows a success message", async () => {
        playlistServiceMocks.addShowToPlaylist.mockResolvedValue(jsonResponse(201, null));

        const { addShowToPlaylist } = usePlaylist();
        await addShowToPlaylist("p1", 42);

        expect(playlistServiceMocks.addShowToPlaylist).toHaveBeenCalledWith("p1", 42);
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Série ajoutée à la playlist");
    });

    it("throws on failure without showing a success message", async () => {
        playlistServiceMocks.addShowToPlaylist.mockResolvedValue(jsonResponse(400, { message: "Playlist introuvable" }));

        const { addShowToPlaylist } = usePlaylist();

        await expect(addShowToPlaylist("p1", 42)).rejects.toThrow("Playlist introuvable");
        expect(snackbarMocks.showSuccess).not.toHaveBeenCalled();
    });
});

describe("usePlaylist.removeShowFromPlaylist", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("removes the show and shows a success message", async () => {
        playlistServiceMocks.removeShowFromPlaylist.mockResolvedValue(jsonResponse(204, null));

        const { removeShowFromPlaylist } = usePlaylist();
        await removeShowFromPlaylist("p1", 42);

        expect(playlistServiceMocks.removeShowFromPlaylist).toHaveBeenCalledWith("p1", 42);
        expect(snackbarMocks.showSuccess).toHaveBeenCalledWith("Série retirée de la playlist");
    });

    it("throws on failure without showing a success message", async () => {
        playlistServiceMocks.removeShowFromPlaylist.mockResolvedValue(jsonResponse(400, { message: "Playlist introuvable" }));

        const { removeShowFromPlaylist } = usePlaylist();

        await expect(removeShowFromPlaylist("p1", 42)).rejects.toThrow("Playlist introuvable");
        expect(snackbarMocks.showSuccess).not.toHaveBeenCalled();
    });
});
