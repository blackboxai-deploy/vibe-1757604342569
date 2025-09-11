import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { RoleNavigation } from "@/components/RoleNavigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "P2P Financial Matching",
  description: "Peer-to-peer financial matching platform with role-based access",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RoleNavigation />
          <div className="min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}