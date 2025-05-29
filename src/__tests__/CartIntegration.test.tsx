// INTEGRATION TEST: Checks Cart updates when adding a product

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductList from "../components/Products/ProductList";

// Mock getProducts to return a single product
jest.mock("../firebase/firestore", () => ({
  getProducts: () => ({
    then: (cb: any) =>
      cb({
        docs: [
          {
            id: "1",
            data: () => ({
              name: "Test Product",
              price: 10,
              stock: 5,
              category: "Test",
              imageUrl: "",
            }),
          },
        ],
      }),
  }),
}));

test("adds product to cart and updates cart", async () => {
  render(<ProductList />);
  const addButton = await screen.findByRole("button", { name: /add/i });
  fireEvent.click(addButton);
  // Adjust the text below to match your cart update feedback
  expect(await screen.findByText(/added to cart/i)).toBeInTheDocument();
});