import React from "react"
import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import Calendar from './pages/Calendar'
import CreateAccount from "./pages/CreateAccount"
import Login from "./pages/LoginPage"

export default function App() {
  return (
    <Routes>
        <Route path="/" exact element={<HomePage />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />
    </Routes>
  )
}