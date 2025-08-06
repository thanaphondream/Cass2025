"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace("/dashboard-layout/Home");
    }, 100);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div style={{ textAlign: "center", paddingTop: "2rem" }}>
      <p aria-live="polite">กำลังตรวจสอบสิทธิ์...</p>
      <span role="img" aria-label="loading">🔄</span>
    </div>
  );
}
