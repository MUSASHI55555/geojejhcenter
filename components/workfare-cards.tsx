"use client"

import { useState } from "react"
import { workfareTeams } from "@/data/workfare"
import { ChevronDown, Users } from "lucide-react"

export function WorkfareCards() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {workfareTeams.map((team, index) => (
        <div
          key={index}
          className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
            className="w-full p-6 text-left hover:bg-sand-50 transition-colors"
            aria-expanded={expandedIndex === index}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-ink-900 mb-2">{team.name}</h3>
                <p className="text-ink-700 mb-3">{team.summary}</p>
                <div className="flex items-center gap-2 text-sm text-primary-600">
                  <Users className="w-4 h-4" aria-hidden="true" />
                  <span>{team.headcount}명</span>
                </div>
              </div>
              {team.branches && (
                <ChevronDown
                  className={`w-6 h-6 text-ink-700 flex-shrink-0 transition-transform ${
                    expandedIndex === index ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              )}
            </div>
          </button>

          {team.branches && expandedIndex === index && (
            <div className="px-6 pb-6 border-t border-border bg-sand-50">
              <ul className="mt-4 space-y-3">
                {team.branches.map((branch, branchIndex) => (
                  <li key={branchIndex} className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <span className="font-medium text-ink-900">{branch.label}</span>
                      {branch.note && <span className="text-sm text-ink-700 ml-2">({branch.note})</span>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
