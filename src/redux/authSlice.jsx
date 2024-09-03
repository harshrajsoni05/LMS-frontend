import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: localStorage.getItem('role') || '',  // 'admin' or 'user'
  userName: localStorage.getItem('userName') || '',
  token: localStorage.getItem('token') || '',  // JWT token
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem('role', action.payload);  // Store role in localStorage
    },


    setUserName: (state, action) => {
      state.userName = action.payload;
      localStorage.setItem('userName', action.payload);  // Store userName in localStorage
    },


    loginSuccess: (state, action) => {
      const { role, userName, token } = action.payload;
      state.role = role;
      state.userName = userName;
      state.token = token;
      localStorage.setItem('role', role);  
      localStorage.setItem('userName', userName);  
      localStorage.setItem('token', token)
    },


    logout: (state) => {
      state.role = '';
      state.userName = '';
      state.token = '';
      localStorage.removeItem('role');
      localStorage.removeItem('userName');  //
      localStorage.removeItem('token'); 
    },
  },
});

export const { setRole, setUserName, loginSuccess, logout } = userSlice.actions;
export default userSlice.reducer;
