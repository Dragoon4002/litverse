"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { ConnectButton, useActiveAccount } from "thirdweb/react";
import { client } from "@/lib/client-thirdweb";
import { useTheme } from "next-themes";
import { defineChain } from "thirdweb/chains";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const tBnb = defineChain({
    id: 97,
  });

  const activeAccount = useActiveAccount();

  console.log(activeAccount);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Subtle grid background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#ccffd9_1px,transparent_1px),linear-gradient(to_bottom,#ccffe3_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4f4f4f20_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f20_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{
            maskImage:
              "radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 50% 50% at 50% 50%, #000 70%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-8">
                <Link href={"/"}>
                  <h1 className="text-2xl font-bold dark:text-emerald-50 text-zinc-900">
                    Litverse<span className="text-emerald-500">.</span>
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
                  theme={theme == "dark" ? "dark" : "light"}
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
