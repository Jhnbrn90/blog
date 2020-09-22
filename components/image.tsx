import React from 'react';
import 'lazysizes';

export default function Image({
    alt,
    src,
    className,
}: {
    alt: string,
    src: string,
    className: string
}): JSX.Element {
    return (
        <img
            className={`lazyload ${className}`}
            alt={alt}
            data-src={src}
            loading="lazy"
        />
    );
}
