import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./assets/styles/StyleSheet.css";
import App from "./App";
import HomePage from "./pages/portal/HomePage";
import Calendar from './pages/portal/Calendar';
import Account from "./pages/portal/Account";
import CreateAccount from "./pages/authentication/CreateAccount";
import Login from "./pages/authentication/LoginPage";
import Auth from "./pages/authentication/Auth";
import ProtectedRoute from "./components/util/ProtectedRoute";
import UserInfo from "./pages/portal/UserInfo";
import Notification from "./pages/portal/Notification";
import Extra from "./pages/portal/Extra";
import Info from "./pages/portal/Info";

// Use createRoot instead of ReactDOM.render
const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter basename={'/'}>
    <Routes>
      <Route path='/auth' element={<Auth />}>
        <Route path='login' element={<Login />} />
        <Route path='createaccount' element={<CreateAccount />} />
      </Route>
      <Route path="/" element={
        <ProtectedRoute>
          <App />
        </ProtectedRoute>}>
        <Route index element={<HomePage />} />
        <Route path='calendar' element={<Calendar />} />
        <Route path='account' element={<Account />} />
        <Route path='user' element={<UserInfo />} />
        <Route path='notification' element={<Notification />} />
        <Route path='extra' element={<Extra />} />
        <Route path='info' element={<Info />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
