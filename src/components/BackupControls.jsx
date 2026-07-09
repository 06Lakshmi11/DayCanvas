import { useRef, useState } from 'react'
import { exportNotes, mergeNotes, readBackupFile } from '../utils/backup.js'

export default function BackupControls({ notesByDate, onImportMerge }) {
  const fileInputRef = useRef(null)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('info') // 'info' | 'error'

  async function handleFileChosen(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const imported = await readBackupFile(file)
      const importedDayCount = Object.keys(imported).length
      onImportMerge((current) => mergeNotes(current, imported))
      setMessageType('info')
      setMessage(`Imported notes from ${importedDayCount} day${importedDayCount === 1 ? '' : 's'}.`)
    } catch (err) {
      setMessageType('error')
      setMessage(err.message || 'Could not import that file.')
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="backup-controls">
      <label className="panel-label">Backup</label>
      <div className="backup-buttons">
        <button
          type="button"
          className="backup-btn"
          onClick={() => exportNotes(notesByDate)}
        >
          Export notes
        </button>
        <button
          type="button"
          className="backup-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          Import notes
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={handleFileChosen}
          className="backup-file-input"
        />
      </div>
      {message && (
        <p className={`backup-message ${messageType === 'error' ? 'backup-message--error' : ''}`}>
          {message}
        </p>
      )}
      <p className="sidebar-hint">
        Notes only live in this browser — export a backup before clearing your
        browser data or switching devices.
      </p>
    </div>
  )
}
