// UNIT TEST: Checks ProductList renders with no products

import React from "react";
import { render, screen } from "@testing-library/react";
import ProductList from "../components/Products/ProductList";

// Mock getProducts to return no products
jest.mock("../firebase/firestore", () => ({
  getProducts: () => ({
    then: (cb: any) => cb({ docs: [] }),
  }),
}));

test("renders ProductList with no products", async () => {
  render(<ProductList />);
  // Adjust the text below to match your ProductList's empty state message
  expect(await screen.findByText(/no products found/i)).toBeInTheDocument();
});