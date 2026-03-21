import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rich Valley Adventures & Aspen Alpenglow Limousine",
  description:
    "Premium outdoor adventures and luxury limousine services in the Aspen/Roaring Fork Valley.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
