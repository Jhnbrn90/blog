import Head from 'next/head'
import {getSlugs, getPostBySlug} from "../../lib/posts";
import ArticleBody from '../../components/article-body'
import Layout from "../../components/Layout";

export default function Post({post, frontmatter}) {
    return (
        <>
            <Layout>
                <Head>
                    <title>{frontmatter.title} | John Braun</title>
                </Head>

                <ArticleBody
                    title={frontmatter.title}
                    date={frontmatter.date}
                    content={post.content}
                />
            </Layout>
        </>
    );
}

export async function getStaticPaths() {
    const paths = getSlugs();

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({params: {slug}}) {
    const postData = getPostBySlug(slug);

    return {props: postData};
}
