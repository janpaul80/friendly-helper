import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { SyncUser } from "@/components/auth/SyncUser";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HEFTCoder - Where ideas become reality",
  description: "The most powerful autonomous AI agents for building production-ready applications in minutes.",
  icons: {
    icon: "/assets/hc-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased dark font-sans`}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#ff6b35",
            }
          }}
        >
          <SyncUser />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
