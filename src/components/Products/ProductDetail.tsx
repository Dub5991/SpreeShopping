import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../../firebase/firestore";
import { Card, Spinner, Badge, Container, Row, Col, Button } from "react-bootstrap";
import { motion } from "framer-motion";

// Animation variants for card entrance
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProductDetail: React.FC = () => {
  // Get productId from route params
  const { productId } = useParams<{ productId: string }>();
  // State for product data and loading indicator
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch product data on mount or when productId changes
  useEffect(() => {
    getProducts().then(snapshot => {
      // Find the product with the matching ID
      const found = snapshot.docs.find(doc => doc.id === productId);
      setProduct(found ? { id: found.id, ...found.data() } : null);
      setLoading(false);
    });
  }, [productId]);

  // Show loading spinner while fetching data
  if (loading)
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );

  // Show not found message if product doesn't exist
  if (!product)
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Card className="shadow-sm p-4 text-center border-0" style={{ background: "#f8f9fa" }}>
          <Card.Body>
            <Card.Title className="text-danger">Product not found.</Card.Title>
            <Button
              variant="outline-primary"
              className="mt-3"
              style={{
                borderRadius: "2em",
                fontWeight: 600,
                background: "linear-gradient(90deg, #c3cfe2 0%, #5e60ce 100%)",
                color: "#22223b",
                border: "none",
              }}
              onClick={() => navigate(-1)}
            >
              ← Back
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );

  // Render product details
  return (
    <Container className="py-5">
      <Row className="justify-content-center align-items-center">
        <Col md={10} lg={9} xl={8}>
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.01, boxShadow: "0 8px 32px rgba(0,0,0,0.13)" }}
          >
            <Card
              className="shadow-lg border-0"
              style={{
                borderRadius: "2.5rem",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                color: "#22223b",
                overflow: "hidden",
                minHeight: 540,
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
              }}
            >
              <Row className="g-0 w-100 align-items-center flex-column-reverse flex-md-row">
                {/* Details Section */}
                <Col xs={12} md={6}>
                  <Card.Body
                    style={{
                      padding: "2.5rem 2rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      height: "100%",
                    }}
                  >
                    {/* Back button */}
                    <Button
                      variant="outline-primary"
                      className="mb-4"
                      style={{
                        borderRadius: "2em",
                        fontWeight: 600,
                        background: "linear-gradient(90deg, #c3cfe2 0%, #5e60ce 100%)",
                        color: "#22223b",
                        border: "none",
                        width: 110,
                        alignSelf: "flex-start",
                        marginBottom: 24,
                      }}
                      onClick={() => navigate(-1)}
                    >
                      ← Back
                    </Button>
                    {/* Product Name */}
                    <Card.Title
                      className="mb-3"
                      style={{
                        fontWeight: 900,
                        fontSize: "2.3rem",
                        color: "#22223b",
                        letterSpacing: 0.5,
                        lineHeight: 1.1,
                        textShadow: "0 2px 8px #e0e7ff",
                      }}
                    >
                      {product.name}
                    </Card.Title>
                    {/* Product Description */}
                    <Card.Text
                      className="mb-4"
                      style={{
                        color: "#4a4e69",
                        fontSize: "1.18rem",
                        minHeight: 60,
                        opacity: 0.97,
                        fontStyle: "italic",
                        lineHeight: 1.5,
                      }}
                    >
                      {product.description}
                    </Card.Text>
                    {/* Badges for price, stock, and category */}
                    <div className="d-flex align-items-center mb-3 flex-wrap gap-2">
                      <Badge
                        pill
                        style={{
                          background: "linear-gradient(90deg, #5e60ce 0%, #48bfe3 100%)",
                          color: "#fff",
                          fontSize: "1.15rem",
                          padding: "0.7em 1.2em",
                          marginRight: "1em",
                          fontWeight: 700,
                          letterSpacing: 0.2,
                        }}
                      >
                        ${product.price}
                      </Badge>
                      <Badge
                        pill
                        style={{
                          background: product.stock > 0
                            ? "linear-gradient(90deg, #06d6a0 0%, #1b9aaa 100%)"
                            : "linear-gradient(90deg, #ff6b6b 0%, #f06543 100%)",
                          color: "#fff",
                          fontSize: "1.15rem",
                          padding: "0.7em 1.2em",
                          fontWeight: 700,
                          letterSpacing: 0.2,
                        }}
                      >
                        {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
                      </Badge>
                      <Badge
                        pill
                        style={{
                          background: "linear-gradient(90deg, #f59e42 0%, #fbbf24 100%)",
                          color: "#fff",
                          fontSize: "1.05rem",
                          padding: "0.6em 1.1em",
                          fontWeight: 600,
                          letterSpacing: 0.1,
                        }}
                      >
                        {product.category}
                      </Badge>
                    </div>
                  </Card.Body>
                </Col>
                {/* Image Section */}
                <Col
                  xs={12}
                  md={6}
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    background: "linear-gradient(135deg, #e0e7ff 0%, #b4c5e4 100%)",
                    minHeight: 380,
                  }}
                >
                  {/* Show product image if available, otherwise show placeholder */}
                  {product.imageUrl ? (
                    <motion.img
                      src={product.imageUrl}
                      alt={product.name}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, type: "spring" }}
                      style={{
                        width: "100%",
                        maxWidth: 440,
                        maxHeight: 380,
                        objectFit: "contain",
                        borderRadius: "2rem",
                        boxShadow: "0 8px 32px rgba(94,96,206,0.10)",
                        background: "#fff",
                        padding: 18,
                        margin: "2rem 0",
                        border: "2px solid #e0e7ff",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 260,
                        height: 260,
                        background: "#f1f5f9",
                        borderRadius: "2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 100,
                        color: "#b4c5e4",
                        margin: "2rem 0",
                        border: "2px solid #e0e7ff",
                      }}
                    >
                      ?
                    </div>
                  )}
                </Col>
              </Row>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;