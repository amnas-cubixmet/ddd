"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const HomeIntroContext = createContext(false);

// The root layout persists across client-side navigation. Once the initial
// homepage has been left, visiting it again must not show the full-screen intro.
export function HomeIntroProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [initialHome, setInitialHome] = useState(pathname === "/");
  if (initialHome && pathname !== "/") {
    setInitialHome(false);
  }
  return (
    <HomeIntroContext.Provider value={initialHome && pathname === "/"}>
      {children}
    </HomeIntroContext.Provider>
  );
}

export function useHomeIntro() {
  return useContext(HomeIntroContext);
}
