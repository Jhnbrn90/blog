import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentPath = path.join(process.cwd(), 'content/pages')

export function getAboutPage() {
    const fileContents = fs.readFileSync(contentPath + '/about.md').toString()

    const { content } = matter(fileContents);

    return content;
}
