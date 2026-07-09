import { useEffect, useRef, useState } from 'react'
import { toDateKey } from '../utils/dateUtils.js'
import { resizeImageFile } from '../utils/imageUtils.js'
import { createChecklistItem } from '../utils/storage.js'
import { ClockIcon } from './icons.jsx'

const COLORS = [
  '#6e8b6e', '#e2704e', '#5b6b7c', '#c9932f',
  '#a15c9e', '#3b7ea1', '#c2452e', '#4a8b6f',
]

const FONT_SIZES = [
  { label: 'S', value: 'small' },
  { label: 'M', value: 'medium' },
  { label: 'L', value: 'large' },
]

const PRIORITIES = [
  { value: 'none', label: 'None', dot: '#c8c4b5' },
  { value: 'low', label: 'Low', dot: '#4a8b6f' },
  { value: 'medium', label: 'Medium', dot: '#c9932f' },
  { value: 'high', label: 'High', dot: '#c2452e' },
]

export default function NoteModal({
  date,
  notes,
  onAddNote,
  onDeleteNote,
  onToggleItem,
  onClose,
}) {
  const [noteType, setNoteType] = useState('text')
  const [text, setText] = useState('')
  const [items, setItems] = useState([])
  const [itemDraft, setItemDraft] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [bold, setBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [fontSize, setFontSize] = useState('medium')
  const [priority, setPriority] = useState('none')
  const [image, setImage] = useState(null)
  const [imageError, setImageError] = useState('')
  const [reminderOn, setReminderOn] = useState(false)
  const [reminderTime, setReminderTime] = useState('09:00')
  const fileInputRef = useRef(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)
  const confirmTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    }
  }, [])

  function handleDeleteClick(noteId) {
    if (confirmDeleteId === noteId) {
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
      setConfirmDeleteId(null)
      onDeleteNote(noteId)
      return
    }
    setConfirmDeleteId(noteId)
    if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current)
    confirmTimerRef.current = setTimeout(() => setConfirmDeleteId(null), 3000)
  }

  function resetForm() {
    setText('')
    setItems([])
    setItemDraft('')
    setBold(false)
    setItalic(false)
    setFontSize('medium')
    setPriority('none')
    setImage(null)
    setReminderOn(false)
    setReminderTime('09:00')
  }

  function addChecklistItem() {
    const trimmed = itemDraft.trim()
    if (!trimmed) return
    setItems((prev) => [...prev, createChecklistItem(trimmed)])
    setItemDraft('')
  }

  function removeChecklistItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  async function handleImagePick(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError('')
    try {
      const dataUrl = await resizeImageFile(file)
      setImage(dataUrl)
    } catch (err) {
      setImageError(err.message || 'Could not attach that image.')
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const hasText = text.trim().length > 0
    const hasItems = noteType === 'checklist' && items.length > 0
    if (!hasText && !hasItems) return

    onAddNote(toDateKey(date), {
      text: text.trim(),
      color,
      bold,
      italic,
      fontSize,
      type: noteType,
      items,
      priority,
      image,
      reminderTime: reminderOn ? reminderTime : '',
    })
    resetForm()
  }

  const dateLabel = date.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="panel-label">Notes for</span>
            <h3>{dateLabel}</h3>
          </div>
          <div className="modal-header-right">
          {notes.length > 0 && (
            <span className="modal-note-count">
              {notes.length} note{notes.length === 1 ? '' : 's'}
            </span>
          )}
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        </div>

        {notes.length > 0 && (
          <ul className="note-list">
            {notes.map((note) => (
              <li key={note.id} className="note-item note-item--grid">
                <div className="note-item-top">
                  <span className="note-dot" style={{ background: note.color }} />
                  {note.priority && note.priority !== 'none' && (
                    <span
                      className="priority-chip"
                      style={{
                        background: PRIORITIES.find((p) => p.value === note.priority)?.dot,
                      }}
                    >
                      {note.priority}
                    </span>
                  )}
                  {note.reminderTime && (
                    <span className="reminder-chip">
                      <ClockIcon size={11} /> {note.reminderTime}
                    </span>
                  )}
                  <button
                    type="button"
                    className={`note-delete ${confirmDeleteId === note.id ? 'note-delete--confirm' : ''}`}
                    onClick={() => handleDeleteClick(note.id)}
                    aria-label={confirmDeleteId === note.id ? 'Click again to confirm delete' : 'Delete note'}
                  >
                    {confirmDeleteId === note.id ? 'Confirm delete?' : 'Delete'}
                  </button>
                </div>

                {note.text && (
                  <span
                    className={`note-text note-text--${note.fontSize || 'medium'}`}
                    style={{
                      fontWeight: note.bold ? 700 : 400,
                      fontStyle: note.italic ? 'italic' : 'normal',
                    }}
                  >
                    {note.text}
                  </span>
                )}

                {note.type === 'checklist' && note.items?.length > 0 && (
                  <ul className="checklist">
                    {note.items.map((item) => (
                      <li key={item.id} className="checklist-row">
                        <label>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => onToggleItem(note.id, item.id)}
                          />
                          <span className={item.checked ? 'checklist-done' : ''}>{item.text}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}

                {note.image && (
                  <img src={note.image} alt="" className="note-image" />
                )}
              </li>
            ))}
          </ul>
        )}

        <form className="note-form" onSubmit={handleSubmit}>
          <div className="type-toggle" role="radiogroup" aria-label="Note type">
            <label className={`type-option ${noteType === 'text' ? 'type-option--active' : ''}`}>
              <input
                type="radio"
                name="note-type"
                value="text"
                checked={noteType === 'text'}
                onChange={() => setNoteType('text')}
              />
              Note
            </label>
            <label
              className={`type-option ${noteType === 'checklist' ? 'type-option--active' : ''}`}
            >
              <input
                type="radio"
                name="note-type"
                value="checklist"
                checked={noteType === 'checklist'}
                onChange={() => setNoteType('checklist')}
              />
              Checklist
            </label>
          </div>

          {noteType === 'text' ? (
            <>
              <div className="format-toolbar">
                <button
                  type="button"
                  className={`format-btn ${bold ? 'format-btn--active' : ''}`}
                  onClick={() => setBold((b) => !b)}
                  aria-pressed={bold}
                  aria-label="Bold"
                >
                  B
                </button>
                <button
                  type="button"
                  className={`format-btn format-btn--italic ${italic ? 'format-btn--active' : ''}`}
                  onClick={() => setItalic((i) => !i)}
                  aria-pressed={italic}
                  aria-label="Italic"
                >
                  I
                </button>
                <span className="format-divider" />
                {FONT_SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    className={`format-btn ${fontSize === size.value ? 'format-btn--active' : ''}`}
                    onClick={() => setFontSize(size.value)}
                    aria-pressed={fontSize === size.value}
                    aria-label={`Font size ${size.value}`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Write a note for this day…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                className={`note-textarea note-textarea--grid note-textarea--${fontSize}`}
                style={{
                  fontWeight: bold ? 700 : 400,
                  fontStyle: italic ? 'italic' : 'normal',
                }}
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Checklist title (optional)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="checklist-title-input"
              />

              {items.length > 0 && (
                <ul className="checklist checklist--editing">
                  {items.map((item) => (
                    <li key={item.id} className="checklist-row">
                      <input type="checkbox" disabled checked={false} />
                      <span>{item.text}</span>
                      <button
                        type="button"
                        className="checklist-remove"
                        onClick={() => removeChecklistItem(item.id)}
                        aria-label="Remove item"
                      >
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="checklist-add-row">
                <input
                  type="text"
                  placeholder="Add an item…"
                  value={itemDraft}
                  onChange={(e) => setItemDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addChecklistItem()
                    }
                  }}
                />
                <button type="button" onClick={addChecklistItem} className="add-item-btn">
                  Add
                </button>
              </div>
            </>
          )}

          <div className="field-row">
            <span className="field-inline-label">Priority</span>
            <div className="priority-radios" role="radiogroup" aria-label="Priority">
              {PRIORITIES.map((p) => (
                <label key={p.value} className="priority-radio">
                  <input
                    type="radio"
                    name="priority"
                    value={p.value}
                    checked={priority === p.value}
                    onChange={() => setPriority(p.value)}
                    className="priority-radio-input"
                  />
                  <span
                    className="priority-radio-dot"
                    style={{ '--dot-color': p.dot }}
                  />
                  {p.label}
                </label>
              ))}
            </div>
          </div>

          <div className="field-row">
            <span className="field-inline-label">Remind me</span>
            <label className="reminder-toggle">
              <input
                type="checkbox"
                checked={reminderOn}
                onChange={(e) => setReminderOn(e.target.checked)}
              />
              at
            </label>
            <input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              disabled={!reminderOn}
              className="time-input"
            />
          </div>

          <div className="field-row">
            <span className="field-inline-label">Photo</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImagePick}
              className="image-input"
            />
          </div>
          {image && (
            <div className="image-preview-row">
              <img src={image} alt="" className="image-preview" />
              <button
                type="button"
                className="note-delete"
                onClick={() => {
                  setImage(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
              >
                Remove photo
              </button>
            </div>
          )}
          {imageError && <p className="field-hint field-hint--error">{imageError}</p>}

          <div className="note-form-row">
            <div className="color-picker">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`color-swatch ${color === c ? 'color-swatch--active' : ''}`}
                  style={{ background: c }}
                  aria-label={`Color ${c}`}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
            <button type="submit" className="save-btn">
              Save note
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
