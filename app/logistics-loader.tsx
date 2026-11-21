"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function LogisticsLoader() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const key = "bhagwan-intro-seen";
    try {
      if (sessionStorage.getItem(key)) return;
    } catch { /* Continue if browser privacy settings block session storage. */ }
    setVisible(true);
    const start = performance.now();
    const timers: number[] = [];
    let finished = false;
    const close = () => {
      if (finished) return;
      finished = true;
      // Mark as seen only once the intro actually finishes, so a re-run of this
      // effect (React Strict Mode in dev) doesn't skip scheduling the close.
      try { sessionStorage.setItem(key, "1"); } catch { /* ignore */ }
      setLeaving(true);
      timers.push(window.setTimeout(() => setVisible(false), 650));
    };
    const finishWhenReady = () => { timers.push(window.setTimeout(close, Math.max(0, 2250 - (performance.now() - start)))); };
    timers.push(window.setTimeout(close, 3000));
    if (document.readyState === "complete") finishWhenReady();
    else window.addEventListener("load", finishWhenReady, { once: true });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) timers.push(window.setTimeout(close, 500));
    return () => { timers.forEach((t) => window.clearTimeout(t)); window.removeEventListener("load", finishWhenReady); };
  }, []);
  if (!visible) return null;
  return <div className={`logistics-loader${leaving ? " is-leaving" : ""}`} role="status" aria-live="polite" aria-label="Preparing your logistics experience">
    <div className="loader-atmosphere" />
    <div className="loader-brand"><span className="loader-mark">BW</span><div><b>BHAGWAN</b><small>WAREHOUSING &amp; DISPATCH</small></div></div>
    <div className="loader-scene" aria-hidden="true">
      <div className="loader-warehouse"><div className="loader-bay"><i className="loader-shutter" /></div></div>
      <div className="loader-road"><span /><span /><span /><span /></div>
      <div className="loader-truck"><Image src="/warehouse-photos/truck-arrival-cutout.webp" alt="" width={900} height={415} priority /></div>
    </div>
    <div className="loader-progress"><div className="loader-progress-top"><span>Preparing your logistics experience...</span><span>BW / 01</span></div><div className="loader-track"><i /></div></div>
  </div>;
}
