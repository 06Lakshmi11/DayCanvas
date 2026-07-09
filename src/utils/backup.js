import { toDateKey } from './dateUtils.js'

const BACKUP_VERSION = 1

/** Triggers a browser download of all notes as a JSON file. */
export function exportNotes(notesByDate) {
  const payload = {
    app: 'calendar-notes',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    notes: notesByDate,
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `calendar-notes-backup-${toDateKey(new Date())}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Reads a backup File, validates its shape, and returns the notes object
 * ready to merge into app state. Throws a descriptive error on anything
 * that isn't a recognizable Calendar Notes backup.
 */
export function readBackupFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that file.'))
    reader.onload = () => {
      let parsed
      try {
        parsed = JSON.parse(reader.result)
      } catch {
        reject(new Error('That file is not valid JSON.'))
        return
      }
      if (!parsed || typeof parsed !== 'object' || typeof parsed.notes !== 'object') {
        reject(new Error("That doesn't look like a Calendar Notes backup file."))
        return
      }
      resolve(parsed.notes)
    }
    reader.readAsText(file)
  })
}

/**
 * Merges imported notes into the current notes, skipping any note whose id
 * already exists on that date (so re-importing the same backup twice won't
 * duplicate everything).
 */
export function mergeNotes(current, imported) {
  const merged = { ...current }
  for (const [dateKey, importedList] of Object.entries(imported)) {
    if (!Array.isArray(importedList)) continue
    const existingIds = new Set((merged[dateKey] || []).map((n) => n.id))
    const newOnes = importedList.filter((n) => n && n.id && !existingIds.has(n.id))
    if (newOnes.length > 0) {
      merged[dateKey] = [...(merged[dateKey] || []), ...newOnes]
    }
  }
  return merged
}
