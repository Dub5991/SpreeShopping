import React, { useEffect, useState } from "react";
import { getOrdersByUserRealtime } from "../../firebase/firestore";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Table, Spinner, Button, Alert, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AnimatedCard from "../AnimatedCard";

type User = { uid: string };
type Order = { id: string; [key: string]: any };

const OrderList: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user) as User | null;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, don't try to fetch orders
    if (!user || !user.uid) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    // Subscribe to real-time updates for current user's orders
    const unsubscribe = getOrdersByUserRealtime(user.uid, (snapshot: any) => {
      if (!snapshot || !snapshot.docs) {
        setOrders([]);
        setLoading(false);
        return;
      }
      const mapped = snapshot.docs.map((doc: any) => {
        const data = doc.data ? doc.data() : {};
        return { id: doc.id, ...data };
      });
      setOrders(mapped);
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [user]);

  // Defensive: If user is not logged in, show message and don't spin
  if (!user || !user.uid)
    return <Alert variant="warning">Please log in to view your orders.</Alert>;
  if (loading) return <Spinner animation="border" />;
  if (!orders.length) return <Alert variant="info">No orders found.</Alert>;

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