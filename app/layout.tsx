import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Magia Beasts",
  description: "Battle each other using beasts from the world of Gaia!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased bg-white text-neutral-800`}>
        {children}
      </body>
    </html>
  );
}
