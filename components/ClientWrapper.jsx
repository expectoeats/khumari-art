"use client";

import { ArtModalProvider } from "./ArtModalContext";
import { UserProvider } from "./UserContext";
import PageTransition from "./PageTransition";
import FloatingWhatsApp from "./FloatingWhatsApp";

export function ClientWrapper({ children }) {
  return (
    <UserProvider>
      <ArtModalProvider>
        <PageTransition>{children}</PageTransition>
        <FloatingWhatsApp />
      </ArtModalProvider>
    </UserProvider>
  );
}
