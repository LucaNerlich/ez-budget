export function leastSquaresFit(xs: Array<number>, ys: Array<number>): {a: number, b: number} | null {
    if (xs.length !== ys.length) return null;
    const n = xs.length;
    const sumX = xs.reduce((sum, x) => sum + x, 0);
    const sumY = ys.reduce((sum, y) => sum + y, 0);
    const sumXY = xs.reduce((sum, x, i) => sum + x * ys[i], 0);
    const sumXX = xs.reduce((sum, x) => sum + x * x, 0);

    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) return null;

    const a = (n * sumXY - sumX * sumY) / denominator;
    return {a, b: (sumY - a * sumX) / n};
}
