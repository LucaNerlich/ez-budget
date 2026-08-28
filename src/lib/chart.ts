/**
 * Chart.js setup, loaded on demand next to the first chart. Registers the
 * controllers react-chartjs-2 needs and aligns typography/colors with the
 * active design theme.
 */

type ChartJs = (typeof import('chart.js'))['Chart'];

let initPromise: Promise<void> | null = null;

/**
 * Align Chart.js typography/colors with the active design theme. Reads the live
 * computed token values so charts adapt when the user toggles light/dark.
 */
function applyChartTheme(ChartJS: ChartJs) {
    if (typeof window === 'undefined') return;
    const styles = getComputedStyle(document.documentElement);
    const ink = styles.getPropertyValue('--text-muted').trim() || '#5e6b62';
    const grid = styles.getPropertyValue('--border').trim() || 'rgba(0,0,0,0.1)';
    const bodyFont = styles.getPropertyValue('--font-body').trim();

    ChartJS.defaults.color = ink;
    ChartJS.defaults.borderColor = grid;
    if (bodyFont) {
        ChartJS.defaults.font.family = `${bodyFont}, system-ui, sans-serif`;
    }
    ChartJS.defaults.font.size = 12;
}

async function initialize(): Promise<void> {
    const chartJs = await import('chart.js');
    const {Chart: ChartJS} = chartJs;

    ChartJS.register(
        chartJs.ArcElement,
        chartJs.BarController,
        chartJs.BarElement,
        chartJs.CategoryScale,
        chartJs.DoughnutController,
        chartJs.Legend,
        chartJs.LinearScale,
        chartJs.LineController,
        chartJs.LineElement,
        chartJs.PieController,
        chartJs.PointElement,
        chartJs.TimeScale,
        chartJs.Title,
        chartJs.Tooltip
    );

    applyChartTheme(ChartJS);

    if (typeof window !== 'undefined') {
        // Re-theme already-mounted charts when the user toggles light/dark.
        window.addEventListener('ez-theme-change', () => {
            applyChartTheme(ChartJS);
            Object.values(ChartJS.instances).forEach((c) => c.update());
        });
    }
}

/**
 * Idempotent: registers Chart.js components and applies the theme exactly once.
 * Must complete before the first chart renders.
 */
export function initChartJs(): Promise<void> {
    if (!initPromise) {
        initPromise = initialize();
    }
    return initPromise;
}
