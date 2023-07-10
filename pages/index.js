import React from 'react';
import Layout from "../src/components/Layout";
import MainInput from "../src/components/form/MainInput";
import CustomHead from "../src/components/CustomHead";

export default function Index() {

    return (
        <Layout>
            <CustomHead title="EzBudget"
                        description="Add income / expense"/>
            <MainInput/>
        </Layout>
    );
}
