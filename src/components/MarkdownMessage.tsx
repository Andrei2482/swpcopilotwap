import { type ReactNode } from 'react'

interface Segment {
    type: 'text' | 'bold' | 'italic' | 'code' | 'link'
    content: string
    url?: string
}

function tokenize(text: string): Segment[] {
    const segments: Segment[] = []
    // Combined regex: **bold**, *italic*, `code`, [text](url)
    const re = /(\*\*(.+?)\*\*)|(\*(.+?)\*)|(`(.+?)`)|(\[(.+?)\]\((.+?)\))/g
    let lastIdx = 0
    let m: RegExpExecArray | null

    while ((m = re.exec(text)) !== null) {
        if (m.index > lastIdx) {
            segments.push({ type: 'text', content: text.slice(lastIdx, m.index) })
        }
        if (m[1]) {       // **bold**
            segments.push({ type: 'bold', content: m[2] })
        } else if (m[3]) { // *italic*
            segments.push({ type: 'italic', content: m[4] })
        } else if (m[5]) { // `code`
            segments.push({ type: 'code', content: m[6] })
        } else if (m[7]) { // [text](url)
            segments.push({ type: 'link', content: m[8], url: m[9] })
        }
        lastIdx = re.lastIndex
    }
    if (lastIdx < text.length) {
        segments.push({ type: 'text', content: text.slice(lastIdx) })
    }
    return segments
}

function isExternal(url: string): boolean {
    try {
        const host = new URL(url).hostname
        return !host.endsWith('.swordigoplus.cf') && host !== 'swordigoplus.cf'
    } catch {
        return false
    }
}

interface MarkdownMessageProps {
    content: string
    onExternalLink?: (url: string) => void
}

export function MarkdownMessage({ content, onExternalLink }: MarkdownMessageProps): ReactNode {
    // Split by newlines to preserve paragraphs
    const lines = content.split('\n')

    return (
        <div className="space-y-1.5 leading-relaxed">
            {lines.map((line, li) => {
                if (!line.trim()) return <div key={li} className="h-2" aria-hidden="true" />
                const segments = tokenize(line)
                return (
                    <p key={li} className="break-words">
                        {segments.map((seg, si) => {
                            if (seg.type === 'bold') return <strong key={si} className="font-semibold text-foreground">{seg.content}</strong>
                            if (seg.type === 'italic') return <em key={si} className="italic">{seg.content}</em>
                            if (seg.type === 'code') return (
                                <code
                                    key={si}
                                    className="rounded-md px-1.5 py-0.5 text-[0.85em] font-mono"
                                    style={{ background: 'hsl(var(--muted) / 0.7)', color: 'hsl(var(--foreground))' }}
                                >
                                    {seg.content}
                                </code>
                            )
                            if (seg.type === 'link') {
                                const url = seg.url ?? '#'
                                const ext = isExternal(url)
                                return (
                                    <button
                                        key={si}
                                        type="button"
                                        onClick={() => {
                                            if (ext && onExternalLink) {
                                                onExternalLink(url)
                                            } else {
                                                window.open(url, '_blank', 'noopener,noreferrer')
                                            }
                                        }}
                                        className="underline underline-offset-2 text-primary hover:opacity-80 transition-opacity duration-100 cursor-pointer"
                                        aria-label={ext ? `External link: ${seg.content}` : seg.content}
                                    >
                                        {seg.content}
                                    </button>
                                )
                            }
                            return <span key={si}>{seg.content}</span>
                        })}
                    </p>
                )
            })}
        </div>
    )
}
