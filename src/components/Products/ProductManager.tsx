// src/components/Products/ProductManager.tsx

import React, { useEffect, useState } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../../firebase/firestore";
import { Card, Button, Row, Col, Spinner, Modal, Form, InputGroup, Badge } from "react-bootstrap";
import { motion } from "framer-motion";

// Template for a new/empty product
const emptyProduct = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  category: ""
};

interface ProductManagerProps {
  adminMode: boolean;
  category?: string | null;
}

// Accent colors for product cards
const accentColors = [
  "#0ea5e9", "#a21caf", "#f59e42", "#16a34a", "#eab308", "#ef4444"
];
const getAccent = (idx: number) => accentColors[idx % accentColors.length];

const ProductManager: React.FC<ProductManagerProps> = ({ adminMode, category = null }) => {
  // State for products, loading, modal, editing, and form data
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyProduct);

  // Fetch products from Firestore and update state
  const fetchProducts = async () => {
    setLoading(true);
    const snapshot = await getProducts();
    setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    setLoading(false);
  };

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Open modal for add/edit product
  const openModal = (product?: any) => {
    setEditing(product || null);
    setForm(product ? { ...product } : emptyProduct);
    setShowModal(true);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save new or edited product to Firestore
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      imageUrl: form.imageUrl,
      category: form.category
    };
    if (editing) {
      await updateProduct(editing.id, productData);
    } else {
      await addProduct(productData);
    }
    setShowModal(false);
    fetchProducts();
  };

  // Delete product from Firestore
  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      fetchProducts();
    }
  };

  // Show loading spinner while fetching products
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );

  // Filter products by category if provided
  const filteredProducts = category
    ? products.filter((product) => product.category === category)
    : products;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div
        style={{
          background: "linear-gradient(120deg, #f0f4f8 0%, #e0e7ff 100%)",
          minHeight: "100vh",
          padding: "2.5rem 0 1rem 0",
        }}
      >
        <Row className="g-5 justify-content-center">
          {/* Render product cards */}
          {filteredProducts.map((product, idx) => (
            <Col
              key={product.id}
              xs={12}
              sm={10}
              md={6}
              lg={4}
              xl={3}
              as={motion.div}
              whileHover={{ scale: 1.03, boxShadow: `0 8px 32px ${getAccent(idx)}22` }}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Card
                className="shadow border-0"
                style={{
                  borderRadius: "1.5rem",
                  background: "#fff",
                  minHeight: 480,
                  width: "100%",
                  maxWidth: 340,
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: `0 8px 32px ${getAccent(idx)}22`,
                  border: `2px solid ${getAccent(idx)}22`,
                  transition: "box-shadow 0.2s, border 0.2s",
                }}
              >
                {/* Accent bar at the top */}
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
                {/* Product image or placeholder */}
                <div
                  style={{
                    position: "absolute",
                    top: 18,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 120,
                    height: 120,
                    background: "#f1f5f9",
                    borderRadius: "1.2rem",
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
                        width: 96,
                        height: 96,
                        objectFit: "contain",
                        filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.10))",
                        background: "#fff",
                        borderRadius: "1.2rem",
                        padding: 6,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        background: "#e0e7ff",
                        borderRadius: "1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#a0aec0",
                        fontWeight: 700,
                        fontSize: 32,
                      }}
                    >
                      ?
                    </div>
                  )}
                </div>
                <Card.Body style={{ paddingTop: 140 }}>
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
                      Stock: {product.stock}
                    </span>
                  </div>
                  {/* Admin controls: Edit/Delete buttons */}
                  {adminMode && (
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        className="me-2"
                        style={{
                          borderRadius: "0.8rem",
                          fontWeight: 700,
                          borderWidth: 2,
                          borderColor: getAccent(idx),
                          color: getAccent(idx),
                          background: "transparent",
                          transition: "all 0.2s",
                        }}
                        onClick={() => openModal(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        style={{
                          borderRadius: "0.8rem",
                          fontWeight: 700,
                          borderWidth: 2,
                        }}
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {/* Add/Edit Product Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{editing ? "Edit Product" : "Add Product"}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSave}>
            <Modal.Body>
              {/* Product form fields */}
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={form.name} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" value={form.description} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <InputGroup>
                  <InputGroup.Text>$</InputGroup.Text>
                  <Form.Control name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Image URL</Form.Label>
                <Form.Control name="imageUrl" value={form.imageUrl} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Clothing, Electronics, Accessories"
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary">{editing ? "Update" : "Add"}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
        {/* Add Product Button (only in admin mode, outside of modal) */}
        {adminMode && (
          <div className="d-flex justify-content-end mt-4">
            <Button
              onClick={() => openModal()}
              variant="success"
              style={{
                borderRadius: "1.2rem",
                fontWeight: 700,
                fontSize: "1.1rem",
                padding: "0.7em 2em",
                boxShadow: "0 2px 12px #16a34a22",
                letterSpacing: 0.2,
              }}
            >
              Add Product
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductManager;