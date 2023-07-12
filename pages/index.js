import React from 'react';
import Layout from "../src/components/Layout";
import MainInput from "../src/components/form/MainInput";
import CustomHead from "../src/components/CustomHead";

export default function Index() {

    return (
        <Layout>
            <a rel="me" href="https://mastodon.social/@luca00">Mastodon</a>
            <CustomHead title="EzBudget"
                        description="Add income / expense"/>
            <MainInput/>
        </Layout>
    );
}
