import transportSlice from "../components/Transport/transportSlice.ts";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import instrumentsSlice, {
  addInstrument,
  addNotesToInstrument,
} from "../components/Transport/instrumentsSlice.ts";

const store = configureStore({
  reducer: {
    [transportSlice.name]: transportSlice.reducer,
    [instrumentsSlice.name]: instrumentsSlice.reducer,
  },
});

store.dispatch(addInstrument({ type: "square" }));

store.dispatch(
  addNotesToInstrument({
    instrumentId: store.getState().instruments.ids[0],
    notes: [
      { time: "0:0:2", note: "C4" },
      { time: "0:1:0", note: "C4" },
      { time: "0:1:3", note: "D4" },
      { time: "0:2:2", note: "C4" },
      { time: "0:3:0", note: "C4" },
      { time: "0:3:2", note: "G3" },
    ],
  }),
);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
