import Layout from '../../src/components/Layout';
import YearContainer from '../../src/components/container/YearContainer';

export const metadata = {
  title: 'Yearly',
  description: 'View this year\'s summary.'
};

export default function YearlyPage() {
  return (
    <Layout>
      <YearContainer/>
    </Layout>
  );
}


