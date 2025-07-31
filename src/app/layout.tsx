import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "DNA Archive Management",
  description: "Secure DNA archive management system",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
