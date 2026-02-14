import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HHS Open Data API Gateway",
  description: "Community-friendly API access to opendata.hhs.gov"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
