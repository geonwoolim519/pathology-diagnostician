import type { CaseData, Difficulty, SystemId } from '../types'
import { ADDITIONAL_CASES } from './additionalCases'
import { CASES_A } from './casesA'
import { CASES_B } from './casesB'

export const CASES: CaseData[] = [...CASES_A, ...CASES_B, ...ADDITIONAL_CASES].sort((a, b) => a.id - b.id)

const seenIds = new Set<number>()
for (const item of CASES) {
  if (seenIds.has(item.id)) throw new Error(`duplicate case id ${item.id}`)
  seenIds.add(item.id)
  if (!item.options.includes(item.answer)) {
    throw new Error(`CASE ${item.id} answer is missing from options`)
  }
  for (const option of item.options) {
    if (option !== item.answer && !item.distractors[option]) {
      throw new Error(`CASE ${item.id} missing distractor for ${option}`)
    }
  }
}

export const SYSTEMS: { id: SystemId | 'all'; label: string }[] = [
  { id: 'all', label: '전체' },
  { id: 'digestive', label: '소화기계' },
  { id: 'respiratory', label: '호흡기계' },
  { id: 'cardiovascular', label: '심혈관계' },
  { id: 'urinary', label: '비뇨기계' },
  { id: 'reproductive', label: '생식기계' },
  { id: 'hematology', label: '혈액계' },
  { id: 'musculoskeletal', label: '근골격계' },
  { id: 'immune', label: '면역계' },
  { id: 'nervous', label: '신경계' },
  { id: 'endocrine', label: '내분비계' },
  { id: 'infection', label: '감염성 질환' },
  { id: 'skin', label: '피부계' },
  { id: 'metabolic', label: '대사성 질환' },
]

export function caseNo(id: number) {
  return String(id).padStart(2, '0')
}

export function stars(difficulty: Difficulty) {
  return `${'★'.repeat(difficulty)}${'☆'.repeat(3 - difficulty)}`
}

export function difficultyLabel(difficulty: Difficulty) {
  if (difficulty === 1) return '쉬움'
  if (difficulty === 2) return '보통'
  return '어려움'
}

export function getCase(id: number) {
  return CASES.find((item) => item.id === id)
}
