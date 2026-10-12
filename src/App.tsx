import { useEffect, useState } from 'react'
import { findGlossary } from './data/glossary'
import { ProgressProvider, useProgress } from './context/Progress'
import { NavigateContext, TermContext, type Page } from './nav'
import { Home } from './pages/Home'
import { Cases } from './pages/Cases'
import { CasePlay } from './pages/CasePlay'
import { Learn } from './pages/Learn'
import { Records } from './pages/Records'
import { CASES } from './data/cases'
import { solvedCount } from './lib/logic'

const NAV = [
  { name: 'home' as const, label: '홈' },
  { name: 'cases' as const, label: '케이스' },
  { name: 'learn' as const, label: '학습' },
  { name: 'records' as const, label: '기록' },
]

function Gate() {
  const { acceptDisclaimer } = useProgress()
  return (
    <div className="min-h-screen bg-paper px-5 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <div className="rounded-[32px] bg-navy px-6 py-8 text-white card-shadow">
          <img src={`${import.meta.env.BASE_URL}icon-512.png`} alt="" className="mb-5 h-24 w-24" />
          <p className="text-[11px] font-semibold tracking-[0.22em] text-teal-bright">PATHOLOGY DIAGNOSTICIAN</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">병리진단의사</h1>
          <p className="mt-4 text-sm leading-6 text-white/70">간호학과 2학년을 위한 병리학 진단 시뮬레이션</p>
        </div>
        <div className="mt-4 rounded-[28px] bg-white p-6 card-shadow">
          <p className="text-sm font-semibold text-teal">실습 전 안내</p>
          <p className="mt-3 text-[15px] leading-7">
            본 콘텐츠는 간호학 병리학 학습을 위한 교육용 시뮬레이션입니다. 실제 환자의 진단이나 치료를 대신하지 않습니다.
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">모든 환자는 가상 사례입니다. 개인정보는 사용하지 않습니다.</p>
          <button
            type="button"
            className="mt-6 w-full rounded-2xl bg-teal px-4 py-3.5 text-sm font-semibold text-white"
            onClick={acceptDisclaimer}
          >
            교육용 시뮬레이션으로 시작
          </button>
        </div>
      </div>
    </div>
  )
}

function Frame() {
  const { state } = useProgress()
  const [page, setPage] = useState<Page>({ name: 'home' })
  const [term, setTerm] = useState<string | null>(null)
  const entry = term ? findGlossary(term) : undefined

  useEffect(() => {
    const title =
      page.name === 'case' ? `CASE ${String(page.id).padStart(2, '0')} · 병리진단의사` : '병리진단의사'
    document.title = title
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  if (!state.disclaimerAccepted) return <Gate />

  const current = page.name === 'case' ? 'cases' : page.name

  return (
    <NavigateContext.Provider value={setPage}>
      <TermContext.Provider value={setTerm}>
        <div className="min-h-screen lg:flex">
          <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col bg-navy px-5 py-6 text-white lg:flex">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-teal-bright">EDU LAB</p>
            <h1 className="mt-2 text-xl font-semibold">병리진단의사</h1>
            <p className="mt-1 text-[11px] tracking-[0.14em] text-white/50">PATHOLOGY DIAGNOSTICIAN</p>
            <nav className="mt-8 space-y-1">
              {NAV.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setPage({ name: item.name })}
                  className={`flex w-full items-center rounded-2xl px-3 py-3 text-left text-sm font-semibold ${
                    current === item.name ? 'bg-white text-navy' : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-auto rounded-2xl bg-white/10 p-3 text-xs leading-5 text-white/70">
              {solvedCount(state)}/{CASES.length} 해결
              <p className="mt-2">교육용 시뮬레이션. 실제 진료를 대신하지 않습니다.</p>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <header className="sticky top-0 z-30 border-b border-white/10 bg-navy text-white lg:hidden">
              <div className="flex items-center justify-between px-5 pb-3 pt-[max(12px,env(safe-area-inset-top))]">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.18em] text-teal-bright">PATHOLOGY DIAGNOSTICIAN</p>
                  <h1 className="text-lg font-semibold">병리진단의사</h1>
                </div>
                <span className="rounded-full border border-white/20 px-2.5 py-1 text-[11px]">교육용</span>
              </div>
            </header>
            <main className="px-4 py-5 pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:px-8 lg:py-8 lg:pb-10">
              {page.name === 'home' ? <Home /> : null}
              {page.name === 'cases' ? <Cases /> : null}
              {page.name === 'case' ? <CasePlay id={page.id} /> : null}
              {page.name === 'learn' ? <Learn /> : null}
              {page.name === 'records' ? <Records /> : null}
            </main>
          </div>

          <nav className="nav-shadow fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden">
            <div className="grid grid-cols-4 pb-[env(safe-area-inset-bottom)]">
              {NAV.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setPage({ name: item.name })}
                  className={`py-3 text-sm font-semibold ${current === item.name ? 'text-teal' : 'text-muted'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {entry ? (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 p-4 sm:items-center" onClick={() => setTerm(null)}>
            <div className="w-full max-w-md rounded-[28px] bg-white p-5 card-shadow" onClick={(event) => event.stopPropagation()}>
              <p className="text-xs font-semibold tracking-[0.16em] text-teal">용어</p>
              <h2 className="mt-1 text-2xl font-semibold">{entry.term}</h2>
              <p className="mt-3 text-sm leading-7">{entry.body}</p>
              <button type="button" className="mt-5 w-full rounded-2xl bg-navy py-3 text-sm font-semibold text-white" onClick={() => setTerm(null)}>
                닫기
              </button>
            </div>
          </div>
        ) : null}
      </TermContext.Provider>
    </NavigateContext.Provider>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <Frame />
    </ProgressProvider>
  )
}
