import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "./fonts/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/inter-cyrillic-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter-cyrillic-700-normal.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Разумная изба — умный дом просто",
  description:
    "Система умного дома «Разумная изба»: безопасность, свет, климат, ворота, сценарии и удобное управление из телефона, Telegram и Алисы.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
