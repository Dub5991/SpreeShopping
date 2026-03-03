import { act, render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Profile from "../components/User/Profile";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/userSlice";

// Return a Promise so React 19 can properly schedule the resulting state updates
// inside act(). A synchronous return causes "not wrapped in act()" warnings
// because the state updates fire in a microtask outside the initial render.
jest.mock("../firebase/firestore", () => ({
  getUserDoc: () => Promise.resolve({
    exists: () => true,
    data: () => ({
      email: "test@example.com",
      displayName: "Test User",
      phone: "1234567890",
      address: "123 Main St",
      avatarUrl: "",
      createdAt: { toDate: () => new Date("2023-01-01") },
    }),
  }),
  updateUserProfile: jest.fn(),
}));

test("renders Profile with user info", async () => {
  const mockStore = configureStore({
    reducer: { user: userReducer },
    preloadedState: {
      user: {
        user: {
          uid: "abc123",
          email: "test@example.com",
          displayName: "Test User",
          phone: "1234567890",
          address: "123 Main St",
          avatarUrl: "",
          role: "user",
        },
        isAuthenticated: true,
        status: "succeeded",
        error: null,
      },
    },
  });

  // Wrapping render in act(async) tells React to process all pending promises
  // and resulting state updates (setProfile, setForm, setAvatarUrl, setLoading)
  // before the assertion, eliminating "not wrapped in act()" warnings.
  await act(async () => {
    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <Profile />
        </Provider>
      </MemoryRouter>
    );
  });

  await waitFor(() =>
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
  );
});