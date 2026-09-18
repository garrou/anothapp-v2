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
    1: "#8C5A2B",
    2: "#6E85A8",
    3: "#C98F2A",
    4: "#22B8D9",
    5: "#6C5CE0",
    6: "#C13584",
    7: "#F59E0B",
};

export const SUB_TIER_ROMAN: Record<number, string> = {
    3: "III",
    2: "II",
    1: "I",
};

export const TOP_LEAGUE = 7;

export const ACHIEVEMENT_ICONS: Record<string, string> = {
    streak: '<path d="M12 3c1.2 2.4-1 3.8-1.6 5.8-.4 1.3.1 2.6 1.3 2.9 1.4.4 2.6-.7 2.3-2.1 1.3 1 2 2.6 2 4.4a5 5 0 11-9.6-1.9C6 10.2 8.6 8.4 9.4 6 9.8 4.7 10.8 3.6 12 3z"/>',
    watch_time: '<circle cx="12" cy="13" r="7.5"/><path d="M12 13V9M9 2h6M12 2v2"/>',
    shows_started: '<rect x="4" y="15" width="16" height="3.2" rx="1"/><rect x="5" y="11" width="14" height="3.2" rx="1"/><rect x="6" y="7" width="12" height="3.2" rx="1"/>',
    shows_completed: '<path d="M12 2.5l2 1.6 2.5-.5 1 2.4 2.4 1-.5 2.5 1.6 2-1.6 2 .5 2.5-2.4 1-1 2.4-2.5-.5-2 1.6-2-1.6-2.5.5-1-2.4-2.4-1 .5-2.5L2 12l1.6-2-.5-2.5 2.4-1 1-2.4 2.5.5 2-1.6z"/><path d="M8.5 12.2l2.3 2.3 4.7-4.9"/>',
    countries: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.2 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.2-3.6-8.5S9.6 5.8 12 3.5z"/>',
    kinds: '<path d="M11 3H5a2 2 0 00-2 2v6l9.6 9.6a2 2 0 002.8 0l5.2-5.2a2 2 0 000-2.8L11 3z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
    platforms: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
    friends_watched_with: '<rect x="4" y="10" width="16" height="10" rx="1"/><rect x="3" y="7" width="18" height="4" rx="1"/><path d="M12 7v13"/><path d="M12 7c-1.5 0-3-1-3-2.5S10 2 11.5 2 12 4 12 5.5M12 7c1.5 0 3-1 3-2.5S14 2 12.5 2 12 4 12 5.5"/>',
    friends_count: '<circle cx="12" cy="6" r="3"/><circle cx="5" cy="8.5" r="2.3"/><circle cx="19" cy="8.5" r="2.3"/><path d="M6 20c.4-3.8 3-6.5 6-6.5s5.6 2.7 6 6.5"/><path d="M1.5 19c.3-2.7 1.8-4.5 3.5-4.8M22.5 19c-.3-2.7-1.8-4.5-3.5-4.8"/>',
    notes_count: '<path d="M12 3l2.6 5.9 6.4.6-4.8 4.3 1.4 6.3L12 17l-5.6 3.1 1.4-6.3-4.8-4.3 6.4-.6L12 3z"/>',
    account_age: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
    favorites_count: '<path d="M12 20.5c-4.5-3-8-6.5-8-10.5a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 4-3.5 7.5-8 10.5z"/>',
    playlists_count: '<rect x="4" y="5" width="16" height="3" rx="1"/><rect x="4" y="10.5" width="16" height="3" rx="1"/><rect x="4" y="16" width="10" height="3" rx="1"/>',
    duo: '<circle cx="8.5" cy="8" r="3"/><circle cx="16" cy="9" r="2.6"/><path d="M2.5 20c.4-3.6 3-6 6-6s5.6 2.4 6 6M14.5 20c.3-2.7 2-4.7 4.3-4.7 1.8 0 3.3 1.1 4 2.9"/>',
    actors_favorited: '<circle cx="10.5" cy="7.5" r="4"/><path d="M3.5 20.5c.5-4.5 3.4-7.5 7-7.5"/><path d="M17 14.5c-.8 0-1.5.3-2 .9-.5-.6-1.2-.9-2-.9a2.4 2.4 0 00-1.7 4l3.7 3.5 3.7-3.5a2.4 2.4 0 00-1.7-4z"/>',
    playlists_collaborated: '<rect x="3" y="5" width="12" height="2.8" rx="1"/><rect x="3" y="10" width="12" height="2.8" rx="1"/><rect x="3" y="15" width="8" height="2.8" rx="1"/><circle cx="18.5" cy="17" r="3.3"/><path d="M18.5 15.3v3.4M16.8 17h3.4"/>',
    rewatch: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    binge: '<path d="M4 9h16"/><path d="M5 9l2 12a1 1 0 001 1h8a1 1 0 001-1l2-12"/><path d="M10 11.5l.8 8M14 11.5l-.8 8"/><circle cx="8" cy="6.5" r="1.8"/><circle cx="12" cy="5" r="2.2"/><circle cx="16" cy="6.5" r="1.8"/>',
};

export const ACHIEVEMENT_DESCRIPTIONS: Record<string, string> = {
    streak: "Enchaînez les jours de suite avec au moins un épisode ou une saison vue.",
    watch_time: "Cumulez du temps de visionnage total.",
    shows_started: "Ajoutez des séries à votre collection.",
    shows_completed: "Terminez des séries jusqu'au bout.",
    countries: "Regardez des séries de pays d'origine différents.",
    kinds: "Regardez des séries de genres différents.",
    platforms: "Regardez des séries disponibles sur des plateformes différentes.",
    friends_watched_with: "Regardez des saisons en compagnie d'amis différents.",
    friends_count: "Ajoutez des amis sur l'application.",
    notes_count: "Notez des séries que vous avez regardées.",
    account_age: "Restez membre de l'application au fil des mois.",
    favorites_count: "Ajoutez des séries à vos favorites.",
    playlists_count: "Créez des playlists.",
    duo: "Regardez un maximum de saisons avec le même ami.",
    actors_favorited: "Ajoutez des acteurs à vos favoris.",
    playlists_collaborated: "Collaborez sur des playlists partagées par vos amis.",
    rewatch: "Revoyez une même saison plusieurs fois.",
    binge: "Cumulez un maximum de temps de visionnage en une seule journée.",
};

export const ACHIEVEMENT_UNITS: Record<string, string> = {
    streak: "jours",
    watch_time: "h",
    shows_started: "séries",
    shows_completed: "séries",
    countries: "pays",
    kinds: "genres",
    platforms: "plateformes",
    friends_watched_with: "amis",
    friends_count: "amis",
    notes_count: "notes",
    account_age: "mois",
    favorites_count: "favoris",
    playlists_count: "playlists",
    duo: "saisons",
    actors_favorited: "acteurs",
    playlists_collaborated: "playlists",
    rewatch: "fois",
    binge: "h",
};
