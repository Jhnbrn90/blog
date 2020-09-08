import ReactMarkdown from "react-markdown/with-html";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialOceanic as theme } from 'react-syntax-highlighter/dist/cjs/styles/prism';

const CodeBlock = ({ language, value }) => {
    return <SyntaxHighlighter language={language} style={theme}>{value}</SyntaxHighlighter>;
};

export default function ArticleBody({ title, date, content, slug, cover}) {
    return (
        <article className="flex mx-auto flex-col mb-10 rounded bg-white shadow-lg sm:px-12 px-12 py-4">
            <div className="text-sm text-gray-600 font-thin">
                &mdash; Published: {date}
            </div>

            <div className="mb-5">
                <div className="flex justify-center pt-4 mb-4">
                    <h1 className="w-full tracking-wide text-center sm:text-3xl text-xl">
                        {title}
                    </h1>
                </div>

                <div className="flex justify-center">
                    <div className="flex flex-col items-center">
                        <img className="max-w-md h-56 mb-4 rounded-t-lg" src={`/images/posts/${slug}/${cover}`} />
                    </div>
                </div>
            </div>

            <div className="text-gray-700">
                <ReactMarkdown
                    className="mb-4 prose-sm prose sm:prose lg:prose-lg"
                    escapeHtml={false}
                    source={content}
                    renderers={{ code: CodeBlock}}
                />
            </div>
        </article>
    )
}