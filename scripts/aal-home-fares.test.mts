import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { applyConfirmedPricingRoutes, buildHomeFares } from '../lib/aal-published-rates.ts'

describe('AAL home fares from published routes', () => {
  const fares = buildHomeFares(applyConfirmedPricingRoutes([]))

  it('uses the pricing-page airport rates, and ASE Transit is Quote', () => {
    assert.equal(fares.airports.ase.suv, '$210')
    assert.equal(fares.airports.ase.transit, 'Quote')
    assert.equal(fares.airports.ege.suv, '$720')
    assert.equal(fares.airports.ege.transit, '$1,200')
    assert.equal(fares.airports.den.suv, '$1,375')
    assert.equal(fares.airports.den.transit, '$1,600')
    assert.equal(fares.airports.ril.suv, '$720')
    assert.equal(fares.airports.ril.transit, '$1,200')
  })

  it('builds the route-card note from those same rates', () => {
    assert.equal(
      fares.alsoNote,
      'Also Rifle ($720), Grand Junction ($950) and Centennial ($1,475). Holiday pricing may change seasonally.',
    )
    assert.equal(fares.routes.find((route) => route.id === 'ase')?.meta, 'About 5 mi · 10 min to Aspen')
    assert.equal(fares.suburbanFrom, 'From $210 · ASE')
    assert.equal(fares.transitFrom, 'From $1,200 · EGE')
  })

  it('does not invent an ASE transit price when the route note is empty', () => {
    const custom = applyConfirmedPricingRoutes([
      {
        route_name: 'ASE Airport to Aspen',
        category: 'airport-inbound',
        origin: 'ASE Airport',
        destination: 'Aspen',
        distance: '~5 mi',
        drive_time: '10 min',
        suv_price: 210,
        price_note: 'call for van',
        display_order: 1,
      },
    ])
    const board = buildHomeFares(custom)
    assert.equal(board.airports.ase.transit, 'Quote')
    assert.equal(board.airports.ase.suv, '$210')
  })
})
