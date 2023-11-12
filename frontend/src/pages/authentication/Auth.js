import React from "react";
import { Outlet } from "react-router-dom";
import AuthFooter from "../../components/footer/AuthFooter";
import AuthNavbar from "../../components/navbar/AuthNavBar";
const Auth = () => {
    return (
        <React.Fragment>
            <AuthNavbar />
            <Outlet />
            <AuthFooter />
        </React.Fragment>
    );
}
export default Auth;