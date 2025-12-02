// /app/login/LoginClient.tsx  (Client Component)
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginClient() {
  const params = useSearchParams();
  const router = useRouter();
  const next = params.get("next") || "/notice";

  const [pw, setPw] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // 이미 로그인 상태면 곧장 이동
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/auth/session", {
          cache: "no-store",
          credentials: "include",
        });
        const j = await r.json();
        if (j?.authed) router.replace(next);
      } catch {}
    })();
  }, [router, next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth/simple-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: pw }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body?.ok) {
        router.replace(next);
      } else {
        setMsg(body?.error || "로그인 실패");
      }
    } catch (err: any) {
      setMsg(err?.message || "알 수 없는 오류");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">관리자 로그인</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="ADMIN_PASSWORD"
          autoFocus
        />
        <button
          disabled={submitting}
          className="w-full px-4 py-2 rounded bg-black text-white disabled:opacity-60"
        >
          {submitting ? "로그인 중…" : "로그인"}
        </button>
      </form>
      {msg && <p className="text-sm text-red-600">{msg}</p>}
    </div>
  );
}
