import Layout from '../../src/components/Layout';
import MonthContainer from '../../src/components/container/MonthContainer';

export const metadata = {
  title: 'Monthly',
  description: 'View and Edit this months entries.'
};

export default function MonthlyPage() {
  return (
    <Layout>
      <MonthContainer/>
    </Layout>
  );
}


