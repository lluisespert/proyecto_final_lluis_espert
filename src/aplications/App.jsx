import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "../components/scrollToTop.jsx";
import Login from "../pages/Login";
import '../styles/styles.css';

const App = () => {

  return (

    <div>

      <BrowserRouter>
      
        <ScrollToTop>

          <Routes>

            <Route element={<Login />} path="/" />

          </Routes>

        </ScrollToTop>

      </BrowserRouter>

    </div>

  )

}


export default App;