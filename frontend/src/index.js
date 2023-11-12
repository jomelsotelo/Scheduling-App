import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import App from "./App"
import HomePage from "./pages/portal/HomePage"
import Calendar from './pages/portal/Calendar'
import CreateAccount from "./pages/authentication/CreateAccount"
import Login from "./pages/authentication/LoginPage"
import Auth from "./pages/authentication/Auth"
import ProtectedRoute from "./components/util/ProtectedRoute"

ReactDOM.render(
    <BrowserRouter basename={'/'}>
        <Routes>
            <Route path='/auth' element={<Auth />}>
                <Route path='login' element={<Login />} />
                <Route path='createaccount' element={<CreateAccount />} />
            </Route>
            <Route path="/" element={<App />}>
                <Route path='' element={
                    <ProtectedRoute>
                        <Calendar />
                    </ProtectedRoute>
                } />
            </Route>
        </Routes>
    </BrowserRouter>,
  document.getElementById('root')
)
