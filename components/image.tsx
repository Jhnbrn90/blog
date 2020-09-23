import React from 'react';

import { ImageProps } from '../common/types';

import 'lazysizes';

const Image = ({alt, src, className}: ImageProps): JSX.Element => (
    <img
        className={`lazyload ${className}`}
        alt={alt}
        data-src={src}
        loading="lazy"
    />
);

export default Image;
