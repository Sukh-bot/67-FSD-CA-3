import React from 'react';

const STATUS_CONFIG = {
  Scheduled: { bg: '#fef3c7', text: '#b45309', border: '#fde68a', icon: '⏳' },
  Confirmed: { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe', icon: '✅' },
  'In Progress': { bg: '#fae8ff', text: '#86198f', border: '#f5d0fe', icon: '🩺' },
  Completed: { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0', icon: '🎉' },
  Cancelled: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca', icon: '❌' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', icon: '•' };

  return (
    <span
      style={{
        backgroundColor: config.bg,
        color: config.text,
        border: `1px solid ${config.border}`,
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.4px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px'
      }}
    >
      <span>{config.icon}</span>
      <span>{status}</span>
    </span>
  );
}
