// Orders page that displays the user's orders

import React from "react";
import OrderList from "../components/Orders/OrderList";

/**
 * OrdersPage
 * Renders a heading and the OrderList component.
 */
const OrdersPage: React.FC = () => (
  <div>
    <h2 className="mb-4">Your Orders</h2>
    <OrderList />
  </div>
);

export default OrdersPage;