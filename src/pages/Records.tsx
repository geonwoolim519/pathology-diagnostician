import { useState } from 'react'
import { CASES, caseNo } from '../data/cases'
import { useBadges, useProgress } from '../context/Progress'
import { averageScore, cleanCount, gradeOf, solvedCount, systemBoards } from '../lib/logic'
import { useNavigate } from '../nav'

type Tab = '요약' | '오답노트' | '배지'

export function Records() {
  const { state, resetAll } = useProgress()
  const badges = useBadges()
  const nav = useNavigate()
  const [tab, setTab] = useState<Tab>('요약')
  const [confirm, setConfirm] = useState(false)
  const solved = solvedCount(state)
  const avg = averageScore(state)
  const clean = cleanCount(state)
  const wrongs = Object.keys(state.wrongNotes).length
  const boards = systemBoards(state)
  const strong = [...boards].sort((a, b) => b.avg - a.avg)[0]
  const weak = boards.length > 1 ? [...boards].sort((a, b) => a.avg - b.avg)[0] : null

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="mb-4">
        <p className="text-xs font-semibold tracking-[0.16em] text-teal">MY RECORD</p>
        <h2 className="mt-1 text-2xl font-semibold">나의 기록</h2>
        <p className="mt-1 text-sm text-muted">{avg === null ? '아직 점수가 없습니다.' : gradeOf(avg)}</p>
      </header>
      <div className="mb-4 grid grid-cols-3 gap-2 rounded-[20px] bg-white p-1">
        {(['요약', '오답노트', '배지'] as Tab[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-2xl py-2 text-sm font-semibold ${tab === item ? 'bg-navy text-white' : 'text-muted'}`}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === '요약' ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="총 케이스" value={String(CASES.length)} />
            <Stat label="완료" value={String(solved)} />
            <Stat label="무실수" value={String(clean)} />
            <Stat label="오답노트" value={String(wrongs)} />
          </div>
          <div className="rounded-[24px] bg-white p-5 card-shadow">
            <p className="text-sm text-muted">평균 점수</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{avg === null ? '—' : `${avg}점`}</p>
            <p className="mt-4 text-sm">
              가장 강한 영역 · <b>{strong ? `${strong.label} ${strong.avg}점` : '아직 없음'}</b>
            </p>
            <p className="mt-1 text-sm">
              복습이 필요한 영역 · <b>{weak ? `${weak.label} ${weak.avg}점` : '케이스를 더 풀면 비교됩니다'}</b>
            </p>
          </div>
          <div className="rounded-[24px] bg-white p-5 card-shadow">
            <h3 className="font-semibold">최근 풀이</h3>
            <ul className="mt-3 space-y-3">
              {state.recent.length === 0 ? <li className="text-sm text-muted">아직 완료한 케이스가 없습니다.</li> : null}
              {state.recent.map((row) => {
                const item = CASES.find((c) => c.id === row.caseId)
                if (!item) return null
                return (
                  <li key={`${row.caseId}-${row.at}`}>
                    <button type="button" className="w-full text-left" onClick={() => nav({ name: 'case', id: item.id })}>
                      <p className="text-xs font-semibold tracking-[0.14em] text-teal">CASE {caseNo(item.id)}</p>
                      <p className="font-semibold">
                        {item.title} · {row.score}점
                      </p>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      ) : null}

      {tab === '오답노트' ? (
        <div className="space-y-3">
          {wrongs === 0 ? <p className="rounded-[24px] bg-white p-5 text-sm text-muted">틀린 케이스가 없습니다.</p> : null}
          {Object.entries(state.wrongNotes).map(([id, note]) => {
            const item = CASES.find((c) => c.id === Number(id))
            if (!item) return null
            const solvedCase = Boolean(state.best[item.id])
            return (
              <article key={id} className="rounded-[24px] bg-white p-5 card-shadow">
                <p className="text-xs font-semibold tracking-[0.14em] text-teal">CASE {caseNo(item.id)}</p>
                <h3 className="mt-1 text-xl font-semibold">{solvedCase ? item.title : item.teaser}</h3>
                <p className="mt-3 text-sm">내가 선택한 답 · {note.choices.join(', ')}</p>
                <p className="mt-1 text-sm">정답 · {solvedCase ? item.answer : '케이스를 맞히면 공개됩니다'}</p>
                <p className="mt-3 text-sm leading-6 text-muted">{item.distractors[note.choices[0]] ?? item.why[0]}</p>
                {solvedCase ? <p className="mt-2 text-sm leading-6">{item.pathophysiology}</p> : null}
                <button
                  type="button"
                  className="mt-4 rounded-2xl bg-teal px-4 py-2.5 text-sm font-semibold text-white"
                  onClick={() => nav({ name: 'case', id: item.id })}
                >
                  다시 풀기
                </button>
              </article>
            )
          })}
        </div>
      ) : null}

      {tab === '배지' ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {badges.map((badge) => (
            <article key={badge.id} className={`rounded-[24px] p-4 ${badge.earned ? 'bg-navy text-white' : 'bg-white text-muted'}`}>
              <p className="text-2xl">{badge.mark}</p>
              <h3 className="mt-2 font-semibold">{badge.title}</h3>
              <p className="mt-1 text-sm leading-6 opacity-80">{badge.detail}</p>
              <p className="mt-3 text-xs font-semibold">{badge.earned ? '획득' : '미획득'}</p>
            </article>
          ))}
        </div>
      ) : null}

      <div className="mt-8">
        {confirm ? (
          <div className="rounded-2xl bg-white p-4 text-sm">
            <p>이 기기에 저장된 실습 기록을 지웁니다.</p>
            <div className="mt-3 flex gap-2">
              <button type="button" className="rounded-2xl bg-danger px-4 py-2 font-semibold text-white" onClick={resetAll}>
                지우기
              </button>
              <button type="button" className="rounded-2xl bg-paper px-4 py-2 font-semibold" onClick={() => setConfirm(false)}>
                취소
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="text-sm font-semibold text-muted" onClick={() => setConfirm(true)}>
            기록 지우기
          </button>
        )}
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] bg-white p-4 card-shadow">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  )
}
