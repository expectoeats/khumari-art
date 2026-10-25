import "./globals.css";
import { ClientWrapper } from "../components/ClientWrapper";

export const metadata = {
  title: "Kala Samputah | Nancy Sikri",
  description: "Self-taught abstract artist based in New Delhi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
