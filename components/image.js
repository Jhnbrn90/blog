import "lazysizes";

export default function Image({ alt, src, previewSrc, className }) {
    return (
        <img
            className={`${className}`}
            alt={alt}
            src={previewSrc}
            data-srcset={src}
        />
    );
}