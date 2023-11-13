import React, { useState, useEffect} from "react"
import { Outlet } from "react-router-dom"
import PortalNavbar from "./components/navbar/PortalNavbar"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const checkUserToken = () => {
      const userToken = localStorage.getItem('user-token');
      if (!userToken || userToken === 'undefined') {
          setIsLoggedIn(false);
      }
      setIsLoggedIn(true);
  }
  useEffect(() => {
      checkUserToken();
  }, [isLoggedIn]);

  return (
      <React.Fragment>
          {isLoggedIn && <PortalNavbar />}
          <Outlet />
      </React.Fragment>
  );
}
export default App;