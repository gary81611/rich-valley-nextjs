import Link from 'next/link'
import type { AalVehicle } from '@/lib/aal-vehicles'

type Props = {
  vehicle: AalVehicle
  tone?: 'light' | 'dark'
  ctaHref?: string
  /** Stretch to grid cell height. Off for stacked service-detail columns (avoids footer overlap). */
  fillHeight?: boolean
}

/** Same card on every AAL surface. Photo omitted until Kit supplies the actual vehicle. */
export default function VehicleCard({
  vehicle,
  tone = 'light',
  ctaHref = '/reservations',
  fillHeight = true,
}: Props) {
  const dark = tone === 'dark'
  const height = fillHeight ? ' h-full' : ''
  return (
    <article
      className={
        dark
          ? `bg-alp-navy rounded-2xl border border-white/10 p-8 flex flex-col${height}`
          : `bg-white rounded-2xl border border-alp-pearl-dark shadow-sm p-8 flex flex-col${height}`
      }
    >
      {/* [PENDING FROM KIT: photo of the actual {vehicle.name}. Do not use escalade.png or sprinter.png.] */}
      <h2 className={`font-playfair text-2xl font-bold mb-2 ${dark ? 'text-white' : 'text-alp-navy'}`}>
        {vehicle.name}
      </h2>
      <p className={`text-sm font-semibold mb-6 ${dark ? 'text-alp-gold' : 'text-alp-gold-700'}`}>
        {vehicle.capacityLabel}
      </p>
      <ul className="flex flex-wrap gap-2 mb-8">
        {vehicle.amenities.map((amenity) => (
          <li
            key={amenity}
            className={
              dark
                ? 'text-xs font-semibold uppercase tracking-wide text-white/80 border border-white/15 rounded-full px-3 py-1.5'
                : 'text-xs font-semibold uppercase tracking-wide text-alp-navy bg-alp-pearl rounded-full px-3 py-1.5'
            }
          >
            {amenity}
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={`${fillHeight ? 'mt-auto ' : ''}inline-flex items-center justify-center bg-alp-gold text-alp-navy font-semibold px-6 py-3 rounded-full hover:bg-alp-gold-light transition-colors`}
      >
        Book online
      </Link>
    </article>
  )
}
