import React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneLight as theme } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

export default function CodeBlock({
    language,
    value,
}: {
    language: string,
    value: string,
}): JSX.Element {
    return (
        <SyntaxHighlighter language={language} style={theme}>{value}</SyntaxHighlighter>
    );
}
