import type { RichTextSpan } from '@/lib/notion'

export function RichText({ spans }: { spans: RichTextSpan[] }) {
  return (
    <>
      {spans.map((span, index) => {
        const style = {
          fontWeight: span.annotations.bold ? 700 : undefined,
          fontStyle: span.annotations.italic ? 'italic' : undefined,
          textDecoration: [span.annotations.underline ? 'underline' : '', span.annotations.strikethrough ? 'line-through' : ''].filter(Boolean).join(' ') || undefined,
          fontFamily: span.annotations.code ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : undefined
        } as const

        const content = <span style={style}>{span.plainText}</span>
        return span.href ? <a key={index} href={span.href}>{content}</a> : <span key={index}>{content}</span>
      })}
    </>
  )
}
