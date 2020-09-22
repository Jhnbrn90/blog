export interface Post {
    frontmatter: {
        title: string,
        description: string,
        formattedDate: string,
        date: string,
        cover: string
    },
    content: string,
    excerpt: string,
    slug: string
}
