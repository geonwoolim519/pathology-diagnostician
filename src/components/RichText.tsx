import { splitGlossary } from '../data/glossary'

export function RichText({ text, onTerm }: { text: string; onTerm: (term: string) => void }) {
  const parts = splitGlossary(text)
  return (
    <>
      {parts.map((part, index) =>
        part.term ? (
          <button
            key={`${part.term}-${index}`}
            type="button"
            className="mx-0.5 inline rounded-md bg-mist px-1 py-0.5 font-semibold text-teal underline decoration-teal/30 underline-offset-2"
            onClick={() => onTerm(part.term!)}
          >
            {part.text}
          </button>
        ) : (
          <span key={`t-${index}`}>{part.text}</span>
        ),
      )}
    </>
  )
}
