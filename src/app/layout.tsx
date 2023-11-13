import "./globals.css";
import NavBar from "../components/sections/NavBar";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { cn } from "../libs/libs";
export const metadata = {
  title: "Matcha Clone",
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          inter.className,
          "bg-gradient-to-b from-orange-50 to-white"
        )}
      >
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
