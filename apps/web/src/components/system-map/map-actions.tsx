"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2, Printer } from "lucide-react";

const publicMapUrl = "https://hari-handika-system-map.vercel.app/";

export function MapActions() {
  const [status, setStatus] = useState<"idle" | "copied" | "manual">("idle");
  const [url, setUrl] = useState("");
  const manualLink = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "manual") {
      manualLink.current?.focus();
    }
  }, [status]);

  async function copyLink() {
    const pageUrl = new URL(publicMapUrl);
    pageUrl.hash = window.location.hash;
    setUrl(pageUrl.href);
    try {
      await navigator.clipboard.writeText(pageUrl.href);
      setStatus("copied");
    } catch {
      setStatus("manual");
    }
  }

  return (
    <div className="map-actions">
      <button type="button" onClick={copyLink}>
        {status === "copied" ? <Check size={16} /> : <Link2 size={16} />}
        <span aria-live="polite">
          {status === "copied" ? "Link copied" : "Copy public link"}
        </span>
      </button>
      <button type="button" onClick={() => window.print()}>
        <Printer size={16} /> Print / PDF
      </button>
      {status === "manual" && (
        <input
          ref={manualLink}
          aria-label="System map URL"
          value={url}
          readOnly
          onFocus={(e) => e.target.select()}
        />
      )}
    </div>
  );
}
