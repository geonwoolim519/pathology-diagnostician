import { CASES } from '../data/cases'
import { CELL_CARD_IDS } from '../data/learning'
import type { AttemptRecord, ProgressState, SystemId } from '../types'

export const EMPTY_PROGRESS: ProgressState = {
  disclaimerAccepted: false,
  best: {},
  recent: [],
  wrongNotes: {},
  draft: null,
  seenCards: [],
  microscopeClicks: 0,
  streak: 0,
  bestStreak: 0,
  celebrated: [],
}

const KEY = 'pathdx-edu-v1'

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY_PROGRESS
    const parsed = JSON.parse(raw) as Partial<ProgressState>
    return { ...EMPTY_PROGRESS, ...parsed }
  } catch {
    return EMPTY_PROGRESS
  }
}

export function saveProgress(state: ProgressState) {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function scoreOf(wrongCount: number, hintsUsed: number) {
  return Math.max(0, 100 - wrongCount * 20 - hintsUsed * 10)
}

export function gradeOf(average: number | null) {
  if (average === null) return '실습 전'
  if (average >= 90) return '병리 마스터'
  if (average >= 80) return '우수한 병리 탐정'
  if (average >= 70) return '좋은 출발'
  if (average >= 60) return '복습 필요'
  return '기초 병리학 복습 추천'
}

export function solvedCount(state: ProgressState) {
  return Object.keys(state.best).length
}

export function averageScore(state: ProgressState) {
  const rows = Object.values(state.best)
  if (!rows.length) return null
  return Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length)
}

export function cleanCount(state: ProgressState) {
  return Object.values(state.best).filter((row) => !state.wrongNotes[row.caseId]).length
}

export interface Badge {
  id: string
  title: string
  detail: string
  mark: string
  earned: boolean
}

export function badgeList(state: ProgressState): Badge[] {
  const solved = new Set(Object.keys(state.best).map(Number))
  const has = (ids: number[]) => ids.every((id) => solved.has(id))
  return [
    {
      id: 'streak',
      title: '5연속 정답',
      detail: '힌트 없이, 오답 없이 다섯 케이스를 연속으로 맞혔습니다.',
      mark: '🔥',
      earned: state.bestStreak >= 5,
    },
    {
      id: 'scope',
      title: '현미경 탐정',
      detail: '현미경 관찰 포인트를 여섯 번 이상 확인했습니다.',
      mark: '🔬',
      earned: state.microscopeClicks >= 6,
    },
    {
      id: 'cell',
      title: '세포손상 전문가',
      detail: '세포손상 학습 카드를 모두 읽었습니다.',
      mark: '🧬',
      earned: CELL_CARD_IDS.every((id) => state.seenCards.includes(id)),
    },
    {
      id: 'heart',
      title: '심혈관 병리 전문가',
      detail: '죽상경화증과 심근경색을 모두 해결했습니다.',
      mark: '🫀',
      earned: has([27, 28]),
    },
    {
      id: 'lung',
      title: '호흡기 병리 전문가',
      detail: '호흡기계 케이스 다섯 개를 모두 해결했습니다.',
      mark: '🫁',
      earned: has([11, 12, 13, 14, 15]),
    },
    {
      id: 'blood',
      title: '혈액 병리 전문가',
      detail: '철결핍성 빈혈과 급성 백혈병을 해결했습니다.',
      mark: '🩸',
      earned: has([25, 26]),
    },
    {
      id: 'thirty',
      title: '30 CASE COMPLETE',
      detail: '서른 개 케이스를 모두 해결했습니다.',
      mark: '🏆',
      earned: solved.size >= 30,
    },
    {
      id: 'title',
      title: '병리학 기초 진단자',
      detail: '기초 병리 실습의 전 과정을 마쳤습니다.',
      mark: '🎓',
      earned: solved.size >= 30,
    },
  ]
}

export function applyCompletion(state: ProgressState, attempt: AttemptRecord): ProgressState {
  const first = !state.best[attempt.caseId]
  const prev = state.best[attempt.caseId]
  const best = !prev || attempt.score >= prev.score ? attempt : prev
  let streak = state.streak
  let bestStreak = state.bestStreak
  if (first) {
    streak = attempt.wrongChoices.length === 0 && attempt.hintsUsed === 0 ? streak + 1 : 0
    bestStreak = Math.max(bestStreak, streak)
  }
  const wrongNotes = { ...state.wrongNotes }
  if (attempt.wrongChoices.length) {
    wrongNotes[attempt.caseId] = { choices: attempt.wrongChoices, at: attempt.at }
  }
  const recent = [attempt, ...state.recent.filter((row) => row.caseId !== attempt.caseId)].slice(0, 8)
  const next: ProgressState = {
    ...state,
    best: { ...state.best, [attempt.caseId]: best },
    recent,
    wrongNotes,
    draft: null,
    streak,
    bestStreak,
  }
  const before = new Set(state.celebrated)
  const fresh = badgeList(next)
    .filter((badge) => badge.earned && !before.has(badge.id))
    .map((badge) => badge.id)
  return { ...next, celebrated: [...state.celebrated, ...fresh] }
}

export function freshBadgeIds(before: ProgressState, after: ProgressState) {
  const oldIds = new Set(before.celebrated)
  return after.celebrated.filter((id) => !oldIds.has(id))
}

export function systemBoards(state: ProgressState) {
  const buckets = new Map<SystemId, number[]>()
  for (const row of Object.values(state.best)) {
    const item = CASES.find((c) => c.id === row.caseId)
    if (!item) continue
    const list = buckets.get(item.system) ?? []
    list.push(row.score)
    buckets.set(item.system, list)
  }
  return [...buckets.entries()].map(([system, scores]) => ({
    system,
    label: CASES.find((c) => c.system === system)?.systemLabel ?? system,
    avg: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
  }))
}
