import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhoneMatch – Find Your Perfect Smartphone",
  description: "Tell us what matters most and we'll recommend the best phone for you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}
