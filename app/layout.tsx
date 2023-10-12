import { SocketProvider } from "@/context/SocketProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { RoomProvider } from "@/context/RoomProvider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Google Meet Clone",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <SocketProvider>
          <RoomProvider>{children}</RoomProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
