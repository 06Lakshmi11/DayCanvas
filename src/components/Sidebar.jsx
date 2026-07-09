import { useMemo, useState } from 'react'
import { parseDateKey } from '../utils/dateUtils.js'

export default function Sidebar({ notesByDate, onJumpToDate }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.trim().toLowerCase()
    const matches = []
    for (const [dateKey, notes] of Object.entries(notesByDate)) {
      for (const note of notes) {
        const itemsText = (note.items || []).map((i) => i.text).join(' ')
        const haystack = `${note.text || ''} ${itemsText}`.toLowerCase()
        if (haystack.includes(q)) {
          matches.push({ dateKey, ...note })
        }
      }
    }
    return matches.sort((a, b) => (a.dateKey < b.dateKey ? 1 : -1)).slice(0, 20)
  }, [query, notesByDate])

  const totalNotes = useMemo(
    () => Object.values(notesByDate).reduce((sum, list) => sum + list.length, 0),
    [notesByDate],
  )

  return (
    <aside className="sidebar">
      <label className="panel-label">Search notes</label>
    <div className="search-input-wrap">
  <svg
    className="search-icon"
    viewBox="0 0 24 24"
    width="15"
    height="15"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
  <input
    type="text"
    placeholder="Search all your notes…"
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    className="search-input"
  />
</div>

      {query.trim() ? (
        <ul className="search-results">
          {results.length === 0 && <li className="search-empty">No matches.</li>}
          {results.map((r) => (
            <li
              key={r.id}
              className="search-result"
              onClick={() => onJumpToDate(parseDateKey(r.dateKey))}
            >
              <span className="note-dot" style={{ background: r.color }} />
              <div>
                <div className="search-result-date">{r.dateKey}</div>
                <div className="search-result-text">
                  {r.text || (r.type === 'checklist' ? 'Checklist' : '')}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="sidebar-hint">
          {totalNotes} note{totalNotes === 1 ? '' : 's'} saved in this browser.
        </p>
      )}
    </aside>
  )
}
