import { Certification } from "../../types/certification";

interface Props {
  cert: Certification;
  onEdit: (cert: Certification) => void;
  onDelete: (id: string) => void;
  onSync: (id: string) => void;
}

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil(
    (new Date(dateStr).getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
}

const VENDOR_LABELS: Record<string, string> = {
  microsoft: "Microsoft",
  aws: "AWS",
  comptia: "CompTIA",
  other: "Other",
};

export function CertCard({ cert, onEdit, onDelete, onSync }: Props) {
  const days = daysUntil(cert.expirationDate);
  const isExpired = days < 0;
  const isUrgent = days >= 0 && days <= 14;
  const isWarning = days > 14 && days <= 30;

  const statusColor = isExpired
    ? "#dc2626"
    : isUrgent
      ? "#ea580c"
      : isWarning
        ? "#ca8a04"
        : "#16a34a";

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        padding: "1rem 1.25rem",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: "1rem" }}>{cert.name}</div>
        <div
          style={{
            color: "#6b7280",
            fontSize: "0.875rem",
            marginTop: "0.2rem",
          }}
        >
          {VENDOR_LABELS[cert.vendor]}{" "}
          {cert.vendorCertId ? `· ${cert.vendorCertId}` : ""}
        </div>
        <div
          style={{
            marginTop: "0.4rem",
            fontSize: "0.875rem",
            color: statusColor,
            fontWeight: 500,
          }}
        >
          {isExpired
            ? `Expired ${Math.abs(days)} days ago`
            : `Expires in ${days} days (${cert.expirationDate})`}
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button
          onClick={() => onSync(cert.id)}
          style={{
            fontSize: "0.8rem",
            padding: "0.3rem 0.6rem",
            cursor: "pointer",
          }}
        >
          Sync
        </button>
        <button
          onClick={() => onEdit(cert)}
          style={{
            fontSize: "0.8rem",
            padding: "0.3rem 0.6rem",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(cert.id)}
          style={{
            fontSize: "0.8rem",
            padding: "0.3rem 0.6rem",
            cursor: "pointer",
            color: "#dc2626",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
