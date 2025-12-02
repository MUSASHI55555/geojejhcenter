// /app/notice/view/DeleteButton.tsx
"use client";

export default function DeleteButton({ blobKey }: { blobKey: string }) {
  const onDelete = async () => {
    if (!confirm("이 공지를 삭제하시겠습니까?")) return;
    const r = await fetch(`/api/notices/delete?key=${encodeURIComponent(blobKey)}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (r.ok) {
      // 삭제 후 목록으로
      location.href = "/notice";
    } else {
      alert("삭제 실패");
    }
  };
  return (
    <button onClick={onDelete} className="text-red-600 hover:underline">
      삭제
    </button>
  );
}
