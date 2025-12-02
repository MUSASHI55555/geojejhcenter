import { NextResponse } from "next/server"
import { head, put } from "@vercel/blob"
import { fetchWithRetry } from "@/lib/fetch-with-retry"

type IncrementResult = {
  ok: boolean
  views?: number | null
  viewCount?: number | null
  error?: string
}

function json(body: IncrementResult, status = 200) {
  return NextResponse.json(body, { status })
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// 공지 Blob(key)이 실제로 존재하는지만 확인 (내용은 건드리지 않음)
async function ensureNoticeExists(key: string): Promise<boolean> {
  try {
    const meta = await head(key)
    if (!meta || !(meta as any).url) {
      return false
    }
    return true
  } catch (e) {
    console.error("[NoticesIncrView] ensureNoticeExists head failed", key, e)
    return false
  }
}

// 조회수 카운터 Blob key 생성: notices/... → notices-views/...
function toCounterKey(noticeKey: string): string {
  return noticeKey.replace(/^notices\//, "notices-views/")
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    // 1) body(JSON) 또는 쿼리스트링에서 key 수신 (둘 다 지원)
    let rawKey = ""
    let body: any = null

    const ct = req.headers.get("content-type") || ""
    if (ct.includes("application/json")) {
      try {
        body = await req.json()
      } catch {
        body = null
      }
    }

    if (body && typeof body.key === "string" && body.key.trim()) {
      rawKey = body.key.trim()
    } else {
      const encoded = searchParams.get("key") || ""
      rawKey = encoded.trim()
    }

    if (!rawKey) {
      return json({ ok: false, error: "Missing notice key" }, 400)
    }

    // URL 인코딩/디코딩 여부에 상관없이 안전하게 처리
    let decodedKey = rawKey
    try {
      decodedKey = decodeURIComponent(rawKey).trim()
    } catch {
      decodedKey = rawKey.trim()
    }

    if (
      !decodedKey ||
      !decodedKey.startsWith("notices/") ||
      !decodedKey.endsWith(".json") ||
      decodedKey.includes("..") ||
      decodedKey.includes("//")
    ) {
      return json({ ok: false, error: "Invalid notice key" }, 400)
    }

    // 2) 실제 공지 Blob이 존재하는지만 확인 (본문은 읽지 않음)
    const exists = await ensureNoticeExists(decodedKey)
    if (!exists) {
      return json({ ok: false, error: "Notice not found" }, 404)
    }

    // 3) 조회수 카운터 Blob key 계산
    const counterKey = toCounterKey(decodedKey)

    let currentViews = 0

    // 4) 기존 카운터 Blob이 있으면 읽어서 viewCount 가져오기
    try {
      const counterMeta = await head(counterKey).catch(() => null)

      if (counterMeta && (counterMeta as any).url) {
        const srcUrl =
          (counterMeta as any).downloadUrl || (counterMeta as any).url

        const res = await fetchWithRetry(srcUrl, {
          maxRetries: 3,
          initialDelayMs: 100,
          maxDelayMs: 2000,
        })

        if (res.ok) {
          const text = await res.text()

          // 혹시라도 HTML 에러 페이지가 들어있으면 버리고 0부터 다시 시작
          if (
            !text.startsWith("<!DOCTYPE") &&
            !text.startsWith("<html") &&
            !text.includes("Too Many Requests")
          ) {
            try {
              const parsed: any = JSON.parse(text)
              const v =
                typeof parsed.viewCount === "number"
                  ? parsed.viewCount
                  : typeof parsed.views === "number"
                  ? parsed.views
                  : 0
              if (Number.isFinite(v) && v >= 0) {
                currentViews = v
              }
            } catch (e) {
              console.error(
                "[NoticesIncrView] counter JSON parse failed",
                counterKey,
                e,
              )
            }
          } else {
            console.error(
              "[NoticesIncrView] counter corrupted, reset to 0",
              counterKey,
              text.slice(0, 100),
            )
          }
        } else {
          console.error(
            "[NoticesIncrView] counter fetch failed",
            counterKey,
            res.status,
          )
        }
      }
    } catch (e) {
      console.error("[NoticesIncrView] counter read error", counterKey, e)
    }

    // 5) 조회수 +1
    const nextViews = currentViews + 1

    // 6) 카운터 Blob에만 쓰기 (공지 본문 Blob은 절대 수정하지 않음)
    const counterPayload = {
      viewCount: nextViews,
      views: nextViews,
      updatedAt: new Date().toISOString(),
      noticeKey: decodedKey,
    }

    await put(counterKey, JSON.stringify(counterPayload), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    console.log("[NoticesIncrView] success", {
      key: decodedKey,
      counterKey,
      oldViews: currentViews,
      newViews: nextViews,
    })

    return json({ ok: true, viewCount: nextViews, views: nextViews }, 200)
  } catch (e: any) {
    console.error("[NoticesIncrView] error", e)
    return json({ ok: false, error: "View increment failed" }, 500)
  }
}
