export default function Image({ alt, src, className }) {
    return (
        <img
            className={`${className}`}
            alt={alt}
            src={src}
            loading="lazy"
        />
    );
}
