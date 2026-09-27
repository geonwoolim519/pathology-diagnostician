import { CASES, caseNo, difficultyLabel, isUnlocked, stars } from '../data/cases'
import { useProgress } from '../context/Progress'
import { gradeOf, averageScore, solvedCount } from '../lib/logic'
import { useNavigate } from '../nav'

function Ring({ value }: { value: number }) {
  const r = 28
  const c = 2 * Math.PI * r
  const pct = value / 30
  return (
    <svg width="78" height="78" viewBox="0 0 78 78" aria-hidden>
      <circle cx="39" cy="39" r={r} stroke="#e6eef2" strokeWidth="7" fill="none" />
      <circle
        cx="39"
        cy="39"
        r={r}
        stroke="#0f766e"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
        transform="rotate(-90 39 39)"
      />
      <text x="39" y="43" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0c2340">
        {value}/30
      </text>
    </svg>
  )
}

export function Home() {
  const { state } = useProgress()
  const nav = useNavigate()
  const solved = solvedCount(state)
  const solvedIds = new Set(Object.keys(state.best).map(Number))
  const starter =
    CASES.find((item) => item.id <= 5 && isUnlocked(item.difficulty, solved) && !solvedIds.has(item.id)) ??
    CASES.find((item) => isUnlocked(item.difficulty, solved) && !solvedIds.has(item.id)) ??
    null
  const avg = averageScore(state)

  return (
    <div className="mx-auto w-full max-w-5xl space-y-5">
      <section className="rise overflow-hidden rounded-[28px] bg-navy text-white card-shadow">
        <div className="grid gap-6 px-6 py-7 sm:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] text-teal-bright">PATHOLOGY DIAGNOSTICIAN</p>
            <h2 className="mt-2 text-[2rem] font-semibold tracking-tight">병리진단의사</h2>
            <p className="mt-4 max-w-xl text-[1.45rem] font-semibold leading-snug">
              증상에서 병리까지,
              <br />
              질환의 원인을 찾아보세요.
            </p>
            <p className="mt-3 text-sm text-white/70">간호학과 2학년을 위한 병리학 진단 시뮬레이션</p>
            <img src="/icon-512.png" alt="" className="mt-5 h-28 w-28 sm:h-32 sm:w-32" />
            <p className="mt-4 max-w-xl text-xs leading-5 text-white/55">
              본 콘텐츠는 간호학 병리학 학습을 위한 교육용 시뮬레이션입니다. 실제 환자의 진단이나 치료를 대신하지 않습니다.
            </p>
          </div>
          <div className="rounded-[24px] bg-white p-4 text-ink">
            <div className="flex items-center gap-3">
              <Ring value={solved} />
              <div>
                <p className="text-xs font-semibold tracking-wide text-muted">실습 진행</p>
                <p className="mt-1 text-lg font-semibold">30개 케이스 중 {solved}개 해결</p>
                <p className="text-sm text-muted">{avg === null ? '첫 케이스를 시작해 보세요' : gradeOf(avg)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {solved >= 5 && solved < 10 ? (
        <p className="rounded-2xl bg-mist px-4 py-3 text-sm font-medium text-teal">새로운 계통에 도전해보세요.</p>
      ) : null}
      {solved >= 10 && solved < 20 ? (
        <p className="rounded-2xl bg-mist px-4 py-3 text-sm font-medium text-teal">보통 난이도가 열렸습니다. 임상과 병리를 함께 읽어 보세요.</p>
      ) : null}
      {solved >= 20 && solved < 30 ? (
        <p className="rounded-2xl bg-mist px-4 py-3 text-sm font-medium text-teal">어려운 난이도가 열렸습니다. 비슷한 질환을 구별해 보세요.</p>
      ) : null}
      {solved >= 30 ? (
        <p className="rounded-2xl bg-navy px-4 py-3 text-sm font-semibold text-white">병리학 기초 진단자 배지를 획득했습니다.</p>
      ) : null}

      <section className="space-y-3">
        <button
          type="button"
          onClick={() => starter && nav({ name: 'case', id: starter.id })}
          className="w-full rounded-[24px] bg-white p-5 text-left card-shadow"
        >
          <p className="text-xs font-semibold tracking-[0.16em] text-teal">오늘의 케이스</p>
          {starter ? (
            <>
              <p className="mt-2 text-xl font-semibold">CASE {caseNo(starter.id)}</p>
              <p className="mt-1 text-base text-ink">{starter.teaser}</p>
              <p className="mt-3 text-sm text-muted">
                {starter.systemLabel} · {difficultyLabel(starter.difficulty)} {stars(starter.difficulty)}
              </p>
              <span className="mt-4 inline-flex rounded-2xl bg-teal px-4 py-2.5 text-sm font-semibold text-white">실습 시작</span>
            </>
          ) : (
            <p className="mt-2 text-lg font-semibold">열린 케이스를 모두 마쳤습니다.</p>
          )}
        </button>
        <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: '전체 케이스', copy: '30개의 가상 환자', go: () => nav({ name: 'cases' }) },
          { label: '병리학 학습', copy: '세포손상부터 종양까지', go: () => nav({ name: 'learn' }) },
          { label: '나의 기록', copy: '점수, 오답노트, 배지', go: () => nav({ name: 'records' }) },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.go}
            className="rounded-[24px] border border-line bg-white px-5 py-4 text-left"
          >
            <p className="text-base font-semibold">{item.label}</p>
            <p className="mt-1 text-sm text-muted">{item.copy}</p>
          </button>
        ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-line bg-white p-5">
        <p className="text-xs font-semibold tracking-[0.16em] text-muted">실습 흐름</p>
        <ol className="mt-3 grid gap-2 text-sm sm:grid-cols-4">
          {['환자를 만난다', '증상과 검사를 본다', '조직을 관찰한다', '간호 의미로 연결한다'].map((step, index) => (
            <li key={step} className="rounded-2xl bg-paper px-3 py-3">
              <span className="text-xs font-semibold text-teal">0{index + 1}</span>
              <p className="mt-1 font-medium">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h3 className="text-lg font-semibold">처음 추천 케이스</h3>
          <button type="button" className="text-sm font-semibold text-teal" onClick={() => nav({ name: 'cases' })}>
            전체 보기
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CASES.filter((item) => item.id <= 5).map((item) => {
            const open = isUnlocked(item.difficulty, solved)
            const finished = Boolean(state.best[item.id])
            return (
              <button
                key={item.id}
                type="button"
                disabled={!open}
                onClick={() => nav({ name: 'case', id: item.id })}
                className="rounded-[22px] border border-line bg-white p-4 text-left disabled:opacity-60"
              >
                <p className="text-xs font-semibold tracking-[0.14em] text-teal">CASE {caseNo(item.id)}</p>
                <p className="mt-2 text-sm font-semibold leading-5">{!open ? '잠긴 케이스' : finished ? item.title : item.teaser}</p>
                <p className="mt-2 text-xs text-muted">
                  {item.systemLabel} · {stars(item.difficulty)}
                  {finished ? ' · 완료' : ''}
                </p>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
