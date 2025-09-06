import React from 'react';
import Layout from '../../src/components/Layout';
import SavingsKPIs from '../../src/components/insights/SavingsKPIs';
import TrendsForecasts from '../../src/components/insights/TrendsForecasts';
import CashflowTimeline from '../../src/components/insights/CashflowTimeline';

export const metadata = {
  title: 'Insights',
  description: 'Savings KPIs, Trends, and Cashflow'
};

export default function InsightsPage() {
  return (
    <Layout>
      <h1>Insights</h1>
      <SavingsKPIs/>
      <TrendsForecasts/>
      <CashflowTimeline/>
    </Layout>
  );
}


