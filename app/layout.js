import "./globals.css";
import { ArtModalProvider } from "../components/ArtModalContext";

export const metadata = {
  title: "ARTWORK | Nancy Sikri",
  description: "Self-taught abstract artist based in New Delhi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ArtModalProvider>
          {children}
        </ArtModalProvider>
      </body>
    </html>
  );
}
