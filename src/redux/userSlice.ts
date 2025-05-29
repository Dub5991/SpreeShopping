import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type UserType = {
  uid: string;
  email: string;
  displayName: string;
  phone: string;
  address: string;
  avatarUrl: string;
} | null;

interface UserState {
  user: UserType;
  isAuthenticated: boolean;
  status: string;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserType>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
    },
    setStatus(state, action: PayloadAction<string>) {
      state.status = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setUser, clearUser, setStatus, setError } = userSlice.actions;
export default userSlice.reducer;