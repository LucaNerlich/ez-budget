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
  BarController,
  LineController,
  Title
);

export { ChartJS };


