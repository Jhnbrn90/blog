import SiteConfig from '../site.config';

const generateRssItem = ({
    frontmatter: {title, description, formattedDate}, slug,
}: {
    frontmatter: {
        title: string,
        description: string,
        formattedDate: string,
    },
    slug: string
}) => `
  <item>
    <guid>${SiteConfig.siteMetadata.siteUrl}/posts/${slug}</guid>
    <title>${title}</title>
    <link>${SiteConfig.siteMetadata.siteUrl}/posts/${slug}</link>
    <description>${description}</description>
    <pubDate>${new Date(formattedDate).toUTCString()}</pubDate>
  </item>
`;

const generateRss = (posts: {
    frontmatter: {
        title: string,
        description: string,
        formattedDate: string
    },
    slug: string
}[]) => `
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${SiteConfig.siteMetadata.title}</title>
      <link>${SiteConfig.siteMetadata.siteUrl}</link>
      <description>${SiteConfig.siteMetadata.description}</description>
      <language>en</language>
      <lastBuildDate>${new Date(posts[0].frontmatter.formattedDate).toUTCString()}</lastBuildDate>
      <atom:link href="https://johnbraun.blog/rss.xml" rel="self" type="application/rss+xml"/>
      ${posts.map(generateRssItem).join('')}
    </channel>
  </rss>
`;

export default generateRss;
