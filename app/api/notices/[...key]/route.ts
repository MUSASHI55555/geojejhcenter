// app/api/notices/[...key]/route.ts

import { NextResponse } from "next/server"
import { head, put } from "@vercel/blob"
import { getSessionFromRequest } from "@/lib/auth"
import type {
  Notice,
  NoticeAttachment,
  NoticeImage,
} from "@/lib/notices-types"
import { fetchWithRetry } from "@/lib/fetch-with-retry"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function jsonError(message: string, status = 400, debug?: any) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      ...(debug !== undefined ? { debug } : {}),
    },
    { status },
  )
}

function isValidNoticeKey(key: string): boolean {
  return (
    typeof key === "string" &&
    key.startsWith("notices/") &&
    key.endsWith(".json") &&
    !key.includes("..") &&
    !key.includes("//")
  )
}

// [...key] → 실제 blob key
async function buildKeyFromParams(
  params:
    | { key: string | string[] }
    | Promise<{ key: string | string[] }>,
): Promise<string | null> {
  const resolved = await Promise.resolve(params).catch(() => null)
  const raw = resolved?.key
  if (!raw) return null

  const parts = Array.isArray(raw) ? raw : [raw]
  const joined = parts.join("/").trim()
  if (!isValidNoticeKey(joined)) return null
  return joined
}

// attachments는 클라이언트에서 이미 upload-attachment API 통해 생성된 값만 신뢰
function sanitizeAttachments(input: any): NoticeAttachment[] | undefined {
  if (!Array.isArray(input)) return undefined
  const list = input
    .filter((f: any) => f && typeof f.url === "string")
    .map((f: any) => ({
      name: String(f.name || "첨부파일"),
      url: String(f.url),
      size:
        typeof f.size === "number" && f.size >= 0
          ? f.size
          : undefined,
      contentType:
        typeof f.contentType === "string"
          ? f.contentType
          : undefined,
    }))
  return list.length > 0 ? list : undefined
}

// 이미지도 공지용 전용 스키마로 정제
function sanitizeImages(input: any): NoticeImage[] | undefined {
  if (!Array.isArray(input)) return undefined
  const list = input
    .filter((img: any) => img && typeof img.url === "string")
    .map((img: any) => ({
      url: String(img.url),
      alt:
        typeof img.alt === "string"
          ? img.alt.slice(0, 200)
          : undefined,
    }))
  return list.length > 0 ? list : undefined
}

// yyyy-MM-dd 또는 ISO → ISO, 잘못되면 undefined (기존 createdAt 유지)
function parseCreatedAt(raw: any): string | undefined {
  if (!raw) return undefined
  const str = String(raw).trim()
  if (!str) return undefined

  let d = new Date(str)
  if (Number.isNaN(d.getTime())) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str)
    if (m) {
      const [_, y, mo, da] = m
      d = new Date(
        Date.UTC(
          Number(y),
          Number(mo) - 1,
          Number(da),
          0,
          0,
          0,
        ),
      )
    }
  }

  if (Number.isNaN(d.getTime())) return undefined
  return d.toISOString()
}

// -------- PUT: 공지 수정 (제목/내용/카테고리/이미지/첨부/등록일 덮어쓰기) --------

export async function PUT(
  req: Request,
  ctx:
    | { params: { key: string | string[] } }
    | { params: Promise<{ key: string | string[] }> },
) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) {
      return jsonError("로그인이 필요합니다.", 401)
    }

    const key = await buildKeyFromParams((ctx as any).params)
    if (!key) {
      console.error("[NoticesCatchAll.PUT] 유효하지 않은 key 형식", {
        params: await Promise.resolve(
          (ctx as any).params,
        ).catch(() => "params-resolve-error"),
      })
      return jsonError("유효하지 않은 key 형식입니다.", 400)
    }

    let body:
      | {
          title?: string
          content?: string
          category?: string
          attachments?: any
          images?: any
          createdAt?: any
        }
      | null = null

    try {
      const json = await req.json()
      body = json && typeof json === "object" ? json : null
    } catch {
      body = null
    }

    if (!body) {
      return jsonError(
        "요청 데이터가 올바르지 않습니다. (본문 누락)",
        400,
      )
    }

    const meta = await head(key).catch((err: any) => {
      console.error("[NoticesCatchAll.PUT] head 실패", key, err)
      return null
    })

    if (!meta || !(meta as any).url) {
      console.error(
        "[NoticesCatchAll.PUT] meta 없음 또는 url 없음",
        key,
        meta,
      )
      return jsonError("해당 공지를 찾을 수 없습니다.", 404)
    }

    const srcUrl =
      (meta as any).downloadUrl || (meta as any).url

    if (!srcUrl || typeof srcUrl !== "string") {
      console.error(
        "[NoticesCatchAll.PUT] blob URL 없음",
        key,
        meta,
      )
      return jsonError(
        "기존 공지 데이터를 불러오지 못했습니다.",
        500,
      )
    }

    let current: Notice | null = null
    
    try {
      const res = await fetchWithRetry(srcUrl, {
        maxRetries: 3,
        initialDelayMs: 100,
        maxDelayMs: 2000,
      })
      
      if (!res.ok) {
        console.error(
          "[NoticesCatchAll.PUT] fetch 실패",
          key,
          res.status,
          res.statusText,
        )
        return jsonError(
          `기존 공지 데이터를 불러오지 못했습니다. (HTTP ${res.status})`,
          500,
        )
      }
      
      const text = await res.text()
      
      if (text.startsWith("<!DOCTYPE") || text.startsWith("<html") || text.includes("Too Many Requests")) {
        console.error(
          "[NoticesCatchAll.PUT] HTML/error response instead of JSON",
          key,
          text.slice(0, 200),
        )
        return jsonError(
          "기존 공지 데이터가 손상되었습니다. 관리자에게 문의해 주세요.",
          500,
        )
      }
      
      current = JSON.parse(text) as Notice
    } catch (err: any) {
      console.error(
        "[NoticesCatchAll.PUT] 기존 JSON 로드/파싱 실패",
        key,
        err?.message || err,
      )
      return jsonError(
        "기존 공지 데이터를 읽을 수 없습니다. 잠시 후 다시 시도해 주세요.",
        500,
      )
    }

    if (!current || !current.title || current.content === undefined) {
      console.error(
        "[NoticesCatchAll.PUT] 기존 데이터 형식 오류",
        key,
        current,
      )
      return jsonError(
        "기존 공지 데이터 형식이 올바르지 않습니다.",
        500,
      )
    }

    const nextTitle =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim()
        : current.title

    const nextContent =
      typeof body.content === "string" &&
      body.content.trim()
        ? body.content
        : current.content

    const nextCategory =
      typeof body.category === "string" &&
      body.category.trim()
        ? body.category.trim()
        : current.category

    const nextAttachments =
      body.attachments !== undefined
        ? sanitizeAttachments(body.attachments)
        : current.attachments

    const nextImages =
      body.images !== undefined
        ? sanitizeImages(body.images)
        : current.images

    let nextCreatedAt = current.createdAt

    if ("createdAt" in body) {
      const raw = body.createdAt

      if (raw === "" || raw === null || raw === undefined) {
        nextCreatedAt = current.createdAt
      } else {
        const parsed = parseCreatedAt(raw)
        if (!parsed) {
          console.error(
            "[NoticesCatchAll.PUT] invalid createdAt",
            { key, raw },
          )
          return jsonError(
            "createdAt 형식이 올바르지 않습니다.",
            400,
          )
        }
        nextCreatedAt = parsed
      }
    }

    if (!nextTitle || nextContent === undefined) {
      console.error(
        "[NoticesCatchAll.PUT] 유효하지 않은 수정 데이터",
        { nextTitle, hasContent: nextContent !== undefined },
      )
      return jsonError(
        "수정된 공지 데이터가 올바르지 않습니다.",
        400,
      )
    }

    // viewCount / views는 이제 별도 카운터 Blob에서 관리하므로
    // 내용 JSON에서는 제거하고 나머지만 유지
    const { viewCount: _vc, views: _v, ...restCurrent } = current

    const next: Notice = {
      ...restCurrent,
      title: nextTitle,
      content: nextContent,
      category: nextCategory,
      attachments: nextAttachments,
      images: nextImages,
      createdAt: nextCreatedAt ?? restCurrent.createdAt,
      updatedAt: new Date().toISOString(),
    }

    console.log("[NoticesCatchAll.PUT] 수정 시작", {
      key,
      titleChanged: next.title !== current.title,
      createdAtChanged: next.createdAt !== current.createdAt,
      nextCreatedAt: next.createdAt,
      currentCreatedAt: current.createdAt,
    })

    try {
      const result = await put(key, JSON.stringify(next), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      })
      console.log("[NoticesCatchAll.PUT] put 성공", {
        key,
        url: result.url,
      })
      return NextResponse.json({ ok: true }, { status: 200 })
    } catch (err: any) {
      console.error("[NoticesCatchAll.PUT] put 실패", key, err)
      return jsonError(
        "공지 저장 중 오류가 발생했습니다.",
        500,
        {
          key,
          message: err?.message || String(err),
          name: err?.name,
        },
      )
    }
  } catch (err: any) {
    console.error("[NoticesCatchAll.PUT] 처리 중 예외", err)
    return jsonError(
      "공지 수정 처리 중 예기치 못한 오류가 발생했습니다.",
      500,
      { message: err?.message || String(err) },
    )
  }
}
