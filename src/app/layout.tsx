import type { Metadata } from "next";
import { Providers } from "@/components/Provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mock Interview",
  description: "A platform for practicing technical interviews.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className="">
          {children}
        </body>
      </Providers>
    </html>
  );
}
