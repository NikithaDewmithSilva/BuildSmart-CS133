import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Aboutus from "./Components/Aboutus";
import Services from "./Components/Services";
import Contact from "./Components/Contact";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Input from "./Components/Input";
import Process from "./Components/Process";
import Output from "./Components/Output";
import CustomizeBoq from "./Components/CustomizeBoq";
import Profile from "./Components/Profile";
import MyProjects from "./Components/MyProjects";
import ProjectPage from "./Components/ProjectPage";
import Footer from "./Components/Footer";
import InviteCustomerForm from "./Components/InviteCustomerForm";
import MaterialChart from "./Components/MaterialChart";


const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };

    getUser();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session ? session.user : null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };


  return (
    <Router>
      <div>
        <Navbar user={user} />
        <Routes>
          <Route path="/" element={<Home user={user} handleLogout={handleLogout} />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/project/:id/input" element={<Input />} />
          <Route path="/project/:id/input/process" element={<Process />} />
          <Route path="/project/:id/input/process/output" element={<Output />} />
          <Route path="/project/:id/input/process/output/customize" element={<CustomizeBoq />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/invite-customer" element={<InviteCustomerForm />} />
          <Route path="/myProjects" element={<MyProjects />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/project/:id/input/process/output/material-usage-chart" element={<MaterialChart/>} />
        </Routes>
      </div>
      <Footer/>
    </Router>
  );
};

export default App;