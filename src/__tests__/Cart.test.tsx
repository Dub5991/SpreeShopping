/**
 * Integration test for Cart functionality.
 * Ensures that adding a product updates the cart UI and localStorage.
 */

// @ts-ignore
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CartPage from "../pages/Cart";
import ProductList from "../components/Products/ProductList";
import { BrowserRouter } from "react-router-dom";

// Mock localStorage for cart
beforeEach(() => {
  localStorage.clear();
});

// Mock Redux store and user
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: () => ({ uid: "test-user" }),
}));

// Mock Firebase Firestore functions
jest.mock("../firebase/firestore", () => ({
  getProducts: jest.fn().mockResolvedValue({
    docs: [
      {
        id: "prod1",
        data: () => ({
          name: "Test Product",
          price: 10,
          stock: 5,
          imageUrl: "",
          category: "TestCat",
        }),
      },
    ],
  }),
  addOrder: jest.fn().mockResolvedValue({}),
  updateProduct: jest.fn().mockResolvedValue({}),
}));

describe("Cart Integration", () => {
  it("updates cart when a product is added", async () => {
    // Render ProductList and CartPage in the same router context
    render(
      <BrowserRouter>
        <ProductList />
        <CartPage />
      </BrowserRouter>
    );

    // Wait for product to appear and add to cart
    const addButton = await screen.findByRole("button", { name: /add/i });
    fireEvent.click(addButton);

    // Simulate the custom event to notify cart update (if your app uses it)
    window.dispatchEvent(new CustomEvent("cart:added", { detail: { name: "Test Product" } }));

    // Wait for CartPage to reflect the added product
    await waitFor(() => {
      expect(screen.getByText(/Test Product/i)).toBeInTheDocument();
    });

    // The cart total should reflect the product price
    expect(screen.getByText(/\$10/)).toBeInTheDocument();

    // localStorage should be updated
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    expect(cart.length).toBeGreaterThan(0);
    expect(cart[0].name).toBe("Test Product");
  });
});