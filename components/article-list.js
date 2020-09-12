import Link from "next/link";

export default function ArticleList({posts}) {
    return (
        <div>
            {posts.map(({frontmatter: {title, description, date, cover}, slug}) => (
                <article key={slug} className="flex mb-10 rounded bg-white shadow-lg p-6">
                    <div className="w-full sm:w-3/4 flex flex-col justify-between mr-4">
                        <div className="w-full text-justify">
                            <Link href={"/posts/[slug]"} as={`/posts/${slug}`}>
                                <a className="hover:underline">
                                    <h3 className="text-3xl font-semibold leading-tight text-left">
                                        {title}
                                    </h3>
                                </a>
                            </Link>

                            <p className="font-thin tracking-wide pt-1 pb-10">
                                {description}
                            </p>

                            <Link href={"/posts/[slug]"} as={`/posts/${slug}`}>
                                <a className="bg-blue-600 hover:no-underline hover:text-white px-3 py-2 rounded text-blue-100 hover:bg-blue-700 hover:shadow">
                                    Read more &rarr;
                                </a>
                            </Link>
                        </div>

                        <div className="text-sm text-gray-600 font-thin mt-6">
                            &mdash; Published: {date}
                        </div>
                    </div>
                    <div className="sm:w-1/4 sm:block hidden flex justify-end items-start">
                        <div
                            className="flex h-auto w-auto overflow-hidden items-start sm:justify-center sm:items-center">
                            <img
                                src={`/assets/posts/${slug}/${cover}`}
                                className="w-full"
                            />
                        </div>
                    </div>
                </article>
            ))}
        </div>
    )
}
