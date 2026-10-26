"use client";

import dynamic from "next/dynamic";
import { ArtModalProvider } from "./ArtModalContext";
import { UserProvider } from "./UserContext";
import { SiteContentProvider } from "./SiteContentContext";
import PageTransition from "./PageTransition";

const FloatingWhatsApp = dynamic(() => import("./FloatingWhatsApp"), {
  ssr: false,
});

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
