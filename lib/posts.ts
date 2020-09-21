import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

// Get day in format: Month day, Year. e.g. April 19, 2020
function getFormattedDate(date: string) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("en-US", options);

    return formattedDate;
}

function stripDateFromFilename(fileName: string) {
    return fileName.replace(/\d{4}-\d{2}-\d{2}\./, '');
}

export function getSortedPosts(excludeSeries = true) {
    let fileNames = fs.readdirSync(postsDirectory)

    if (excludeSeries) {
        // Only show the first blog post of a series
        fileNames = fileNames.filter((fileName) => {
            return !fileName.match(/[2-9].md$/);
        });
    }

    const posts = fileNames.map(fileName => {
        const fileNameWithoutDate = stripDateFromFilename(fileName);
        const slug = fileNameWithoutDate.replace(/\.md$/, '')

        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath).toString()

        const { data, excerpt, content } = matter(fileContents);

        const frontmatter = {
            ...(data as {title: string, description: string, date: string}),
            formattedDate: getFormattedDate(data.date),
            cover: data.cover
        };

        return {
            slug,
            frontmatter,
            excerpt,
            content,
        };
    })

    return posts.sort((a, b) => {
        if (a.frontmatter.date < b.frontmatter.date) {
          return 1
        } else {
          return -1
        }
    })
}

export function getPostBySlug(slug: string) {
    const posts = getSortedPosts(false);

    const postIndex = posts.findIndex(({slug: postSlug}) => postSlug === slug);

    const {frontmatter, content, excerpt} = posts[postIndex];

    return {frontmatter, post: {content, excerpt}};
}

export function getSlugs() {
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map(fileName => {
        return {
            params: {
                slug: stripDateFromFilename(fileName.replace(/\.md$/, ''))
            }
        }
    })
}
