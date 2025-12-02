"use client";

import { useRouter } from "next/navigation";

export function AuthButton({ authed }: { authed: boolean }) {
  const router = useRouter();

  if (!authed) {
    return (
      <button
        onClick={() => router.push("/login")}
        className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
      >
        로그인
      </button>
    );
  }

  const onLogout = async () => {
    await fetch("/api/auth/simple-login", { method: "DELETE" });
    router.refresh(); // 헤더 상태 즉시 갱신
  };

  return (
    <button
      onClick={onLogout}
      className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
    >
      로그아웃
    </button>
  );
}
