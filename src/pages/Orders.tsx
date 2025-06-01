// Orders.tsx - Orders page that displays the user's orders

import React from "react";
import OrderList from "../components/Orders/OrderList";

// OrdersPage simply renders the OrderList component.
// You can add a heading or wrapper here if desired.
const OrdersPage: React.FC = () => (
  <div>
    <h2 className="mb-4">Your Orders</h2>
    <OrderList />
  </div>
);

export default OrdersPage;