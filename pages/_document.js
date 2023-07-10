import React from 'react';
import Document, {Head, Html, Main, NextScript} from 'next/document';


export default class MyDocument extends Document {
    render() {
        return (
            <Html lang="de">
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href="/icons/favicons/apple-touch-icon.png"/>
                    <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicons/favicon-32x32.png"/>
                    <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicons/favicon-16x16.png"/>
                    <link rel="manifest" href="/icons/favicons/site.webmanifest"/>
                    <link rel="mask-icon" href="/icons/favicons/safari-pinned-tab.svg" color="#5bbad5"/>
                    <link rel="shortcut icon" href="/icons/favicons/favicon.ico"/>
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        );
    }
}
