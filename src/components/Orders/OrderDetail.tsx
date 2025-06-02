// OrderDetail.tsx - Shows details for a single order

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "../../firebase/firestore";
import { Card, Table, Spinner, Button, Alert, Badge, Row, Col } from "react-bootstrap";
import AnimatedCard from "../AnimatedCard";

// Types for order and items
type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
};
type Order = {
  createdAt?: { toDate: () => Date };
  total?: number;
  items?: OrderItem[];
  status?: string;
  customer?: {
    name?: string;
    email?: string;
  };
};

// Status badge mapping
const statusVariant: Record<string, string> = {
  pending: "warning",
  completed: "success",
  cancelled: "danger",
  shipped: "info",
};

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError(null);
    getOrder(orderId)
      .then(docSnap => {
        if (docSnap.exists()) setOrder(docSnap.data());
        else setError("Order not found.");
      })
      .catch(() => setError("Failed to fetch order."))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
        <Spinner animation="border" />
      </div>
    );
  if (error)
    return (
      <Alert variant="danger" className="my-4 text-center">
        {error}
      </Alert>
    );
  if (!order)
    return (
      <Alert variant="warning" className="my-4 text-center">
        Order not found.
      </Alert>
    );

  return (
    <AnimatedCard>
      <Card className="mx-auto shadow order-detail-card" style={{ maxWidth: 700, width: "100%", border: "none" }}>
        <Card.Body className="p-4">
          <div className="d-flex align-items-center mb-4">
            <Button
              variant="outline-secondary"
              onClick={() => navigate(-1)}
              className="me-3"
              style={{ borderRadius: 6, fontWeight: 500 }}
              aria-label="Back to orders"
              size="sm"
            >
              &larr; Back
            </Button>
            <Card.Title className="mb-0 flex-grow-1" style={{ fontSize: "1.5rem", fontWeight: 600 }}>
              Order Details
              {order.status && (
                <Badge
                  className="ms-3"
                  bg={statusVariant[order.status] || "secondary"}
                  style={{
                    fontSize: "1rem",
                    verticalAlign: "middle",
                    padding: "0.5em 1em",
                    borderRadius: "20px",
                    fontWeight: 500,
                  }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              )}
            </Card.Title>
          </div>
          <Row className="mb-4">
            <Col xs={12} md={6} className="mb-2 mb-md-0">
              <div className="mb-2">
                <span className="order-label">Order ID:</span>
                <span className="order-value">{orderId}</span>
              </div>
              <div className="mb-2">
                <span className="order-label">Date:</span>
                <span className="order-value">{order.createdAt?.toDate?.().toLocaleString() || "N/A"}</span>
              </div>
              <div className="mb-2">
                <span className="order-label">Total:</span>
                <span className="order-value text-success fw-bold">${order.total?.toFixed(2) ?? "0.00"}</span>
              </div>
            </Col>
            <Col xs={12} md={6}>
              {order.customer && (
                <div>
                  <span className="order-label">Customer:</span>
                  <span className="order-value">{order.customer.name || "N/A"}</span>
                  <div className="order-customer-email text-muted">{order.customer.email || "No email"}</div>
                </div>
              )}
            </Col>
          </Row>
          <h5 className="mb-3" style={{ fontSize: "1.15rem", fontWeight: 600 }}>
            Items
          </h5>
          <div className="table-responsive">
            <Table size="sm" className="mb-0 order-detail-table align-middle table-borderless">
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={{ minWidth: 40 }}></th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.length ? (
                  order.items.map((item, idx) => (
                    <tr key={idx} className="order-item-row">
                      <td>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{
                              width: 40,
                              height: 40,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "1px solid #e3e6ea",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 40,
                              height: 40,
                              background: "#f1f3f6",
                              borderRadius: 8,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#b0b4bb",
                              fontSize: 18,
                            }}
                          >
                            <i className="bi bi-box"></i>
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 500 }}>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price?.toFixed(2)}</td>
                      <td className="fw-bold">${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
      {/* Inline styles for professional look */}
      <style>{`
        .order-detail-card {
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 2px 16px rgba(40, 60, 90, 0.07);
        }
        .order-label {
          font-weight: 500;
          color: #495057;
          margin-right: 0.5em;
        }
        .order-value {
          color: #212529;
        }
        .order-customer-email {
          font-size: 0.97em;
          margin-top: 2px;
        }
        .order-detail-table th,
        .order-detail-table td {
          font-size: 1rem !important;
          padding: 0.65rem 0.7rem !important;
          vertical-align: middle;
          word-break: break-word;
        }
        .order-detail-table th {
          color: #6c757d;
          font-weight: 600;
          border-bottom: 2px solid #e9ecef !important;
        }
        .order-detail-table td {
          border-top: 1px solid #f1f3f6 !important;
        }
        .order-item-row:hover {
          background: #f8fafc;
        }
        @media (max-width: 576px) {
          .order-detail-card {
            border-radius: 12px;
            box-shadow: 0 1px 6px rgba(40, 60, 90, 0.08);
          }
          .order-detail-table th,
          .order-detail-table td {
            font-size: 0.92rem !important;
            padding: 0.38rem 0.18rem !important;
          }
          .card-body {
            padding: 1rem !important;
          }
        }
        @media (max-width: 400px) {
          .order-detail-table th,
          .order-detail-table td {
            font-size: 0.82rem !important;
            padding: 0.12rem 0.08rem !important;
          }
        }
      `}</style>
    </AnimatedCard>
  );
};

export default OrderDetail;