// Mirrors the achievement catalog in anothapp-services (constants/achievements.js).
export const ACHIEVEMENT_NAMES: Record<string, string> = {
    streak: "Série de feu",
    watch_time: "Marathonien",
    shows_started: "Collectionneur",
    shows_completed: "Complétionniste",
    countries: "Cinéphile du monde",
    kinds: "Explorateur de genres",
    platforms: "Multi-plateforme",
    friends_watched_with: "Ami fidèle",
    friends_count: "Cercle d'amis",
    notes_count: "Noteur assidu",
    account_age: "Ancien de la maison",
    leaderboard_top3: "Top 3 classement",
};

// league: 1=bronze 2=argent 3=or 4=diamant 5=master 6=champion 7=titan
export const LEAGUE_NAMES: Record<number, string> = {
    1: "Bronze",
    2: "Argent",
    3: "Or",
    4: "Diamant",
    5: "Master",
    6: "Champion",
    7: "Titan",
};

export const LEAGUE_COLORS: Record<number, string> = {
    1: "#A9673A",
    2: "#9AA0AE",
    3: "#C98F2A",
    4: "#4DC4D9",
    5: "#6C5CE0",
    6: "#C6519E",
    7: "#E0483A",
};

// sub_tier: 3 (entry of the league) down to 1 (top of the league)
export const SUB_TIER_ROMAN: Record<number, string> = {
    3: "III",
    2: "II",
    1: "I",
};

export const TOP_LEAGUE = 7;

// Inner markup for a 24x24 outline icon (stroke=currentColor), one per achievement code.
export const ACHIEVEMENT_ICONS: Record<string, string> = {
    streak: '<path d="M12 3c1.2 2.4-1 3.8-1.6 5.8-.4 1.3.1 2.6 1.3 2.9 1.4.4 2.6-.7 2.3-2.1 1.3 1 2 2.6 2 4.4a5 5 0 11-9.6-1.9C6 10.2 8.6 8.4 9.4 6 9.8 4.7 10.8 3.6 12 3z"/>',
    watch_time: '<circle cx="12" cy="13" r="7.5"/><path d="M12 13V9M9 2h6M12 2v2"/>',
    shows_started: '<rect x="4" y="15" width="16" height="3.2" rx="1"/><rect x="5" y="11" width="14" height="3.2" rx="1"/><rect x="6" y="7" width="12" height="3.2" rx="1"/>',
    shows_completed: '<path d="M12 2.5l2 1.6 2.5-.5 1 2.4 2.4 1-.5 2.5 1.6 2-1.6 2 .5 2.5-2.4 1-1 2.4-2.5-.5-2 1.6-2-1.6-2.5.5-1-2.4-2.4-1 .5-2.5L2 12l1.6-2-.5-2.5 2.4-1 1-2.4 2.5.5 2-1.6z"/><path d="M8.5 12.2l2.3 2.3 4.7-4.9"/>',
    countries: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5z"/>',
    kinds: '<path d="M11 3H5a2 2 0 00-2 2v6l9.6 9.6a2 2 0 002.8 0l5.2-5.2a2 2 0 000-2.8L11 3z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
    platforms: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
    friends_watched_with: '<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
    friends_count: '<circle cx="8.5" cy="8" r="3"/><circle cx="16" cy="9" r="2.6"/><path d="M2.5 20c.4-3.6 3-6 6-6s5.6 2.4 6 6M14.5 20c.3-2.7 2-4.7 4.3-4.7 1.8 0 3.3 1.1 4 2.9"/>',
    notes_count: '<path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.1 1.4-6.3-4.8-4.3 6.4-.6L12 3z"/>',
    account_age: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
    leaderboard_top3: '<path d="M4 18h16l-1.4-8-4.1 3.2L12 6l-2.5 7.2L5.4 10 4 18z"/><path d="M4 20h16"/>',
};
