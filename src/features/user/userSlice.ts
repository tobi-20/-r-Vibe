import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  username: "",
  isAuthenticated: false,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

// Async action for signup
export const signup = createAsyncThunk(
  "user/signup",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Simulate API call (replace with real API)
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error("Signup failed");
      return await response.json(); // { username }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async action for login
export const login = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Simulate API call (replace with real API)
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error("Login failed");
      return await response.json(); // { username }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the user slice with a single reducer using switch
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: (state, action) => {
    switch (action.type) {
      case "user/updateName":
        const newName = action.payload.trim();
        if (newName.length > 0) {
          state.username = newName;
        }
        break;
      case "user/resetUser":
        state.username = "";
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
        break;
      case signup.pending.type:
        state.status = "loading";
        state.error = null;
        break;
      case signup.fulfilled.type:
        state.status = "succeeded";
        state.username = action.payload.username;
        state.isAuthenticated = true;
        state.error = null;
        break;
      case signup.rejected.type:
        state.status = "failed";
        state.error = action.payload;
        break;
      case login.pending.type:
        state.status = "loading";
        state.error = null;
        break;
      case login.fulfilled.type:
        state.status = "succeeded";
        state.username = action.payload.username;
        state.isAuthenticated = true;
        state.error = null;
        break;
      case login.rejected.type:
        state.status = "failed";
        state.error = action.payload;
        break;
      default:
        return state; // Return unchanged state for unhandled actions
    }
  },
});

// Export action creators
export const { updateName, resetUser } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;
