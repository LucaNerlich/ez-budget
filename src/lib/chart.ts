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

export {ChartJS};


