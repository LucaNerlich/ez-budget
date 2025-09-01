module.exports = {
    experimental: {
        reactCompiler: true,
    },
    turbopack: {
        rules: {
            '*.yaml': {
                loaders: ['yaml-loader'],
                as: '*.yaml',
            },
        },
    },
};
