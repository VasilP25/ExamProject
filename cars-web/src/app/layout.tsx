import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "../components/site-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cars App",
  description: "Public pages for login, registration, and home navigation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-gradient-to-br from-sky-200 via-cyan-100 to-orange-200 text-slate-950">
        <SiteHeader />
        <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
        <footer className="border-t border-slate-200 bg-white/90 px-4 py-6 text-center text-sm text-slate-500 sm:px-6">
          &copy; {new Date().getFullYear()} Cars App. Public access pages for authentication and discovery.
        </footer>
      </body>
    </html>
  );
}
