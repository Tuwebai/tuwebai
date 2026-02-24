// Google Analytics configuration
export const GA_TRACKING_ID = 'G-WX19N0LCCC'

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Custom events for TuWeb.ai
export const trackContactForm = () => {
  event({
    action: 'submit_contact_form',
    category: 'engagement',
    label: 'contact_form_submission',
  })
}

export const trackServiceClick = (service: string) => {
  event({
    action: 'click_service',
    category: 'engagement',
    label: service,
  })
}

export const trackProjectView = (project: string) => {
  event({
    action: 'view_project',
    category: 'engagement',
    label: project,
  })
}

export const trackConsultationRequest = () => {
  event({
    action: 'request_consultation',
    category: 'conversion',
    label: 'consultation_request',
  })
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}
