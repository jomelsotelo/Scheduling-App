import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import PortalNavbar from "./components/navbar/PortalNavbar";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkUserToken = () => {
    const userToken = localStorage.getItem("user-token");
    setIsLoggedIn(!!userToken); // Set isLoggedIn to true if userToken exists
  };

  useEffect(() => {
    checkUserToken();
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <React.Fragment>
      {isLoggedIn && <PortalNavbar />}
      <Outlet />
    </React.Fragment>
  );
}

export default App;
