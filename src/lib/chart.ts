import {
    ArcElement,
    BarController,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    DoughnutController,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PieController,
    PointElement,
    TimeScale,
    Title,
    Tooltip
} from 'chart.js';

ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    TimeScale,
    PointElement,
    LineElement,
    PieController,
    DoughnutController,
    BarController,
    LineController,
    Title
);

/**
 * Align Chart.js typography/colors with the active design theme. Reads the live
 * computed token values so charts adapt when the user toggles light/dark.
 */
export function applyChartTheme() {
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

applyChartTheme();

if (typeof window !== 'undefined') {
    // Re-theme already-mounted charts when the user toggles light/dark.
    window.addEventListener('ez-theme-change', () => {
        applyChartTheme();
        Object.values(ChartJS.instances).forEach((c) => c.update());
    });
}

export {ChartJS};


