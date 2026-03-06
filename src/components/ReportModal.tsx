import { useState, type FormEvent } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

const REPORT_REASONS = [
    { value: 'harmful', label: 'The message contains harmful information' },
    { value: 'policy', label: 'The content breaks our policies' },
    { value: 'imprecise', label: "The message isn't precise" },
    { value: 'other', label: 'Other (specify below)' },
] as const

interface ReportModalProps {
    open: boolean
    onClose: () => void
    onSubmit: (reason: string, details: string) => void
}

export function ReportModal({ open, onClose, onSubmit }: ReportModalProps) {
    const [reason, setReason] = useState<string>('')
    const [details, setDetails] = useState('')
    const [submitted, setSubmitted] = useState(false)

    function reset() {
        setReason('')
        setDetails('')
        setSubmitted(false)
    }

    function handleClose() {
        reset()
        onClose()
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (!reason) return
        onSubmit(reason, details)
        setSubmitted(true)
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(o: boolean) => {
                if (!o) handleClose()
            }}
        >
            <DialogContent aria-describedby="report-desc">
                {submitted ? (
                    <div className="py-4 flex flex-col items-center gap-3 text-center animate-fade-in">
                        <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-primary" aria-hidden="true">
                                <path
                                    d="M5 13l4 4L19 7"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <DialogHeader>
                            <DialogTitle>Report submitted</DialogTitle>
                            <DialogDescription id="report-desc">
                                Thanks for helping keep Copilot safe. We'll review your report.
                            </DialogDescription>
                        </DialogHeader>
                        <Button
                            onClick={handleClose}
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            autoFocus
                        >
                            Close
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate>
                        <DialogHeader className="mb-4">
                            <DialogTitle>Report message</DialogTitle>
                            <DialogDescription id="report-desc">
                                Help us understand what went wrong with this response.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                            {/* Reason selector */}
                            <div className="space-y-1.5">
                                <label htmlFor="report-reason" className="text-xs font-medium text-muted-foreground">
                                    Reason <span aria-hidden="true" className="text-destructive">*</span>
                                </label>
                                <Select value={reason} onValueChange={setReason} required>
                                    <SelectTrigger id="report-reason" aria-required="true">
                                        <SelectValue placeholder="Select a reason…" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REPORT_REASONS.map((r) => (
                                            <SelectItem key={r.value} value={r.value}>
                                                {r.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Optional details */}
                            <div className="space-y-1.5">
                                <label htmlFor="report-details" className="text-xs font-medium text-muted-foreground">
                                    {reason === 'other' ? 'Details (required)' : 'Additional details'}
                                </label>
                                <textarea
                                    id="report-details"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    rows={3}
                                    placeholder="Describe the issue…"
                                    aria-required={reason === 'other' ? 'true' : 'false'}
                                    className="flex w-full resize-none rounded-lg border border-input bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                        </div>

                        <DialogFooter className="mt-5 gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={!reason || (reason === 'other' && !details.trim())}
                            >
                                Submit report
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
