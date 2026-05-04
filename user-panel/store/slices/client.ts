import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClientState {
  token: string;
}

const initialState: ClientState = {
  token: "",
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    client: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    logOut: (state) => {
      state.token = "";
    },
  },
});

export const { client, logOut } = clientSlice.actions;
export default clientSlice.reducer;
