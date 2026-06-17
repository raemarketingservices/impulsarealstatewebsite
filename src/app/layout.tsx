import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://somosimpulsarealstate.com"),
  title: {
    default: "IMPULSA Real Estate | Inversión Inmobiliaria Premium en República Dominicana",
    template: "%s | IMPULSA Real Estate",
  },
  description:
    "IMPULSA Real Estate — la plataforma inmobiliaria corporativa líder en República Dominicana. Compra, vende e invierte en propiedades premium con asesoría financiera, calculadora hipotecaria y seguimiento de metas de inversión.",
  keywords: [
    "comprar propiedades en República Dominicana",
    "inversión bienes raices",
    "financiamiento hipotecario",
    "IMPULSA Real Estate",
    "propiedades premium Santo Domingo",
    "inmobiliaria Punta Cana",
    "casas de lujo República Dominicana",
    "apartamentos en venta",
    "asesores inmobiliarios",
    "inversión inmobiliaria Caribe",
  ],
  authors: [{ name: "IMPULSA Real Estate" }],
  creator: "IMPULSA Real Estate",
  publisher: "IMPULSA Real Estate",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "IMPULSA Real Estate | Inversión Inmobiliaria Premium",
    description:
      "Compra, vende e invierte en propiedades premium en República Dominicana. Asesoría financiera, calculadora hipotecaria y seguimiento de metas.",
    url: "https://somosimpulsarealstate.com",
    siteName: "IMPULSA Real Estate",
    images: [
      {
        url: "/images/hero-bg.png",
        width: 1440,
        height: 720,
        alt: "Propiedad de lujo en República Dominicana - IMPULSA Real Estate",
      },
    ],
    locale: "es_DO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "IMPULSA Real Estate | Inversión Inmobiliaria Premium",
    description:
      "Compra, vende e invierte en propiedades premium en República Dominicana.",
    images: ["/images/hero-bg.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/logo-impulsa.png",
    apple: "/images/logo-impulsa.png",
  },
  category: "real estate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
