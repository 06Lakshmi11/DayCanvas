import { useState } from 'react'
import { buildMonthGrid, isSameDay, monthLabel, toDateKey, weekdayLabels } from '../utils/dateUtils.js'
import DayCell from './DayCell.jsx'
import MonthYearPicker from './MonthYearPicker.jsx'

export default function CalendarGrid({
  year,
  month,
  notesByDate,
  holidaysByDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onJumpToMonth,
  onSelectDay,
}) {
  const days = buildMonthGrid(year, month)
  const today = new Date()
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <div className="calendar-card">
      <div className="calendar-toolbar">
        <div className="calendar-nav">
          <button type="button" className="nav-arrow-btn" onClick={onPrevMonth} aria-label="Previous month">
            &larr;
          </button>
          <div className="calendar-title-wrap">
            <button
              type="button"
              className="calendar-title-btn"
              onClick={() => setPickerOpen((open) => !open)}
              aria-expanded={pickerOpen}
            >
              <h2>{monthLabel(year, month)}</h2>
            </button>
            {pickerOpen && (
              <MonthYearPicker
                year={year}
                month={month}
                onJump={(y, m) => {
                  onJumpToMonth(y, m)
                  setPickerOpen(false)
                }}
                onClose={() => setPickerOpen(false)}
              />
            )}
          </div>
          <button type="button" className="nav-arrow-btn" onClick={onNextMonth} aria-label="Next month">
            &rarr;
          </button>
        </div>
        <button type="button" className="today-btn" onClick={onToday}>
          Today
        </button>
      </div>

      <div className="weekday-row">
        {weekdayLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((date) => {
          const key = toDateKey(date)
          return (
            <DayCell
              key={key}
              date={date}
              inCurrentMonth={date.getMonth() === month}
              isToday={isSameDay(date, today)}
              notes={notesByDate[key] || []}
              holidayName={holidaysByDate?.[key]}
              onClick={onSelectDay}
            />
          )
        })}
      </div>
    </div>
  )
}
