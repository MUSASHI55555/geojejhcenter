// /app/notice/new/ClientGate.tsx  (Client Component)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NewNoticeForm from "./form";

export default function ClientGate() {
  const router = useRouter();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/auth/session", { cache: "no-store", credentials: "include" });
        const j = await r.json().catch(() => ({}));
        if (j?.authed) setOk(true);
        else router.replace("/login?next=/notice/new");
      } catch {
        // 세션 확인 실패 시 로그인으로 우회
        router.replace("/login?next=/notice/new");
      }
    })();
  }, [router]);

  if (ok === null) return <div className="max-w-2xl mx-auto p-6">세션 확인 중…</div>;
  if (!ok) return null; // 리다이렉트 중

  return <NewNoticeForm />;
}
