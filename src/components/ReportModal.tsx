import { useState, type FormEvent } from 'react'
import { CheckCircle2, Flag } from 'lucide-react'
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const REASONS = [
    { value: 'inaccurate', label: 'Inaccurate information' },
    { value: 'harmful', label: 'Harmful or unsafe content' },
    { value: 'inappropriate', label: 'Inappropriate language' },
    { value: 'other', label: 'Other' },
]

interface ReportModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (reason: string, details: string) => void
}

export function ReportModal({ open, onClose, onSubmit }: ReportModalProps) {
    const [reason, setReason] = useState('')
    const [details, setDetails] = useState('')
    const [submitted, setSubmitted] = useState(false)

    function handleSubmit(e: FormEvent) {
        e.preventDefault()
        if (!reason) return
        onSubmit(reason, details)
        setSubmitted(true)
        setTimeout(() => {
            onClose()
            setSubmitted(false)
            setReason('')
            setDetails('')
        }, 1800)
    }

    function handleClose() {
        if (submitted) return
        onClose()
        setReason('')
        setDetails('')
    }

    return (
        <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
            <DialogContent className="sm:max-w-md">
                {submitted ? (
                    /* ── Success ── */
                    <div className="flex flex-col items-center gap-4 py-8 text-center animate-fade-in" aria-live="polite">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 border border-primary/25">
                            <CheckCircle2 className="h-7 w-7 text-primary" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-foreground">Report submitted</p>
                            <p className="mt-1 text-sm text-muted-foreground">Thank you for helping us improve Copilot.</p>
                        </div>
                    </div>
                ) : (
                    /* ── Form ── */
                    <>
                        <DialogHeader>
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-destructive/10 border border-destructive/20">
                                    <Flag className="h-4 w-4 text-destructive" aria-hidden="true" />
                                </div>
                                <DialogTitle>Report a response</DialogTitle>
                            </div>
                            <DialogDescription>
                                Help us understand what's wrong. We review every report.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            {/* Reason selector */}
                            <fieldset>
                                <legend className="sr-only">Reason</legend>
                                <div className="grid grid-cols-1 gap-2" role="radiogroup" aria-required="true">
                                    {REASONS.map((r) => (
                                        <label
                                            key={r.value}
                                            className={cn(
                                                'flex items-center gap-3 rounded-xl border px-3.5 py-3 cursor-pointer text-sm transition-all duration-150',
                                                'focus-within:ring-2 focus-within:ring-primary',
                                                reason === r.value
                                                    ? 'border-primary/50 bg-primary/6 text-foreground'
                                                    : 'border-border/50 bg-surface/60 text-muted-foreground hover:text-foreground hover:border-border'
                                            )}
                                        >
                                            <input
                                                type="radio"
                                                name="reason"
                                                value={r.value}
                                                checked={reason === r.value}
                                                onChange={() => setReason(r.value)}
                                                className="sr-only"
                                                aria-label={r.label}
                                            />
                                            <span className={cn(
                                                'flex h-4 w-4 shrink-0 rounded-full border-2 transition-colors',
                                                reason === r.value ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                                            )} aria-hidden="true" />
                                            {r.label}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            {/* Details */}
                            <div>
                                <label htmlFor="report-details" className="sr-only">Additional details</label>
                                <textarea
                                    id="report-details"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    placeholder="Additional details (optional)"
                                    rows={3}
                                    maxLength={500}
                                    className={cn(
                                        'w-full resize-none rounded-xl border border-border/50 bg-surface/60',
                                        'px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40',
                                        'focus:outline-none focus:border-primary/50 focus:bg-surface transition-all duration-150'
                                    )}
                                />
                                <p className="mt-1 text-right text-[10px] text-muted-foreground/40">{details.length}/500</p>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <Button type="button" variant="outline" className="flex-1 h-9" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!reason}
                                    className="flex-1 h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    aria-label="Submit report"
                                >
                                    Submit report
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
