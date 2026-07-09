import { ClockIcon, ImageIcon } from './icons.jsx'

export default function DayCell({ date, inCurrentMonth, isToday, notes, holidayName, onClick }) {
  const dayNumber = date.getDate()
  const visibleNotes = notes.slice(0, 3)
  const overflowCount = notes.length - visibleNotes.length

  return (
    <button
      type="button"
      className={[
        'day-cell',
        inCurrentMonth ? '' : 'day-cell--muted',
        isToday ? 'day-cell--today' : '',
        holidayName ? 'day-cell--holiday' : '',
        notes.length === 0 ? 'day-cell--empty' : '',
      ].join(' ')}
      onClick={() => onClick(date)}
    >
      <span className="day-number">{dayNumber}</span>
      {notes.length > 0 && (
  <span className="day-count-badge" aria-label={`${notes.length} notes`}>
    {notes.length}
  </span>
)}

      {holidayName && (
        <span className="day-holiday" title={holidayName}>
          {holidayName}
        </span>
      )}

      {notes.length > 0 && (
        <div className="day-notes">
          {visibleNotes.map((note) => {
            const checkedCount = note.items?.filter((i) => i.checked).length || 0
            const totalCount = note.items?.length || 0
            return (
              <span
                key={note.id}
                className={`day-note-flag day-note-flag--${note.fontSize || 'medium'}`}
                style={{
                  background: note.color,
                  fontWeight: note.bold ? 700 : 400,
                  fontStyle: note.italic ? 'italic' : 'normal',
                }}
                title={note.text}
              >
                {note.reminderTime && <ClockIcon className="flag-icon" />}
                {note.image && <ImageIcon className="flag-icon" />}
                {note.type === 'checklist'
                  ? `${note.text || 'Checklist'} (${checkedCount}/${totalCount})`
                  : note.text}
              </span>
            )
          })}
          {overflowCount > 0 && (
            <span className="day-note-more">+{overflowCount} more</span>
          )}
        </div>
      )}
    </button>
  )
}
