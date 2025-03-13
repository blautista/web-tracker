import { configureStore } from "@reduxjs/toolkit";
import { syncTransport } from "../components/Transport/slice/sync.ts";
import transportSlice from "../components/Transport/slice/transportSlice.ts";
import instrumentsSlice from "../components/instruments/instrumentsSlice.ts";
import { makeFakeInitialState } from "./fakeInitialState.ts";

const store = configureStore({
  reducer: {
    [transportSlice.name]: transportSlice.reducer,
    [instrumentsSlice.name]: instrumentsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

syncTransport(store.dispatch);
makeFakeInitialState(store.dispatch, store.getState);

export default store;
