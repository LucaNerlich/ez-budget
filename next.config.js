module.exports = {
    experimental: {
        reactCompiler: true,
    },
    turbopack: {
        rules: {
            '*.yaml': {
                loaders: ['yaml-loader'],
                as: '*.js',
            },
            '*.yml': {
                loaders: ['yaml-loader'],
                as: '*.js',
            },
        },
    },
};
