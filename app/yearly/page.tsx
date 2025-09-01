import Layout from '../../src/components/Layout';
import YearContainer from '../../src/components/container/YearContainer';

export const metadata = {
  title: 'Yearly',
  description: 'View this years summary.'
};

export default function YearlyPage() {
  return (
    <Layout>
      <YearContainer/>
    </Layout>
  );
}


