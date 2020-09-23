import { Post } from '../common/types';

import { getSiteMetaData } from './site';

export function getPullRequestUrl(post: Post): string {
    const siteConfig = getSiteMetaData();
    const baseUrl = siteConfig.github.postUrl;
    const ext = '.md';

    return baseUrl + post.frontmatter.date + '.' + post.slug + ext;
}
