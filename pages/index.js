import Head from 'next/head'
import Navigation from '../components/navigation'
import ArticleList from '../components/article-list'
import {getSortedPosts} from "../lib/posts";
import Layout from "../components/Layout";

export default function Home({posts}) {
    return (
        <>
            <Layout>
                <Head>
                    <title>John Braun | weblog</title>
                </Head>

                <ArticleList posts={posts}/>
            </Layout>
        </>
    )
}

export async function getStaticProps() {
    const posts = getSortedPosts();

    return {
        props: {
            posts,
        },
    };
}