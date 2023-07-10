import React from 'react'
import Layout from "../src/components/Layout";
import Overview from "../src/components/statistics/Overview";
import CustomHead from "../src/components/CustomHead";

export default function Statistics(props) {

    return (
        <Layout>
            <CustomHead title="Statistics"
                        description="View your budget statistics"/>
            <Overview/>
        </Layout>
    );
}
