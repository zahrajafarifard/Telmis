import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchValueState: string;
  searchItemState: [];
}

const initialState: SearchState = {
  searchValueState: "",
  searchItemState: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchItem: (
      state,
      action: PayloadAction<{ result: []; searchValue: string }>
    ) => {
      state.searchItemState = [...action?.payload?.result];
      state.searchValueState = action?.payload?.searchValue;
    },
    clearSearchItems: (state) => {
      state.searchItemState = [];
    },
  },
});

export const { setSearchItem, clearSearchItems } = searchSlice.actions;
export default searchSlice.reducer;
