import React from "react";
import "./App.css";
import Signup from "./Components/Signup";
import { Container } from "react-bootstrap";
import AuthProvider from "../src/Contexts/AuthProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/Login";

const App = () => {
  // Assuming you have currentUser set up in your AuthProvider
  // Replace with your actual currentUser data fetched from AuthProvider
  const currentUser = null;

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Route for the root URL */}
              {/* <Route path="/" element={<LandingPage />} /> */}

              {/* Route for the dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Route for signup */}
              <Route path="/signup" element={<Signup />} />

              {/* Route for login */}
              <Route path="/login" element={<Login />} />
            </Routes>
          </Router>
        </AuthProvider>
      </div>
    </Container>
  );
};

export default App;
