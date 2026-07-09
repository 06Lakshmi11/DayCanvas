/**
 * Reminders only fire while this app is open in a browser tab — there's no
 * backend or service worker here to push notifications when it's closed.
 * That's a real limitation worth telling the user about, not hiding.
 */

export function notificationsSupported() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export async function requestNotificationPermission() {
  if (!notificationsSupported()) return 'unsupported'
  if (Notification.permission === 'granted' || Notification.permission === 'denied') {
    return Notification.permission
  }
  return Notification.requestPermission()
}

export function showReminderNotification(title, body) {
  if (notificationsSupported() && Notification.permission === 'granted') {
    new Notification(title, { body, icon: undefined })
    return true
  }
  return false
}

/** Returns "HH:MM" for the current local time, e.g. "09:05". */
export function currentTimeHHMM() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}
