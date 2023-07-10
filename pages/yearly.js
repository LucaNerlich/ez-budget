import React from "react";
import Layout from "../src/components/Layout";
import CustomHead from "../src/components/CustomHead";
import YearContainer from "../src/components/container/YearContainer";

export default function yearly(props) {

    return (
        <Layout>
            <CustomHead title="Yearly"
                        description="View this years summary."/>
            <YearContainer/>
        </Layout>
    );
}
