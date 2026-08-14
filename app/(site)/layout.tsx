import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JuliaChatbot from "@/components/JuliaChatbot";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <JuliaChatbot />
    </>
  );
}
