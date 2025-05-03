"use client";

import "@/styles/globals.css";
import { Arima, Roboto } from "next/font/google";
import { SessionProvider } from "next-auth/react";

const arima = Arima({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-arima",
});
const roboto = Roboto({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${arima.variable} ${roboto.variable} antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}