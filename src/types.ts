export type Difficulty = 1 | 2 | 3

export type SystemId =
  | 'digestive'
  | 'respiratory'
  | 'cardiovascular'
  | 'urinary'
  | 'reproductive'
  | 'hematology'
  | 'musculoskeletal'
  | 'immune'

export type SlideTheme =
  | 'mucosa-acute'
  | 'ulcer'
  | 'malignant-glands'
  | 'benign-glands'
  | 'steatosis'
  | 'cirrhosis'
  | 'hcc'
  | 'fat-necrosis'
  | 'neutrophil-wall'
  | 'alveoli-exudate'
  | 'granuloma'
  | 'emphysema'
  | 'airway'
  | 'fibroadenoma'
  | 'malignant-sheets'
  | 'smooth-muscle'
  | 'squamous'
  | 'ectopic'
  | 'glomerulus'
  | 'glomerulus-protein'
  | 'clear-cell'
  | 'urothelium'
  | 'rbc-micro'
  | 'blasts'
  | 'atheroma'
  | 'myocyte'
  | 'synovium'
  | 'cartilage'
  | 'normal-mucosa'
  | 'normal-liver'
  | 'normal-lung'
  | 'normal-kidney'
  | 'normal-heart'
  | 'normal-colon'
  | 'normal-breast'
  | 'normal-uterus'
  | 'normal-blood'
  | 'normal-vessel'

export interface ObservationPoint {
  label: string
  text: string
}

export interface CaseData {
  id: number
  title: string
  teaser: string
  system: SystemId
  systemLabel: string
  filters: SystemId[]
  difficulty: Difficulty
  patient: { age: number; sex: '남성' | '여성'; line: string }
  symptoms: string[]
  history: string[]
  exam: string[]
  tests: { label: string; findings: string[] }[]
  pathology: { gross: string; micro: string; theme: SlideTheme }
  points: [ObservationPoint, ObservationPoint, ObservationPoint]
  clues: string[]
  options: [string, string, string, string]
  answer: string
  why: string[]
  pathophysiology: string
  nursing: {
    symptoms: string[]
    signs: string[]
    changes: string[]
    observation: string[]
    education: string[]
  }
  hints: [string, string, string]
  distractors: Record<string, string>
  tutor: { q: string; a: string }[]
}

export interface AttemptRecord {
  caseId: number
  score: number
  wrongChoices: string[]
  hintsUsed: number
  at: string
}

export interface Draft {
  caseId: number
  maxStep: number
  wrongCount: number
  hintsUsed: number
  wrongChoices: string[]
  phase: 'play' | 'wrong' | 'result'
}

export interface ProgressState {
  disclaimerAccepted: boolean
  best: Record<number, AttemptRecord>
  recent: AttemptRecord[]
  wrongNotes: Record<number, { choices: string[]; at: string }>
  draft: Draft | null
  seenCards: string[]
  microscopeClicks: number
  streak: number
  bestStreak: number
  celebrated: string[]
}
