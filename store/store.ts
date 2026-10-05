import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { api } from './api';

export const makeStore = () => configureStore({ reducer: { [api.reducerPath]: api.reducer }, middleware: (g) => g().concat(api.middleware) });
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch: () => AppDispatch = useDispatch;
