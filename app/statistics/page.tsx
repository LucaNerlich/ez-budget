import Layout from '../../src/components/Layout';
import Overview from '../../src/components/statistics/Overview';

export const metadata = {
  title: 'Statistics',
  description: 'View your budget statistics'
};

export default function StatisticsPage() {
  return (
    <Layout>
      <Overview/>
    </Layout>
  );
}


