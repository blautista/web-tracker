import type { AppDispatch, RootState } from "./store";

type CreateThunkCallback<Arg = void, Res = void> = (
  arg: Arg,
  { dispatch, getState }: { dispatch: AppDispatch; getState: () => RootState },
) => Res;

export function createThunk<Arg = void, Res = void>(cb: CreateThunkCallback<Arg, Res>) {
  return (arg: Arg) => (dispatch: AppDispatch, getState: () => RootState) =>
    cb(arg, { dispatch, getState });
}
