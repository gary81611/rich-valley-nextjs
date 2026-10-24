import Image from 'next/image'
import Link from 'next/link'

type Props = {
  href: string
  title: string
  image?: string | null
  imageAlt?: string
  objectPosition?: string
  duration?: string | null
  level?: string | null
  excerpt?: string | null
  priceNote?: string | null
  cta?: string
}

/**
 * One RVA adventure card: 4:3 image, duration badge, no index number, hairline, equal height.
 * Skips the image when src is empty so a missing photo does not render a broken img.
 */
export default function AdventureCard({
  href,
  title,
  image,
  imageAlt,
  objectPosition,
  duration,
  level,
  excerpt,
  priceNote,
  cta = 'Learn more',
}: Props) {
  const src = (image || '').trim()
  const meta = [duration, level].filter((part) => part && part.trim()).join(' · ')

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-rva-forest/15 bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#E8C4A0]"
    >
      <div className="relative aspect-[4/3] bg-rva-forest-dark">
        {src ? (
          <Image
            src={src}
            alt={imageAlt || title}
            fill
            className="object-cover"
            style={objectPosition ? { objectPosition } : undefined}
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : null}
        {duration ? (
          <span className="absolute left-3 top-3 rounded-full bg-rva-forest/90 px-3 py-1 text-xs font-medium text-white">
            {duration}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-playfair text-[22px] font-semibold leading-7 text-rva-forest">{title}</h3>
        {meta ? <p className="mt-2 text-sm text-rva-forest/80">{meta}</p> : null}
        {priceNote ? <p className="mt-2 text-sm font-semibold text-rva-copper-700">{priceNote}</p> : null}
        {excerpt ? <p className="mt-3 line-clamp-3 text-[17px] leading-7 text-rva-forest/80">{excerpt}</p> : null}
        <span className="mt-auto inline-flex min-h-11 items-center pt-4 text-[15px] font-semibold text-rva-copper-700 group-hover:underline">
          {cta}
        </span>
      </div>
    </Link>
  )
}
