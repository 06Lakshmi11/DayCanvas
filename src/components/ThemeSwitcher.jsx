const THEMES = [
  { id: 'sage', name: 'Sage', swatch: '#6e8b6e' },
  { id: 'ocean', name: 'Ocean', swatch: '#3b7ea1' },
  { id: 'sunset', name: 'Sunset', swatch: '#d97757' },
  { id: 'dusk', name: 'Dusk', swatch: '#8b7bd8' },
]

export default function ThemeSwitcher({ theme, onChange }) {
  return (
    <div className="theme-switcher" role="group" aria-label="Choose theme">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`theme-swatch ${theme === t.id ? 'theme-swatch--active' : ''}`}
          style={{ background: t.swatch }}
          title={t.name}
          aria-label={`${t.name} theme`}
          aria-pressed={theme === t.id}
          onClick={() => onChange(t.id)}
        />
      ))}
    </div>
  )
}
