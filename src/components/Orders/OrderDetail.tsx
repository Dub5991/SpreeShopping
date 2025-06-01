// OrderDetail.tsx - Shows details for a single order

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "../../firebase/firestore";
import { Card, Table, Spinner, Button, Alert, Badge } from "react-bootstrap";
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
      <Card className="mx-auto shadow-sm" style={{ maxWidth: 540, width: "100%" }}>
        <Card.Body style={{ fontSize: "1rem" }}>
          <Button
            variant="link"
            onClick={() => navigate(-1)}
            className="mb-3 p-0"
            style={{ fontSize: "1rem" }}
            aria-label="Back to orders"
          >
            &larr; Back
          </Button>
          <Card.Title className="mb-3" style={{ fontSize: "1.25rem" }}>
            Order Details
            {order.status && (
              <Badge
                className="ms-2"
                bg={statusVariant[order.status] || "secondary"}
                style={{ fontSize: "0.9rem", verticalAlign: "middle" }}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            )}
          </Card.Title>
          <div className="mb-2">
            <strong>Order ID:</strong> <span className="text-muted">{orderId}</span>
          </div>
          <div className="mb-2">
            <strong>Date:</strong>{" "}
            {order.createdAt?.toDate?.().toLocaleString() || "N/A"}
          </div>
          <div className="mb-2">
            <strong>Total:</strong>{" "}
            <span className="fw-bold text-success">${order.total?.toFixed(2) ?? "0.00"}</span>
          </div>
          {order.customer && (
            <div className="mb-2">
              <strong>Customer:</strong> {order.customer.name || "N/A"}{" "}
              <span className="text-muted" style={{ fontSize: "0.95em" }}>
                ({order.customer.email || "No email"})
              </span>
            </div>
          )}
          <h5 className="mt-4 mb-2" style={{ fontSize: "1.05rem" }}>
            Items
          </h5>
          <div className="table-responsive">
            <Table size="sm" className="mb-0 order-detail-table align-middle">
              <thead>
                <tr>
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
                    <tr key={idx}>
                      <td>
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 4 }}
                          />
                        ) : (
                          <span style={{ width: 32, display: "inline-block" }} />
                        )}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price?.toFixed(2)}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
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
      {/* Inline styles for responsive table and card */}
      <style>{`
        .order-detail-table th,
        .order-detail-table td {
          font-size: 0.95rem !important;
          padding: 0.45rem 0.6rem !important;
          vertical-align: middle;
          word-break: break-word;
        }
        .order-detail-table img {
          border: 1px solid #eee;
        }
        @media (max-width: 576px) {
          .card {
            border-radius: 15px;
            box-shadow: none;
          }
          .order-detail-table th,
          .order-detail-table td {
            font-size: 0.85rem !important;
            padding: 0.28rem 0.18rem !important;
          }
          .card-body {
            padding: 0.8rem !important;
          }
        }
        @media (max-width: 400px) {
          .order-detail-table th,
          .order-detail-table td {
            font-size: 0.75rem !important;
            padding: 0.12rem 0.08rem !important;
          }
        }
      `}</style>
    </AnimatedCard>
  );
};

export default OrderDetail;