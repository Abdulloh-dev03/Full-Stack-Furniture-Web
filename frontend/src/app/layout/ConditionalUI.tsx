"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "../Header/Navbar";
import Footer from "../Pages/Footer";
import Providers from "../providers";

export default function LayoutWithConditionalUI({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const excludedPaths = ["/login", "/signup", "/404", "/not-found"];
  const hideLayout = excludedPaths.includes(pathname) || pathname.startsWith("/admin");

  return (
    <Providers>
      {!hideLayout && <Navbar />}
      <main>{children}</main>
      {!hideLayout && <Footer />}
    </Providers>
  );
}
