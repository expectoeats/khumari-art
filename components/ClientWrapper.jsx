"use client";

import { ArtModalProvider } from "./ArtModalContext";
import { UserProvider } from "./UserContext";
import PageTransition from "./PageTransition";

export function ClientWrapper({ children }) {
  return (
    <UserProvider>
      <ArtModalProvider>
        <PageTransition>{children}</PageTransition>
      </ArtModalProvider>
    </UserProvider>
  );
}
