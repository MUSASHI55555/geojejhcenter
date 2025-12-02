// components/error-hint.tsx
"use client";

export function ErrorHint({
  title = "문제가 발생했습니다",
  desc,
  action,
}: {
  title?: string;
  desc?: string;
  action?: React.ReactNode;
}) {
  return (
    <div role="alert" className="border rounded p-4 bg-gray-50">
      <h2 className="font-semibold mb-1">{title}</h2>
      {desc && <p className="text-sm text-gray-600">{desc}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
