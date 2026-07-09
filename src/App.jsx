import { useEffect, useRef, useState } from 'react'
import CalendarGrid from './components/CalendarGrid.jsx'
import NoteModal from './components/NoteModal.jsx'
import Sidebar from './components/Sidebar.jsx'
import ThemeSwitcher from './components/ThemeSwitcher.jsx'
import HolidaySettings from './components/HolidaySettings.jsx'
import BackupControls from './components/BackupControls.jsx'
import UndoToast from './components/UndoToast.jsx'
import { toDateKey } from './utils/dateUtils.js'
import { createNote, loadNotes, saveNotes } from './utils/storage.js'
import { fetchHolidays } from './utils/holidays.js'
import {
  currentTimeHHMM,
  requestNotificationPermission,
  showReminderNotification,
} from './utils/reminders.js'
import './App.css'

const THEME_KEY = 'calendar-notes:theme'
const COUNTRY_KEY = 'calendar-notes:country'
const SHOW_HOLIDAYS_KEY = 'calendar-notes:show-holidays'

export default function App() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [notesByDate, setNotesByDate] = useState(() => loadNotes())
  const [selectedDate, setSelectedDate] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'sage')

  const [country, setCountry] = useState(() => localStorage.getItem(COUNTRY_KEY) || 'IN')
  const [showHolidays, setShowHolidays] = useState(
    () => localStorage.getItem(SHOW_HOLIDAYS_KEY) !== 'false',
  )
  const [holidaysByDate, setHolidaysByDate] = useState({})
  const [holidayStatus, setHolidayStatus] = useState('idle') // idle | loading | ok | empty | error

  const [undoData, setUndoData] = useState(null) // { dateKey, note } | null
  const undoTimerRef = useRef(null)

  useEffect(() => {
    saveNotes(notesByDate)
  }, [notesByDate])

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem(COUNTRY_KEY, country)
  }, [country])

  useEffect(() => {
    localStorage.setItem(SHOW_HOLIDAYS_KEY, String(showHolidays))
  }, [showHolidays])

  // Load public holidays for the visible year (plus neighbors, since a
  // month grid can show a few days that spill into an adjacent year).
  useEffect(() => {
    if (!showHolidays) {
      setHolidaysByDate({})
      setHolidayStatus('idle')
      return
    }
    let cancelled = false
    async function loadHolidays() {
      setHolidayStatus('loading')
      const years = [year - 1, year, year + 1]
      try {
        const results = await Promise.all(years.map((y) => fetchHolidays(y, country)))
        if (cancelled) return
        const flat = results.flat()
        const map = {}
        flat.forEach((h) => {
          map[h.date] = h.name
        })
        setHolidaysByDate(map)
        setHolidayStatus(flat.length > 0 ? 'ok' : 'empty')
      } catch (err) {
        // Offline, the API is unreachable, or this country isn't in the
        // free dataset — the calendar still works fine without holiday
        // labels, but we surface *why* instead of failing silently.
        console.error('Could not load holidays:', err)
        if (!cancelled) {
          setHolidaysByDate({})
          setHolidayStatus('error')
        }
      }
    }
    loadHolidays()
    return () => {
      cancelled = true
    }
  }, [year, country, showHolidays])

  // Poll once a minute for due reminders on today's notes.
  useEffect(() => {
    const interval = setInterval(() => {
      const todayKey = toDateKey(new Date())
      const nowHHMM = currentTimeHHMM()
      const todaysNotes = notesByDate[todayKey] || []
      const due = todaysNotes.filter(
        (n) => n.reminderTime && n.reminderTime <= nowHHMM && !n.remindedAt,
      )
      if (due.length === 0) return

      setNotesByDate((prev) => {
        const list = prev[todayKey] || []
        return {
          ...prev,
          [todayKey]: list.map((n) =>
            due.some((d) => d.id === n.id) ? { ...n, remindedAt: Date.now() } : n,
          ),
        }
      })

      due.forEach((n) => {
        showReminderNotification('Calendar Notes reminder', n.text || 'Checklist item due')
      })
    }, 20000)

    return () => clearInterval(interval)
  }, [notesByDate])

  function goToPrevMonth() {
    const next = new Date(year, month - 1, 1)
    setYear(next.getFullYear())
    setMonth(next.getMonth())
  }

  function goToNextMonth() {
    const next = new Date(year, month + 1, 1)
    setYear(next.getFullYear())
    setMonth(next.getMonth())
  }

  function goToToday() {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }

  function jumpToDate(date) {
    setYear(date.getFullYear())
    setMonth(date.getMonth())
    setSelectedDate(date)
  }

  function jumpToMonth(newYear, newMonth) {
    setYear(newYear)
    setMonth(newMonth)
  }

  async function handleAddNote(dateKey, noteData) {
    if (noteData.reminderTime) {
      await requestNotificationPermission()
    }
    setNotesByDate((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), createNote(noteData)],
    }))
  }

  function handleDeleteNote(noteId) {
    if (!selectedDate) return
    const key = toDateKey(selectedDate)
    const note = (notesByDate[key] || []).find((n) => n.id === noteId)
    if (!note) return

    setNotesByDate((prev) => ({
      ...prev,
      [key]: (prev[key] || []).filter((n) => n.id !== noteId),
    }))

    setUndoData({ dateKey: key, note })
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    undoTimerRef.current = setTimeout(() => setUndoData(null), 6000)
  }

  function handleUndoDelete() {
    if (!undoData) return
    setNotesByDate((prev) => ({
      ...prev,
      [undoData.dateKey]: [...(prev[undoData.dateKey] || []), undoData.note],
    }))
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
    setUndoData(null)
  }

  function handleToggleItem(noteId, itemId) {
    if (!selectedDate) return
    const key = toDateKey(selectedDate)
    setNotesByDate((prev) => ({
      ...prev,
      [key]: (prev[key] || []).map((n) =>
        n.id === noteId
          ? {
              ...n,
              items: n.items.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i)),
            }
          : n,
      ),
    }))
  }

  const selectedKey = selectedDate ? toDateKey(selectedDate) : null

  return (
    <div className="page" data-theme={theme}>
      <header className="masthead">
        <div>
  <span className="masthead-eyebrow">A quiet place for daily notes</span>
  <div className="brand-row">
    <img src="/favicon.svg" alt="" className="brand-logo" />
    <h1>DayCanvas</h1>
  </div>
  <span className="masthead-eyebrow">Calendar Notes</span>
</div>
        <div className="masthead-right">
          <p className="masthead-sub">Click any day to jot something down.</p>
          <ThemeSwitcher theme={theme} onChange={setTheme} />
          <HolidaySettings
            country={country}
            onCountryChange={setCountry}
            show={showHolidays}
            onToggleShow={setShowHolidays}
            status={holidayStatus}
          />
        </div>
        
      </header>

      <div className="workspace">
        <CalendarGrid
          year={year}
          month={month}
          notesByDate={notesByDate}
          holidaysByDate={holidaysByDate}
          onPrevMonth={goToPrevMonth}
          onNextMonth={goToNextMonth}
          onToday={goToToday}
          onJumpToMonth={jumpToMonth}
          onSelectDay={setSelectedDate}
        />
        <div className="side-column">
          <Sidebar notesByDate={notesByDate} onJumpToDate={jumpToDate} />
          <BackupControls notesByDate={notesByDate} onImportMerge={setNotesByDate} />
        </div>
      </div>

      {undoData && (
        <UndoToast
          message="Note deleted."
          onUndo={handleUndoDelete}
          onDismiss={() => {
            if (undoTimerRef.current) clearTimeout(undoTimerRef.current)
            setUndoData(null)
          }}
        />
      )}

      {selectedDate && (
        <NoteModal
          date={selectedDate}
          notes={notesByDate[selectedKey] || []}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
          onToggleItem={handleToggleItem}
          onClose={() => setSelectedDate(null)}
        />
      )}

      <footer className="note">
        Built by <strong>LAKSHMI VALMIKI</strong> . Notes are saved in this browser's local storage — they'll stay after a
        refresh, but only on this device. Reminders only fire while this tab
        is open (there's no server to push notifications when it's closed).
        Holiday data comes from the public Nager.Date API.
      </footer>
    </div>
  )
}
