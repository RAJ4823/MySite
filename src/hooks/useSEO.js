import { useEffect } from 'react';

/**
 * Custom SEO hook for React 19 - manages document head elements
 * Sets title, canonical URL, meta description, and other SEO tags
 * 
 * @param {Object} options
 * @param {string} options.title - Page title (required)
 * @param {string} options.description - Meta description (optional - only updates if provided)
 * @param {string} options.canonical - Canonical URL path (optional - only updates if provided)
 * @param {boolean} options.noindex - If true, adds noindex meta tag (for pages like 404, error, game)
 * @param {string} options.type - og:type (default: 'website')
 */
const useSEO = ({ title, description, canonical, noindex = false, type = 'website' }) => {
    const BASE_URL = 'https://iamraj.dev';
    const fullCanonical = canonical ? `${BASE_URL}${canonical}` : null;
    const fullTitle = title ? `${title} | Raj Patel` : 'Raj Patel | Full Stack Software Developer';

    // Update Open Graph tags only if canonical is provided
    const updateMeta = (property, content) => {
        let el = document.querySelector(`meta[property="${property}"]`);
        if (el && content) {
            el.setAttribute('content', content);
        }
    };

    // Update Twitter tags only if canonical is provided
    const updateTwitterMeta = (name, content) => {
        let el = document.querySelector(`meta[name="${name}"]`);
        if (el && content) {
            el.setAttribute('content', content);
        }
    };

    useEffect(() => {
        // Always set document title
        document.title = fullTitle;

        // Only update canonical if explicitly provided
        if (fullCanonical) {
            let canonicalEl = document.querySelector('link[rel="canonical"]');
            if (canonicalEl) {
                canonicalEl.setAttribute('href', fullCanonical);
            }
        }

        // Only update meta description if provided
        if (description) {
            let descEl = document.querySelector('meta[name="description"]');
            if (descEl) {
                descEl.setAttribute('content', description);
            }
        }

        // Handle noindex for pages that shouldn't be indexed
        let robotsEl = document.querySelector('meta[name="robots"]');
        const originalRobots = robotsEl?.getAttribute('content');
        if (noindex && robotsEl) {
            robotsEl.setAttribute('content', 'noindex, nofollow');
        }

        updateMeta('og:title', fullTitle);
        if (fullCanonical) updateMeta('og:url', fullCanonical);
        if (description) updateMeta('og:description', description);

        updateTwitterMeta('twitter:title', fullTitle);
        if (fullCanonical) updateTwitterMeta('twitter:url', fullCanonical);
        if (description) updateTwitterMeta('twitter:description', description);

        // Cleanup - restore defaults on unmount
        return () => {
            document.title = 'Raj Patel | Full Stack Software Developer';
            // Restore canonical to root
            let canonicalEl = document.querySelector('link[rel="canonical"]');
            if (canonicalEl) {
                canonicalEl.setAttribute('href', BASE_URL + '/');
            }
            // Restore robots if it was changed
            if (noindex && robotsEl && originalRobots) {
                robotsEl.setAttribute('content', originalRobots);
            }
        };
    }, [fullTitle, fullCanonical, description, noindex, type]);
};

export default useSEO;

