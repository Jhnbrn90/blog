import ArticleList from '../components/article-list'
import {getSortedPosts} from "../lib/posts";
import Layout from "../components/layout";
import SEO from "../components/seo";

export default function Home({posts}) {
    return (
        <>
            <Layout>
                <SEO
                    title="John Braun | weblog"
                    image="/assets/profile/profile_resized.jpg"
                />

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
