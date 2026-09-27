import type { CaseData, Difficulty, SystemId } from '../types'
import { CASES_A } from './casesA'
import { CASES_B } from './casesB'

export const CASES: CaseData[] = [...CASES_A, ...CASES_B].sort((a, b) => a.id - b.id)

for (const item of CASES) {
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
  { id: 'digestive', label: '소화기' },
  { id: 'respiratory', label: '호흡기' },
  { id: 'cardiovascular', label: '심혈관' },
  { id: 'urinary', label: '비뇨기' },
  { id: 'reproductive', label: '생식기' },
  { id: 'hematology', label: '혈액' },
  { id: 'musculoskeletal', label: '근골격' },
  { id: 'immune', label: '면역' },
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

export function isUnlocked(difficulty: Difficulty, solved: number) {
  if (difficulty === 1) return true
  if (difficulty === 2) return solved >= 10
  return solved >= 20
}

export function unlockNeed(difficulty: Difficulty) {
  if (difficulty === 2) return 10
  if (difficulty === 3) return 20
  return 0
}

export function getCase(id: number) {
  return CASES.find((item) => item.id === id)
}
