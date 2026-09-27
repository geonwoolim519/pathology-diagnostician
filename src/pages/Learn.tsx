import { useState } from 'react'
import { CompareSlide, Microscope } from '../components/Slide'
import { RichText } from '../components/RichText'
import { GLOSSARY } from '../data/glossary'
import { TOPICS } from '../data/learning'
import { ORGANS } from '../data/organs'
import { CASES, caseNo } from '../data/cases'
import { useProgress } from '../context/Progress'
import { useNavigate, useTerm } from '../nav'

type Tab = '개념' | '용어' | '비교' | '현미경'

export function Learn() {
  const [tab, setTab] = useState<Tab>('개념')
  const [topicId, setTopicId] = useState(TOPICS[0].id)
  const [organId, setOrganId] = useState(ORGANS[0].id)
  const [scopeId, setScopeId] = useState(1)
  const [termQuery, setTermQuery] = useState('')
  const { markCard, addScopeClick } = useProgress()
  const nav = useNavigate()
  const onTerm = useTerm()
  const topic = TOPICS.find((item) => item.id === topicId) ?? TOPICS[0]
  const organ = ORGANS.find((item) => item.id === organId) ?? ORGANS[0]
  const terms = GLOSSARY.filter((item) => item.term.includes(termQuery.trim()) || item.body.includes(termQuery.trim()))

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-4">
        <p className="text-xs font-semibold tracking-[0.16em] text-teal">STUDY ROOM</p>
        <h2 className="mt-1 text-2xl font-semibold">병리학 학습</h2>
        <p className="mt-1 text-sm text-muted">케이스 밖에 있는 기초 개념입니다. 전문의 수준의 분자병리는 다루지 않습니다.</p>
      </header>
      <div className="mb-4 grid grid-cols-4 gap-2 rounded-[20px] bg-white p-1">
        {(['개념', '용어', '비교', '현미경'] as Tab[]).map((item) => (
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

      {tab === '개념' ? (
        <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex gap-2 overflow-x-auto lg:flex-col">
            {TOPICS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTopicId(item.id)}
                className={`shrink-0 rounded-2xl px-3 py-3 text-left text-sm font-semibold lg:w-full ${
                  topic.id === item.id ? 'bg-navy text-white' : 'bg-white'
                }`}
              >
                <span className="block text-[11px] font-medium opacity-70">{item.kicker}</span>
                {item.title}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-sm leading-6 text-muted">{topic.summary}</p>
            {topic.cards.map((card) => (
              <article
                key={card.id}
                className="cursor-pointer rounded-[24px] bg-white p-4 card-shadow"
                onClick={() => markCard(`${topic.id}:${card.id}`)}
              >
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-7">
                  <RichText text={card.body} onTerm={onTerm} />
                </p>
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {card.points.map((point) => (
                    <li key={point}>· {point}</li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-mist px-3 py-1.5 text-xs font-semibold text-teal">카드를 누르면 학습 기록</span>
                  {card.related.map((id) => (
                    <button
                      key={id}
                      type="button"
                      className="rounded-full bg-paper px-3 py-1.5 text-xs font-semibold"
                      onClick={() => nav({ name: 'case', id })}
                    >
                      CASE {caseNo(id)}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      {tab === '용어' ? (
        <div>
          <input
            value={termQuery}
            onChange={(event) => setTermQuery(event.target.value)}
            placeholder="용어 검색"
            className="mb-3 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-teal"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {terms.map((item) => (
              <button
                key={item.term}
                type="button"
                onClick={() => onTerm(item.term)}
                className="rounded-[24px] bg-white p-4 text-left card-shadow"
              >
                <p className="text-base font-semibold">{item.term}</p>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {tab === '비교' ? (
        <div>
          <div className="mb-4 flex gap-2 overflow-x-auto">
            {ORGANS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setOrganId(item.id)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${
                  organ.id === item.id ? 'bg-navy text-white' : 'bg-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[28px] bg-white p-4 card-shadow">
              <CompareSlide theme={organ.normalTheme} caption="NORMAL" />
              <p className="mt-3 text-sm leading-6">{organ.normal}</p>
            </div>
            <div className="rounded-[28px] bg-white p-4 card-shadow">
              <CompareSlide theme={organ.pathTheme} caption="PATHOLOGY" />
              <p className="mt-3 text-sm font-semibold">{organ.pathTitle}</p>
              <p className="mt-1 text-sm leading-6">{organ.pathology}</p>
              <button
                type="button"
                className="mt-3 text-sm font-semibold text-teal"
                onClick={() => nav({ name: 'case', id: organ.caseId })}
              >
                관련 CASE {caseNo(organ.caseId)}
              </button>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted">실제 환자 조직이 아닌 교육용 일러스트입니다.</p>
        </div>
      ) : null}

      {tab === '현미경' ? (
        <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          <div className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">
            {CASES.slice(0, 8).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setScopeId(item.id)}
                className="shrink-0 rounded-2xl bg-white px-3 py-3 text-left text-sm font-semibold lg:w-full"
              >
                CASE {caseNo(item.id)}
                <span className="mt-1 block text-xs font-medium text-muted">{item.teaser}</span>
              </button>
            ))}
          </div>
          <ScopeLab caseId={scopeId} onObserve={addScopeClick} />
        </div>
      ) : null}
    </div>
  )
}

function ScopeLab({ caseId, onObserve }: { caseId: number; onObserve: () => void }) {
  const item = CASES.find((row) => row.id === caseId) ?? CASES[0]
  return (
    <div>
      <Microscope theme={item.pathology.theme} points={item.points} onObserve={onObserve} />
      <p className="mt-3 text-sm text-muted">
        {item.teaser} · 배율을 바꾸면 조직이 확대됩니다. 질환명은 케이스를 풀어야 공개됩니다.
      </p>
    </div>
  )
}
