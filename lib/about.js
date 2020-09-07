import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const aboutPage = path.join(process.cwd(), 'pages')

export function getAboutPage() {

    const fileContents = fs.readFileSync(aboutPage + '/about.md').toString()

    const { content } = matter(fileContents);

    return content;
}