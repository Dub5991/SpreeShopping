import React, { useEffect, useState } from "react";
import { getOrdersByUser } from "../../firebase/firestore";
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
    if (!user) return;
    getOrdersByUser(user.uid).then(snapshot => {
      setOrders(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  }, [user]);

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
                    <td>{order.createdAt?.toDate?.().toLocaleString?.() ?? "N/A"}</td>
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