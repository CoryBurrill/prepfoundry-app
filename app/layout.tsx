// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "PrepFoundry",
  description: "The kitchen brain you don't have to think about.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <SiteHeader />

            <div className="flex-1 flex flex-col">
              {children}
            </div>

            <Suspense
              fallback={
                <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16 text-muted-foreground">
                  Loading footer…
                </footer>
              }
            >
              <SiteFooter />
            </Suspense>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}