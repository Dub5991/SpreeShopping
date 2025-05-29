// @ts-ignore
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { BrowserRouter } from "react-router-dom";
import ProductList from "../components/Products/ProductList";

// Mock getProducts to return a single product
jest.mock("../firebase/firestore", () => ({
  getProducts: () => ({
    then: (cb: (arg: any) => void) =>
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
  render(
    <BrowserRouter>
      <ProductList />
    </BrowserRouter>
  );
  // Find the add button for the product
  const addButton = await screen.findByRole("button", { name: /add/i });
  fireEvent.click(addButton);
  // Assert feedback toast appears
  expect(await screen.findByText(/added to cart/i)).toBeInTheDocument();
});