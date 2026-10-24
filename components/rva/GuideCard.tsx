import Image from 'next/image'
import type { PublicGuide } from '@/lib/rva-guides'

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
}

/** Shared guide card for /guides and /about. Missing photos show initials, not a “coming soon” label. */
export default function GuideCard({ guide }: { guide: PublicGuide }) {
  const tags = (guide.specialties || []).filter(Boolean).slice(0, 2)
  const photo = (guide.photo_url || '').trim()
  const bio = (guide.bio || '').trim()

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-rva-forest/15 bg-white">
      <div className="relative aspect-[4/5] bg-rva-forest-dark">
        {photo ? (
          <Image
            src={photo}
            alt={guide.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-playfair text-5xl text-white/80" aria-hidden>
              {initials(guide.name)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="font-playfair text-[22px] font-semibold leading-7 text-rva-forest">{guide.name}</h2>
        {guide.title ? <p className="mt-1 text-sm font-semibold text-rva-copper-700">{guide.title}</p> : null}
        {tags.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag} className="rounded-full border border-rva-forest/15 px-2.5 py-1 text-xs text-rva-forest">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        {bio ? (
          <details className="group mt-3">
            <summary className="cursor-pointer list-none">
              <span className="line-clamp-4 text-sm leading-6 text-rva-forest/80 group-open:line-clamp-none">{bio}</span>
              <span className="mt-2 block text-sm font-semibold text-rva-copper-700 group-open:hidden">Read bio</span>
            </summary>
          </details>
        ) : null}
      </div>
    </article>
  )
}
