import { enterprises, enterpriseTotals } from "@/data/enterprises"

export function EnterpriseTable() {
  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-primary-600 text-white p-6 rounded-xl text-center">
          <div className="text-4xl font-bold mb-2">{enterpriseTotals.workers}</div>
          <div className="text-primary-200">총 근로자</div>
        </div>
        <div className="bg-teal-600 text-white p-6 rounded-xl text-center">
          <div className="text-4xl font-bold mb-2">{enterpriseTotals.subsidized}</div>
          <div className="text-teal-100">인건비 지원</div>
        </div>
        <div className="sm:col-span-2 text-center text-sm text-ink-700">기준일: {enterpriseTotals.asOf}</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary-800 text-white">
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                기업명
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                지역
              </th>
              <th scope="col" className="px-4 py-3 text-left font-semibold">
                분야
              </th>
              <th scope="col" className="px-4 py-3 text-center font-semibold">
                근로자
              </th>
              <th scope="col" className="px-4 py-3 text-center font-semibold">
                지원
              </th>
            </tr>
          </thead>
          <tbody>
            {enterprises.map((enterprise, index) => (
              <tr key={index} className="border-b border-border hover:bg-sand-50 transition-colors">
                <td className="px-4 py-3 font-medium text-ink-900">{enterprise.name}</td>
                <td className="px-4 py-3 text-ink-700">{enterprise.area}</td>
                <td className="px-4 py-3 text-ink-700">{enterprise.field}</td>
                <td className="px-4 py-3 text-center text-ink-900">{enterprise.workers}명</td>
                <td className="px-4 py-3 text-center text-ink-900">{enterprise.subsidy}명</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
