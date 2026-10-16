/**
 * Type declaration for yaml-loader imports (next.config.js turbopack rule).
 */
declare module '*.yaml' {
    const content: unknown;
    export default content;
}
