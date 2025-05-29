import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Spinner,
  InputGroup,
  Form,
  Badge,
} from "react-bootstrap";
import { getProducts } from "../../firebase/firestore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBoxOpen, FaCartPlus, FaEye, FaExclamationTriangle } from "react-icons/fa";
import clsx from "clsx";

// --- Cart helpers ---
const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const setCart = (cart: any[]) => localStorage.setItem("cart", JSON.stringify(cart));

// --- Accent color palette ---
const accentColors = [
  "#0ea5e9", "#a21caf", "#f59e42", "#16a34a", "#eab308", "#ef4444"
];
const getAccent = (idx: number) => accentColors[idx % accentColors.length];

// --- ProductList Props ---
interface ProductListProps {
  category?: string | null;
}

// --- Card animation variants ---
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, type: "spring" },
  }),
  exit: { opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.3 } },
};

const ProductList: React.FC<ProductListProps> = ({ category = null }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [id: string]: number }>({});
  const navigate = useNavigate();

  useEffect(() => {
    getProducts().then((snapshot) => {
      const prods = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(prods);
      setQuantities(Object.fromEntries(prods.map((p) => [p.id, 1])));
      setLoading(false);
    });
  }, []);

  const handleAddToCart = (product: any) => {
    const cart = getCart();
    const existing = cart.find((item: any) => item.id === product.id);
    const qty = quantities[product.id] || 1;
    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }
    setCart(cart);
    window.dispatchEvent(new CustomEvent("cart:added", { detail: { name: product.name } }));
    // Toast is now handled at a higher level (App.tsx)
  };

  const handleQuantityChange = (id: string, value: number) => {
    setQuantities((q) => ({ ...q, [id]: value }));
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );

  const filteredProducts = category
    ? products.filter((product) => product.category === category)
    : products;

  return (
    <div
      style={{
        background: "linear-gradient(120deg, #f0f4f8 0%, #e0e7ff 100%)",
        minHeight: "100vh",
        padding: "3rem 0",
        position: "relative",
      }}
    >
      <Row className="g-5 justify-content-center">
        <AnimatePresence>
          {filteredProducts.map((product, idx) => (
            <Col
              key={product.id}
              xs={12}
              sm={10}
              md={6}
              lg={4}
              xl={3}
              as={motion.div}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                className={clsx(
                  "shadow border-0",
                  product.stock < 1 && "opacity-50"
                )}
                style={{
                  borderRadius: "1.5rem",
                  background: "#fff",
                  minHeight: 500,
                  width: "100%",
                  maxWidth: 360,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: `0 8px 32px ${getAccent(idx)}22`,
                  border: `2px solid ${getAccent(idx)}22`,
                  transition: "box-shadow 0.2s, border 0.2s",
                }}
              >
                {/* Modern accent bar at the top */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: 8,
                    background: `linear-gradient(90deg, ${getAccent(idx)} 60%, #fff0 100%)`,
                    zIndex: 2,
                  }}
                />
                {/* Product image or fallback icon */}
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.08 + 0.2, duration: 0.5, type: "spring" }}
                  style={{
                    position: "absolute",
                    top: 18,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 140,
                    height: 140,
                    background: "#f1f5f9",
                    borderRadius: "1.5rem",
                    boxShadow: `0 2px 16px ${getAccent(idx)}22`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 3,
                  }}
                >
                  {product.imageUrl ? (
                    <Card.Img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "contain",
                        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.10))",
                        background: "#fff",
                        borderRadius: "1.2rem",
                        padding: 8,
                      }}
                    />
                  ) : (
                    <FaBoxOpen size={90} color={getAccent(idx)} />
                  )}
                </motion.div>
                <Card.Body style={{ paddingTop: 170 }}>
                  <div className="d-flex align-items-center mb-2">
                    <Card.Title
                      style={{
                        fontWeight: 900,
                        color: "#1e293b",
                        fontSize: "1.18rem",
                        flex: 1,
                        marginBottom: 0,
                        letterSpacing: 0.2,
                        textTransform: "capitalize",
                      }}
                    >
                      {product.name}
                    </Card.Title>
                    <Badge
                      style={{
                        background: getAccent(idx),
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        marginLeft: 8,
                        borderRadius: "0.7rem",
                        padding: "0.4em 0.8em",
                        boxShadow: `0 2px 8px ${getAccent(idx)}22`,
                      }}
                    >
                      {product.category}
                    </Badge>
                  </div>
                  <Card.Text
                    style={{
                      color: "#64748b",
                      fontSize: "1.01rem",
                      minHeight: 44,
                      marginBottom: 14,
                      opacity: 0.97,
                      fontStyle: "italic",
                    }}
                  >
                    {product.description}
                  </Card.Text>
                  <div className="d-flex align-items-center mb-3">
                    <span
                      style={{
                        fontWeight: 800,
                        color: getAccent(idx),
                        fontSize: "1.18rem",
                        letterSpacing: 0.1,
                        marginRight: 10,
                      }}
                    >
                      ${product.price}
                    </span>
                    <span
                      className="ms-2 d-flex align-items-center"
                      style={{ color: "#64748b", fontSize: "0.97rem" }}
                    >
                      <FaBoxOpen className="me-1" /> {product.stock} in stock
                    </span>
                    {product.stock < 5 && product.stock > 0 && (
                      <Badge
                        bg="danger"
                        className="ms-2 d-flex align-items-center"
                        style={{ borderRadius: "0.7rem", fontWeight: 700 }}
                      >
                        <FaExclamationTriangle className="me-1" /> Low!
                      </Badge>
                    )}
                    {product.stock < 1 && (
                      <Badge
                        bg="secondary"
                        className="ms-2 d-flex align-items-center"
                        style={{ borderRadius: "0.7rem", fontWeight: 700 }}
                      >
                        Out of stock
                      </Badge>
                    )}
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <InputGroup
                      style={{
                        maxWidth: 120,
                        background: "#f1f5f9",
                        borderRadius: 10,
                        border: `1.5px solid ${getAccent(idx)}33`,
                      }}
                    >
                      <InputGroup.Text
                        style={{
                          background: "#f1f5f9",
                          color: "#64748b",
                          border: "none",
                          fontWeight: 600,
                          fontSize: "0.95rem",
                        }}
                      >
                        Qty
                      </InputGroup.Text>
                      <Form.Control
                        type="number"
                        min={1}
                        max={product.stock}
                        value={quantities[product.id] || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            product.id,
                            Math.max(1, Math.min(product.stock, Number(e.target.value)))
                          )
                        }
                        style={{
                          width: 48,
                          border: "none",
                          borderRadius: "0 10px 10px 0",
                          background: "#f1f5f9",
                          fontWeight: 600,
                        }}
                        disabled={product.stock < 1}
                      />
                    </InputGroup>
                  </div>
                  <div className="d-flex gap-2">
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      whileHover={{
                        scale: 1.04,
                        backgroundColor: "#f1f5f9",
                        color: getAccent(idx),
                        borderColor: getAccent(idx),
                      }}
                      style={{
                        borderColor: getAccent(idx),
                        color: getAccent(idx),
                        fontWeight: 700,
                        flex: 1,
                        borderRadius: "0.8rem",
                        background: "transparent",
                        borderWidth: 2,
                        borderStyle: "solid",
                        padding: "0.45rem 0.75rem",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <FaEye /> Details
                    </motion.button>
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      whileHover={{
                        scale: 1.06,
                        backgroundColor: "#fff",
                        color: getAccent(idx),
                        borderColor: getAccent(idx),
                      }}
                      style={{
                        background: getAccent(idx),
                        borderColor: getAccent(idx),
                        fontWeight: 800,
                        flex: 1,
                        borderRadius: "0.8rem",
                        boxShadow: `0 2px 12px ${getAccent(idx)}22`,
                        color: "#fff",
                        border: "2px solid",
                        padding: "0.45rem 0.75rem",
                        transition: "all 0.2s",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock < 1}
                    >
                      <FaCartPlus /> Add
                    </motion.button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </AnimatePresence>
      </Row>
    </div>
  );
};

export default ProductList;