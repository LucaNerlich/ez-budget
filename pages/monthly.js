import React from "react";
import Layout from "../src/components/Layout";
import CustomHead from "../src/components/CustomHead";
import MonthContainer from "../src/components/container/MonthContainer";

export default function Monthly(props) {

    return (
        <Layout>
            <CustomHead title="Monthly"
                        description="View and Edit this months entries."/>
            <MonthContainer/>
        </Layout>
    );
}
