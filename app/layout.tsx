import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deal",
  description: "A simple POS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className=" h-full antialiased">
      <body className=" bg-[#777777] font-mono min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
