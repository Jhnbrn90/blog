import Head from "next/head";
import { getSiteMetaData } from "../lib/site";

export default function SEO({ title, description = "", image = null }) {
    const siteMetadata = getSiteMetaData();

    const metaDescription = description || siteMetadata.description;

    return (
        <Head>
            <title>{title} | {siteMetadata.title}</title>
            <meta name="description" content={metaDescription} />
            <meta property="og:type" content="website" />
            <meta name="og:title" property="og:title" content={title} />
            <meta
                name="og:description"
                property="og:description"
                content={metaDescription}
            />
            <meta property="og:image" content={`${siteMetadata.siteUrl}/images/${image}`} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:creator" content={siteMetadata.social.twitter} />
            <meta name="twitter:image" content={`${siteMetadata.siteUrl}/images/${image}`} />
        </Head>
    );
}
