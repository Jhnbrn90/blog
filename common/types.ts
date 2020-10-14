export interface Frontmatter {
    title: string,
    description: string,
    formattedDate: string,
    date: string,
    cover: string
}

export interface Post {
    frontmatter: Frontmatter,
    content: string,
    excerpt: string,
    slug: string
}

export interface ImageProps {
    alt: string,
    src: string,
    className?: string,
}

export interface CodeBlockProps {
    language: string,
    value: string
}

export interface SEOProps {
    title?: string,
    description: string,
    image?: string
}

export interface Slug {
    params: {
        slug: string
    }
}

export interface RSSItem {
    frontmatter: Frontmatter,
    slug: string
}

export interface SiteMetaDataProps {
    title: string,
    description: string,
    keywords: string,
    aboutPage: string,
    siteUrl: string,
    language: string,
    social: {
        twitter: string,
    },
    github: {
        postUrl: string,
    }
}
