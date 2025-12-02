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
    // 1. Login check (existing /api/auth/simple-login + s cookie)
    const session = await getSessionFromRequest(req)
    if (!session) {
      return jsonError("로그인이 필요합니다.", 401)
    }

    // 2. Parse multipart/form-data
    const formData = await req.formData().catch(() => null)
    if (!formData) {
      return jsonError("유효한 업로드 데이터가 아닙니다.", 400)
    }

    const file = formData.get("file")
    if (!(file instanceof File)) {
      return jsonError("이미지 파일이 필요합니다.", 400)
    }

    // 3. File size limit (e.g., 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return jsonError("최대 10MB까지 업로드 가능합니다.", 400)
    }

    // 4. Validate image type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return jsonError("이미지 파일만 업로드 가능합니다.", 400)
    }

    // 5. Clean filename
    const safeName = file.name.replace(/[^\w.\-가-힣]/g, "_") || "image"

    // 6. Upload to Blob
    const key = `gallery-images/${Date.now()}-${safeName}`

    const result = await put(key, file, {
      access: "public",
      addRandomSuffix: true, // Each upload is always a new file
    })

    // 7. Return metadata to save in gallery JSON
    return NextResponse.json(
      {
        ok: true,
        image: {
          url: result.url,
          alt: file.name,
        },
      },
      { status: 200 },
    )
  } catch (err: any) {
    console.error("[UploadGalleryImage] processing exception", err)
    return jsonError("이미지 업로드 중 오류가 발생했습니다.", 500)
  }
}
