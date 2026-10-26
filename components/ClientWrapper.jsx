"use client";

import { ArtModalProvider } from "./ArtModalContext";
import { UserProvider } from "./UserContext";
import { SiteContentProvider } from "./SiteContentContext";
import PageTransition from "./PageTransition";
import FloatingWhatsApp from "./FloatingWhatsApp";

export function ClientWrapper({ children }) {
  return (
    <SiteContentProvider>
      <UserProvider>
        <ArtModalProvider>
          <PageTransition>{children}</PageTransition>
          <FloatingWhatsApp />
        </ArtModalProvider>
      </UserProvider>
    </SiteContentProvider>
  );
}
