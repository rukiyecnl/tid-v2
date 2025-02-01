"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import * as gtag from "./lib/gtag.js";

export default function Template({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    gtag.pageview(pathname);
  }, [pathname]);

  return <>{children}</>;
}
