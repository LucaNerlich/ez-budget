// Colors (chart fills)
export const RGBA_GREEN = '#15a06a';
export const RGBA_RED = '#d0563f';
export const RGBA_WHITE = 'rgba(255,255,255,0.9)';

// Cookies
export const COOKIE_LOAD_VIA_URL: string = 'loadViaUrl'
export const COOKIE_REMOTE_FILE_URL: string = 'remoteFileUrl'

// Month names live in src/services/month.ts (single source).

export const TEST_CATEGORIES: Array<string> = [
    "Abonnements",
    "Energie",
    "Gesundheit",
    "Kleidung",
    "Gehalt",
    "Lebensmittel",
    "Miete",
    "Restaurants",
    "Shopping",
    "Telefon",
    "Transport",
    "Unterhaltung",
    "Versicherungen",
];

const TEST_COMMENTS: { [key: string]: string[] } = {
    Abonnements: ['Netflix', 'Google Drive', 'iCloud', 'Amazon Prime'],
    Energie: ['Erdgas', 'Heizöl', 'Kohle', 'Biomasse', 'Elektrizität'],
    Gesundheit: ['Medizin', 'Vitamine', 'Gesichtsmaske', 'Thermometer', 'Verband'],
    Kleidung: ['Hose', 'Hemd', 'Schuhe', 'Rock', 'Pullover'],
    Lebensmittel: ['Brot', 'Apfel', 'Wurst', 'Käse', 'Joghurt'],
    Miete: ['Stadt-Wohnung', 'Landhaus', 'Wohnheim', 'Studio', 'Loft'],
    Restaurants: ['Griechisch', 'Chinesisch', 'Sushi', 'Tapas', 'Donuts'],
    Shopping: ['Klamotten', 'Games', 'Baumarkt', 'Einrichtung'],
    Telefon: ['Festnetz', 'Mobilfunk', 'Internet'],
    Transport: ['Auto', 'Fahrrad', 'Bus-Ticket', 'Zug-Ticket', 'Flug-Ticket'],
    Unterhaltung: ['Buch', 'Fahrrad', 'Gitarre', 'Spielkonsole', 'Fernseher'],
    Versicherungen: ['Hausrat', 'Lebensversicherung', 'Kfz-Versicherung', 'Haftpflicht', 'Unfallversicherung'],
};

export function getRandomCommentByCategory(category: string): string | undefined {
    const items = TEST_COMMENTS[category];
    if (items) {
        return items[Math.floor(Math.random() * items.length)];
    }
    return undefined;
}

// getRandomFloat(1.5, 3.5, 2); // 👉️ 2.18
export function getRandomFloat(min: number, max: number, decimals: number): number {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);

    return parseFloat(str);
}
