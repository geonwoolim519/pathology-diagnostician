import { useEffect, useState, type ReactNode } from 'react'
import { Microscope } from '../components/Slide'
import { RichText } from '../components/RichText'
import { caseNo, getCase } from '../data/cases'
import { useProgress } from '../context/Progress'
import { badgeList, gradeOf, scoreOf } from '../lib/logic'
import { useNavigate, useTerm } from '../nav'
import type { AttemptRecord, CaseData } from '../types'

const STEPS = ['환자', '증상', '검사', '병리', '진단']

export function CasePlay({ id }: { id: number }) {
  const item = getCase(id)
  const nav = useNavigate()
  if (!item) {
    return (
      <p className="text-sm text-muted">
        케이스를 찾을 수 없습니다.{' '}
        <button type="button" className="font-semibold text-teal" onClick={() => nav({ name: 'cases' })}>
          목록으로
        </button>
      </p>
    )
  }
  return <Player key={item.id} item={item} />
}

function Player({ item }: { item: CaseData }) {
  const { state, saveDraft, clearDraft, completeCase, addScopeClick, noteWrong } = useProgress()
  const nav = useNavigate()
  const onTerm = useTerm()
  const draft = state.draft?.caseId === item.id ? state.draft : null
  const existing = state.best[item.id]
  const [mode, setMode] = useState<'play' | 'done'>(existing && !draft ? 'done' : 'play')
  const [step, setStep] = useState(draft?.maxStep ?? 0)
  const [maxStep, setMaxStep] = useState(draft?.maxStep ?? 0)
  const [wrongCount, setWrongCount] = useState(draft?.wrongCount ?? 0)
  const [hintsUsed, setHintsUsed] = useState(draft?.hintsUsed ?? 0)
  const [wrongChoices, setWrongChoices] = useState<string[]>(draft?.wrongChoices ?? [])
  const [phase, setPhase] = useState<'play' | 'wrong' | 'result'>(draft?.phase === 'result' ? 'play' : (draft?.phase ?? 'play'))
  const [shake, setShake] = useState(false)
  const [notice, setNotice] = useState('')
  const [badges, setBadges] = useState<string[]>([])
  const [record, setRecord] = useState<AttemptRecord | null>(existing && mode === 'done' ? existing : null)

  useEffect(() => {
    if (mode !== 'play' || phase === 'result') return
    saveDraft({ caseId: item.id, maxStep, wrongCount, hintsUsed, wrongChoices, phase })
  }, [hintsUsed, item.id, maxStep, mode, phase, saveDraft, wrongChoices, wrongCount])

  function next() {
    const value = Math.min(4, step + 1)
    setStep(value)
    setMaxStep((prev) => Math.max(prev, value))
  }

  function choose(option: string) {
    if (phase === 'result') return
    if (option !== item.answer) {
      const seen = wrongChoices.includes(option)
      setNotice(seen ? '이미 비교한 선택지입니다. 다른 단서를 다시 보세요.' : item.distractors[option])
      if (!seen) {
        setWrongChoices((prev) => [...prev, option])
        setWrongCount((prev) => prev + 1)
        noteWrong(item.id, option)
      }
      setPhase('wrong')
      setShake(true)
      window.setTimeout(() => setShake(false), 450)
      return
    }
    const attempt: AttemptRecord = {
      caseId: item.id,
      score: scoreOf(wrongCount, hintsUsed),
      wrongChoices,
      hintsUsed,
      at: new Date().toISOString(),
    }
    const earned = completeCase(attempt)
    setBadges(earned)
    setRecord(attempt)
    setPhase('result')
    setMode('done')
    clearDraft()
  }

  function replay() {
    setMode('play')
    setStep(0)
    setMaxStep(0)
    setWrongCount(0)
    setHintsUsed(0)
    setWrongChoices([])
    setPhase('play')
    setNotice('')
    setRecord(null)
    clearDraft()
  }

  const shown = record ?? existing
  if (mode === 'done' && shown && phase !== 'wrong') {
    return (
      <Result
        item={item}
        record={shown}
        badges={badges}
        onReplay={replay}
        onList={() => nav({ name: 'cases' })}
      />
    )
  }

  const preview = scoreOf(wrongCount, hintsUsed)

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4 lg:grid-cols-[280px_minmax(0,1fr)_300px]">
      <aside className="hidden lg:block">
        <div className="sticky top-6 space-y-3">
          <Chart item={item} maxStep={maxStep} onTerm={onTerm} />
        </div>
      </aside>

      <section className={shake ? 'shake' : ''}>
        <header className="mb-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-teal">CASE {caseNo(item.id)} · 가상 환자</p>
          <h2 className="mt-1 text-2xl font-semibold">{item.teaser}</h2>
          <p className="mt-1 text-sm text-muted">{item.systemLabel} · 질환명은 정답 뒤에 공개됩니다.</p>
        </header>
        <ol className="mb-4 grid grid-cols-5 gap-1">
          {STEPS.map((label, index) => {
            const on = index === step
            const locked = index > maxStep
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => setStep(index)}
                  className={`w-full rounded-2xl px-1 py-2 text-[11px] font-semibold sm:text-xs ${
                    on ? 'bg-navy text-white' : locked ? 'bg-white text-muted/50' : 'bg-white text-ink'
                  }`}
                >
                  {label}
                </button>
              </li>
            )
          })}
        </ol>

        <div className="rise rounded-[28px] bg-white p-5 card-shadow">
          {step === 0 ? (
            <Block kicker="STEP 01" title="환자 정보">
              <p className="text-2xl font-semibold">{item.patient.line}</p>
              <ul className="mt-4 space-y-2 text-sm leading-6">
                {item.history.map((line) => (
                  <li key={line}>· {line}</li>
                ))}
              </ul>
            </Block>
          ) : null}
          {step === 1 ? (
            <Block kicker="STEP 02" title="주요 증상">
              <ul className="space-y-2 text-base leading-7">
                {item.symptoms.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-semibold tracking-[0.14em] text-muted">신체검사</p>
              <ul className="mt-2 space-y-2 text-sm leading-6">
                {item.exam.map((line) => (
                  <li key={line}>· {line}</li>
                ))}
              </ul>
            </Block>
          ) : null}
          {step === 2 ? (
            <Block kicker="STEP 03" title="검사 결과">
              <div className="space-y-4">
                {item.tests.map((test) => (
                  <div key={test.label}>
                    <p className="text-sm font-semibold">{test.label}</p>
                    <ul className="mt-1 space-y-1 text-sm leading-6 text-ink">
                      {test.findings.map((line) => (
                        <li key={line}>· {line}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Block>
          ) : null}
          {step === 3 ? (
            <Block kicker="STEP 04" title="조직·병리 소견">
              <p className="text-sm leading-7">
                <RichText text={item.pathology.micro} onTerm={onTerm} />
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">{item.pathology.gross}</p>
              <div className="mt-4 rounded-2xl bg-paper p-3">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted">핵심 병리 단서</p>
                <ul className="mt-2 space-y-1 text-sm leading-6">
                  {item.clues.map((line) => (
                    <li key={line}>· {line}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <Microscope theme={item.pathology.theme} points={item.points} onObserve={addScopeClick} />
              </div>
            </Block>
          ) : null}
          {step === 4 ? (
            <Block kicker="STEP 05" title="가장 가능성이 높은 질환은?">
              <p className="text-sm text-muted">현재 예상 점수 {preview}점 · 오답 −20 · 힌트 −10</p>
              <div className="mt-4 space-y-2">
                {item.options.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => choose(option)}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${
                      wrongChoices.includes(option) ? 'border-danger/30 bg-red-50 text-danger' : 'border-line bg-paper'
                    }`}
                  >
                    <span className="text-muted">{['①', '②', '③', '④'][index]}</span>
                    {option}
                  </button>
                ))}
              </div>
              {phase === 'wrong' ? (
                <div className="rise mt-4 rounded-2xl bg-paper p-4">
                  <p className="text-lg font-semibold">아쉽습니다.</p>
                  <p className="mt-1 text-sm text-muted">선택한 질환과 현재 병리소견을 비교해보세요.</p>
                  <p className="mt-3 text-sm font-semibold">다시 생각해보기</p>
                  <p className="mt-1 text-sm leading-6">{notice}</p>
                  <div className="mt-3 space-y-2">
                    {item.hints.map((hint, index) => {
                      const openHint = index < hintsUsed
                      const canOpen = index === hintsUsed
                      return (
                        <button
                          key={hint}
                          type="button"
                          disabled={!canOpen && !openHint}
                          onClick={() => {
                            if (canOpen) setHintsUsed(index + 1)
                          }}
                          className="w-full rounded-2xl bg-white px-3 py-3 text-left text-sm disabled:opacity-50"
                        >
                          <span className="font-semibold text-teal">힌트 {index + 1}</span>
                          <span className="ml-2 text-xs text-muted">{openHint ? '' : '−10'}</span>
                          <p className="mt-1 leading-6">{openHint ? hint : '눌러서 확인'}</p>
                        </button>
                      )
                    })}
                  </div>
                  <button type="button" className="mt-3 rounded-2xl bg-navy px-4 py-3 text-sm font-semibold text-white" onClick={() => setPhase('play')}>
                    다시 선택
                  </button>
                </div>
              ) : null}
            </Block>
          ) : null}

          {step < 4 ? (
            <button type="button" className="mt-5 w-full rounded-2xl bg-teal px-4 py-3 text-sm font-semibold text-white" onClick={next}>
              {step === 3 ? '단서를 모두 확인하고 진단하기' : '다음 단서'}
            </button>
          ) : null}
        </div>
      </section>

      <aside className="hidden lg:block">
        <div className="sticky top-6 rounded-[28px] bg-white p-4 card-shadow">
          <p className="text-xs font-semibold tracking-[0.16em] text-teal">진단</p>
          {maxStep < 4 ? (
            <p className="mt-3 text-sm leading-6 text-muted">환자, 증상, 검사, 병리 단서를 순서대로 확인한 뒤 선택할 수 있습니다.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {item.options.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setStep(4)
                    choose(option)
                  }}
                  className="flex w-full items-center gap-2 rounded-2xl border border-line px-3 py-3 text-left text-sm font-semibold"
                >
                  <span className="text-muted">{['①', '②', '③', '④'][index]}</span>
                  {option}
                </button>
              ))}
              <p className="text-xs text-muted">예상 점수 {preview}점</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

function Block({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.16em] text-teal">{kicker}</p>
      <h3 className="mt-1 text-xl font-semibold">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function Chart({ item, maxStep, onTerm }: { item: CaseData; maxStep: number; onTerm: (term: string) => void }) {
  return (
    <div className="rounded-[28px] bg-white p-4 card-shadow">
      <p className="text-xs font-semibold tracking-[0.16em] text-muted">CASE CHART</p>
      <p className="mt-2 text-lg font-semibold">{item.patient.line}</p>
      <div className="mt-3 space-y-3 text-sm leading-6">
        {maxStep >= 1 ? (
          <div>
            <p className="text-xs font-semibold text-teal">증상</p>
            <p>{item.symptoms[0]}</p>
          </div>
        ) : null}
        {maxStep >= 2 ? (
          <div>
            <p className="text-xs font-semibold text-teal">검사</p>
            <p>{item.tests[0]?.findings[0]}</p>
          </div>
        ) : null}
        {maxStep >= 3 ? (
          <div>
            <p className="text-xs font-semibold text-teal">병리</p>
            <p>
              <RichText text={item.pathology.micro} onTerm={onTerm} />
            </p>
          </div>
        ) : null}
        {maxStep < 1 ? <p className="text-muted">단서를 열면 차트가 채워집니다.</p> : null}
      </div>
    </div>
  )
}

function Result({
  item,
  record,
  badges,
  onReplay,
  onList,
}: {
  item: CaseData
  record: AttemptRecord
  badges: string[]
  onReplay: () => void
  onList: () => void
}) {
  const onTerm = useTerm()
  const { state } = useProgress()
  const names = badges.map((id) => badgeList(state).find((badge) => badge.id === id)?.title ?? id)
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <section className="pop rounded-[28px] bg-navy px-6 py-7 text-white card-shadow">
        <p className="text-sm font-semibold text-teal-bright">진단 성공</p>
        <h2 className="mt-2 text-3xl font-semibold">정답: {item.title}</h2>
        <p className="mt-3 text-sm text-white/70">
          {record.score}점 · {gradeOf(record.score)} · 오답 {record.wrongChoices.length}회 · 힌트 {record.hintsUsed}개
        </p>
        {names.length ? <p className="mt-3 text-sm">새 배지 · {names.join(' · ')}</p> : null}
      </section>
      <section className="rounded-[28px] bg-white p-5 card-shadow">
        <h3 className="text-lg font-semibold">왜 이 진단일까?</h3>
        <ul className="mt-3 space-y-2 text-sm leading-6">
          {item.why.map((line) => (
            <li key={line}>· {line}</li>
          ))}
        </ul>
        <h3 className="mt-6 text-lg font-semibold">병리학 핵심</h3>
        <p className="mt-2 text-sm leading-7">
          <RichText text={item.pathophysiology} onTerm={onTerm} />
        </p>
        {item.references ? <p className="mt-4 text-xs leading-5 text-muted">{item.references}</p> : null}
      </section>
      <section className="rounded-[28px] bg-white p-5 card-shadow">
        <h3 className="text-lg font-semibold">간호학적 연결</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Note title="주요 증상" lines={item.nursing.symptoms} />
          <Note title="관찰해야 할 징후" lines={item.nursing.signs} />
          <Note title="환자 상태 변화" lines={item.nursing.changes} />
          <Note title="간호 관찰 포인트" lines={item.nursing.observation} />
          <div className="sm:col-span-2">
            <Note title="환자 교육 포인트" lines={item.nursing.education} />
          </div>
        </div>
      </section>
      <TutorBox item={item} />
      <div className="flex gap-2">
        <button type="button" className="flex-1 rounded-2xl bg-navy px-4 py-3 text-sm font-semibold text-white" onClick={onList}>
          케이스 목록
        </button>
        <button type="button" className="flex-1 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold" onClick={onReplay}>
          다시 풀기
        </button>
      </div>
    </div>
  )
}

function TutorBox({ item }: { item: CaseData }) {
  const [q, setQ] = useState('')
  const [a, setA] = useState('')
  function ask(question: string) {
    const text = question.trim()
    setQ(text)
    const found = item.tutor.find((row) => row.q === text)
    if (found) {
      setA(found.a)
      return
    }
    if (text.includes('간호')) {
      setA(item.nursing.education.join(' '))
      return
    }
    if (text.includes('왜') || text.includes(item.title)) {
      setA(item.why.join(' '))
      return
    }
    if (!text) return
    setA('이 질문에는 준비된 학습 설명이 없습니다. 위 질문을 선택해 보세요. 튜터는 학습 설명만 제공하며 실제 환자를 진단하지 않습니다.')
  }
  return (
    <section className="rounded-[28px] bg-white p-5 card-shadow">
      <p className="text-xs font-semibold tracking-[0.16em] text-teal">학습 튜터</p>
      <h3 className="mt-1 text-lg font-semibold">왜 이 진단일까, 다시 물어보기</h3>
      <p className="mt-2 text-sm leading-6 text-muted">
        미리 정리한 학습 설명만 보여 줍니다. 실제 환자의 진단이나 치료를 하지 않습니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {item.tutor.map((row) => (
          <button key={row.q} type="button" className="rounded-full bg-mist px-3 py-2 text-sm font-semibold text-teal" onClick={() => ask(row.q)}>
            {row.q}
          </button>
        ))}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          ask(q)
        }}
      >
        <input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="왜 이 질환인가요?"
          className="min-w-0 flex-1 rounded-2xl border border-line px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-teal"
        />
        <button type="submit" className="rounded-2xl bg-teal px-4 text-sm font-semibold text-white">
          설명
        </button>
      </form>
      {a ? <p className="rise mt-3 rounded-2xl bg-paper p-4 text-sm leading-7">{a}</p> : null}
    </section>
  )
}

function Note({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl bg-paper p-3 sm:col-span-1">
      <p className="text-xs font-semibold text-teal">{title}</p>
      <ul className="mt-2 space-y-1 text-sm leading-6">
        {lines.map((line) => (
          <li key={line}>· {line}</li>
        ))}
      </ul>
    </div>
  )
}
