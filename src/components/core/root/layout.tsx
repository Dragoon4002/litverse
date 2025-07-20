"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "@/lib/client-thirdweb";
import { useTheme } from "next-themes";
import { defineChain } from "thirdweb/chains";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { motion } from "framer-motion";
import { Audiowide } from "next/font/google";

const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const tBnb = defineChain({
    id: 97,
  });

  const activeAccount = useActiveAccount();


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Subtle grid background */}
      <div className="fixed inset-0 z-0">
        {/*<div
          className="absolute inset-0 bg-[linear-gradient(to_right,#ccffd9_2px,transparent_2px),linear-gradient(to_bottom,#ccffe3_2px,transparent_2px)] dark:bg-[linear-gradient(to_right,#4f4f4f20_2px,transparent_2px),linear-gradient(to_bottom,#4f4f4f20_2px,transparent_2px)] bg-[size:24px_24px]"
          style={{
            maskImage:
              "radial-gradient(ellipse 50% 50% at 50% 50%, #000 50%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 50% 50% at 50% 50%, #000 50%, transparent 100%)",
          }}
        />
        */}
        <AuroraBackground className="absolute inset-0 z-0" showRadialGradient>
          <motion.div
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          ></motion.div>
        </AuroraBackground>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-5 z-50 grid place-items-center">
          <div 
            className={`container mx-auto px-8 py-2 backdrop-blur-xl max-w-[80vw] glass rounded-lg shadow-2xl ${theme === "dark" ? "bg-zinc-800/40" : "bg-white/40"}`}
          >
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <Link href={"/"}>
                  <h1 className={`text-2xl font-bold dark:text-emerald-50 text-zinc-900 ${audiowide.className}`}>
                    Litverse<span className="text-emerald-500 font-bold">.</span>
                  </h1>
                </Link>
                {activeAccount !== undefined ? (
                  <nav className="hidden md:flex items-center gap-6">
                    <Link
                      href="/host-event"
                      className="text-gray-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                    >
                      Host Event
                    </Link>
                    <Link
                      href="/your-events"
                      className="text-gray-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                    >
                      Your Events
                    </Link>
                    <Link
                      href={"/dashboard"}
                      className="text-gray-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                    >
                      Dashboard
                    </Link>
                  </nav>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex items-center gap-4">
                {/* <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <Bell className="h-5 w-5" />
                </Button> */}
                <ThemeToggle />
                <ConnectButton
                  theme={theme === "light" ? "light" : "dark"}
                  client={client}
                  appMetadata={{
                    name: "LitVerse",
                    url: "http://localhost:3000",
                  }}
                  chains={[tBnb]}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>
      </div>
    </div>
  );
}
