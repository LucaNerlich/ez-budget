/**
 * Bootstrap's interactive behaviors (dropdowns etc.), loaded on demand from the
 * client. Kept in a non-component module so the React Compiler never has to
 * lower the dynamic `import()` expression inside a component.
 */
export function loadBootstrapJs(): Promise<unknown> {
    return import('bootstrap/dist/js/bootstrap.bundle.min.js');
}
