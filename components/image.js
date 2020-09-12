import "lazysizes";

export default function Image({ alt, src, className }) {
    return (
        <img
            className={`lazyload blur-up ${className}`}
            alt={alt}
            src={src}
            loading="lazy"
        />
    );
}
