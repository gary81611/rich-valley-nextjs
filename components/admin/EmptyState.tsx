'use client'

const emptyMessages: Record<string, { title: string; description: string; icon: string }> = {
  adventures: { title: 'No adventures yet', description: 'Adventures are guided outdoor experiences shown on Rich Valley Adventures. Add your first adventure to see it on the site.', icon: 'compass' },
  services: { title: 'No services yet', description: 'Services are transportation packages shown on the Alpenglow site. Add your first service to start taking bookings.', icon: 'briefcase' },
  'fleet vehicles': { title: 'No vehicles yet', description: 'Your vehicle inventory is shown on the Alpenglow site and sent to Google as structured data. Add your first vehicle.', icon: 'truck' },
  testimonials: { title: 'No testimonials yet', description: 'Customer reviews build trust and can show star ratings in Google search results. Add your first review.', icon: 'star' },
  'gallery images': { title: 'No photos yet', description: 'Photos appear in a masonry grid on your site\'s gallery page. Add your first photo.', icon: 'image' },
  FAQs: { title: 'No FAQs yet', description: 'FAQs show in an accordion on your site AND can appear in Google\'s "People Also Ask" section. Add your first FAQ.', icon: 'help' },
  'service areas': { title: 'No service areas yet', description: 'Service areas tell Google where you operate, which helps you show up in local searches. Add your first area.', icon: 'map' },
  contacts: { title: 'No inquiries yet', description: 'Contact inquiries from your website forms will appear here. Share your site to start receiving inquiries.', icon: 'inbox' },
  subscribers: { title: 'No subscribers yet', description: 'Newsletter signups from your site footer will appear here. Share your site to get subscribers!', icon: 'mail' },
}

interface EmptyStateProps {
  entity: string
  onAdd?: () => void
  addLabel?: string
}

export default function EmptyState({ entity, onAdd, addLabel }: EmptyStateProps) {
  const msg = emptyMessages[entity] || { title: `No ${entity} yet`, description: `Add your first ${entity} to get started.`, icon: 'plus' }

  return (
    <div className="text-center py-16 px-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">{msg.title}</h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">{msg.description}</p>
      {onAdd && addLabel && (
        <button onClick={onAdd} className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">
          + {addLabel}
        </button>
      )}
    </div>
  )
}
