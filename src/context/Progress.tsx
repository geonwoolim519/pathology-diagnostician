import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AttemptRecord, Draft, ProgressState } from '../types'
import {
  applyCompletion,
  badgeList,
  EMPTY_PROGRESS,
  freshBadgeIds,
  loadProgress,
  saveProgress,
} from '../lib/logic'

interface ProgressApi {
  state: ProgressState
  acceptDisclaimer: () => void
  saveDraft: (draft: Draft) => void
  clearDraft: () => void
  completeCase: (attempt: AttemptRecord) => string[]
  noteWrong: (caseId: number, choice: string) => void
  resetAll: () => void
  markCard: (id: string) => void
  addScopeClick: () => void
}

const ProgressContext = createContext<ProgressApi | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadProgress())

  useEffect(() => {
    saveProgress(state)
  }, [state])

  const acceptDisclaimer = useCallback(() => {
    setState((prev) => ({ ...prev, disclaimerAccepted: true }))
  }, [])

  const saveDraft = useCallback((draft: Draft) => {
    setState((prev) => ({ ...prev, draft }))
  }, [])

  const clearDraft = useCallback(() => {
    setState((prev) => ({ ...prev, draft: null }))
  }, [])

  const completeCase = useCallback((attempt: AttemptRecord) => {
    let earned: string[] = []
    setState((prev) => {
      const next = applyCompletion(prev, attempt)
      earned = freshBadgeIds(prev, next)
      return next
    })
    return earned
  }, [])

  const noteWrong = useCallback((caseId: number, choice: string) => {
    setState((prev) => {
      const choices = prev.wrongNotes[caseId]?.choices ?? []
      if (choices.includes(choice)) return prev
      return {
        ...prev,
        wrongNotes: {
          ...prev.wrongNotes,
          [caseId]: { choices: [...choices, choice], at: new Date().toISOString() },
        },
      }
    })
  }, [])

  const resetAll = useCallback(() => {
    setState({ ...EMPTY_PROGRESS, disclaimerAccepted: true })
  }, [])

  const markCard = useCallback((id: string) => {
    setState((prev) => (prev.seenCards.includes(id) ? prev : { ...prev, seenCards: [...prev.seenCards, id] }))
  }, [])

  const addScopeClick = useCallback(() => {
    setState((prev) => ({ ...prev, microscopeClicks: prev.microscopeClicks + 1 }))
  }, [])

  const api: ProgressApi = {
    state,
    acceptDisclaimer,
    saveDraft,
    clearDraft,
completeCase,
      noteWrong,
      resetAll,
    markCard,
    addScopeClick,
  }

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('progress missing')
  return ctx
}

export function useBadges() {
  const { state } = useProgress()
  return badgeList(state)
}
