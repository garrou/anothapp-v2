import { EMAIL_PATTERN, MAX_PASSWORD, MAX_USERNAME, MIN_PASSWORD, MIN_USERNAME, PASSWORD_PATTERN, USERNAME_PATTERN } from "@/constants/auth";

export const nameRules = [
    (value?: string) => {
        if (value) return true;
        return "Username requis";
    },
    (value: string) => {
        if (USERNAME_PATTERN.test(value)) return true;
        return `Le username doit être valide (${MIN_USERNAME} - ${MAX_USERNAME})`;
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

/**
 * A rule for a "confirm password" field, checked against the original password's current value.
 * Pass it the ref's unwrapped value from the template (e.g. `passwordsMatchRule(password)` where
 * `password` is a ref) - the template re-evaluates the `:rules` array on every re-render, so this
 * always closes over the latest value even though the rule function itself is rebuilt each time.
 */
export const passwordsMatchRule = (password: string) => (value?: string) => {
    if (value === password) return true;
    return "Les mots de passe ne correspondent pas";
};

/**
 * Same idea as passwordsMatchRule, for a "confirm new email" field - see its comment for how to
 * pass the ref's value from the template.
 */
export const emailsMatchRule = (email: string) => (value?: string) => {
    if (value === email) return true;
    return "Les emails ne correspondent pas";
};

/**
 * Same idea as passwordsMatchRule, for a "confirm new username" field - see its comment for how
 * to pass the ref's value from the template.
 */
export const usernamesMatchRule = (username: string) => (value?: string) => {
    if (value === username) return true;
    return "Les noms d'utilisateur ne correspondent pas";
};