import React, { useState } from "react";
import {
  Table,
  Button,
  Form,
  Alert,
  Toast,
  ToastContainer,
  Badge,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addOrder, getProducts, updateProduct } from "../firebase/firestore";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";

// --- Types ---
type CartItem = { id: string; name: string; price: number; quantity: number; stock: number };
type Product = { id: string; name: string; price: number; stock: number };
type User = { uid: string; [key: string]: any };

// --- Cart helpers ---
const getCart = (): CartItem[] => JSON.parse(localStorage.getItem("cart") || "[]");
const setCart = (cart: CartItem[]) => localStorage.setItem("cart", JSON.stringify(cart));

// --- Main Cart Page ---
const CartPage: React.FC = () => {
  const [cart, setCartState] = useState<CartItem[]>(getCart());
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user.user) as User | null;
  const navigate = useNavigate();

  // --- Animation variants ---
  const tableVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  };
  const rowVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  };

  // --- Styling classes ---
  const cardClass = clsx(
    "shadow-lg",
    "rounded-5",
    "bg-white",
    "p-4",
    "mx-auto",
    "my-5",
    "border-0",
    "w-100",
    "mw-100",
    "max-w-2xl",
    "position-relative"
  );
  const tableClass = clsx("align-middle", "table-hover", "table-borderless", "mb-4");
  const totalClass = clsx("text-end", "fw-bold", "fs-3", "text-primary", "mb-4", "pe-2");
  const checkoutBtnClass = clsx(
    "w-100",
    "py-3",
    "fs-5",
    "rounded-pill",
    "shadow-sm",
    "fw-bold",
    "mt-3",
    "gradient-btn"
  );

  // --- Cart logic ---
  const total = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (id: string, value: number) => {
    const updated = cart.map((item: CartItem) =>
      item.id === id ? { ...item, quantity: Math.max(1, value) } : item
    );
    setCart(updated);
    setCartState(updated);
    setToastMsg("Quantity updated!");
    setShowToast(true);
  };

  const handleRemove = (id: string) => {
    const updated = cart.filter((item: CartItem) => item.id !== id);
    setCart(updated);
    setCartState(updated);
    setToastMsg("Item removed from cart.");
    setShowToast(true);
  };

  const handleCheckout = async () => {
    setCheckoutError(null);
    if (!user) {
      setToastMsg("Please log in to checkout.");
      setShowToast(true);
      navigate("/login");
      return;
    }
    setCheckoutLoading(true);
    // Check stock before placing order
    const productsSnap = await getProducts();
    const products: Product[] = productsSnap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    for (const item of cart) {
      const prod = products.find((p: Product) => p.id === item.id);
      if (!prod || prod.stock < item.quantity) {
        setCheckoutError(`Not enough stock for ${item.name}`);
        setCheckoutLoading(false);
        return;
      }
    }
    // Place order
    await addOrder({
      userId: user.uid,
      items: cart.map(({ id, name, price, quantity }) => ({ productId: id, name, price, quantity })),
      total
    });
    // Update stock
    for (const item of cart) {
      const prod = products.find((p: Product) => p.id === item.id);
      if (prod) {
        await updateProduct(item.id, { stock: prod.stock - item.quantity });
      }
    }
    setCart([]);
    setCartState([]);
    setToastMsg("Order placed! Thank you for shopping with Spree 🎉");
    setShowToast(true);
    setCheckoutLoading(false);
    setTimeout(() => navigate("/orders"), 1200);
  };

  // --- Render ---
  return (
    <motion.div
      className={clsx("container", "my-5")}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <motion.div
        className={cardClass}
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        style={{
          background: "linear-gradient(120deg, #f8fafc 70%, #e0e7ff 100%)",
          boxShadow: "0 8px 32px rgba(99,102,241,0.10), 0 1.5px 8px rgba(30,41,59,0.08)"
        }}
      >
        <motion.h2
          className={clsx("fw-bold", "mb-4", "text-center", "text-primary")}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span role="img" aria-label="cart">🛒</span> Your Cart
        </motion.h2>
        {cart.length === 0 ? (
          <motion.div
            className={clsx("text-center", "text-secondary", "fs-4", "py-5")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span role="img" aria-label="empty">🛍️</span> Your cart is empty.
            <div className="mt-4">
              <Button
                variant="outline-primary"
                className={clsx("rounded-pill", "fw-bold", "px-4", "py-2")}
                onClick={() => navigate("/products")}
              >
                Shop Products
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {checkoutError && (
              <Alert variant="danger" className="mb-3 text-center">
                {checkoutError}
              </Alert>
            )}
            <motion.div
              variants={tableVariants}
              initial="hidden"
              animate="visible"
            >
              <Table className={tableClass} responsive>
                <thead>
                  <tr>
                    <th className="fs-5">Product</th>
                    <th className="fs-5">Qty</th>
                    <th className="fs-5">Price</th>
                    <th className="fs-5">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {cart.map((item: CartItem, idx: number) => (
                      <motion.tr
                        key={item.id}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className={clsx("align-middle")}
                        style={{
                          background: idx % 2 === 0 ? "#f8fafc" : "#e0e7ff",
                          borderRadius: 16,
                          boxShadow: idx % 2 === 0 ? "0 1px 4px #6366f111" : "0 1px 4px #818cf811"
                        }}
                      >
                        <td className="fw-semibold fs-6" style={{ minWidth: 120 }}>
                          <span className="d-flex align-items-center gap-2">
                            <Badge
                              bg={idx % 2 === 0 ? "primary" : "warning"}
                              className="me-2"
                              style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                background: idx % 2 === 0 ? "#6366f1" : "#f59e42"
                              }}
                            >
                              {item.name[0]}
                            </Badge>
                            {item.name}
                          </span>
                        </td>
                        <td>
                          <Form.Control
                            type="number"
                            min={1}
                            max={item.stock}
                            value={item.quantity}
                            className={clsx("text-center", "fw-bold")}
                            style={{
                              width: 60,
                              borderRadius: "0.7em",
                              border: "1.5px solid #6366f1",
                              fontWeight: 600,
                              color: "#6366f1",
                              background: "#fff"
                            }}
                            onChange={e =>
                              handleQuantityChange(item.id, Math.max(1, Math.min(item.stock, Number(e.target.value))))
                            }
                          />
                        </td>
                        <td className="fw-bold text-primary">${item.price}</td>
                        <td className="fw-bold text-success">${(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className={clsx("rounded-pill", "fw-bold")}
                            onClick={() => handleRemove(item.id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </Table>
            </motion.div>
            <motion.div
              className={totalClass}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Total: <span className="text-success">${total.toFixed(2)}</span>
            </motion.div>
            <motion.button
              type="button"
              className={checkoutBtnClass + " btn btn-success"}
              onClick={handleCheckout}
              disabled={checkoutLoading}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "linear-gradient(90deg, #6366f1 0%, #10b981 100%)",
                border: "none",
                color: "#fff",
                letterSpacing: "0.03em"
              }}
            >
              {checkoutLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" /> Processing...
                </>
              ) : (
                <>
                  <span role="img" aria-label="checkout">💳</span> Checkout
                </>
              )}
            </motion.button>
          </>
        )}
      </motion.div>
      {/* Toast Notification */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 3000 }}>
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.4, type: "spring" }}
            >
              <Toast
                bg="info"
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={1800}
                autohide
                style={{
                  minWidth: 240,
                  borderRadius: "1.25rem",
                  boxShadow: "0 4px 24px rgba(99,102,241,0.12)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.08rem",
                  background: "linear-gradient(90deg, #6366f1 0%, #f59e42 100%)"
                }}
              >
                <Toast.Body>
                  <span role="img" aria-label="cart">🛒</span>{" "}
                  <span style={{ color: "#fff" }}>
                    {toastMsg}
                  </span>
                </Toast.Body>
              </Toast>
            </motion.div>
          )}
        </AnimatePresence>
      </ToastContainer>
      <style>{`
        .table thead th {
          background: #e0e7ff;
          color: #6366f1;
          border-bottom: 2px solid #6366f1;
        }
        .table tbody tr {
          transition: background 0.2s;
        }
        .table tbody tr:hover {
          background: #f1f5f9 !important;
        }
        .gradient-btn {
          background: linear-gradient(90deg, #6366f1 0%, #10b981 100%) !important;
          color: #fff !important;
          border: none !important;
        }
      `}</style>
    </motion.div>
  );
};

export default CartPage;