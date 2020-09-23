import React from 'react';

import { GetStaticPaths, GetStaticProps } from 'next';

import { Post as PostInterface } from '../../common/types';
import ArticleBody from '../../components/article-body';
import Layout from '../../components/layout';
import SEO from '../../components/seo';
import {getPostBySlug,getSlugs} from '../../lib/posts';

export default function Post(post: PostInterface): React.ReactNode {
    return (
        <Layout>
            <SEO
                title={post.frontmatter.title}
                description={post.frontmatter.description || post.excerpt}
                image={`posts/${post.slug}/${post.frontmatter.cover}`}
            />

            <ArticleBody post={post} />
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
    const post = getPostBySlug(params.slug as string);

    return {
        props: {
            ...(post as PostInterface),
        },
    };
};
