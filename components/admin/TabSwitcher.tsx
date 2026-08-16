"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TabSwitcher() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab");

  useEffect(() => {
    if (!tab) return;

    let attempts = 0;
    const maxAttempts = 20;

    const trySwitch = () => {
      attempts++;
      if (attempts > maxAttempts) return;

      const tabButtons = document.querySelectorAll<HTMLElement>(
        '[role="tab"], button[data-tab]'
      );

      for (const btn of tabButtons) {
        const text = btn.textContent?.trim().toLowerCase() || "";
        const target = tab.toLowerCase();
        if (text === target || text.startsWith(target)) {
          btn.click();
          const url = new URL(window.location.href);
          url.searchParams.delete("tab");
          router.replace(url.pathname + url.search);
          return;
        }
      }

      setTimeout(trySwitch, 200);
    };

    const timer = setTimeout(trySwitch, 300);
    return () => clearTimeout(timer);
  }, [tab, router]);

  return null;
}
