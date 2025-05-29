// UNIT TEST: Checks Profile renders user info

import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "../components/User/Profile";
import { Provider } from "react-redux";
import { store } from "../redux/store";

// Mock getUserDoc to return a user profile
jest.mock("../../src/firebase/firestore", () => ({
  getUserDoc: () => ({
    exists: () => true,
    data: () => ({
      email: "test@example.com",
      displayName: "Test User",
      phone: "1234567890",
      address: "123 Main St",
      avatarUrl: "",
    }),
  }),
  updateUserProfile: jest.fn(),
}));

test("renders Profile with user info", async () => {
  render(
    <Provider store={store}>
      <Profile />
    </Provider>
  );
  expect(await screen.findByText(/test@example.com/i)).toBeInTheDocument();
});