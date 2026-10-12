import { useMemo, useState } from 'react'
import { CASES, SYSTEMS, caseNo, difficultyLabel, stars } from '../data/cases'
import { useProgress } from '../context/Progress'
import { useNavigate } from '../nav'
import type { Difficulty, SystemId } from '../types'

const DIFFS = [
  { id: 0, label: '전체' },
  { id: 1, label: '쉬움' },
  { id: 2, label: '보통' },
  { id: 3, label: '어려움' },
] as const

const STATUS = ['전체', '미풀이', '완료', '정답', '오답 경험'] as const

function statusText(finished: boolean, wrong: boolean) {
  if (!finished && wrong) return '미풀이 · 오답 경험 있음'
  if (!finished) return '미풀이'
  if (wrong) return '완료 · 오답 경험 있음'
  return '완료 · 정답'
}

export function Cases() {
  const { state } = useProgress()
  const nav = useNavigate()
  const [system, setSystem] = useState<SystemId | 'all'>('all')
  const [diff, setDiff] = useState<0 | Difficulty>(0)
  const [status, setStatus] = useState<(typeof STATUS)[number]>('전체')
  const [query, setQuery] = useState('')

  const stats = useMemo(() => {
    const finished = CASES.filter((item) => state.best[item.id]).length
    const wrong = CASES.filter((item) => state.wrongNotes[item.id]).length
    return {
      total: CASES.length,
      finished,
      fresh: CASES.length - finished,
      wrong,
    }
  }, [state.best, state.wrongNotes])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CASES.filter((item) => {
      if (system !== 'all' && !item.filters.includes(system)) return false
      if (diff !== 0 && item.difficulty !== diff) return false
      const finished = Boolean(state.best[item.id])
      const wrong = Boolean(state.wrongNotes[item.id])
      if (status === '완료' && !finished) return false
      if (status === '미풀이' && finished) return false
      if (status === '정답' && !(finished && !wrong)) return false
      if (status === '오답 경험' && !wrong) return false
      if (!q) return true
      const systemNames = SYSTEMS.filter((row) => item.filters.includes(row.id as SystemId)).map((row) => row.label)
      const hay = [
        `case ${caseNo(item.id)}`,
        caseNo(item.id),
        String(item.id),
        item.title,
        item.teaser,
        item.topic ?? '',
        item.systemLabel,
        ...systemNames,
        ...item.symptoms,
        ...item.clues,
        item.pathology.micro,
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
        <p className="mt-1 text-sm text-muted">모든 케이스를 바로 선택할 수 있습니다. 해결 전에는 증상 제목이 보이고, 질환명은 정답 뒤에 공개됩니다.</p>
      </header>

      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          ['전체', stats.total],
          ['완료', stats.finished],
          ['미풀이', stats.fresh],
          ['오답 경험', stats.wrong],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white px-3 py-3 card-shadow">
            <p className="text-xs font-semibold text-muted">{label}</p>
            <p className="mt-1 text-xl font-semibold text-navy">{value}</p>
          </div>
        ))}
      </div>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="질환명, 증상, 병리 용어, 계통 검색"
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
          const finished = state.best[item.id]
          const wrong = Boolean(state.wrongNotes[item.id])
          const label = statusText(Boolean(finished), wrong)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => nav({ name: 'case', id: item.id })}
              className="rounded-[24px] border border-line bg-white p-4 text-left card-shadow"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-[0.14em] text-teal">CASE {caseNo(item.id)}</p>
                <p className="text-xs text-muted">{stars(item.difficulty)}</p>
              </div>
              <p className="mt-3 text-base font-semibold leading-6">{finished ? item.title : item.teaser}</p>
              <p className="mt-2 text-sm text-muted">
                {item.systemLabel} · {difficultyLabel(item.difficulty)}
              </p>
              <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted">{item.topic ?? item.clues[0]}</p>
              <p className={`mt-3 text-xs font-semibold ${wrong ? 'text-warn' : 'text-teal'}`}>
                {label}
                {finished ? ` · ${finished.score}점` : ''}
              </p>
            </button>
          )
        })}
      </div>
      {rows.length === 0 ? <p className="mt-8 text-center text-sm text-muted">조건에 맞는 케이스가 없습니다.</p> : null}
    </div>
  )
}
