import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
      </div>
    </Router>
  );
};

export default App;