import React from 'react';

const BADGE_MAP = {
  Scheduled: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
  Confirmed: { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' },
  'In Progress': { bg: '#fae8ff', text: '#86198f', border: '#f5d0fe' },
  Completed: { bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  Cancelled: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' }
};

export default function StatusBadge({ status }) {
  const style = BADGE_MAP[status] || { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };

  return (
    <span style={{
      backgroundColor: style.bg,
      color: style.text,
      border: `1px solid ${style.border}`,
      padding: '3px 9px',
      borderRadius: '9999px',
      fontSize: '0.74rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.4px',
      display: 'inline-block'
    }}>
      {status}
    </span>
  );
}
