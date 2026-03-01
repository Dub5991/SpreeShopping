/**
 * Integration test for the ProductList component.
 * Verifies that products fetched from Firestore are rendered,
 * that category filtering works, and that adding to cart dispatches the event.
 */
// @ts-ignore
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import ProductList from "../components/Products/ProductList";

// Mock Firebase Firestore
jest.mock("../firebase/firestore", () => ({
  getProducts: jest.fn().mockResolvedValue({
    docs: [
      {
        id: "prod1",
        data: () => ({
          name: "Gadget Pro",
          price: 49,
          stock: 8,
          imageUrl: "",
          category: "Electronics",
          description: "A great gadget.",
        }),
      },
      {
        id: "prod2",
        data: () => ({
          name: "Cozy Blanket",
          price: 25,
          stock: 0,
          imageUrl: "",
          category: "Home",
          description: "Very cozy.",
        }),
      },
    ],
  }),
}));

const renderProductList = (category?: string | null) =>
  render(
    <BrowserRouter>
      <ProductList category={category} />
    </BrowserRouter>
  );

describe("ProductList integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders all products when no category filter is applied", async () => {
    renderProductList();
    await waitFor(() => {
      expect(screen.getByText("Gadget Pro")).toBeInTheDocument();
      expect(screen.getByText("Cozy Blanket")).toBeInTheDocument();
    });
  });

  it("filters products by category", async () => {
    renderProductList("Electronics");
    await waitFor(() => {
      expect(screen.getByText("Gadget Pro")).toBeInTheDocument();
      expect(screen.queryByText("Cozy Blanket")).not.toBeInTheDocument();
    });
  });

  it("shows 'Out of stock' badge for zero-stock products", async () => {
    renderProductList();
    await waitFor(() => {
      expect(screen.getByText("Out of stock")).toBeInTheDocument();
    });
  });

  it("adds a product to the cart when Add button is clicked", async () => {
    const cartEvents: string[] = [];
    window.addEventListener("cart:added", (e) => {
      cartEvents.push((e as CustomEvent).detail.name);
    });

    renderProductList();

    const addButtons = await screen.findAllByRole("button", { name: /add/i });
    // Click the first enabled Add button (Gadget Pro, stock > 0)
    fireEvent.click(addButtons[0]);

    expect(cartEvents).toContain("Gadget Pro");

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    expect(cart.length).toBeGreaterThan(0);
    expect(cart[0].name).toBe("Gadget Pro");
  });
});
