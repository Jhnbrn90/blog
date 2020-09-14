import ArticleList from '../components/article-list'
import {getSortedPosts} from "../lib/posts";
import Layout from "../components/layout";
import SEO from "../components/seo";
import generateRss from '../lib/rss';
import fs from 'fs';

export default function Home({posts}) {
    return (
        <>
            <Layout>
                <SEO image="profile/profile_resized.jpg" />

                <ArticleList posts={posts}/>
            </Layout>
        </>
    )
}

export async function getStaticProps() {
    const posts = getSortedPosts();
    const rss = generateRss(posts);

    fs.writeFileSync('./public/rss.xml', rss);

    return {
        props: {
            posts,
        },
    };
}
