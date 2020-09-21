import 'lazysizes';

export default function Image({
    alt,
    src,
    className
}: {
    alt: string,
    src: string,
    className: string
}) {
    return (
        <img
            className={`lazyload ${className}`}
            alt={alt}
            data-src={src}
            loading="lazy"
        />
    );
}
