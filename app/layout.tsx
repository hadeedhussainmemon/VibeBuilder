import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VibeBuilder | Elite AI Website Generator",
  description: "Transform your vision into premium, production-ready websites in seconds. Powered by Groq Llama-3.3 AI.",
  metadataBase: new URL("https://vibe-builder-seven.vercel.app"),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "VibeBuilder | Elite AI Website Generator",
    description: "Instant generation of ultra-premium AI websites. Zero code, maximum vibe.",
    url: "https://vibe-builder-seven.vercel.app",
    siteName: "VibeBuilder",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeBuilder | Elite AI Website Generator",
    description: "The world's fastest high-end AI website builder.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
