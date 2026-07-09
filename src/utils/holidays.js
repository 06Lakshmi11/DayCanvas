const CACHE_PREFIX = 'calendar-notes:holidays:'

export const COUNTRIES = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'CA', name: 'Canada' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'BR', name: 'Brazil' },
  { code: 'ZA', name: 'South Africa' },
]

/**
 * Fetches public holidays (including major gazetted festivals) for a given
 * year and country using the free, keyless Nager.Date API, caching results
 * in localStorage so repeat visits don't re-fetch the same year.
 *
 * @param {number} year
 * @param {string} countryCode - ISO 3166-1 alpha-2, e.g. 'IN', 'US'
 * @returns {Promise<{date: string, name: string}[]>}
 */
export async function fetchHolidays(year, countryCode) {
  const cacheKey = `${CACHE_PREFIX}${countryCode}:${year}`

  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) return JSON.parse(cached)
  } catch {
    // ignore cache read errors, fall through to fetch
  }

  const response = await fetch(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`,
  )
  if (!response.ok) {
    throw new Error(`Could not load holidays for ${countryCode} ${year}`)
  }

  const data = await response.json()
  const holidays = data.map((h) => ({ date: h.date, name: h.localName || h.name }))

  try {
    localStorage.setItem(cacheKey, JSON.stringify(holidays))
  } catch {
    // storage full or unavailable — non-fatal, just won't be cached
  }

  return holidays
}
