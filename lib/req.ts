// 런타임 컨텍스트 없는 SSR에서도 터지지 않게 가드
export function safeHeader(name: string): string | null {
  try {
    // 'next/headers'는 서버 컴포넌트/라우트 핸들러의 요청 컨텍스트에서만 동작
    const { headers } = require("next/headers") as typeof import("next/headers");
    return headers().get(name);
  } catch {
    return null;
  }
}

export function safeCookie(name: string): string | null {
  try {
    const { cookies } = require("next/headers") as typeof import("next/headers");
    return cookies().get(name)?.value ?? null;
  } catch {
    return null;
  }
}
