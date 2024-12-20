import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { ThirdwebProvider } from "thirdweb/react";
import { Toaster } from "@/components/ui/toaster";
import { BaseLayout } from "@/components/core";
import { ThemeProvider } from "@/components/core/theme-provider";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Litverse",
  description: "A place to host and share your events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThirdwebProvider>
            <Toaster />
            <BaseLayout>{children}</BaseLayout>
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
