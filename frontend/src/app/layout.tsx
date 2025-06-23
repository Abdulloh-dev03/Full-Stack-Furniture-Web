import type { Metadata } from "next"

import "./globals.css"
import LayoutWithConditionalUI from "./layout/ConditionalUI"


export const metadata: Metadata = {
  title: "Funiro - Modern Furniture Store",
  description: "High quality furniture made with modern design",
  icons: {
    icon: "/favicon.ico.png", 
  },
};


// ✅ Move this to a Client Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`font-mono antialiased`}>
        <LayoutWithConditionalUI>{children}</LayoutWithConditionalUI>
      </body>
    </html>
  )
}
