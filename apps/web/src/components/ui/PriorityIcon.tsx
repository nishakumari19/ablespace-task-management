'use client';

import React from 'react';

export type PriorityType = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NO_PRIORITY';

interface PriorityIconProps {
  priority: PriorityType | string;
  className?: string;
}

export function PrioritySignalIcon({ priority, className = '' }: PriorityIconProps) {
  const p = (priority || 'NO_PRIORITY').toUpperCase() as PriorityType;

  switch (p) {
    case 'URGENT':
      return (
        <span className={`inline-flex items-end gap-[2px] h-3.5 ${className}`}>
          <span className="w-[3px] h-[5px] bg-[#ef4444] rounded-[1px]" />
          <span className="w-[3px] h-[9px] bg-[#ef4444] rounded-[1px]" />
          <span className="w-[3px] h-[13px] bg-[#ef4444] rounded-[1px]" />
        </span>
      );
    case 'HIGH':
      return (
        <span className={`inline-flex items-end gap-[2px] h-3.5 ${className}`}>
          <span className="w-[3px] h-[5px] bg-[#f43f5e] rounded-[1px]" />
          <span className="w-[3px] h-[9px] bg-[#f43f5e] rounded-[1px]" />
          <span className="w-[3px] h-[13px] bg-[#f43f5e] rounded-[1px]" />
        </span>
      );
    case 'MEDIUM':
      return (
        <span className={`inline-flex items-end gap-[2px] h-3.5 ${className}`}>
          <span className="w-[3px] h-[5px] bg-[#eab308] rounded-[1px]" />
          <span className="w-[3px] h-[9px] bg-[#eab308] rounded-[1px]" />
          <span className="w-[3px] h-[13px] bg-neutral-200 dark:bg-neutral-700 rounded-[1px]" />
        </span>
      );
    case 'LOW':
      return (
        <span className={`inline-flex items-end gap-[2px] h-3.5 ${className}`}>
          <span className="w-[3px] h-[5px] bg-[#94a3b8] rounded-[1px]" />
          <span className="w-[3px] h-[9px] bg-neutral-200 dark:bg-neutral-700 rounded-[1px]" />
          <span className="w-[3px] h-[13px] bg-neutral-200 dark:bg-neutral-700 rounded-[1px]" />
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center justify-center w-3.5 h-3.5 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
        </span>
      );
  }
}

export function PriorityIcon({ priority, className = '' }: PriorityIconProps) {
  return <PrioritySignalIcon priority={priority} className={className} />;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const labels: Record<string, string> = {
    URGENT: 'Urgent',
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low',
    NO_PRIORITY: 'No Priority',
  };

  const textColors: Record<string, string> = {
    URGENT: 'text-[#ef4444]',
    HIGH: 'text-[#f43f5e]',
    MEDIUM: 'text-[#eab308]',
    LOW: 'text-[#94a3b8]',
    NO_PRIORITY: 'text-neutral-400 dark:text-neutral-500',
  };

  const p = (priority || 'NO_PRIORITY').toUpperCase();

  return (
    <div className={`inline-flex items-center gap-1.5 text-[12px] font-normal ${textColors[p] || 'text-neutral-600'}`}>
      <PrioritySignalIcon priority={p} />
      <span>{labels[p] || 'Medium'}</span>
    </div>
  );
}
