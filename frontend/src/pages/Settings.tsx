import { useState, useEffect } from "react";
import { api } from "../services/api";
import { ReminderPreferences } from "../types/user";
import { ReminderSettings } from "../components/reminders/ReminderSettings";

export function Settings() {
  const [prefs, setPrefs] = useState<ReminderPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.reminders
      .getPreferences()
      .catch(() =>
        // Profile doesn't exist yet — auto-provision with defaults, then retry
        api.users.updateProfile({}).then(() => api.reminders.getPreferences()),
      )
      .then(setPrefs)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Failed to load settings.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error)
    return (
      <p style={{ color: "#dc2626" }}>
        {error} — have you created your profile yet?
      </p>
    );
  if (!prefs) return null;

  return (
    <div>
      <ReminderSettings initial={prefs} onSaved={setPrefs} />
    </div>
  );
}
