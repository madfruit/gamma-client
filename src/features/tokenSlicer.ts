import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export interface Tokens {
    access: string;
    refresh: string;
}

interface TokensState {
    value?: Tokens;
}

const initialState: TokensState = {

}

export const tokensSlice = createSlice({
    name: 'tokens',
    initialState,
    reducers: {
        setTokens: (state, action: PayloadAction<Tokens>) => {
            state.value = action.payload;
        },
        removeTokens: (state, action: PayloadAction<Tokens>) => {
            state.value = undefined;
        },
    }
})

export const { setTokens, removeTokens } = tokensSlice.actions

export const selectTokens = (state: RootState) => state.user.value

export default tokensSlice.reducer
