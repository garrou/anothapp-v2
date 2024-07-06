import type { Layout } from "@/models/layout"

export const ProfileLayout: Layout[] = [
    {
        icon: "mdi-image",
        name: "Changer la photo de profil",
        value: "images"
    }, 
    {
        icon: "mdi-email",
        name: "Modifier l'email",
        value: "email"
    },
    {
        icon: "mdi-account-lock",
        name: "Modifier le mot de passe",
        value: "password"
    }
]