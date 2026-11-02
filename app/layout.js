import "./globals.css";
import { ClientWrapper } from "../components/ClientWrapper";

export const metadata = {
  title: "Kala Samputah | Nancy Sikri",
  description: "Self-taught abstract artist based in New Delhi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Non-blocking Google fonts (DM Sans/Jost) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load fonts asynchronously — media=print trick replaced with direct stylesheet load */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300;1,9..40,400&family=Jost:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
