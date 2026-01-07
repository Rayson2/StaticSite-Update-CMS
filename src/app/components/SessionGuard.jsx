"use client";

import { useEffect } from "react";

export default function SessionGuard({ children }) {
  useEffect(() => {
    const capSeconds = Number(process.env.NEXT_PUBLIC_ABSOLUTE_CAP);

    if (!capSeconds || isNaN(capSeconds)) {
      console.error("NEXT_PUBLIC_ABSOLUTE_CAP not defined");
      return;
    }

    console.log("ABSOLUTE CAP TIMER STARTED:", capSeconds, "seconds");

    const timeout = setTimeout(() => {
      // Hard reload → middleware + server auth runs
      window.location.href = "/login";
    }, capSeconds * 1000);

    return () => clearTimeout(timeout);
  }, []);

  return children;
}
    