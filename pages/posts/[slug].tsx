import {getSlugs, getPostBySlug} from '../../lib/posts';
import ArticleBody from '../../components/article-body';
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import { GetStaticPaths, GetStaticProps } from 'next';

export default function Post({
    post,
    frontmatter,
    slug,
}: {
    post: {
        excerpt: string,
        content: string,
    },
    frontmatter: {
        title: string,
        description: string,
        cover: string,
        formattedDate: string,

    },
    slug: string,
}) {
    return (
        <Layout>
            <SEO
                title={frontmatter.title}
                description={frontmatter.description || post.excerpt}
                image={`posts/${slug}/${frontmatter.cover}`}
            />

            <ArticleBody
                title={frontmatter.title}
                date={frontmatter.formattedDate}
                cover={frontmatter.cover}
                content={post.content}
                slug={slug}
            />
        </Layout>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getSlugs();

    return {
        paths,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postData = getPostBySlug(params!.slug as string);

    return {
        props: {
            post: postData.post,
            frontmatter: postData.frontmatter,
            slug: params!.slug,
        },
    };
};
