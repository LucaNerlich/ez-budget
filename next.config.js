/** @type {import('next').NextConfig} */
const config = {
    reactCompiler: true,
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
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                ],
            },

        ];
    },
};
module.exports = config;
