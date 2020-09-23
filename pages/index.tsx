import React from 'react';

import fs from 'fs';
import { GetStaticProps } from 'next';

import { Post } from '../common/types';
import ArticleList from '../components/article-list';
import Layout from '../components/layout';
import SEO from '../components/seo';
import {getSortedPosts} from '../lib/posts';
import generateRss from '../lib/rss';
import { getSiteMetaData } from '../lib/site';

export default function Home({posts}: {posts: Post[]}): React.ReactNode {
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
