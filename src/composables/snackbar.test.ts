import { describe, it, expect, beforeEach } from "vitest";
import { createPinia, setActivePinia } from "pinia";
import { useSnackbar } from "./snackbar";
import { useSnackbarStore } from "@/stores/snackbar";

describe("useSnackbar", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    it("shows a string error as-is", () => {
        const { showError } = useSnackbar();
        showError("Une erreur est survenue");

        expect(useSnackbarStore().message).toEqual({
            color: "error",
            message: "Une erreur est survenue",
            subject: "Erreur"
        });
    });

    it("shows an Error's message", () => {
        const { showError } = useSnackbar();
        showError(new Error("Erreur réseau"));

        expect(useSnackbarStore().message).toEqual({
            color: "error",
            message: "Erreur réseau",
            subject: "Erreur"
        });
    });

    it("shows a success message", () => {
        const { showSuccess } = useSnackbar();
        showSuccess("Playlist créée");

        expect(useSnackbarStore().message).toEqual({
            color: "success",
            message: "Playlist créée",
            subject: "Succès"
        });
    });

    it("shows an info message", () => {
        const { showInfo } = useSnackbar();
        showInfo("Chargement en cours");

        expect(useSnackbarStore().message).toEqual({
            color: "info",
            message: "Chargement en cours",
            subject: "Information"
        });
    });
});
