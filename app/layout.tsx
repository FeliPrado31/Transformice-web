import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import Navigation from "@/components/organisms/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transformice Private Server - Play Now",
  description:
    "Play Transformice in your browser with Ruffle emulator. Join our private server and compete with other players!",
  keywords: "transformice, private server, flash game, ruffle, browser game",
  authors: [{ name: "Transformice Private Server" }],
  openGraph: {
    title: "Transformice Private Server",
    description: "Play Transformice in your browser",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
