import React from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./Landing/Footer";
import Login from "./Authentication/Login";
import Register from "./Authentication/Register";
import SignedIn from "./components/SignedIn";
import Hero from "./Landing/Hero";


function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Routes>
         <Route path="/main" element={<SignedIn/>}/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<Hero/>}/>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
