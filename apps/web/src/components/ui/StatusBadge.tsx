'use client';

import React from 'react';

export type StatusType = 'TO_DO' | 'DOING' | 'COMPLETED' | 'ON_HOLD';

const statusConfig: Record<StatusType, { label: string; bg: string; text: string; dot: string }> = {
  TO_DO: {
    label: 'To Do',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
  DOING: {
    label: 'Doing',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  COMPLETED: {
    label: 'Completed',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  ON_HOLD: {
    label: 'On Hold',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
};

export function StatusBadge({ status }: { status: string }) {
  const s = (status || 'TO_DO').toUpperCase() as StatusType;
  const config = statusConfig[s] || statusConfig.TO_DO;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
