import { useMemo, useState } from 'react'
import { CASES, SYSTEMS, caseNo, difficultyLabel, isUnlocked, stars, unlockNeed } from '../data/cases'
import { useProgress } from '../context/Progress'
import { solvedCount } from '../lib/logic'
import { useNavigate } from '../nav'
import type { Difficulty, SystemId } from '../types'

const DIFFS = [
  { id: 0, label: '전체' },
  { id: 1, label: '쉬움' },
  { id: 2, label: '보통' },
  { id: 3, label: '어려움' },
] as const

const STATUS = ['전체', '미완료', '완료', '오답'] as const

export function Cases() {
  const { state } = useProgress()
  const nav = useNavigate()
  const solved = solvedCount(state)
  const [system, setSystem] = useState<SystemId | 'all'>('all')
  const [diff, setDiff] = useState<0 | Difficulty>(0)
  const [status, setStatus] = useState<(typeof STATUS)[number]>('전체')
  const [query, setQuery] = useState('')

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CASES.filter((item) => {
      if (system !== 'all' && !item.filters.includes(system)) return false
      if (diff !== 0 && item.difficulty !== diff) return false
      const finished = Boolean(state.best[item.id])
      const wrong = Boolean(state.wrongNotes[item.id])
      if (status === '완료' && !finished) return false
      if (status === '미완료' && finished) return false
      if (status === '오답' && !wrong) return false
      if (!q) return true
      const hay = [
        `case ${caseNo(item.id)}`,
        caseNo(item.id),
        String(item.id),
        item.teaser,
        item.systemLabel,
        finished ? item.title : '',
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [diff, query, state.best, state.wrongNotes, status, system])

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-4">
        <p className="text-xs font-semibold tracking-[0.16em] text-teal">CASE LIBRARY</p>
        <h2 className="mt-1 text-2xl font-semibold">케이스</h2>
        <p className="mt-1 text-sm text-muted">질환명은 해결한 뒤에 공개됩니다. 카드에는 증상만 보입니다.</p>
      </header>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="케이스 번호, 증상, 계통 검색"
        className="mb-3 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none ring-teal focus:ring-2"
      />

      <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
        {SYSTEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSystem(item.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${
              system === item.id ? 'bg-navy text-white' : 'bg-white text-muted'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {DIFFS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setDiff(item.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              diff === item.id ? 'bg-teal text-white' : 'bg-white text-muted'
            }`}
          >
            {item.label}
            {item.id === 2 && solved < 10 ? ' · 잠김' : ''}
            {item.id === 3 && solved < 20 ? ' · 잠김' : ''}
          </button>
        ))}
        {STATUS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStatus(item)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              status === item ? 'bg-ink text-white' : 'bg-white text-muted'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((item) => {
          const open = isUnlocked(item.difficulty, solved)
          const finished = state.best[item.id]
          const wrong = state.wrongNotes[item.id]
          return (
            <button
              key={item.id}
              type="button"
              disabled={!open}
              onClick={() => nav({ name: 'case', id: item.id })}
              className="rounded-[24px] border border-line bg-white p-4 text-left card-shadow disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-[0.14em] text-teal">CASE {caseNo(item.id)}</p>
                <p className="text-xs text-muted">{stars(item.difficulty)}</p>
              </div>
              <p className="mt-3 text-base font-semibold leading-6">
                {open ? (finished ? item.title : item.teaser) : `${difficultyLabel(item.difficulty)} 난이도`}
              </p>
              <p className="mt-2 text-sm text-muted">
                {item.systemLabel} · {difficultyLabel(item.difficulty)}
              </p>
              {!open ? (
                <p className="mt-3 text-xs leading-5 text-warn">{unlockNeed(item.difficulty)}개 케이스를 완료하면 열립니다.</p>
              ) : (
                <p className="mt-3 text-xs font-semibold text-teal">
                  {finished ? `${finished.score}점` : '미완료'}
                  {wrong ? ' · 오답노트' : ''}
                </p>
              )}
            </button>
          )
        })}
      </div>
      {rows.length === 0 ? <p className="mt-8 text-center text-sm text-muted">조건에 맞는 케이스가 없습니다.</p> : null}
    </div>
  )
}
