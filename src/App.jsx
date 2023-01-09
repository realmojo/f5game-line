import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home, Make } from "./components";
import { Header } from "./components/nav/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" index element={<Home />} />
        <Route path="/:idx" index element={<Home />} />
        <Route path="/make" index element={<Make />} />
      </Routes>
    </div>
  );
}

export default App;
