import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Write with Milo - Public Build",
  description: "A public-safe view of the Write with Milo student writing interface."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
