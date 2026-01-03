import type { Metadata } from "next";
import { Inter, Merriweather } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const merriweather = Merriweather({ 
  subsets: ["latin"], 
  weight: ["300", "400", "700", "900"],
  variable: "--font-serif" 
});

export const metadata: Metadata = {
  title: "Vitals | Blood Donation Management System",
  description: "A comprehensive platform for donors, hospitals, and administrators to manage blood donations efficiently.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
