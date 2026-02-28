import { useState } from 'react';
import { ReminderPreferences } from '../../types/user';
import { api } from '../../services/api';

interface Props {
  initial: ReminderPreferences;
  onSaved: (prefs: ReminderPreferences) => void;
}

export function ReminderSettings({ initial, onSaved }: Props) {
  const [prefs, setPrefs] = useState<ReminderPreferences>(initial);
  const [daysInput, setDaysInput] = useState(initial.emailDaysBefore.join(', '));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const days = daysInput
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n) && n > 0)
        .sort((a, b) => b - a);

      const updated = await api.reminders.updatePreferences({ ...prefs, emailDaysBefore: days });
      setPrefs(updated);
      onSaved(updated);
      setMessage('Preferences saved.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '480px' }}>
      <h2 style={{ margin: 0 }}>Reminder settings</h2>

      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={prefs.emailEnabled}
          onChange={(e) => setPrefs((p) => ({ ...p, emailEnabled: e.target.checked }))}
        />
        Enable email reminders
      </label>

      {prefs.emailEnabled && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>
            Remind me at (days before expiry, comma-separated)
          </label>
          <input
            style={{ padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
            value={daysInput}
            onChange={(e) => setDaysInput(e.target.value)}
            placeholder="30, 14, 7"
          />
          <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>e.g. "30, 14, 7" — sends emails 30, 14, and 7 days before expiry</span>
        </div>
      )}

      <div style={{ fontSize: '0.875rem', color: '#6b7280', background: '#f9fafb', padding: '0.75rem', borderRadius: '6px' }}>
        SMS reminders are not yet available but will be added in a future update.
      </div>

      {message && <div style={{ fontSize: '0.875rem', color: message === 'Preferences saved.' ? '#16a34a' : '#dc2626' }}>{message}</div>}

      <button type="submit" disabled={saving} style={{ padding: '0.5rem 1.25rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', alignSelf: 'flex-start' }}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
