import React, { useEffect, useState } from "react";
import { getOrdersByUserRealtime } from "../../firebase/firestore";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Table, Spinner, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AnimatedCard from "../AnimatedCard";

// User and Order types for type safety
type User = { uid: string };
type Order = { id: string; [key: string]: any };

/**
 * OrderList component
 * Displays all orders for the current user in real-time.
 * Handles loading, empty, and unauthenticated states.
 */
const OrderList: React.FC = () => {
  // Get current user from Redux store
  const user = useSelector((state: RootState) => state.user.user) as User | null;
  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  // Loading state
  const [loading, setLoading] = useState(true);
  // React Router navigation
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, clear orders and stop loading
    if (!user || !user.uid) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Subscribe to real-time updates for current user's orders
    const unsubscribe = getOrdersByUserRealtime(user.uid, (snapshot: any) => {
      // Defensive: handle empty or malformed snapshot
      if (!snapshot || !snapshot.docs) {
        setOrders([]);
        setLoading(false);
        return;
      }
      // Map Firestore docs to order objects
      const mapped = snapshot.docs.map((doc: any) => {
        const data = doc.data ? doc.data() : {};
        return { id: doc.id, ...data };
      });
      setOrders(mapped);
      setLoading(false);
    });
    // Cleanup subscription on unmount or user change
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [user]);

  // Show login warning if not authenticated
  if (!user || !user.uid)
    return <Alert variant="warning">Please log in to view your orders.</Alert>;
  // Show spinner while loading
  if (loading) return <Spinner animation="border" />;
  // Show info if no orders found
  if (!orders.length) return <Alert variant="info">No orders found.</Alert>;

  // Render orders table
  return (
    <Container>
      <Row>
        <Col>
          <AnimatedCard>
            <Table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      {order.createdAt?.toDate?.()
                        ? order.createdAt.toDate().toLocaleString()
                        : "N/A"}
                    </td>
                    <td>{order.status ?? "N/A"}</td>
                    <td>
                      <Button size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </AnimatedCard>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderList;