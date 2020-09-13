import 'lazysizes';

export default function Image({ alt, src, className }) {
    return (
        <img
            className={`lazyload ${className}`}
            alt={alt}
            data-src={src}
            loading="lazy"
        />
    );
}
