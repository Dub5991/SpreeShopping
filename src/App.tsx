import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import ProfilePage from "./pages/Profile";
import ProductsPage from "./pages/Products";
import OrdersPage from "./pages/Orders";
import OrderDetail from "./components/Orders/OrderDetail";
import ProductDetail from "./components/Products/ProductDetail";
import CartPage from "./pages/Cart";
import Logout from "./components/Auth/Logout";
import AnimatedBackground from "./components/AnimatedBackground";
import SpreeLogo from "./components/SpreeLogo"; // Import the animated Spree logo

const App: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  // Collapse navbar after clicking a nav link
  const handleNavClick = () => setExpanded(false);

  return (
    <Router>
      {/* Animated background for the whole app */}
      <AnimatedBackground />
      {/* Main navigation bar */}
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        expanded={expanded}
        onToggle={setExpanded}
        style={{ position: "relative", zIndex: 2 }}
      >
        <Container>
          {/* Brand section with animated Spree logo and text */}
          <Navbar.Brand
            as={Link}
            to="/"
            onClick={handleNavClick}
            className="d-flex align-items-center gap-2"
          >
            <SpreeLogo width={40} height={40} className="d-inline-block align-top" /> {/* Animated Spree logo */}
            
            {/* Brand text */}
            <span className="fw-bold ms-2" style={{ fontSize: 22, letterSpacing: 1 }}>
              Spree Store
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            {/* Left navigation links */}
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/products" onClick={handleNavClick}>
                Products
              </Nav.Link>
              <Nav.Link as={Link} to="/orders" onClick={handleNavClick}>
                Orders
              </Nav.Link>
              <Nav.Link as={Link} to="/cart" onClick={handleNavClick}>
                Cart
              </Nav.Link>
              <Nav.Link as={Link} to="/profile" onClick={handleNavClick}>
                Profile
              </Nav.Link>
            </Nav>
            {/* Right navigation links */}
            <Nav>
              <Nav.Link as={Link} to="/login" onClick={handleNavClick}>
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register" onClick={handleNavClick}>
                Register
              </Nav.Link>
              <Logout />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Main content area with animated route transitions */}
      <Container className="mt-4" style={{ position: "relative", zIndex: 2 }}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Each route is wrapped in a motion.div for fade transitions */}
            <Route
              path="/"
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <HomePage />
                </motion.div>
              }
            />
            <Route
              path="/login"
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <LoginPage />
                </motion.div>
              }
            />
            <Route
              path="/register"
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <RegisterPage />
                </motion.div>
              }
            />
            <Route
              path="/profile"
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ProfilePage />
                </motion.div>
              }
            />
            <Route
              path="/products"
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ProductsPage />
                </motion.div>
              }
            />
            <Route
              path="/products/:productId"
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ProductDetail />
                </motion.div>
              }
            />
            <Route
              path="/orders"
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <OrdersPage />
                </motion.div>
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <OrderDetail />
                </motion.div>
              }
            />
            <Route
              path="/cart"
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CartPage />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </Container>
    </Router>
  );
};

export default App;