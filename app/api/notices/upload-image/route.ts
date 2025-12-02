// app/api/notices/upload-image/route.ts

import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getSessionFromRequest } from "@/lib/auth"

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

export async function POST(req: Request) {
  try {
    // 1. 관리자 세션 확인
    const session = await getSessionFromRequest(req)
    if (!session) {
      return jsonError("로그인이 필요합니다.", 401)
    }

    // 2. FormData 파싱
    let form: FormData
    try {
      form = await req.formData()
    } catch (err: any) {
      console.error("[NoticesUploadImage] formData 파싱 실패", err)
      return jsonError(
        "요청 형식이 올바르지 않습니다. (form-data 필요)",
        400,
      )
    }

    const file = form.get("file")
    if (!file || !(file instanceof File)) {
      return jsonError(
        "업로드할 파일이 없습니다. (file 필드 확인)",
        400,
      )
    }

    // 3. 용량/형식 검증
    const fileSize = file.size || 0
    if (fileSize <= 0) {
      return jsonError("빈 파일은 업로드할 수 없습니다.", 400)
    }

    // 🔼 용량 상향: 30MB
    const MAX_SIZE = 30 * 1024 * 1024
    if (fileSize > MAX_SIZE) {
      return jsonError(
        "이미지 용량이 너무 큽니다. (최대 30MB)",
        400,
      )
    }

    const mime = file.type || "application/octet-stream"
    if (!mime.startsWith("image/")) {
      return jsonError("이미지 파일만 업로드할 수 있습니다.", 400)
    }

    // 4. Blob key 생성 (공지용 네임스페이스)
    const originalName =
      typeof file.name === "string" && file.name.trim()
        ? file.name.trim()
        : "notice-image"

    const safeName =
      originalName
        .replace(/[^\w.\-가-힣]+/g, "_")
        .replace(/_+/g, "_")
        .slice(-80) || "notice-image"

    const now = new Date().toISOString().replace(/[:.]/g, "_")

    const random =
      (globalThis.crypto &&
        "randomUUID" in globalThis.crypto &&
        (globalThis.crypto as any).randomUUID()) ||
      Math.random().toString(36).slice(2)

    // Blob key는 단일 진실
    const key = `notices/images/${now}-${random}-${safeName}`

    // 5. Blob 업로드
    try {
      const result = await put(key, file, {
        access: "public",
        contentType: mime,
        addRandomSuffix: false,
        allowOverwrite: false,
      })

      console.log("[NoticesUploadImage] 업로드 성공", {
        key,
        url: result.url,
      })

      return NextResponse.json(
        {
          ok: true,
          image: {
            url: result.url,
            alt: originalName,
          },
        },
        { status: 200 },
      )
    } catch (err: any) {
      console.error("[NoticesUploadImage] put 실패", err)
      return jsonError(
        "이미지 업로드 중 오류가 발생했습니다.",
        500,
        {
          message: err?.message || String(err),
          name: err?.name,
        },
      )
    }
  } catch (err: any) {
    console.error("[NoticesUploadImage] 처리 중 예외", err)
    return jsonError(
      "이미지 업로드 처리 중 예기치 못한 오류가 발생했습니다.",
      500,
      { message: err?.message || String(err) },
    )
  }
}
