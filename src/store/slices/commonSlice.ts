import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
  name: "common",
  initialState: {
    appReady: true,
  },
  reducers: {},
});

export default commonSlice.reducer;
