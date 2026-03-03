import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container, Navbar, Nav, Toast, ToastContainer } from "react-bootstrap";
import { AnimatePresence, motion } from "framer-motion";
import { FaCartPlus } from "react-icons/fa";
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
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AnimatedBackground from "./components/AnimatedBackground";
import SpreeLogo from "./components/SpreeLogo";

const App: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastProduct, setToastProduct] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setToastProduct(detail?.name || null);
      setShowToast(true);
    };
    window.addEventListener("cart:added", handler as EventListener);
    return () => window.removeEventListener("cart:added", handler as EventListener);
  }, []);

  const handleNavClick = () => setExpanded(false);

  return (
    <Router>
      <a
        href="#main-content"
        className="visually-hidden-focusable position-absolute top-0 start-0 p-2 bg-white text-primary fw-bold"
        style={{ zIndex: 9999 }}
      >
        Skip to main content
      </a>
      <ToastContainer
        position="top-center"
        className="p-3"
        style={{
          zIndex: 3000,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100vw",
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {showToast && (
          <Toast
            bg="success"
            onClose={() => setShowToast(false)}
            show={showToast}
            delay={1800}
            autohide
            style={{
              minWidth: 220,
              maxWidth: "90vw",
              borderRadius: "1rem",
              boxShadow: "0 4px 24px rgba(16,185,129,0.12)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "1.05rem",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <Toast.Body>
              <FaCartPlus className="me-2" />
              <span style={{ color: "#fff" }}>
                {toastProduct ? `"${toastProduct}" added to cart!` : "Added to cart!"}
              </span>
            </Toast.Body>
          </Toast>
        )}
      </ToastContainer>
      <AnimatedBackground />
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        expanded={expanded}
        onToggle={setExpanded}
        style={{ position: "relative", zIndex: 2 }}
      >
        <Container>
          <Navbar.Brand as={Link} to="/" onClick={handleNavClick} className="d-flex align-items-center gap-2">
            <SpreeLogo size={40} className="d-inline-block align-top" />
            <span className="fw-bold ms-2" style={{ fontSize: 22, letterSpacing: 1 }}>
              Spree Store
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/products" onClick={handleNavClick}>Products</Nav.Link>
              <Nav.Link as={Link} to="/orders" onClick={handleNavClick}>Orders</Nav.Link>
              <Nav.Link as={Link} to="/cart" onClick={handleNavClick}>Cart</Nav.Link>
              <Nav.Link as={Link} to="/profile" onClick={handleNavClick}>Profile</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link as={Link} to="/login" onClick={handleNavClick}>Login</Nav.Link>
              <Nav.Link as={Link} to="/register" onClick={handleNavClick}>Register</Nav.Link>
              <Logout />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container id="main-content" as="main" className="mt-4" style={{ position: "relative", zIndex: 2 }}>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><HomePage /></motion.div>} />
            <Route path="/login" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><LoginPage /></motion.div>} />
            <Route path="/register" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><RegisterPage /></motion.div>} />
            <Route path="/products" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ProductsPage /></motion.div>} />
            <Route path="/products/:productId" element={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ProductDetail /></motion.div>} />

            {/* Protected routes — redirect to /login if not authenticated */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><ProfilePage /></motion.div>
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><OrdersPage /></motion.div>
              </ProtectedRoute>
            } />
            <Route path="/orders/:orderId" element={
              <ProtectedRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><OrderDetail /></motion.div>
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><CartPage /></motion.div>
              </ProtectedRoute>
            } />
          </Routes>
        </AnimatePresence>
      </Container>
    </Router>
  );
};

export default App;
