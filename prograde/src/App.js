import React from "react";
import "./App.css";
import Signup from "./Components/Signup";
import { Container } from "react-bootstrap";
import AuthProvider from "../src/Contexts/AuthProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard";

const App = () => {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Router>
        </AuthProvider>
      </div>
    </Container>
  );
};

export default App;
