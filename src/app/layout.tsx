import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

import ConditionalFooter from "@/components/layout/ConditionalFooter";
import Header from "@/components/layout/Header";
import AuthProvider from "@/providers/AuthProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import ReduxProvider from "@/providers/ReduxProvider";
import ThemeProvider from "@/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body>
        <AuthProvider>
          <ThemeProvider>
            <ReduxProvider>
              <LanguageProvider>
                <Header />
                {children}
                <ConditionalFooter />
              </LanguageProvider>
            </ReduxProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
