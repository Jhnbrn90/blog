import Link from 'next/link';
import 'lazysizes';


export default function ArticleList({
    posts,
}: {
    posts: {
        frontmatter: {
            title: string,
            description: string,
            formattedDate: string,
            date: string,
            cover: string
        },
        slug: string
    }[]
}) {
    return (
        <div>
            {posts.map(({frontmatter: {title, description, formattedDate, cover}, slug}) => (
                <article key={slug} className="flex mb-10 rounded bg-white shadow-lg p-6">
                    <div className="w-full sm:w-3/4 flex flex-col justify-between mr-4">
                        <div className="w-full text-justify">
                            <Link href={'/posts/[slug]'} as={`/posts/${slug}`}>
                                <a className="hover:underline">
                                    <h1 className="text-xl tracking-wide sm:tracking-normal text-center sm:text-left sm:text-3xl font-semibold leading-tight text-left">
                                        {title}
                                    </h1>
                                </a>
                            </Link>

                            <div className="flex justify-center py-2">
                                <img alt={title} data-src={`/assets/posts/${slug}/${cover}`} className="lazyload w-1/2 h-full sm:hidden rounded-lg"/>
                            </div>

                            <p className="pt-1 sm:pb-10 pb-5 text-gray-700 sm:text-base text-sm sm:text-left">
                                {description}
                            </p>

                            <div className="sm:block flex justify-center">
                                <Link href={'/posts/[slug]'} as={`/posts/${slug}`}>
                                    <a className="bg-blue-600 hover:no-underline hover:text-white px-3 py-2 rounded text-blue-100 hover:bg-blue-700 hover:shadow">
                                        Read more &rarr;
                                    </a>
                                </Link>
                            </div>
                        </div>

                        <div className="text-sm text-gray-500 mt-6">
                            &mdash; Published: {formattedDate}
                        </div>
                    </div>

                    <div className="sm:w-1/4 sm:block hidden flex justify-end items-start">
                        <div
                            className="flex h-auto w-auto overflow-hidden items-start sm:justify-center sm:items-center">
                            <img alt={title} data-src={`/assets/posts/${slug}/${cover}`} className="lazyload w-full rounded-lg"/>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}
