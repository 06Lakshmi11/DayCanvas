export default function UndoToast({ message, onUndo, onDismiss }) {
  return (
    <div className="undo-toast" role="status">
      <span>{message}</span>
      <button type="button" className="undo-toast-btn" onClick={onUndo}>
        Undo
      </button>
      <button
        type="button"
        className="undo-toast-close"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        &times;
      </button>
    </div>
  )
}
