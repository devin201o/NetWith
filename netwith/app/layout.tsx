import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NetWith",
  description: "A networking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* 2. ADDED NAVIGATION STRUCTURE */}
        <header className="p-4 bg-[#252456] text-white">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            
            {/* Project Name/Logo Placeholder SINCE ITS A HACKATHONE AND WE DONT HAVE TIME TI MAKE ONE*/}
            <div className="text-xl font-bold">NetWith</div>

            
          </nav>
        </header>
        
        {children}
      </body>
    </html>
  );
}