"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef("");

  useEffect(() => {
    const query = searchParams.toString();
    const path = `${pathname}${query ? `?${query}` : ""}`;
    if (lastPath.current === path) return;
    lastPath.current = path;
    void fetch("/api/tracking/page-view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path }),
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname, searchParams]);

  return null;
}
