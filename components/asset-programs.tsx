import Link from "next/link"
import { assetPrograms } from "@/data/case-gateway"
import { AlertCircle } from "lucide-react"

export function AssetPrograms() {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        {assetPrograms.map((program) => (
          <div key={program.code} className="bg-white border border-border p-6 rounded-xl">
            <h3 className="text-xl font-bold text-ink-900 mb-3">{program.name}</h3>
            <div className="space-y-2 text-sm">
              <p className="text-ink-700">
                <span className="font-medium">대상:</span> {program.target}
              </p>
              <p className="text-ink-700">
                <span className="font-medium">본인 저축:</span> {program.monthlyDeposit}
              </p>
              <p className="text-ink-700">
                <span className="font-medium">정부 매칭:</span> {program.govMatch}
              </p>
              {program.expectedAtMaturity && (
                <p className="text-ink-700">
                  <span className="font-medium">만기 예상:</span> {program.expectedAtMaturity}
                </p>
              )}
            </div>
            {program.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                {program.notes.map((note, index) => (
                  <p key={index} className="text-xs text-ink-700 flex items-start gap-2">
                    <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{note}</span>
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-sand-50 p-6 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" aria-hidden="true" />
          <div>
            <h4 className="font-semibold text-ink-900 mb-2">TBD 값 안내</h4>
            <p className="text-ink-700 mb-3">
              일부 금액 정보는 최신 공지사항을 확인해주세요. 제도 변경에 따라 금액이 달라질 수 ��습니다.
            </p>
            <Link
              href="/notice?cat=웹진"
              className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
            >
              최신 공지 확인하기 →
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <caption className="text-left text-xl font-bold text-ink-900 mb-4">자산형성 프로그램 비교</caption>
          <thead>
            <tr className="bg-primary-800 text-white">
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                프로그램
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                대상
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                본인 저축
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                정부 매칭
              </th>
            </tr>
          </thead>
          <tbody>
            {assetPrograms.map((program, index) => (
              <tr key={index} className="border-b border-border hover:bg-sand-50 transition-colors">
                <td className="px-4 py-3 font-medium text-ink-900">{program.name}</td>
                <td className="px-4 py-3 text-ink-700">{program.target}</td>
                <td className="px-4 py-3 text-ink-700">{program.monthlyDeposit}</td>
                <td className="px-4 py-3 text-ink-700">{program.govMatch}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
