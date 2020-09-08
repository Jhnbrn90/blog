import Head from 'next/head'
import {getSlugs, getPostBySlug} from "../../lib/posts";
import ArticleBody from '../../components/article-body'
import Layout from "../../components/Layout";

export default function Post({post, frontmatter, slug}) {
    return (
        <>
            <Layout>
                <Head>
                    <title>{frontmatter.title} | John Braun</title>
                </Head>

                <ArticleBody
                    title={frontmatter.title}
                    date={frontmatter.date}
                    cover={frontmatter.cover}
                    content={post.content}
                    slug={slug}
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

    return {
        props: {
            post: postData.post,
            frontmatter: postData.frontmatter,
            slug: slug
        }
    };
}
