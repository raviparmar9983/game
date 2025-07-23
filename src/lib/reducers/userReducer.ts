import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePic?: string;
}

const initialState: UserState = {
  _id: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
};

export const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return { ...state, ...action.payload };
    },
    clearUser: () => initialState,
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
