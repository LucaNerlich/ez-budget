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
      <link rel="manifest" href="/icons/favicons/site.webmanifest"/>
      <link rel="icon" href="/icons/favicons/favicon.ico"/>
      <link rel="apple-touch-icon" href="/icons/favicons/apple-touch-icon.png"/>
      <meta name="theme-color" content="#0d6efd"/>
    </Head>
  );
}

export default memo(CustomHead);
