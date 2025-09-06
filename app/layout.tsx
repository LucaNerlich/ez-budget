import {Metadata} from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../src/styles/app.css';
import DataProvider from '../src/providers/DataProvider';
import BootstrapClient from './BootstrapClient';
import UmamiAnalytics from "../src/components/UmamiAnalytics";
import Head from "next/head";

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
    themeColor: '#0d6efd',
    icons: {
        icon: [
            { url: '/icons/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/icons/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/icons/favicons/favicon.ico' }
        ],
        apple: '/icons/favicons/apple-touch-icon.png',
    }
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="de">
        <Head>
            <meta name="msapplication-TileColor" content="#da532c"/>
            <meta name="msapplication-config" content="/icons/favicons/browserconfig.xml"/>
        </Head>
        <body>
        <DataProvider>
            {children}
        </DataProvider>
        <BootstrapClient/>
        <UmamiAnalytics/>
        </body>
        </html>
    );
}


