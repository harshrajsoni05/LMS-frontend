
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: '',  // 'admin' or 'user'
  userName: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
    logout: (state) => {
      state.role = '';
      state.userName = '';
    },
    // other reducers as needed
  },
});

export const { setRole, setUserName, logout } = userSlice.actions;
export default userSlice.reducer;
