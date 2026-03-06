import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & { inset?: boolean }
>(({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
        ref={ref}
        className={cn(
            'flex cursor-default select-none items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none',
            'focus:bg-[hsl(var(--muted)/0.6)] focus:text-foreground',
            'data-[state=open]:bg-[hsl(var(--muted)/0.6)]',
            inset && 'pl-8', className
        )}
        {...props}
    >
        {children}
        <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />
    </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
        ref={ref}
        className={cn(
            'z-50 min-w-[8rem] overflow-hidden rounded-xl p-1',
            'bg-[hsl(var(--surface-raised)/0.92)] backdrop-blur-2xl',
            'border border-[hsl(var(--border)/0.6)]',
            'shadow-[0_12px_40px_hsl(222_25%_4%/0.55),0_2px_8px_hsl(222_25%_4%/0.3)]',
            'text-[hsl(var(--foreground))]',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            className
        )}
        {...props}
    />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
    <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                'z-50 min-w-[10rem] overflow-hidden rounded-xl p-1',
                /* Glassmorphism — semi-transparent + strong blur */
                'bg-[hsl(var(--surface-raised)/0.88)] backdrop-blur-2xl',
                'border border-[hsl(var(--border)/0.55)]',
                'shadow-[0_16px_48px_hsl(222_25%_4%/0.6),0_4px_12px_hsl(222_25%_4%/0.35)]',
                'text-[hsl(var(--foreground))]',
                /* Animations */
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                'data-[side=bottom]:slide-in-from-top-1.5 data-[side=top]:slide-in-from-bottom-1.5',
                'data-[side=left]:slide-in-from-right-1.5 data-[side=right]:slide-in-from-left-1.5',
                'duration-150',
                className
            )}
            {...props}
        />
    </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
        ref={ref}
        className={cn(
            'relative flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm outline-none',
            'transition-colors duration-100',
            'focus:bg-[hsl(var(--muted)/0.6)] focus:text-foreground',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
            '[&_svg]:pointer-events-none [&_svg]:h-3.5 [&_svg]:w-3.5 [&_svg]:shrink-0 [&_svg]:text-muted-foreground/70',
            'focus:[&_svg]:text-foreground',
            inset && 'pl-8',
            className
        )}
        {...props}
    />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
        ref={ref}
        className={cn(
            'relative flex cursor-pointer select-none items-center rounded-lg py-1.5 pl-8 pr-2.5 text-sm outline-none transition-colors',
            'focus:bg-[hsl(var(--muted)/0.6)] focus:text-foreground',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
            className
        )}
        checked={checked}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <DropdownMenuPrimitive.ItemIndicator>
                <Check className="h-3.5 w-3.5 text-primary" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
        ref={ref}
        className={cn(
            'relative flex cursor-pointer select-none items-center rounded-lg py-1.5 pl-8 pr-2.5 text-sm outline-none transition-colors',
            'focus:bg-[hsl(var(--muted)/0.6)] focus:text-foreground',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
            className
        )}
        {...props}
    >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <DropdownMenuPrimitive.ItemIndicator>
                <Circle className="h-2 w-2 fill-primary text-primary" />
            </DropdownMenuPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & { inset?: boolean }
>(({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
        ref={ref}
        className={cn('px-2.5 py-2 text-xs text-muted-foreground', inset && 'pl-8', className)}
        {...props}
    />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
    React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
        ref={ref}
        className={cn('-mx-1 my-1 h-px bg-[hsl(var(--border)/0.5)]', className)}
        {...props}
    />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span className={cn('ml-auto text-[10px] tracking-widest text-muted-foreground/40', className)} {...props} />
)
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup,
    DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent,
    DropdownMenuSubTrigger, DropdownMenuRadioGroup,
}
