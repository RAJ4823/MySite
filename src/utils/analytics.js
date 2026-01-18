const GA_ID = import.meta.env.VITE_GA_ID;

export function initGA() {
  if (!window.dataLayer) window.dataLayer = [];
  if (!window.gtag) window.gtag = function () { window.dataLayer.push(arguments); };
  if (GA_ID && window.gtag) {
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { send_page_view: false });
  }
}

export function trackPageView(path) {
  if (!GA_ID || !window.gtag) return;
  const page_path = path || (window.location.pathname + window.location.search + window.location.hash);
  window.gtag('event', 'page_view', {
    page_location: window.location.href,
    page_path,
    page_title: document.title,
  });
}

export function trackEvent(name, params = {}) {
  if (!GA_ID || !window.gtag) return;
  window.gtag('event', name, params);
}

let engagementStart = Date.now();
let lastVisibilityState = document.visibilityState;
let engagementTimerId = null;

function visible() {
  return document.visibilityState === 'visible';
}

function flushEngagement() {
  if (!visible()) return;
  const now = Date.now();
  const delta = now - engagementStart;
  engagementStart = now;
  if (delta > 0) {
    trackEvent('user_engagement', { engagement_time_msec: delta });
  }
}

export function startEngagementTracking() {
  engagementStart = Date.now();
  if (engagementTimerId) clearInterval(engagementTimerId);
  engagementTimerId = setInterval(flushEngagement, 15000);
  document.addEventListener('visibilitychange', () => {
    if (lastVisibilityState === 'hidden' && visible()) {
      engagementStart = Date.now();
    } else if (lastVisibilityState === 'visible' && !visible()) {
      flushEngagement();
    }
    lastVisibilityState = document.visibilityState;
  });
  window.addEventListener('beforeunload', () => {
    flushEngagement();
  });
}

export function initClickTracking(root = document) {
  if (!GA_ID || !window.gtag) return;
  root.addEventListener('click', (e) => {
    const el = e.target && (e.target.closest && e.target.closest('a,button,[role="button"]'));
    if (!el) return;
    const sectionEl = el.closest('[data-section], section');
    const section = (sectionEl && (sectionEl.getAttribute('data-section') || sectionEl.id || sectionEl.className)) || 'unknown';
    const label = el.getAttribute('data-label') || (el.textContent && el.textContent.trim().slice(0, 80)) || el.id || el.className || 'unknown';
    const element_type = (el.tagName || '').toLowerCase();
    const link_url = el.getAttribute('href') || undefined;
    trackEvent('click', { element_type, label, section, link_url });
  }, { capture: true });
}
