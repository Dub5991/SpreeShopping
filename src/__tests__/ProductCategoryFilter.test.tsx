// @ts-ignore
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import App from "../App";

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
  render(<App />);
  // Navigate to products page if needed, or ensure it's the default route
  const addButton = await screen.findByRole("button", { name: /add/i });
  fireEvent.click(addButton);
  // Assert feedback toast appears (use a flexible matcher)
  expect(await screen.findByText((content) => /added to cart/i.test(content))).toBeInTheDocument();
});