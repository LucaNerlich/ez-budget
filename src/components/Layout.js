import React from 'react';
import Header from "./Header";
import Footer from "./Footer";

export const Layout = (props) => {
    return (
        <>
            <Header/>
            <div className="container">
                {props.children}
            </div>
            <Footer/>
        </>
    );
};

export default Layout;
