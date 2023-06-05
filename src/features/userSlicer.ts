import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import type { RootState } from '../store'
import {SafeUser} from "package-types";

interface UserState {
    value?: SafeUser;
}

const initialState: UserState = {

}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<SafeUser>) => {
            state.value = action.payload;
        },
        removeUser: (state) => {
            state.value = undefined;
        },
    }
})

export const { setUser, removeUser } = userSlice.actions

export const selectUser = (state: RootState) => state.user.value

export default userSlice.reducer
