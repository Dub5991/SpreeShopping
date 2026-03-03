/**
 * Unit tests for the userSlice Redux reducer.
 */
import userReducer, { setUser, clearUser, setStatus, setError } from "../redux/userSlice";

const initialState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const mockUser = {
  uid: "u1",
  email: "test@example.com",
  displayName: "Test User",
  phone: "555-0100",
  address: "1 Main St",
  avatarUrl: "",
  role: "user",
};

describe("userSlice", () => {
  it("returns the initial state", () => {
    expect(userReducer(undefined, { type: "@@INIT" })).toEqual(initialState);
  });

  it("setUser stores the user and marks as authenticated", () => {
    const state = userReducer(undefined, setUser(mockUser));
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.status).toBe("succeeded");
    expect(state.error).toBeNull();
  });

  it("setUser with null marks as unauthenticated", () => {
    const populated = { ...initialState, user: mockUser, isAuthenticated: true, status: "succeeded" };
    const state = userReducer(populated, setUser(null));
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("clearUser resets to initial state", () => {
    const populated = { ...initialState, user: mockUser, isAuthenticated: true, status: "succeeded" };
    const state = userReducer(populated, clearUser());
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.status).toBe("idle");
    expect(state.error).toBeNull();
  });

  it("setStatus updates the status field", () => {
    const state = userReducer(undefined, setStatus("loading"));
    expect(state.status).toBe("loading");
  });

  it("setError stores an error message", () => {
    const state = userReducer(undefined, setError("Invalid credentials"));
    expect(state.error).toBe("Invalid credentials");
  });

  it("setError with null clears the error", () => {
    const withError = { ...initialState, error: "Some error" };
    const state = userReducer(withError, setError(null));
    expect(state.error).toBeNull();
  });
});
