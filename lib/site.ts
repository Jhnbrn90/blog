import SiteConfig from '../site.config';

export function getSiteMetaData(): {
    title: string,
    description: string,
    aboutPage: string,
    siteUrl: string,
    language: string,
    social: {
        twitter: string,
    },
    github: {
        postUrl: string,
    }
    } {
    return SiteConfig.siteMetadata;
}
