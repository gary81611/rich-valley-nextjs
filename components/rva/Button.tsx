import Link from 'next/link'

export const RVA_BOOKING_LABEL = 'Check availability'
export const RVA_PHONE_LABEL = 'Call 970-456-3666'
export const RVA_PHONE_HREF = 'tel:+19704563666'

type Variant = 'primary' | 'secondary' | 'text'
type Size = 'md' | 'lg'
type Tone = 'on-light' | 'on-dark'

const sizeClass: Record<Size, string> = {
  md: 'min-h-12 px-6',
  lg: 'min-h-14 px-8',
}

const variantClass: Record<Variant, Record<Tone, string>> = {
  primary: {
    'on-light': 'bg-rva-copper-700 text-white hover:bg-rva-copper-800',
    'on-dark': 'bg-rva-copper-700 text-white hover:bg-rva-copper-800',
  },
  secondary: {
    'on-light': 'border-2 border-rva-forest text-rva-forest hover:bg-rva-forest hover:text-white',
    'on-dark': 'border-2 border-white text-white hover:bg-white hover:text-rva-forest',
  },
  text: {
    'on-light': 'text-rva-copper-700 underline underline-offset-2 hover:text-rva-forest min-h-11 px-0',
    'on-dark': 'text-rva-copper-light underline underline-offset-2 hover:text-white min-h-11 px-0',
  },
}

type Props = {
  href?: string
  children: React.ReactNode
  variant?: Variant
  size?: Size
  tone?: Tone
  className?: string
  external?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

/** RVA buttons: copper-700 fill, darker hover, pill, 48px or 56px. */
export default function RvaButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  tone = 'on-light',
  className = '',
  external = false,
  type = 'button',
  disabled = false,
  onClick,
}: Props) {
  const classes = [
    'inline-flex items-center justify-center rounded-full font-inter text-[15px] font-semibold transition-colors disabled:opacity-50',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#E8C4A0]',
    variant === 'text' ? '' : sizeClass[size],
    variantClass[variant][tone],
    className,
  ]
    .filter(Boolean)
    .join(' ')

  if (!href) {
    return (
      <button type={type} className={classes} disabled={disabled} onClick={onClick}>
        {children}
      </button>
    )
  }
  if (external || href.startsWith('tel:') || href.startsWith('http')) {
    return (
      <a href={href} className={classes} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
