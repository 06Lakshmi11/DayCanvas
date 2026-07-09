const STORAGE_KEY = 'calendar-notes:v1'

/**
 * Notes are stored as: { "2026-07-08": [ <note>, ... ] }
 *
 * A note looks like:
 * {
 *   id, createdAt, color, bold, italic, fontSize,
 *   type: 'text' | 'checklist',
 *   text: string,                 // body text (text notes) or title (checklists)
 *   items: [{ id, text, checked }], // only used when type === 'checklist'
 *   priority: 'none' | 'low' | 'medium' | 'high',
 *   image: string | null,         // base64 data URL, already resized
 *   reminderTime: string,         // 'HH:MM' or '' for none
 *   remindedAt: number | null,    // timestamp the reminder last fired, to avoid repeats
 * }
 */
export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveNotes(notesByDate) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notesByDate))
  } catch {
    // Storage might be full (e.g. many images) or unavailable (private
    // browsing) — fail silently, the UI still works for this session.
  }
}

export function createNote(options) {
  const {
    text = '',
    color = '#6e8b6e',
    bold = false,
    italic = false,
    fontSize = 'medium',
    type = 'text',
    items = [],
    priority = 'none',
    image = null,
    reminderTime = '',
  } = options

  return {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    text,
    color,
    bold,
    italic,
    fontSize,
    type,
    items,
    priority,
    image,
    reminderTime,
    remindedAt: null,
  }
}

export function createChecklistItem(text) {
  return { id: crypto.randomUUID(), text, checked: false }
}
