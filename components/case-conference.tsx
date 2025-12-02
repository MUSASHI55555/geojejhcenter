export function CaseConference() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-primary-100 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-ink-900 mb-3">내부 사례회의</h3>
        <p className="text-ink-700 leading-relaxed">
          센터 내 전문가들이 모여 참여자의 상황을 종합적으로 검토하고 최적의 지원 방안을 논의합니다.
        </p>
      </div>
      <div className="bg-teal-100 p-6 rounded-xl">
        <h3 className="text-xl font-bold text-ink-900 mb-3">지역 사례회의</h3>
        <p className="text-ink-700 leading-relaxed">
          지역 내 유관 기관과 협력하여 복합적인 문제 해결을 위한 통합 지원 체계를 구축합니다.
        </p>
      </div>
    </div>
  )
}
