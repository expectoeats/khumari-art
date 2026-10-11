import "./globals.css";
import { ArtModalProvider } from "../components/ArtModalContext";
import PageTransition from "../components/PageTransition";

export const metadata = {
  title: "Kala Samputah | Nancy Sikri",
  description: "Self-taught abstract artist based in New Delhi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ArtModalProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </ArtModalProvider>
      </body>
    </html>
  );
}
