"use client";
import dynamic from 'next/dynamic';

/**
 * Client-only Chart.js <Chart> wrapper. Loads react-chartjs-2 + chart.js on
 * demand and completes controller registration/theming before the first chart
 * renders, keeping the heavy bundle out of the initial page load.
 */
const LazyChart = dynamic(() => Promise.all([
    import('react-chartjs-2'),
    import('../../lib/chart').then((mod) => mod.initChartJs()),
]).then(([chartModule]) => chartModule.Chart), {
    ssr: false,
    loading: () => null,
});

export default LazyChart;
