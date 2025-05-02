import { Inter } from "next/font/google";

import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NextLeap",
  description: "Take your career to next level",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}  `}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col mx-auto">
              <Header />
              <main className="min-h-screen p-20 w-full mx-auto flex flex-col ">
                {children}
              </main>
              <Toaster richColors />
              <footer className="my-12 w-full bg-background">
                <div className="mx-auto px-4 text-center text-gray-400">
                  Made with Next.js
                </div>
              </footer>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
