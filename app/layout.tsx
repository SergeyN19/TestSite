import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "ЕНА ГРУПП — ремонт квартир в Москве и МО",
  description:
    "Ремонт квартир в Москве и Подмосковье: фиксированная смета, гарантия 10 лет, выезд замерщика бесплатно.",
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
