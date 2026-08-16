import {Metadata, Viewport} from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/styles/app.css';
import DataProvider from '../src/providers/DataProvider';
import BootstrapClient from './BootstrapClient';
import UmamiAnalytics from "../src/components/UmamiAnalytics";

// Fonts are provided by the system font stack defined in src/styles/app.css
// (--font-display, --font-body, --font-mono); no remote fonts are fetched.

// Runs before paint to set the theme attribute, preventing a flash of the wrong theme.
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-bs-theme',t);}catch(e){}})();`;

export const metadata: Metadata = {
    title: {
        default: 'EzBudget',
        template: '%s | EzBudget',
    },
    description: 'Simple budget tracker – upload YAML/JSON and view monthly/yearly results.',
    keywords: ['Budget', 'Finanzen', 'Haushaltsbuch', 'Einnahmen', 'Ausgaben', 'YAML', 'JSON'],
    applicationName: 'EzBudget',
    abstract: 'Track monthly and yearly income/expenses from a local YAML/JSON file.',
    category: 'Finance, Tools',
    creator: 'Luca Nerlich',
    publisher: 'Luca Nerlich',
    referrer: 'same-origin',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    alternates: {
        canonical: '/',
    },
    metadataBase: new URL((process.env.NEXT_PUBLIC_SITE_URL || 'https://ez-budget.lucanerlich.com').replace(/\/$/, '')),
    openGraph: {
        type: 'website',
        siteName: 'EzBudget',
        title: 'EzBudget',
        description: 'Simple budget tracker – upload YAML/JSON and view monthly/yearly results.',
        url: '/',
        locale: 'de_DE',
        images: ['/icons/euro_symbol.svg'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'EzBudget',
        description: 'Simple budget tracker – upload YAML/JSON and view monthly/yearly results.',
        images: ['/icons/euro_symbol.svg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    manifest: '/icons/favicons/site.webmanifest',
    icons: {
        icon: [
            { url: '/icons/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/icons/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/icons/favicons/favicon.ico' }
        ],
        apple: '/icons/favicons/apple-touch-icon.png',
    },
    other: {
        'msapplication-TileColor': '#0c6b4f',
        'msapplication-config': '/icons/favicons/browserconfig.xml',
    }
};

export const viewport: Viewport = {
    themeColor: [
        {media: '(prefers-color-scheme: light)', color: '#f5f4f1'},
        {media: '(prefers-color-scheme: dark)', color: '#0e1311'},
    ],
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="de" suppressHydrationWarning>
        <body>
        <script dangerouslySetInnerHTML={{__html: themeInitScript}}/>
        <DataProvider>
            {children}
        </DataProvider>
        <BootstrapClient/>
        <UmamiAnalytics/>
        </body>
        </html>
    );
}


