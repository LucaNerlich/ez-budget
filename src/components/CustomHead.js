import React, {memo} from "react";
import Head from "next/head";

function CustomHead(props) {
    const {
        title,
        description
    } = props;

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description}/>
        </Head>
    );
}

export default memo(CustomHead);
