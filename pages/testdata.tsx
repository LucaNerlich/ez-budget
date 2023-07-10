import CustomHead from "../src/components/CustomHead";
import React from "react";
import Layout from "../src/components/Layout";
import TestDataGenerator from "../src/components/form/TestDataGenerator";

export default function TestData(props) {
    return (
        <Layout>
            <CustomHead title="Test Data Generator"
                        description="Generate EzBudget Test Data"/>
            <TestDataGenerator/>
        </Layout>
    );
}
