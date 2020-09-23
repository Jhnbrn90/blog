import React from 'react';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark as theme } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

import { CodeBlockProps } from '../common/types';

const CodeBlock = ({language, value}: CodeBlockProps): JSX.Element => (
    <SyntaxHighlighter language={language} style={theme}>{value}</SyntaxHighlighter>
);

export default CodeBlock;
