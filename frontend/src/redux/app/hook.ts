import { type TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
// Update the import path below to the actual path of your store file
import type { RootState, AppDispatch } from "./store"

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
