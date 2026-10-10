/**
 * Per-category stats rollup: a user-defined Category label with the summed
 * Entry values attributed to it (see CONTEXT.md — stats roll up per category).
 */
export interface Category {
    category: string,
    sum: number,
}
