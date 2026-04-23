import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Certification, CreateCertificationRequest } from '../types/certification';
import { CertCard } from '../components/certifications/CertCard';
import { CertForm } from '../components/certifications/CertForm';

export function Certifications() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Certification | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const data = await api.certifications.list();
      setCerts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load certifications');
    }
  }

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  async function handleCreate(data: CreateCertificationRequest) {
    try {
      setError(null);
      await api.certifications.create(data);
      await load();
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create certification');
    }
  }

  async function handleUpdate(data: CreateCertificationRequest) {
    if (!editing) return;
    try {
      setError(null);
      await api.certifications.update(editing.id, data);
      await load();
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update certification');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this certification?')) return;
    try {
      setError(null);
      await api.certifications.remove(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete certification');
    }
  }

  async function handleSync(id: string) {
    try {
      setError(null);
      const result = await api.certifications.sync(id) as { status: string; message?: string };
      alert(result.message ?? `Sync status: ${result.status}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed');
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Certifications</h1>
        {!showForm && !editing && (
          <button
            onClick={() => setShowForm(true)}
            style={{ padding: '0.5rem 1.25rem', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            + Add certification
          </button>
        )}
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1rem', background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {(showForm || editing) && (
        <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: '0 0 1rem' }}>{editing ? 'Edit certification' : 'New certification'}</h2>
          <CertForm
            initial={editing ?? undefined}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      {certs.length === 0 && !showForm && (
        <p style={{ color: '#6b7280', textAlign: 'center', marginTop: '3rem' }}>No certifications yet. Add your first one above.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {certs.map((cert) => (
          <CertCard
            key={cert.id}
            cert={cert}
            onEdit={setEditing}
            onDelete={handleDelete}
            onSync={handleSync}
          />
        ))}
      </div>
    </div>
  );
}
