import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "SAYOLA KAYBEE GLOBAL LIMITED | ...Creating Wealth",
    template: "%s | SAYOLA KAYBEE GLOBAL LIMITED",
  },
  description:
    "SAYOLA KAYBEE GLOBAL LIMITED is a Nigerian real estate and logistics company focused on creating wealth through property development, management and dependable logistics solutions.",
  keywords: [
    "Sayola Kaybee Global Limited",
    "Sayola Kaybee",
    "real estate Nigeria",
    "property development Nigeria",
    "property management Nigeria",
    "logistics Nigeria",
    "haulage Nigeria",
  ],
  openGraph: {
    title: "SAYOLA KAYBEE GLOBAL LIMITED | ...Creating Wealth",
    description:
      "Real Estate and Logistics solutions built around creating wealth.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
