// app/api/notices/upload-attachment/route.ts

import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getSessionFromRequest } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

export async function POST(req: Request) {
  try {
    // 1. 로그인 확인 (기존 /api/auth/simple-login + s 쿠키 기반)
    const session = await getSessionFromRequest(req)
    if (!session) {
      return jsonError("로그인이 필요합니다.", 401)
    }

    // 2. multipart/form-data 파싱
    const formData = await req.formData().catch(() => null)
    if (!formData) {
      return jsonError("유효한 업로드 데이터가 아닙니다.", 400)
    }

    const file = formData.get("file")
    if (!(file instanceof File)) {
      return jsonError("첨부파일이 필요합니다.", 400)
    }

    // 3. 용량 제한 (예: 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return jsonError("최대 10MB까지 업로드 가능합니다.", 400)
    }

    // 4. 파일명 정리
    const safeName = file.name.replace(/[^\w.\-가-힣]/g, "_") || "file"

    // 5. Blob 업로드
    const key = `notices/files/${Date.now()}-${safeName}`

    const result = await put(key, file, {
      access: "public",
      addRandomSuffix: true, // 각 업로드는 항상 새로운 파일
      // allowOverwrite: 기본 false (첨부는 새로 쌓는 개념)
    })

    // 6. 공지 JSON에 저장할 메타만 응답
    return NextResponse.json(
      {
        ok: true,
        attachment: {
          name: file.name,
          url: result.url,
          size: file.size,
          contentType:
            file.type || "application/octet-stream",
        },
      },
      { status: 200 },
    )
  } catch (err: any) {
    console.error("[UploadAttachment] 처리 중 예외", err)
    return jsonError(
      "첨부파일 업로드 중 오류가 발생했습니다.",
      500,
    )
  }
}
