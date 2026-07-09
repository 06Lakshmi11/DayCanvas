import { COUNTRIES } from '../utils/holidays.js'

export default function HolidaySettings({ country, onCountryChange, show, onToggleShow, status }) {
  const countryName = COUNTRIES.find((c) => c.code === country)?.name || country

  return (
    <div className="holiday-settings">
      <div className="holiday-settings-row">
        <label className="holiday-toggle">
          <input
            type="checkbox"
            checked={show}
            onChange={(e) => onToggleShow(e.target.checked)}
          />
          Show holidays
        </label>
        <select
          value={country}
          onChange={(e) => onCountryChange(e.target.value)}
          disabled={!show}
          aria-label="Holiday country"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {show && status === 'empty' && (
        <p className="holiday-status holiday-status--warn">
          No holiday data available for {countryName} from the free API.
        </p>
      )}
      {show && status === 'error' && (
        <p className="holiday-status holiday-status--warn">
          Couldn't reach the holiday service — check your connection.
        </p>
      )}
    </div>
  )
}
