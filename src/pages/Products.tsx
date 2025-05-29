// src/pages/Products.tsx
// Professional, color-optimized, and animated Products page for Spree

import React, { useState } from "react";
import ProductManager from "../components/Products/ProductManager";
import ProductList from "../components/Products/ProductList";
import ProductCategoryFilter from "../components/Products/ProductCategoryFilter";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import clsx from "clsx";

// Color palette for theme
const accent = "#6366f1";
const bgGradient = "linear-gradient(120deg, #f8fafc 60%, #e0e7ff 100%)";
const adminGradient = "linear-gradient(90deg, #f43f5e 0%, #6366f1 100%)";
const userGradient = "linear-gradient(90deg, #6366f1 0%, #10b981 100%)";

const ProductsPage: React.FC = () => {
  const [adminMode, setAdminMode] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  return (
    <Container
      fluid
      className={clsx("py-4", "fade-in-up")}
      style={{
        minHeight: "90vh",
        background: bgGradient,
        borderRadius: "2rem",
        boxShadow: "0 8px 32px rgba(99,102,241,0.10), 0 1.5px 8px rgba(30,41,59,0.08)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Header and Admin Toggle */}
      <Row className="align-items-center mb-4">
        <Col xs={12} md={8}>
          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className={clsx("fw-bold", "mb-0", "display-5")}
            style={{
              color: accent,
              letterSpacing: "-1px",
              textShadow: "0 2px 8px #6366f122",
            }}
          >
            <span role="img" aria-label="products">🛍️</span> Products
            <Badge
              bg="light"
              className="ms-3"
              style={{
                color: adminMode ? "#f43f5e" : accent,
                background: adminMode ? "#f43f5e22" : "#6366f122",
                fontWeight: 700,
                fontSize: "1.1rem",
                borderRadius: "1.5em",
                letterSpacing: "0.5px",
                boxShadow: "0 2px 8px #6366f122",
              }}
            >
              {adminMode ? "Admin Mode" : "Shopper Mode"}
            </Badge>
          </motion.h1>
        </Col>
        <Col xs={12} md={4} className="d-flex justify-content-md-end mt-3 mt-md-0">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <motion.button
              type="button"
              className={clsx(
                "fw-bold",
                "rounded-pill",
                "shadow-sm",
                "px-4",
                "py-2",
                "fs-5",
                "btn",
                adminMode ? "btn-danger" : "btn-outline-primary"
              )}
              style={{
                background: adminMode ? adminGradient : userGradient,
                color: "#fff",
                border: "none",
                letterSpacing: "0.03em",
                boxShadow: adminMode
                  ? "0 2px 8px #f43f5e22"
                  : "0 2px 8px #6366f122",
                transition: "background 0.18s, box-shadow 0.18s, transform 0.12s",
              }}
              onClick={() => setAdminMode((prev) => !prev)}
              whileTap={{ scale: 0.97 }}
            >
              {adminMode ? (
                <>
                  <span role="img" aria-label="admin">🛠️</span> Admin Mode: ON
                </>
              ) : (
                <>
                  <span role="img" aria-label="shopper">🛒</span> Admin Mode: OFF
                </>
              )}
            </motion.button>
          </motion.div>
        </Col>
      </Row>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ProductCategoryFilter selected={category} onCategoryChange={setCategory} />
      </motion.div>

      {/* Product List or Admin Manager */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-3"
      >
        {!adminMode && <ProductList category={category} />}
        {adminMode && <ProductManager adminMode={adminMode} category={category} />}
      </motion.div>

      {/* Decorative Accent */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.12 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="position-absolute"
        style={{
          right: -80,
          bottom: -60,
          width: 220,
          height: 220,
          background: "radial-gradient(circle at 40% 60%, #f59e42 0%, #6366f1 80%)",
          borderRadius: "50%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
    </Container>
  );
};

export default ProductsPage;