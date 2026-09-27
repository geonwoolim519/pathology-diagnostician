import { useMemo, useRef, useState } from 'react'
import type { ObservationPoint, SlideTheme } from '../types'

const MAGS = [40, 100, 400] as const

function hash(value: string) {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) h = Math.imul(h ^ value.charCodeAt(i), 16777619)
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function dots(theme: string, count: number, min: number, span: number) {
  const rand = mulberry32(hash(theme))
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: rand() * 100,
    y: rand() * 100,
    r: min + rand() * span,
    tilt: rand() * 40 - 20,
  }))
}

function Field({ theme }: { theme: SlideTheme }) {
  const nuclei = useMemo(() => dots(theme, 70, 0.7, 1.1), [theme])
  const pink = '#f4c3d2'
  const nucleus = '#6b2d86'
  const deep = '#4c1d6b'

  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <rect width="100" height="100" fill={pink} />
      {theme === 'steatosis' || theme === 'normal-liver' ? <rect width="100" height="100" fill="#f7d2c4" /> : null}
      {theme === 'cartilage' ? <rect width="100" height="100" fill="#d5eef3" /> : null}
      {theme === 'atheroma' || theme === 'normal-vessel' ? <rect width="100" height="100" fill="#f6d8c8" /> : null}
      {theme === 'emphysema' || theme === 'alveoli-exudate' || theme === 'normal-lung' ? (
        <rect width="100" height="100" fill="#f8e4ea" />
      ) : null}
      {theme === 'rbc-micro' || theme === 'normal-blood' || theme === 'blasts' ? (
        <rect width="100" height="100" fill="#fdeff1" />
      ) : null}

      {theme === 'mucosa-acute' || theme === 'normal-mucosa' || theme === 'ulcer' || theme === 'urothelium' ? (
        <g>
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x={8 + i * 12} y={38} width={7} height={48} rx={3} fill="#f7d5e0" stroke="#e7a8bc" />
          ))}
          <path d="M0 22 C20 16 30 28 50 20 C70 12 80 26 100 18 V0 H0 Z" fill="#f8d0dc" />
          {theme === 'ulcer' ? (
            <path d="M34 18 C40 36 48 48 62 42 C58 28 50 22 40 16 Z" fill="#e8b3c4" stroke="#9a4d68" />
          ) : null}
          {theme === 'mucosa-acute'
            ? nuclei
                .filter((dot) => dot.y < 36)
                .map((dot) => <circle key={dot.id} cx={dot.x} cy={dot.y * 0.7 + 6} r={0.8} fill={deep} />)
            : null}
        </g>
      ) : null}

      {theme === 'benign-glands' || theme === 'normal-colon' ? (
        <g>
          {Array.from({ length: 8 }, (_, i) => (
            <ellipse key={i} cx={12 + (i % 4) * 22} cy={28 + Math.floor(i / 4) * 40} rx={7} ry={14} fill="#fde7ef" stroke="#c46b8b" />
          ))}
        </g>
      ) : null}

      {theme === 'malignant-glands' || theme === 'hcc' || theme === 'malignant-sheets' ? (
        <g>
          {Array.from({ length: 9 }, (_, i) => (
            <path
              key={i}
              d={`M${10 + (i % 3) * 30} ${16 + Math.floor(i / 3) * 28} c6 -8 16 2 12 12 c8 4 -2 16 -12 10 c-8 6 -16 -2 -10 -10 c-8 -4 2 -14 10 -12z`}
              fill="#f6d5e4"
              stroke={deep}
              strokeWidth={0.6}
            />
          ))}
        </g>
      ) : null}

      {theme === 'steatosis' ? (
        <g>
          {dots('fat', 18, 0, 0).length
            ? Array.from({ length: 16 }, (_, i) => (
                <g key={i} transform={`translate(${8 + (i % 4) * 23} ${10 + Math.floor(i / 4) * 22})`}>
                  <circle cx="8" cy="8" r="7" fill="#fff8f4" stroke="#e7b8a8" />
                  <circle cx="12" cy="11" r="1.1" fill={nucleus} />
                </g>
              ))
            : null}
        </g>
      ) : null}

      {theme === 'cirrhosis' ? (
        <g>
          <path d="M30 0 C34 30 28 50 36 100" stroke="#9eb4c4" strokeWidth="5" fill="none" />
          <path d="M62 0 C54 40 70 60 58 100" stroke="#8eabbf" strokeWidth="4" fill="none" />
          <path d="M0 48 C30 40 60 58 100 46" stroke="#a9c0ce" strokeWidth="4" fill="none" />
        </g>
      ) : null}

      {theme === 'fat-necrosis' ? (
        <g>
          {Array.from({ length: 10 }, (_, i) => (
            <circle
              key={i}
              cx={16 + (i % 5) * 17}
              cy={24 + Math.floor(i / 5) * 40}
              r="7"
              fill="#f3eee8"
              stroke="#b9a394"
            />
          ))}
        </g>
      ) : null}

      {theme === 'neutrophil-wall' ? <rect x="0" y="34" width="100" height="28" fill="#efb7cb" /> : null}

      {theme === 'alveoli-exudate' || theme === 'emphysema' || theme === 'normal-lung' ? (
        <g>
          {Array.from({ length: theme === 'emphysema' ? 5 : 12 }, (_, i) => (
            <circle
              key={i}
              cx={18 + (i % 4) * 22}
              cy={20 + Math.floor(i / 4) * 28}
              r={theme === 'emphysema' ? 16 : 9}
              fill={theme === 'alveoli-exudate' && i % 2 === 0 ? '#f6c6d6' : '#fff7f8'}
              stroke="#e3a9bb"
            />
          ))}
        </g>
      ) : null}

      {theme === 'granuloma' ? (
        <g>
          <circle cx="50" cy="50" r="22" fill="#f7e7cf" stroke="#c9a27a" />
          <circle cx="50" cy="50" r="28" fill="none" stroke={nucleus} strokeWidth="3" opacity="0.45" />
        </g>
      ) : null}

      {theme === 'airway' ? (
        <g>
          <circle cx="50" cy="50" r="28" fill="#f8d5c8" />
          <circle cx="50" cy="50" r="16" fill="#fff6f2" />
          <circle cx="50" cy="50" r="22" fill="none" stroke="#8d4d73" strokeWidth="3" />
        </g>
      ) : null}

      {theme === 'fibroadenoma' || theme === 'normal-breast' ? (
        <g>
          {Array.from({ length: 6 }, (_, i) => (
            <rect
              key={i}
              x={18 + (i % 3) * 22}
              y={22 + Math.floor(i / 3) * 34}
              width="16"
              height="4"
              rx="2"
              transform={`rotate(${i % 2 ? -18 : 12} ${26 + (i % 3) * 22} ${24 + Math.floor(i / 3) * 34})`}
              fill="#fde8f0"
              stroke="#b85d7e"
            />
          ))}
        </g>
      ) : null}

      {theme === 'smooth-muscle' || theme === 'normal-uterus' || theme === 'normal-heart' || theme === 'myocyte' ? (
        <g>
          {Array.from({ length: 8 }, (_, i) => (
            <rect
              key={i}
              x={-10}
              y={8 + i * 11}
              width="120"
              height="7"
              rx="3"
              fill={theme === 'myocyte' && i > 3 && i < 6 ? '#e7d3c6' : '#f7d0dc'}
              transform={`rotate(${i % 2 ? -8 : 7} 50 50)`}
            />
          ))}
        </g>
      ) : null}

      {theme === 'squamous' ? (
        <g>
          {Array.from({ length: 18 }, (_, i) => (
            <rect key={i} x={8 + (i % 6) * 15} y={10 + Math.floor(i / 6) * 28} width="12" height="16" rx="3" fill="#f8d7e3" stroke={deep} />
          ))}
        </g>
      ) : null}

      {theme === 'ectopic' ? (
        <g>
          <ellipse cx="36" cy="42" rx="10" ry="7" fill="#fde7ef" stroke="#b85d7e" />
          <ellipse cx="62" cy="58" rx="8" ry="6" fill="#fde7ef" stroke="#b85d7e" />
          <circle cx="48" cy="70" r="1.4" fill="#8a5a32" />
          <circle cx="52" cy="74" r="1.2" fill="#8a5a32" />
        </g>
      ) : null}

      {theme === 'glomerulus' || theme === 'glomerulus-protein' || theme === 'normal-kidney' ? (
        <g>
          <circle cx="50" cy="46" r="18" fill="none" stroke="#d989a4" />
          <circle cx="50" cy="46" r="11" fill={theme === 'glomerulus' ? '#e7b4c8' : '#f6d5e1'} />
          {Array.from({ length: 5 }, (_, i) => (
            <ellipse key={i} cx={18 + i * 16} cy="78" rx="6" ry="4" fill="#fde8ef" stroke="#e2a9bd" />
          ))}
        </g>
      ) : null}

      {theme === 'clear-cell' ? (
        <g>
          {Array.from({ length: 12 }, (_, i) => (
            <rect key={i} x={8 + (i % 4) * 23} y={12 + Math.floor(i / 4) * 28} width="16" height="16" fill="#fffaf7" stroke="#d7a08a" />
          ))}
        </g>
      ) : null}

      {theme === 'rbc-micro' || theme === 'normal-blood' ? (
        <g>
          {dots(theme + 'rbc', 42, 0, 0).map((dot, i) => (
            <ellipse
              key={dot.id}
              cx={dot.x}
              cy={dot.y}
              rx={theme === 'rbc-micro' ? 2.1 : 2.8}
              ry={theme === 'rbc-micro' ? 1.5 : 2.2}
              fill="none"
              stroke={i % 5 === 0 ? '#e07a8c' : '#d4536c'}
              strokeWidth="0.7"
            />
          ))}
        </g>
      ) : null}

      {theme === 'blasts' ? (
        <g>
          {Array.from({ length: 14 }, (_, i) => (
            <g key={i}>
              <circle cx={12 + (i % 4) * 22} cy={16 + Math.floor(i / 4) * 24} r="7" fill="#f7e4ee" stroke="#c47aa0" />
              <circle cx={12 + (i % 4) * 22} cy={16 + Math.floor(i / 4) * 24} r="4.2" fill={nucleus} />
            </g>
          ))}
        </g>
      ) : null}

      {theme === 'atheroma' ? (
        <g>
          <rect x="0" y="28" width="100" height="44" fill="#f3cbb8" />
          <ellipse cx="50" cy="50" rx="24" ry="12" fill="#f6e27a" opacity="0.9" />
          <rect x="0" y="62" width="100" height="10" fill="#e7b39a" />
        </g>
      ) : null}

      {theme === 'normal-vessel' ? <rect x="18" y="0" width="64" height="100" fill="#fff7f4" /> : null}

      {theme === 'synovium' ? (
        <g>
          <path d="M0 24 H100 V40 H0 Z" fill="#eab4c8" />
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={10 + i * 12} cy={32} r="2.2" fill={deep} />
          ))}
        </g>
      ) : null}

      {theme === 'cartilage' ? (
        <g>
          <path d="M0 16 C20 28 40 8 60 18 C80 28 90 12 100 20" fill="none" stroke="#7aa8b4" strokeWidth="1.4" />
          {Array.from({ length: 10 }, (_, i) => (
            <ellipse key={i} cx={14 + (i % 5) * 18} cy={36 + Math.floor(i / 5) * 28} rx="4" ry="3" fill="#eef8fb" stroke="#6e9aa8" />
          ))}
        </g>
      ) : null}

      {nuclei.map((dot) => (
        <ellipse
          key={dot.id}
          cx={dot.x}
          cy={dot.y}
          rx={dot.r}
          ry={dot.r * 0.78}
          transform={`rotate(${dot.tilt} ${dot.x} ${dot.y})`}
          fill={dot.id % 4 === 0 ? deep : nucleus}
          opacity={theme === 'emphysema' || theme === 'rbc-micro' || theme === 'normal-blood' ? 0.25 : 0.9}
        />
      ))}
    </svg>
  )
}

const SPOTS = [
  { x: 32, y: 38 },
  { x: 64, y: 46 },
  { x: 48, y: 68 },
]

export function Microscope({
  theme,
  points,
  onObserve,
}: {
  theme: SlideTheme
  points: ObservationPoint[]
  onObserve?: () => void
}) {
  const [mag, setMag] = useState(1)
  const [active, setActive] = useState<number | null>(null)
  const seen = useRef(new Set<number>())
  function openPoint(index: number) {
    setActive(index)
    if (seen.current.has(index)) return
    seen.current.add(index)
    onObserve?.()
  }
  const scale = mag === 0 ? 1 : mag === 1 ? 1.65 : 2.45
  const current = active === null ? null : points[active]

  return (
    <div className="rounded-[28px] bg-[#10283f] p-4 text-white">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[11px] tracking-[0.16em] text-teal-bright">MICROSCOPE</p>
        <p className="text-xs text-white/70">교육용 일러스트</p>
      </div>
      <div className="mx-auto w-full max-w-[320px]">
        <div className="relative aspect-square">
          <div className="absolute inset-[7%] rounded-full bg-teal-bright/30 blur-2xl" />
          <div className="absolute inset-0 rounded-full border-[10px] border-[#071525] bg-black shadow-[inset_0_0_0_8px_#d7e2ec]" />
          <div className="absolute inset-[18px] overflow-hidden rounded-full bg-[#f4c3d2]">
            <div className="scope-zoom h-full w-full" style={{ transform: `scale(${scale})` }}>
              <Field theme={theme} />
              {points.map((point, index) => (
                <button
                  key={point.label}
                  type="button"
                  className={`absolute z-10 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white text-[11px] font-bold shadow ${
                    active === index ? 'bg-teal text-white' : 'bg-navy/80 text-white'
                  }`}
                  style={{ left: `${SPOTS[index].x}%`, top: `${SPOTS[index].y}%` }}
                  onClick={() => openPoint(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <button
          type="button"
          className="h-10 w-10 rounded-full bg-white/10 text-lg"
          onClick={() => setMag((value) => Math.max(0, value - 1))}
          aria-label="배율 낮추기"
        >
          −
        </button>
        <div className="min-w-24 rounded-full bg-white/10 px-4 py-2 text-center text-sm font-semibold tabular-nums">
          {MAGS[mag]}×
        </div>
        <button
          type="button"
          className="h-10 w-10 rounded-full bg-white/10 text-lg"
          onClick={() => setMag((value) => Math.min(2, value + 1))}
          aria-label="배율 높이기"
        >
          +
        </button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {points.map((point, index) => (
          <button
            key={point.label}
            type="button"
            className={`rounded-2xl px-2 py-2 text-xs font-semibold ${
              active === index ? 'bg-teal-bright text-navy' : 'bg-white/10 text-white'
            }`}
            onClick={() => openPoint(index)}
          >
            {point.label}
          </button>
        ))}
      </div>
      {current ? (
        <div className="rise mt-3 rounded-2xl bg-white p-3 text-sm leading-6 text-ink">
          <p className="text-xs font-semibold text-teal">{current.label}</p>
          <p className="mt-1">{current.text}</p>
        </div>
      ) : (
        <p className="mt-3 text-center text-xs leading-5 text-white/60">번호를 누르면 관찰 포인트가 열립니다.</p>
      )}
    </div>
  )
}

export function CompareSlide({ theme, caption }: { theme: SlideTheme; caption: string }) {
  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-[24px] border border-line bg-white">
        <Field theme={theme} />
      </div>
      <p className="mt-2 text-center text-xs font-semibold tracking-[0.14em] text-muted">{caption}</p>
    </div>
  )
}
