
// Tell TypeScript to ignore the unused import for this file
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Profile from "../components/User/Profile";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../redux/userSlice";

// Helper to flush pending promises (Jest/JSDOM safe)
const flushPromises = () => new Promise(res => setTimeout(res, 0));

// Mock getUserDoc as before
jest.mock("../firebase/firestore", () => ({
  getUserDoc: () => ({
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
        },
        isAuthenticated: true,
        status: "succeeded",
        error: null,
      },
    },
  });

  render(
    <Provider store={mockStore}>
      <Profile />
    </Provider>
  );

  await flushPromises();

  await waitFor(() =>
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
  );
});