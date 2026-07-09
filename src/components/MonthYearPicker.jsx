import { useEffect, useRef, useState } from 'react'
import { monthAbbrLabels } from '../utils/dateUtils.js'

export default function MonthYearPicker({ year, month, onJump, onClose }) {
  const [yearInput, setYearInput] = useState(String(year))
  const popoverRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  function commitYear() {
    const parsed = parseInt(yearInput, 10)
    if (!Number.isNaN(parsed) && parsed > 0) {
      onJump(parsed, month)
    } else {
      setYearInput(String(year))
    }
  }

  return (
    <div className="year-picker" ref={popoverRef}>
      <div className="year-picker-row">
        <label htmlFor="year-jump-input">Year</label>
        <input
          id="year-jump-input"
          type="number"
          value={yearInput}
          onChange={(e) => setYearInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && commitYear()}
          onBlur={commitYear}
        />
      </div>

      <div className="month-grid-picker">
        {monthAbbrLabels.map((label, i) => (
          <button
            key={label}
            type="button"
            className={`month-picker-btn ${i === month ? 'month-picker-btn--active' : ''}`}
            onClick={() => {
              const parsed = parseInt(yearInput, 10)
              onJump(Number.isNaN(parsed) ? year : parsed, i)
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
