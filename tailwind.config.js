module.exports = {
    purge: [
        './pages/**/*.tsx',
        './components/**/*.tsx',
    ],
    future: {
        removeDeprecatedGapUtilities: true,
        purgeLayersByDefault: true,
        defaultLineHeights: true,
        standardFontWeights: true,
    },
    theme: {
        extend: {},
    },
    variants: {},
    plugins: [],
};
