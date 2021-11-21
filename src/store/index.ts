import { configureStore } from "@reduxjs/toolkit";
import {
    TypedUseSelectorHook,
    useDispatch,
    useSelector
} from "react-redux";
import mainSlice from "./main.slice";

const store = configureStore({
    reducer: {
        main: mainSlice
    }
});

type RootState = ReturnType<typeof store.getState>;

type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;