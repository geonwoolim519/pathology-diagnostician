import { createContext, useContext } from 'react'

export type Page =
  | { name: 'home' | 'cases' | 'learn' | 'records' }
  | { name: 'case'; id: number }

export const NavigateContext = createContext<(page: Page) => void>(() => {})
export const TermContext = createContext<(term: string) => void>(() => {})

export function useNavigate() {
  return useContext(NavigateContext)
}

export function useTerm() {
  return useContext(TermContext)
}
