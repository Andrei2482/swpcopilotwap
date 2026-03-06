import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExternalLinkModalProps {
    url: string | null
    onClose: () => void
    onAlwaysAllow: () => void
}

export function ExternalLinkModal({ url, onClose, onAlwaysAllow }: ExternalLinkModalProps) {
    const [dontAsk, setDontAsk] = useState(false)

    function handleOpen() {
        if (dontAsk) onAlwaysAllow()
        window.open(url ?? '', '_blank', 'noopener,noreferrer')
        onClose()
    }

    const host = (() => { try { return new URL(url ?? '').hostname } catch { return url ?? '' } })()

    return (
        <Dialog open={!!url} onOpenChange={o => !o && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20">
                            <ExternalLink className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                        </div>
                        Leaving SwordigoPlus
                    </DialogTitle>
                    <DialogDescription>
                        You're about to open an external site:
                        <span className="block mt-2 rounded-lg border border-border/40 bg-muted/30 px-3 py-2 font-mono text-[12px] text-foreground break-all">
                            {host}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <label className="flex items-center gap-2.5 cursor-pointer select-none" htmlFor="dont-ask-link">
                    <div
                        className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-all duration-150"
                        style={{
                            background: dontAsk ? 'hsl(var(--primary))' : 'transparent',
                            borderColor: dontAsk ? 'hsl(var(--primary))' : 'hsl(var(--border) / 0.7)',
                        }}
                    >
                        {dontAsk && (
                            <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                                <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                        <input
                            id="dont-ask-link"
                            type="checkbox"
                            checked={dontAsk}
                            onChange={e => setDontAsk(e.target.checked)}
                            className="sr-only"
                        />
                    </div>
                    <span className="text-[13px] text-muted-foreground leading-snug">
                        Don't ask me again when visiting external links
                    </span>
                </label>

                <DialogFooter>
                    <button
                        type="button"
                        onClick={onClose}
                        className={cn(
                            'inline-flex h-9 items-center justify-center rounded-xl px-4 text-[13px] font-medium',
                            'border border-border/50 text-foreground hover:bg-muted/50',
                            'active:scale-95 transition-all duration-150',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                        )}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleOpen}
                        className={cn(
                            'inline-flex h-9 items-center justify-center gap-1.5 rounded-xl px-4 text-[13px] font-medium',
                            'bg-primary text-primary-foreground hover:brightness-110',
                            'active:scale-95 transition-all duration-150',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                        )}
                    >
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        Open link
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
