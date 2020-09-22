import ArticleList from '../components/article-list';
import {getSortedPosts} from '../lib/posts';
import Layout from '../components/layout';
import SEO from '../components/seo';
import generateRss from '../lib/rss';
import fs from 'fs';
import { getSiteMetaData } from '../lib/site';
import { GetStaticProps } from 'next';
import React from 'react';
import { Post } from '../common/types';

export default function Home({
    posts,
}: {
    posts: Post[]
}): React.ReactNode {
    const siteMetadata = getSiteMetaData();

    return (
        <Layout>
            <SEO
                description={siteMetadata.description}
                image="profile/profile_resized.jpg"
            />

            <ArticleList posts={posts}/>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const posts = getSortedPosts();
    const rss = generateRss(posts);

    fs.writeFileSync('./public/rss.xml', rss);

    return {
        props: {
            posts,
        },
    };
};
