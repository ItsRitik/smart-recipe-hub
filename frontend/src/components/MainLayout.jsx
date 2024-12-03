import React from "react";
import { Outlet } from "react-router-dom";
import NavigationBar from "../components/Navbar";
import { Container } from "react-bootstrap";

const MainLayout = () => {
  return (
    <div className="d-flex flex-column vh-100">
      {/* Sticky Navbar */}
      <header>
        <NavigationBar />
      </header>

      {/* Main Content */}
      <Container as="main" className="flex-grow-1 py-4">
        <Outlet />
      </Container>

      {/* Sticky Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto">
        © 2024 Smart Recipe Hub
      </footer>
    </div>
  );
};

export default MainLayout;
