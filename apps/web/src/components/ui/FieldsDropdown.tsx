'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LayoutList, Kanban, Check, Menu } from 'lucide-react';

export interface FieldVisibility {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

interface FieldsDropdownProps {
  viewMode?: 'board' | 'list';
  onViewModeChange?: (mode: 'board' | 'list') => void;
  fields: FieldVisibility;
  onFieldsChange: (fields: FieldVisibility) => void;
}

export function FieldsDropdown({
  viewMode = 'board',
  onViewModeChange,
  fields,
  onFieldsChange,
}: FieldsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleField = (key: keyof FieldVisibility) => {
    const updated = { ...fields, [key]: !fields[key] };
    onFieldsChange(updated);
    localStorage.setItem('task_fields', JSON.stringify(updated));
  };

  const fieldItems: { key: keyof FieldVisibility; label: string }[] = [
    { key: 'priority', label: 'Priority' },
    { key: 'members', label: 'Members' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'labels', label: 'Labels' },
    { key: 'status', label: 'Status' },
    { key: 'reporter', label: 'Reporter' },
  ];

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
          isOpen
            ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
            : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800'
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-neutral-500">
          <path d="M2 3.5C2 2.67157 2.67157 2 3.5 2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H3.5C2.67157 14 2 13.3284 2 12.5V3.5Z" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M6 2V14" stroke="currentColor" strokeWidth="1.3"/>
          <path d="M10 2V14" stroke="currentColor" strokeWidth="1.3"/>
        </svg>
        <span>Fields</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl z-50 p-2 animate-in fade-in zoom-in-95 duration-100">
          {/* Segmented View Switcher (matching Figma page 3 & 7) */}
          {onViewModeChange && (
            <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-2 text-xs font-medium">
              <button
                type="button"
                onClick={() => {
                  onViewModeChange('list');
                }}
                className={`flex items-center justify-center gap-1.5 py-1 rounded-md text-xs transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-neutral-900 shadow-xs text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onViewModeChange('board');
                }}
                className={`flex items-center justify-center gap-1.5 py-1 rounded-md text-xs transition-colors ${
                  viewMode === 'board'
                    ? 'bg-white dark:bg-neutral-900 shadow-xs text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Board</span>
              </button>
            </div>
          )}

          {/* Checklist of visible fields */}
          <div className="space-y-0.5">
            {fieldItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleField(item.key)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-md transition-colors text-left"
              >
                <span>{item.label}</span>
                <span
                  className={`w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${
                    fields[item.key]
                      ? 'bg-neutral-900 dark:bg-white border-neutral-900 dark:border-white text-white dark:text-neutral-900'
                      : 'border-neutral-300 dark:border-neutral-600'
                  }`}
                >
                  {fields[item.key] && <Check className="w-3 h-3 stroke-[2.5]" />}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
