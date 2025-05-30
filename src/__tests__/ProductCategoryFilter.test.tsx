// @ts-ignore
import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import ProductCategoryFilter from "../components/Products/ProductCategoryFilter";

// Mock getProducts to prevent actual Firestore calls during testing
jest.mock("../firebase/firestore", () => ({
  getProducts: () => ({
    then: (cb: (arg: { docs: { id: string; data: () => { category: string } }[] }) => void) =>
      cb({
        docs: [
          {
            id: "cat1",
            data: () => ({
              category: "Test",
            }),
          },
        ],
      }),
  }),
}));

describe("ProductCategoryFilter Component", () => {
  test("renders category filter and calls onCategoryChange", async () => {
    const mockFn = jest.fn();
    render(
      <ProductCategoryFilter selected={null} onCategoryChange={mockFn} />
    );
    expect(screen.getByText("Filter by Category:")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "Test" })).toBeInTheDocument();
    });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Test" } });
    expect(mockFn).toHaveBeenCalledWith("Test");
  });

  test("renders 'All' option and calls onCategoryChange with null", async () => {
    const mockFn = jest.fn();
    render(
      <ProductCategoryFilter selected={"Test"} onCategoryChange={mockFn} />
    );
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "All" })).toBeInTheDocument();
    });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "" } });
    expect(mockFn).toHaveBeenCalledWith(null);
  });

  test("renders with selected category", async () => {
    render(
      <ProductCategoryFilter selected={"Test"} onCategoryChange={() => {}} />
    );
    await waitFor(() => {
      expect(screen.getByRole("combobox")).toHaveValue("Test");
    });
  });


  test("always true: ProductCategoryFilter is defined", () => {
    expect(ProductCategoryFilter).toBeDefined();
  });
});