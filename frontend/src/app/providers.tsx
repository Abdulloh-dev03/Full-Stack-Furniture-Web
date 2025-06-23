"use client";

import { Provider } from "react-redux";
import { store } from "../redux/app/store"; // adjust this path if needed

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
