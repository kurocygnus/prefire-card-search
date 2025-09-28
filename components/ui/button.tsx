import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        firstPage: 'bg-accent text-accent-foreground shadow-xs hover:bg-accent/80 rounded-full px-2',
        lastPage: 'bg-accent text-accent-foreground shadow-xs hover:bg-accent/80 rounded-full px-2',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

/**
 * Button component supporting multiple variants and sizes.
 * Now includes 'firstPage' and 'lastPage' variants for pagination navigation.
 *
 * Example usage for page navigation:
 * <Button variant="firstPage" aria-label="First Page">
 *   <svg>...</svg>
 * </Button>
 * <Button variant="lastPage" aria-label="Last Page">
 *   <svg>...</svg>
 * </Button>
 */
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  // Prevent nested <button> hydration error
  const ref = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development' && ref.current) {
      let parent = ref.current.parentElement;
      while (parent) {
        if (parent.tagName === 'BUTTON') {
          // eslint-disable-next-line no-console
          console.warn('Button: <button> cannot be a descendant of <button>. Rendering <span> instead.');
          break;
        }
        parent = parent.parentElement;
      }
    }
  }, []);

  let Comp: any = asChild ? Slot : 'button';
  let overrideTag = false;
  if (asChild && typeof window !== 'undefined' && ref.current) {
    let parent = ref.current.parentElement;
    while (parent) {
      if (parent.tagName === 'BUTTON') {
        Comp = 'span';
        overrideTag = true;
        break;
      }
      parent = parent.parentElement;
    }
  }

  return (
    <Comp
      ref={ref}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants }
