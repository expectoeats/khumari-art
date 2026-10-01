import "./globals.css";

export const metadata = {
  title: "ARTWORK | Nancy Sikri",
  description: "Self-taught abstract artist based in New Delhi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
