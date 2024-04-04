import { EMAIL_PATTERN, MAX_PASSWORD, MAX_USERNAME, MIN_PASSWORD, MIN_USERNAME, PASSWORD_PATTERN, USERNAME_PATTERN } from "@/constants/auth";

export const nameRules = [
    (value?: string) => {
        if (value) return true;
        return "Username requis";
    },
    (value: string) => {
        if (USERNAME_PATTERN.test(value)) return true;
        return `Le username doit être valide (${MIN_USERNAME} - ${MAX_USERNAME}) sans '@'`;
    }
]

export const emailRules = [
    (value?: string) => {
        if (value) return true;
        return "Email requis";
    },
    (value: string) => {
        if (EMAIL_PATTERN.test(value)) return true;
        return "L'email doit être valide";
    }
];

export const passwordRules = [
    (value?: string) => {
        if (value) return true;
        return "Un mot de passe est requis.";
    },
    (value: string) => {
        if (PASSWORD_PATTERN.test(value)) return true;
        return `Le mot de passe doit être valide (${MIN_PASSWORD} - ${MAX_PASSWORD})`;
    }
];