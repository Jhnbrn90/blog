module.exports = {
    purge: [
        './pages/**/*.tsx',
        './components/**/*.tsx',
    ],
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
    },
    theme: {
        extend: {},
    },
    variants: {},
    plugins: [],
};
