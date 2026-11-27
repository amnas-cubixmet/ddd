"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const HomeIntroContext = createContext(false);

// Allow the branded intro every time the homepage mounts, including client navigation.
export function HomeIntroProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <HomeIntroContext.Provider value={pathname === "/"}>
      {children}
    </HomeIntroContext.Provider>
  );
}

export function useHomeIntro() {
  return useContext(HomeIntroContext);
}
