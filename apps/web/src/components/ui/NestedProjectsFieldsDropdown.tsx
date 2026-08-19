'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, ChevronRight, Check } from 'lucide-react';

interface NestedFieldsProps {
  visibleColumns: Record<string, boolean>;
  onToggleColumn: (key: string) => void;
}

export function NestedProjectsFieldsDropdown({ visibleColumns, onToggleColumn }: NestedFieldsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  const menuCategories = [
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'members', label: 'Members' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'teams', label: 'Teams' },
    { key: 'labels', label: 'Labels' },
    { key: 'reporter', label: 'Reporter' },
  ];

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-2xs"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>Fields</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl z-50 p-1.5 animate-in fade-in zoom-in-95 duration-100">
          {menuCategories.map((cat) => (
            <div
              key={cat.key}
              onMouseEnter={() => setActiveSubmenu(cat.key)}
              className="relative"
            >
              <button
                type="button"
                onClick={() => onToggleColumn(cat.key)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3.5 h-3.5 rounded-xs border flex items-center justify-center ${
                      visibleColumns[cat.key] !== false
                        ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {visibleColumns[cat.key] !== false && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </span>
                  <span>{cat.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {activeSubmenu === cat.key && (
                <div className="absolute left-full top-0 ml-1 w-44 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl z-50 p-2 text-xs text-gray-600 dark:text-gray-300">
                  <div className="font-semibold text-gray-900 dark:text-white mb-1 px-2 border-b pb-1">
                    {cat.label} Options
                  </div>
                  <button
                    onClick={() => onToggleColumn(cat.key)}
                    className="w-full text-left px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                  >
                    Toggle visibility
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
