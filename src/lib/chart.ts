import {
  Chart as ChartJS,
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

export { ChartJS };


