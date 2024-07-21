import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Arcade Points Calculator",
  description: "A Next.js web app based on web scraping to help you calculate the Arcade Points you have earned.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={inter.className}>{children}</body>
    </html>
  );
}
