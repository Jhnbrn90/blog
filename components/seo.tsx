import React from 'react';

import Head from 'next/head';

import { SEOProps } from '../common/types';
import { getSiteMetaData } from '../lib/site';

export default function SEO({title, description, image}: SEOProps): JSX.Element {
    const siteMetadata = getSiteMetaData();
    const metaDescription = description || siteMetadata.description;
    const siteTitle = title ? `${title} - ${siteMetadata.title}` : `${siteMetadata.title}`;

    return (
        <Head>
            <title>{siteTitle}</title>
            <meta charSet='utf-8'/>
            <meta http-equiv='X-UA-Compatible' content='IE=edge'/>
            <meta name='viewport'
                  content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no'/>
            <meta name='keywords' content=''/>
            <link rel="manifest" href="/manifest.json"/>
            <link href='/images/icons/icons-16.png' rel='icon' type='image/png' sizes='16x16'/>
            <link href='/images/icons/icons-32.png' rel='icon' type='image/png' sizes='32x32'/>
            <link rel="apple-touch-icon" href="/images/icons/apple-icon.png" />
            <meta name="theme-color" content="#317EFB"/>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={siteMetadata.keywords} />
            <meta property="og:type" content="website" />
            <meta name="og:title" property="og:title" content={title ?? siteMetadata.title} />
            <meta
                name="og:description"
                property="og:description"
                content={metaDescription}
            />
            <meta property="og:image" content={`${siteMetadata.siteUrl}/assets/${image}`} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title ?? siteMetadata.title} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:creator" content={siteMetadata.social.twitter} />
            <meta name="twitter:image" content={`${siteMetadata.siteUrl}/assets/${image}`} />
            <link
                rel="alternate"
                type="application/rss+xml"
                title="RSS feed for John Braun's blog posts"
                href={`${siteMetadata.siteUrl}/rss.xml`}
            />
        </Head>
    );
}
