import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import ProductCategoryFilter from "../components/Products/ProductCategoryFilter";

// Mock getProducts to return categories
jest.mock("../firebase/firestore", () => ({
  getProducts: () => ({
    then: (cb: (arg: any) => void) =>
      cb({
        docs: [
          { data: () => ({ category: "Electronics" }) },
          { data: () => ({ category: "Clothing" }) },
        ],
      }),
  }),
}));

test("renders category filter and selects category", async () => {
  const handleChange = jest.fn();
  render(<ProductCategoryFilter selected={null} onCategoryChange={handleChange} />);
  expect(await screen.findByText(/filter by category/i)).toBeInTheDocument();
  // Select "Electronics"
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "Electronics" } });
  expect(handleChange).toHaveBeenCalledWith("Electronics");
});