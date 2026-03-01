/**
 * Unit tests for the productSlice Redux reducer.
 */
import productReducer, { setProducts, clearProducts } from "../redux/productSlice";

const initialState = { items: [] };

describe("productSlice", () => {
  it("returns the initial state", () => {
    expect(productReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("setProducts stores provided items", () => {
    const products = [
      { id: "p1", name: "Widget", price: 9.99, stock: 10, category: "Misc" },
    ];
    const state = productReducer(initialState, setProducts(products));
    expect(state.items).toEqual(products);
  });

  it("clearProducts resets items to empty array", () => {
    const populated = { items: [{ id: "p1", name: "Widget", price: 9.99, stock: 10, category: "Misc" }] };
    const state = productReducer(populated as unknown as ReturnType<typeof productReducer>, clearProducts());
    expect(state.items).toEqual([]);
  });
});
