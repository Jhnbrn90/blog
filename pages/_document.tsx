import React from 'react';

import Document, { Head, Html, Main, NextScript } from 'next/document';

import { getSiteMetaData } from '../lib/site';

export default class MyDocument extends Document {
    render(): JSX.Element {
        const siteMetadata = getSiteMetaData();

        return (
            <Html lang={siteMetadata.language}>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
