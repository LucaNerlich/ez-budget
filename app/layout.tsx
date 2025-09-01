import {Metadata} from "next";
import '../src/styles/app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Script from 'next/script';
import DataProvider from '../src/providers/DataProvider';
import BootstrapClient from './BootstrapClient';

export const metadata: Metadata = {
    title: 'EzBudget',
    description: 'Add income / expense',
    openGraph: {
        type: 'website',
        siteName: 'ezbudget.de'
    },
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="de">
        <head>
            <meta name="msapplication-TileColor" content="#da532c"/>
            <meta name="msapplication-config" content="/icons/favicons/browserconfig.xml"/>
        </head>
        <body>
        <DataProvider>
            {children}
        </DataProvider>
        <BootstrapClient/>
        <Script
            id="umami"
            strategy="afterInteractive"
            src="https://umami-t8kgsg4o4wc4o80wgwwo484c.lucanerlich.com/script.js"
            data-website-id="cc45fb2f-c85e-4c87-8332-43ef11b3a215"
        />
        </body>
        </html>
    );
}


