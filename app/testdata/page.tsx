import React from 'react';
import Layout from '../../src/components/Layout';
import TestDataGenerator from '../../src/components/form/TestDataGenerator';

export const metadata = {
  title: 'Test Data Generator',
  description: 'Generate EzBudget Test Data'
};

export default function TestDataPage() {
  return (
    <Layout>
      <TestDataGenerator/>
    </Layout>
  );
}


