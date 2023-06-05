import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlicer';
import tokensReducer from './features/tokenSlicer';

export const store = configureStore({
    reducer: {
        user: userReducer,
        tokens: tokensReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
