import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts')

// Get day in format: Month day, Year. e.g. April 19, 2020
function getFormattedDate(date) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);

    return formattedDate;
}

export function getSortedPosts() {
    const fileNames = fs.readdirSync(postsDirectory)

    const posts = fileNames.map(fileName => {
        const slug = fileName.replace(/\.md$/, '')

        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath).toString()

        const { data, excerpt, content } = matter(fileContents);

        const frontmatter = {
            ...data,
            date: getFormattedDate(data.date),
            cover: data.cover
        };

        return {
            slug,
            frontmatter,
            excerpt,
            content,
        };
    })
    .sort(
        (a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date)
    );

    return posts;
}

export function getPostBySlug(slug) {
    const posts = getSortedPosts();

    const postIndex = posts.findIndex(({slug: postSlug}) => postSlug === slug);

    const {frontmatter, content, excerpt} = posts[postIndex];

    return {frontmatter, post: {content, excerpt}};
}

export function getSlugs() {
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map(fileName => {
        return {
            params: {
                slug: fileName.replace(/\.md$/, '')
            }
        }
    })
}