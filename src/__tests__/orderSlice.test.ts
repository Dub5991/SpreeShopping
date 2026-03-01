/**
 * Unit tests for the orderSlice Redux reducer.
 */
import orderReducer, { setOrders, clearOrders } from "../redux/orderSlice";

const initialState = { orders: [] };

describe("orderSlice", () => {
  it("returns the initial state", () => {
    expect(orderReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("setOrders stores provided orders", () => {
    const orders = [
      { id: "o1", userId: "u1", total: 29.99, items: [] },
    ];
    const state = orderReducer(initialState, setOrders(orders));
    expect(state.orders).toEqual(orders);
  });

  it("clearOrders resets orders to empty array", () => {
    const populated = { orders: [{ id: "o1", userId: "u1", total: 29.99, items: [] }] };
    const state = orderReducer(populated, clearOrders());
    expect(state.orders).toEqual([]);
  });
});
