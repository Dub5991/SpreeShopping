import React, { useEffect, useState } from "react";
import { getOrdersByUser } from "../../firebase/firestore";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Table, Spinner, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AnimatedCard from "../AnimatedCard";

// OrderList component displays a list of orders for the logged-in user
const OrderList: React.FC = () => {
  // Get the current user from Redux store
  const user = useSelector((state: RootState) => state.user.user);
  // State to hold fetched orders
  const [orders, setOrders] = useState<any[]>([]);
  // Loading state for async fetch
  const [loading, setLoading] = useState(true);
  // React Router navigation hook
  const navigate = useNavigate();

  // Fetch orders when user changes
  useEffect(() => {
    if (!user) return;
    getOrdersByUser(user.uid).then(snapshot => {
      // Map Firestore docs to order objects
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, [user]);

  // Show alert if user is not logged in
  if (!user)
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          Please log in to view your orders.
        </Alert>
      </Container>
    );

  // Show spinner while loading
  if (loading)
    return (
      <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
        <Spinner animation="border" />
      </Container>
    );

  // Render orders table
  return (
    <Container fluid className="py-4 px-1 px-md-4">
      <AnimatedCard>
        <Row className="mb-3">
          <Col xs={12}>
            <h2 className="text-center mb-0" style={{ fontWeight: 700, fontSize: "2rem" }}>
              Your Orders
            </h2>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <div style={{ overflowX: "auto" }}>
              <Table
                striped
                bordered
                hover
                responsive
                className="mb-0"
                style={{
                  minWidth: 400,
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  fontSize: "1rem"
                }}
              >
                <thead style={{ background: "#f8f9fa" }}>
                  <tr>
                    <th style={{ minWidth: 120 }}>Order ID</th>
                    <th style={{ minWidth: 120 }}>Date</th>
                    <th style={{ minWidth: 80 }}>Total</th>
                    <th style={{ minWidth: 90 }}>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Show message if no orders */}
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted py-4">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    // Render each order row
                    orders.map(order => (
                      <tr key={order.id}>
                        <td style={{ wordBreak: "break-all", fontWeight: 500 }}>{order.id}</td>
                        <td>
                          {/* Format Firestore timestamp if available */}
                          {order.createdAt?.toDate?.().toLocaleString() ||
                            "N/A"}
                        </td>
                        <td style={{ fontWeight: 600, color: "#198754" }}>
                          ${order.total?.toFixed(2)}
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant="primary"
                            style={{ minWidth: 70, fontWeight: 500 }}
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </AnimatedCard>
    </Container>
  );
};

export default OrderList;