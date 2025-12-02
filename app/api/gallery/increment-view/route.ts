// app/api/gallery/increment-view/route.ts
import { NextResponse } from "next/server"
import { head, put } from "@vercel/blob"
import { fetchWithRetry } from "@/lib/fetch-with-retry"

type IncrementResult = {
  ok: boolean
  viewCount?: number | null
  error?: string
}

function json(body: IncrementResult, status = 200) {
  return NextResponse.json(body, { status })
}

function isValidGalleryKey(key: string): boolean {
  return (
    typeof key === "string" &&
    key.startsWith("galleries/") &&
    key.endsWith(".json") &&
    !key.includes("..") &&
    !key.includes("//")
  )
}

// galleries/... → galleries-views/...
function toCounterKey(key: string): string {
  return key.replace(/^galleries\//, "galleries-views/")
}

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  try {
    let body: { key?: string; url?: string } | null = null

    // 1. 요청 바디 파싱
    try {
      const jsonBody = await req.json()
      body = jsonBody && typeof jsonBody === "object" ? jsonBody : null
    } catch {
      return json({ ok: false, error: "Invalid request body" }, 400)
    }

    const key = (body?.key || "").toString().trim()

    if (!key || !isValidGalleryKey(key)) {
      return json({ ok: false, error: "Invalid gallery key" }, 400)
    }

    // 2. 원본 갤러리 Blob 존재 여부만 확인 (내용은 절대 읽지 않음)
    const galleryMeta = await head(key).catch(() => null)
    if (!galleryMeta || !(galleryMeta as any).url) {
      return json({ ok: false, error: "Gallery not found" }, 404)
    }

    // 3. 카운터 Blob 키 계산
    const counterKey = toCounterKey(key)

    // 4. 현재 조회수 읽기 (카운터 Blob만)
    let currentViews = 0

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

          // HTML / Too Many Requests 등 에러 페이지가 저장된 경우는 무시하고 0에서 시작
          if (
            !text.startsWith("<!DOCTYPE") &&
            !text.startsWith("<html") &&
            !text.includes("Too Many Requests")
          ) {
            try {
              const data: any = JSON.parse(text)
              const v =
                typeof data.viewCount === "number"
                  ? data.viewCount
                  : typeof data.views === "number"
                  ? data.views
                  : 0

              if (Number.isFinite(v) && v >= 0) {
                currentViews = v
              }
            } catch (e: any) {
              console.error(
                "[GalleryIncrementView] counter JSON parse failed",
                counterKey,
                e,
              )
            }
          } else {
            console.error(
              "[GalleryIncrementView] counter corrupted",
              counterKey,
              text.slice(0, 100),
            )
          }
        } else {
          console.error(
            "[GalleryIncrementView] counter fetch failed",
            counterKey,
            res.status,
          )
        }
      }
    } catch (e: any) {
      console.error(
        "[GalleryIncrementView] counter read error",
        counterKey,
        e,
      )
    }

    // 5. 조회수 +1
    const nextViews = currentViews + 1

    // 6. 카운터 Blob에만 쓰기 (콘텐츠는 절대 수정 안 함)
    const payload = {
      viewCount: nextViews,
      updatedAt: new Date().toISOString(),
    }

    await put(counterKey, JSON.stringify(payload), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    console.log("[GalleryIncrementView] success", {
      key,
      counterKey,
      oldViews: currentViews,
      newViews: nextViews,
    })

    return json({ ok: true, viewCount: nextViews }, 200)
  } catch (err: any) {
    console.error("[GalleryIncrementView] error", err)
    return json({ ok: false, error: "View increment failed" }, 500)
  }
}
